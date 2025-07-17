# NEO-OS Drivers

## Overview

NEO-OS implements a modular driver architecture that supports various hardware components including storage controllers, graphics adapters, network interfaces, and system buses. The driver system is initialized during kernel boot and provides standardized interfaces for hardware access.

## Driver Architecture

### Driver Loading System (`OS/src/drivers/load_drivers.cpp`)

The kernel loads drivers in a specific order during initialization:

```cpp
void load_drivers() {
    pci::enumerate_pci();        // Discover PCI devices
    disk::ahci_init();          // Initialize SATA storage
    kernel::vfs_init();         // Initialize virtual file system
    vga::initialize_font();     // Load VGA fonts
    network::rtl8139_init();    // Initialize network interface
}
```

## Core Drivers

### 1. PCI Bus Driver (`OS/src/drivers/pci/`)

#### Overview
The PCI driver provides device enumeration and configuration for the Peripheral Component Interconnect bus.

#### Key Structures
```cpp
struct dev_common_hdr {
    uint16_t vendor_id;         // Device manufacturer ID
    uint16_t device_id;         // Specific device ID
    pci_command_t command;      // Device control register
    uint16_t status;            // Device status
    uint8_t revision_id;        // Device revision
    uint8_t prog_ifb;           // Programming interface
    uint8_t subclass;           // Device subclass
    uint8_t class_code;         // Device class
    uint8_t cache_size;         // Cache line size
    uint8_t latency_timer;      // Bus latency timer
    uint8_t header_type;        // Header type and multifunction flag
    uint8_t BIST;              // Built-in self test
};
```

#### PCI Command Register
```cpp
struct pci_command_t {
    uint16_t io_space_enable : 1;           // Enable I/O space access
    uint16_t mem_space_enable : 1;          // Enable memory space access
    uint16_t bus_master_enable : 1;         // Enable bus mastering
    uint16_t special_cycle_enable : 1;      // Enable special cycles
    uint16_t mvi_enable : 1;                // Memory write invalidate
    uint16_t VGA_pallete_snoop_enable : 1;  // VGA palette snooping
    uint16_t parity_err_response_enable : 1; // Parity error response
    uint16_t wait_cycle_enable : 1;         // DEVSEL timing
    uint16_t SERR_enable : 1;               // System error reporting
    uint16_t fast_back_to_back_enable : 1;  // Fast back-to-back
    uint16_t intr_disable : 1;              // Interrupt disable
    uint16_t rsv0 : 5;                      // Reserved bits
};
```

#### Functions
- **Device Enumeration**: `enumerate_pci()` - Scans PCI bus for devices
- **Configuration Access**: Read/write PCI configuration space
- **Resource Management**: Allocate I/O ports and memory regions
- **Interrupt Management**: Configure device interrupts

### 2. ACPI Driver (`OS/src/drivers/acpi/`)

#### System Description Tables
The ACPI driver parses system description tables to discover hardware configuration.

##### MADT (Multiple APIC Description Table) (`madt.cpp`)
- **Local APIC Discovery**: Find CPU cores and their local APICs
- **I/O APIC Configuration**: Configure interrupt routing
- **Interrupt Override**: Handle interrupt line remapping

##### System Description Table Base (`sdt.cpp`)
- **Table Discovery**: Find and validate ACPI tables
- **Checksum Validation**: Verify table integrity
- **Table Parsing**: Extract hardware configuration data

#### Key Functions
```cpp
void parse_madt();              // Parse MADT for APIC information
void validate_sdt_checksum();   // Validate table checksums
void find_acpi_tables();        // Locate ACPI tables in memory
```

### 3. Storage Drivers

#### AHCI Driver (`OS/src/drivers/disk/ahci/`)

##### Overview
Advanced Host Controller Interface (AHCI) driver for SATA storage devices.

##### Key Components

**AHCI Initialization** (`ahci_init.cpp`)
- **Controller Discovery**: Find AHCI controllers via PCI
- **HBA Configuration**: Configure Host Bus Adapter
- **Port Initialization**: Set up SATA ports
- **Command Engine**: Initialize command processing

**AHCI Driver Interface** (`ahci_driver.cpp`)
- **Read Operations**: Sector-based disk reading
- **Write Operations**: Sector-based disk writing
- **Command Queuing**: Support for native command queuing
- **Error Handling**: Handle SATA errors and timeouts

##### AHCI Structures (`OS/include/drivers/disk/ahci/`)

**Host Bus Adapter Global Host Control** (`hba_ghc.h`)
```cpp
struct hba_ghc {
    uint32_t cap;           // Host capabilities
    uint32_t ghc;           // Global host control
    uint32_t is;            // Interrupt status
    uint32_t pi;            // Ports implemented
    uint32_t vs;            // Version
    // ... additional registers
};
```

**Port Registers** (`hba_port.h`)
- **Command List Base**: Physical address of command list
- **FIS Base**: Frame Information Structure base address
- **Interrupt Status**: Port-specific interrupt status
- **Command and Status**: Port command and status registers

**Command Header** (`ahci_cmd.h`)
- **Command Table**: Physical address of command table
- **PRDT Length**: Physical Region Descriptor Table length
- **Control Flags**: Command control and status flags

#### Disk Driver Interface (`disk_driver.cpp`)
- **Unified Interface**: Common interface for all storage devices
- **Partition Support**: Handle disk partitions
- **Error Recovery**: Retry failed operations
- **Performance Optimization**: Optimize I/O operations

### 4. File System Support

#### GPT Partition Support (`OS/src/drivers/fs/gpt.cpp`)
- **Partition Table Parsing**: Read GUID Partition Table
- **Partition Discovery**: Enumerate disk partitions
- **Boot Partition**: Identify system and boot partitions
- **Protective MBR**: Handle legacy MBR compatibility

#### FAT File System (`OS/src/drivers/fs/fat/`)
- **FAT12/16/32 Support**: Multiple FAT variants
- **Directory Operations**: Read directory entries
- **File Operations**: Read file data and metadata
- **Cluster Management**: Track file allocation clusters

### 5. Graphics Driver

#### VGA Driver (`OS/src/drivers/vga/`)

##### Framebuffer Management (`fbuf.cpp`)
- **Graphics Initialization**: Set up graphics mode
- **Pixel Operations**: Direct pixel manipulation
- **Double Buffering**: Smooth graphics updates
- **Mode Setting**: Configure display resolution and color depth

##### Font System (`fonts.cpp`)
- **Font Loading**: Load bitmap fonts from storage
- **Text Rendering**: Render text to framebuffer
- **Multiple Fonts**: Support different font sizes
- **Character Mapping**: ASCII to glyph mapping

##### Custom Graphics Format (`nic_icon.cpp`)
- **NIC Format**: Custom image format for icons
- **Image Loading**: Load and display NIC images
- **Color Management**: Handle color palettes
- **Transparency**: Support transparent pixels

### 6. Input Drivers

#### PS/2 Driver (`OS/src/drivers/ps2/`)
- **Keyboard Interface**: PS/2 keyboard support
- **Scancode Translation**: Convert scancodes to key codes
- **Key Repeat**: Handle key repeat functionality
- **Special Keys**: Support modifier and function keys
- **Mouse Support**: PS/2 mouse interface (planned)

#### Key Features
```cpp
void ps2_init();                // Initialize PS/2 controller
uint8_t ps2_read_key();         // Read key from keyboard
bool ps2_key_available();       // Check if key is available
void ps2_enable_keyboard();     // Enable keyboard interface
```

### 7. Network Drivers

#### RTL8139 Ethernet Driver (`OS/src/drivers/network/rtl8139.cpp`)

##### Overview
Driver for Realtek RTL8139 Fast Ethernet controller, commonly used in virtualized environments.

##### Key Features
- **Packet Transmission**: Send Ethernet frames
- **Packet Reception**: Receive and process incoming packets
- **Buffer Management**: Manage transmit and receive buffers
- **Interrupt Handling**: Handle network interrupts
- **Link Management**: Monitor link status

##### Functions
```cpp
void rtl8139_init();            // Initialize RTL8139 controller
void rtl8139_send_packet();     // Transmit packet
void rtl8139_receive_packet();  // Receive packet
void rtl8139_interrupt_handler(); // Handle interrupts
```

### 8. Serial Driver (`OS/src/drivers/serial/`)

#### Debug Output
- **Console Output**: Serial console for debugging
- **Kernel Logging**: Send kernel logs to serial port
- **Boot Messages**: Early boot debugging output
- **Remote Debugging**: Support for remote debugging sessions

#### Configuration
- **Port Selection**: Support multiple serial ports
- **Baud Rate**: Configurable communication speed
- **Flow Control**: Hardware/software flow control
- **Format Settings**: Data bits, parity, stop bits

## Driver Interfaces

### Hardware Abstraction
Each driver provides a standardized interface that abstracts hardware-specific details:

#### Storage Interface
```cpp
class storage_device {
    virtual int read_sectors(uint64_t lba, uint32_t count, void *buffer) = 0;
    virtual int write_sectors(uint64_t lba, uint32_t count, void *buffer) = 0;
    virtual uint64_t get_sector_count() = 0;
    virtual uint32_t get_sector_size() = 0;
};
```

#### Network Interface
```cpp
class network_device {
    virtual int send_packet(void *packet, size_t length) = 0;
    virtual int receive_packet(void *buffer, size_t max_length) = 0;
    virtual void get_mac_address(uint8_t mac[6]) = 0;
    virtual bool link_up() = 0;
};
```

## Interrupt Handling

### Driver Interrupt Integration
- **Shared Interrupts**: Multiple devices sharing interrupt lines
- **Interrupt Routing**: APIC-based interrupt distribution
- **Handler Registration**: Register device-specific interrupt handlers
- **Error Handling**: Handle spurious and error interrupts

### Performance Optimization
- **Interrupt Coalescing**: Reduce interrupt frequency
- **Polling Mode**: Switch to polling under high load
- **NAPI**: New API for network drivers (planned)

## Device Discovery

### PCI Device Discovery
1. **Bus Scanning**: Enumerate all PCI buses
2. **Device Detection**: Check each device slot
3. **Vendor/Device ID**: Identify specific hardware
4. **Driver Matching**: Load appropriate driver
5. **Resource Allocation**: Assign I/O and memory resources

### ACPI Integration
- **Device Objects**: ACPI device descriptions
- **Resource Requirements**: Hardware resource needs
- **Power Management**: Device power states
- **Hot Plug**: Dynamic device insertion/removal (planned)

## Error Handling and Recovery

### Driver Error Handling
- **Graceful Degradation**: Continue operation with reduced functionality
- **Error Logging**: Log errors for debugging
- **Retry Logic**: Automatic retry for transient errors
- **Timeout Handling**: Handle unresponsive devices

### System Recovery
- **Driver Restart**: Restart failed drivers
- **Hardware Reset**: Reset unresponsive hardware
- **Fallback Drivers**: Use generic drivers when specific drivers fail

## Performance Considerations

### Optimization Strategies
- **DMA Usage**: Direct Memory Access for high-throughput devices
- **Interrupt Mitigation**: Reduce interrupt overhead
- **Buffer Management**: Efficient buffer allocation and reuse
- **Cache Optimization**: Align data structures for cache efficiency

### Resource Management
- **Memory Usage**: Minimize driver memory footprint
- **CPU Usage**: Reduce CPU overhead in driver operations
- **Power Management**: Implement device power saving features

## Future Enhancements

### Planned Features
- **USB Support**: Universal Serial Bus driver stack
- **Audio Drivers**: Sound card support
- **Advanced Graphics**: 3D acceleration and modern GPU support
- **Wireless Networking**: WiFi driver support
- **Bluetooth**: Bluetooth device support

### Driver Framework Improvements
- **Dynamic Loading**: Load drivers on demand
- **Driver Updates**: Hot-swap driver updates
- **Sandbox**: Isolate drivers for security
- **Debugging Tools**: Advanced driver debugging support

## Configuration and Customization

### Build-Time Configuration
- **Driver Selection**: Choose which drivers to include
- **Feature Flags**: Enable/disable driver features
- **Optimization Levels**: Performance vs. size tradeoffs

### Runtime Configuration
- **Parameter Tuning**: Adjust driver parameters
- **Debug Levels**: Control debug output verbosity
- **Performance Monitoring**: Runtime performance metrics

## Reference Files

### Header Files (`OS/include/drivers/`)
- `acpi/madt.h`, `acpi/mcfg.h`, `acpi/sdt.h` - ACPI interfaces
- `disk/ahci/ahci.h` - AHCI controller interface
- `fs/fat/fat.h`, `fs/gpt.h` - File system drivers
- `network/rtl8139.h` - Network driver interface
- `pci/pci.h` - PCI bus interface
- `ps2/ps2.h` - PS/2 input interface
- `serial/serial.h` - Serial port interface
- `vga/vga.h`, `vga/fonts.h` - Graphics interfaces

### Implementation Files (`OS/src/drivers/`)
- `acpi/` - ACPI table parsing
- `disk/` - Storage device drivers
- `fs/` - File system support
- `network/` - Network device drivers
- `pci/` - PCI bus management
- `ps2/` - Input device drivers
- `serial/` - Serial communication
- `vga/` - Graphics and font rendering 