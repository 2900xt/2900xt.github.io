"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Copy, ExternalLink, FileText } from "lucide-react"

// Documentation content mapping
const documentationContent: Record<string, { title: string; file: string; content: string }> = {
  overview: {
    title: "Architecture Overview",
    file: "Architecture-Overview.md",
    content: `# NEO-OS Architecture Overview

## System Architecture

NEO-OS is a 64-bit operating system designed for x86-64 architecture with a modular, microkernel-inspired design. The system is built around several core components that work together to provide a complete operating environment.

## High-Level Design

\`\`\`
┌─────────────────────────────────────────────────────┐
│                Applications Layer                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Terminal  │ │    Login    │ │  File View  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                 System Call Layer                   │
│              (Virtual File System)                  │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                  Kernel Core                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Memory    │ │   Process   │ │ Interrupt   │   │
│  │ Management  │ │ Management  │ │  Handling   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                   Driver Layer                      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│  │ PCI │ │ACPI │ │AHCI │ │ VGA │ │ PS2 │ │ NET │ │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                Hardware Layer                       │
│              (x86-64 Platform)                     │
└─────────────────────────────────────────────────────┘
\`\`\`

## Core Components

### 1. Boot System (LIMINE Protocol)
- **Boot Loader**: Uses LIMINE bootloader for UEFI systems
- **Kernel Loading**: 64-bit ELF kernel loaded at high memory addresses
- **Memory Map**: Initialization with system memory layout from bootloader

### 2. Kernel Core
Located in \`OS/src/kernel/\` and \`OS/include/kernel/\`

**Entry Point**: \`_start.cpp\`
- System initialization in specific order
- TTY subsystem initialization
- SSE/SSE2 instruction enabling
- Interrupt Descriptor Table setup
- Kernel heap initialization
- Page frame allocator setup

### 3. Memory Management
- **Page Frame Allocator**: Modular design for physical memory management
- **Heap Management**: Dynamic memory allocation for kernel
- **Virtual Memory**: Memory mapping and protection

### 4. Driver Framework
- **PCI**: Hardware enumeration and configuration
- **ACPI**: Advanced power management
- **AHCI**: SATA storage controller
- **VGA**: Graphics framebuffer
- **Network**: Basic networking support

### 5. File System
- **Virtual File System (VFS)**: Abstraction layer
- **FAT Support**: Primary file system implementation
- **Custom Icon Format**: Efficient icon storage

## Design Principles

1. **Modularity**: Clear separation of concerns
2. **Security**: Memory protection and privilege separation
3. **Performance**: Efficient algorithms and data structures
4. **Portability**: Clean hardware abstraction
5. **Maintainability**: Well-documented and structured code

## Development Goals

- Enhanced process scheduler
- USB support implementation
- Network stack expansion
- BusyBox port for utilities
- Improved shell functionality`
  },
  kernel: {
    title: "Kernel Core",
    file: "Kernel-Core.md",
    content: `# NEO-OS Kernel Core

## Overview

The NEO-OS kernel core provides fundamental operating system services including memory management, process control, interrupt handling, and system initialization. The kernel follows a modular design with clear separation of concerns.

## Kernel Entry Point

### Main Entry (\`OS/src/kernel/_start.cpp\`)

The kernel entry point \`_start()\` performs system initialization in a specific order:

\`\`\`cpp
extern "C" void _start(void) {
    kernel::tty_init();                    // Initialize TTY subsystem
    kernel::enableSSE();                   // Enable SSE/SSE2 instructions
    kernel::fillIDT();                     // Setup Interrupt Descriptor Table
    kernel::heapInit();                    // Initialize kernel heap
    kernel::initialize_page_allocator();   // Setup page frame allocator
    vga::framebuffer_init();              // Initialize VGA framebuffer
    kernel::load_drivers();               // Load hardware drivers
    kernel::smp_init();                   // Initialize SMP cores
    kernel::terminal_init();              // Start terminal interface
    kernel::login_init();                 // Initialize login system
    
    // Main kernel loop
    while (true) {
        kernel::sleep(5);                 // Sleep 5ms
        stdlib::call_timers();            // Handle timer callbacks
        kernel::pollNextChar();           // Poll keyboard input
    }
}
\`\`\`

## Memory Management

### Page Frame Allocator
- **Location**: \`OS/src/kernel/memory/page_allocator.cpp\`
- **Purpose**: Manages physical memory pages
- **Features**: 
  - Efficient page allocation/deallocation
  - Memory fragmentation handling
  - Debug tracking capabilities

### Heap Manager
- **Location**: \`OS/src/kernel/memory/heap.cpp\`
- **Purpose**: Dynamic memory allocation for kernel
- **Algorithm**: Custom allocator optimized for kernel usage

\`\`\`cpp
// Heap initialization
void heapInit() {
    heap_start = (void*)HEAP_START_ADDRESS;
    heap_size = HEAP_INITIAL_SIZE;
    initialize_heap_structures();
}
\`\`\`

## Process Management

### Process Structure
\`\`\`cpp
struct Process {
    uint64_t pid;           // Process ID
    uint64_t ppid;          // Parent Process ID
    ProcessState state;     // Current state
    void* stack_pointer;    // Stack pointer
    PageDirectory* page_dir; // Virtual memory space
    FileDescriptor* files;  // Open file descriptors
};
\`\`\`

### Scheduler
- **Type**: Round-robin with priority queues
- **Time Slice**: Configurable quantum (default 10ms)
- **Context Switching**: Full register state preservation

## Interrupt Handling

### Interrupt Descriptor Table (IDT)
- **Size**: 256 entries
- **Types**: Hardware interrupts, software interrupts, exceptions
- **Handler Registration**: Dynamic interrupt handler registration

\`\`\`cpp
void register_interrupt_handler(uint8_t interrupt, 
                               interrupt_handler_t handler) {
    interrupt_handlers[interrupt] = handler;
}
\`\`\`

### Timer System
- **Frequency**: 1000 Hz (1ms resolution)
- **Purpose**: Process scheduling, system timekeeping
- **Callbacks**: Timer callback system for delayed execution

## System Calls

### Interface
\`\`\`cpp
// System call numbers
#define SYS_READ    0
#define SYS_WRITE   1
#define SYS_OPEN    2
#define SYS_CLOSE   3
#define SYS_FORK    4
#define SYS_EXEC    5
#define SYS_EXIT    6
\`\`\`

### Implementation
- **Entry Point**: Software interrupt 0x80
- **Parameter Passing**: Registers (RAX, RBX, RCX, RDX)
- **Return Values**: RAX register

## SMP Support

### Multi-Core Initialization
- **Bootstrap Processor**: Primary CPU initialization
- **Application Processors**: Secondary CPU startup
- **Synchronization**: Spinlocks and atomic operations

\`\`\`cpp
void smp_init() {
    detect_cores();
    initialize_apic();
    start_application_processors();
    setup_per_cpu_data();
}
\`\`\`

## Debug and Logging

### Serial Output
- **Port**: COM1 (0x3F8)
- **Baud Rate**: 115200
- **Purpose**: Kernel debugging and logging

### Debug Macros
\`\`\`cpp
#ifdef DEBUG
#define KERNEL_DEBUG(fmt, ...) \
    kprintf("[DEBUG] " fmt "\n", ##__VA_ARGS__)
#else
#define KERNEL_DEBUG(fmt, ...)
#endif
\`\`\`

This kernel core provides the foundation for all higher-level operating system functionality, ensuring stability, performance, and maintainability.`
  },
  boot: {
    title: "Boot Process",
    file: "Boot-Process.md", 
    content: `# NEO-OS Boot Process

## Overview

NEO-OS uses the LIMINE bootloader protocol for UEFI systems, providing a modern and reliable boot experience. The boot process follows a well-defined sequence to initialize the system from power-on to user space.

## Boot Sequence

### 1. UEFI Firmware
\`\`\`
Power On → UEFI Firmware → Boot Manager → LIMINE Bootloader
\`\`\`

- **UEFI POST**: Hardware initialization and testing
- **Boot Manager**: Loads LIMINE bootloader from EFI System Partition
- **Secure Boot**: Optional signature verification

### 2. LIMINE Bootloader
Located in \`/EFI/BOOT/BOOTX64.EFI\`

**Configuration**: \`limine.cfg\`
\`\`\`
:NEO-OS
PROTOCOL=limine
KERNEL_PATH=boot:///kernel.elf
MODULE_PATH=boot:///modules/
RESOLUTION=1920x1080
\`\`\`

**Responsibilities**:
- Kernel loading from storage
- Memory map creation
- Graphics mode setup
- Control transfer to kernel

### 3. Kernel Entry Point

**File**: \`OS/src/kernel/_start.cpp\`

\`\`\`cpp
extern "C" void _start(void) {
    // Early initialization
    kernel::early_init();
    
    // Parse bootloader information
    kernel::parse_limine_info();
    
    // Initialize core systems
    kernel::core_init();
    
    // Start user space
    kernel::start_init_process();
}
\`\`\`

## Memory Layout

### Physical Memory Map
\`\`\`
0x0000000000000000 - 0x00000000000FFFFF  Legacy/Reserved (1MB)
0x0000000000100000 - 0x0000000000FFFFFF  Kernel Code/Data (15MB)
0x0000000001000000 - 0x000000007FFFFFFF  Available RAM
0x0000000080000000 - 0x00000000FFFFFFFF  Memory Mapped I/O
0x0000000100000000 - ...                 Extended RAM (if present)
\`\`\`

### Virtual Memory Layout
\`\`\`
0xFFFF800000000000 - 0xFFFF8000FFFFFFFF  Kernel Direct Map
0xFFFF880000000000 - 0xFFFF88FFFFFFFFFF  Kernel Heap
0xFFFF900000000000 - 0xFFFF90FFFFFFFFFF  Kernel Modules
0xFFFFFFFF80000000 - 0xFFFFFFFFFFFFFFFF  Kernel Code/Data
\`\`\`

## Initialization Phases

### Phase 1: Early Initialization
\`\`\`cpp
void early_init() {
    // Disable interrupts
    cli();
    
    // Setup basic CPU state
    setup_cpu_features();
    
    // Initialize early console
    early_console_init();
    
    // Parse memory map
    parse_memory_map();
}
\`\`\`

### Phase 2: Core Systems
\`\`\`cpp
void core_init() {
    // Memory management
    mm_init();
    
    // Interrupt handling
    idt_init();
    
    // Process management
    proc_init();
    
    // Device drivers
    driver_init();
}
\`\`\`

### Phase 3: System Services
\`\`\`cpp
void system_init() {
    // File system
    vfs_init();
    
    // Network stack
    net_init();
    
    // User space preparation
    userspace_init();
}
\`\`\`

## LIMINE Protocol Integration

### Required Requests
\`\`\`cpp
// Bootloader info request
static volatile struct limine_bootloader_info_request bootloader_info_request = {
    .id = LIMINE_BOOTLOADER_INFO_REQUEST,
    .revision = 0
};

// Memory map request
static volatile struct limine_memmap_request memmap_request = {
    .id = LIMINE_MEMMAP_REQUEST,
    .revision = 0
};

// Framebuffer request
static volatile struct limine_framebuffer_request framebuffer_request = {
    .id = LIMINE_FRAMEBUFFER_REQUEST,
    .revision = 0
};
\`\`\`

### Information Extraction
\`\`\`cpp
void parse_limine_info() {
    // Get memory map
    struct limine_memmap_response *memmap = memmap_request.response;
    for (size_t i = 0; i < memmap->entry_count; i++) {
        process_memory_entry(memmap->entries[i]);
    }
    
    // Get framebuffer
    struct limine_framebuffer_response *fb = framebuffer_request.response;
    if (fb && fb->framebuffer_count > 0) {
        setup_framebuffer(fb->framebuffers[0]);
    }
}
\`\`\`

## Error Handling

### Boot Failures
1. **Kernel Load Failure**: LIMINE error messages
2. **Memory Issues**: Early panic with diagnostic info
3. **Hardware Problems**: Safe mode fallback

### Panic System
\`\`\`cpp
void kernel_panic(const char* message) {
    // Disable interrupts
    cli();
    
    // Display error message
    early_printf("KERNEL PANIC: %s\n", message);
    
    // Dump system state
    dump_registers();
    dump_stack_trace();
    
    // Halt system
    hlt_loop();
}
\`\`\`

## Debug Boot Options

### Serial Debug
- **Port**: COM1 (0x3F8)
- **Baud**: 115200
- **Output**: Boot progress and error messages

### Boot Parameters
\`\`\`
debug=1          Enable debug output
serial=115200    Set serial baud rate
noacpi=1         Disable ACPI
nomp=1           Disable SMP
\`\`\`

## Performance Optimization

### Fast Boot Features
- **Parallel Initialization**: Concurrent driver loading
- **Lazy Loading**: Defer non-critical initialization
- **Cache Optimization**: Minimize memory access patterns

### Boot Time Targets
- **UEFI to Kernel**: < 2 seconds
- **Kernel to Shell**: < 3 seconds
- **Total Boot Time**: < 5 seconds

The boot process is designed for reliability, speed, and maintainability, providing a solid foundation for the operating system.`
  },
  drivers: {
    title: "Drivers",
    file: "Drivers.md",
    content: `# NEO-OS Drivers

## Overview

NEO-OS includes a comprehensive set of hardware drivers that provide abstraction layers for various system components. The driver architecture follows a modular design with standardized interfaces.

## Driver Architecture

### Base Driver Interface
\`\`\`cpp
class Driver {
public:
    virtual bool probe() = 0;        // Detect hardware
    virtual bool init() = 0;         // Initialize driver
    virtual void cleanup() = 0;      // Cleanup resources
    virtual const char* name() = 0;  // Driver name
};
\`\`\`

### Driver Manager
\`\`\`cpp
class DriverManager {
    std::vector<Driver*> drivers;
    
public:
    void register_driver(Driver* driver);
    void probe_all_drivers();
    void init_all_drivers();
};
\`\`\`

## Hardware Drivers

### PCI Driver
**Location**: \`OS/src/drivers/pci/\`

**Purpose**: Enumerate and configure PCI devices

\`\`\`cpp
class PCIDriver : public Driver {
private:
    struct PCIDevice {
        uint16_t vendor_id;
        uint16_t device_id;
        uint8_t class_code;
        uint8_t subclass;
        uint32_t base_addresses[6];
    };
    
public:
    std::vector<PCIDevice> enumerate_devices();
    void configure_device(PCIDevice& device);
    void enable_bus_mastering(PCIDevice& device);
};
\`\`\`

**Key Features**:
- Device enumeration
- Configuration space access
- Bus mastering support
- MSI/MSI-X interrupt configuration

### ACPI Driver
**Location**: \`OS/src/drivers/acpi/\`

**Purpose**: Advanced Configuration and Power Interface

\`\`\`cpp
class ACPIDriver : public Driver {
private:
    RSDP* root_pointer;
    RSDT* root_table;
    std::vector<ACPITable*> tables;
    
public:
    bool parse_tables();
    void enumerate_devices();
    void handle_power_events();
};
\`\`\`

**Supported Tables**:
- **FADT**: Fixed ACPI Description Table
- **MADT**: Multiple APIC Description Table  
- **DSDT**: Differentiated System Description Table
- **SSDT**: Secondary System Description Table

### AHCI Driver
**Location**: \`OS/src/drivers/storage/ahci/\`

**Purpose**: SATA storage controller interface

\`\`\`cpp
class AHCIDriver : public Driver {
private:
    HBA_MEM* hba_mem;
    Port ports[32];
    
public:
    bool detect_drives();
    bool read_sectors(uint8_t drive, uint64_t lba, 
                     uint16_t count, void* buffer);
    bool write_sectors(uint8_t drive, uint64_t lba,
                      uint16_t count, void* buffer);
};
\`\`\`

**Features**:
- Native Command Queuing (NCQ)
- Hot-plug support
- Power management
- Error recovery

### VGA Driver
**Location**: \`OS/src/drivers/video/vga/\`

**Purpose**: Graphics framebuffer management

\`\`\`cpp
class VGADriver : public Driver {
private:
    uint32_t* framebuffer;
    uint32_t width, height;
    uint32_t pitch;
    uint8_t bpp;
    
public:
    void set_pixel(uint32_t x, uint32_t y, uint32_t color);
    void draw_rectangle(uint32_t x, uint32_t y, 
                       uint32_t w, uint32_t h, uint32_t color);
    void scroll_up(uint32_t lines);
};
\`\`\`

**Supported Modes**:
- Linear framebuffer
- Multiple color depths (16, 24, 32-bit)
- Hardware acceleration (where available)

### PS/2 Driver
**Location**: \`OS/src/drivers/input/ps2/\`

**Purpose**: Keyboard and mouse interface

\`\`\`cpp
class PS2Driver : public Driver {
private:
    bool dual_channel;
    uint8_t config_byte;
    
public:
    void send_command(uint8_t command);
    uint8_t read_data();
    void handle_keyboard_interrupt();
    void handle_mouse_interrupt();
};
\`\`\`

**Features**:
- Dual channel support
- Keyboard scan code translation
- Mouse packet parsing
- Hot-plug detection

### Network Driver
**Location**: \`OS/src/drivers/network/\`

**Purpose**: Basic network interface abstraction

\`\`\`cpp
class NetworkDriver : public Driver {
protected:
    uint8_t mac_address[6];
    bool link_up;
    uint32_t speed;
    
public:
    virtual bool send_packet(void* data, size_t length) = 0;
    virtual bool receive_packet(void* buffer, size_t* length) = 0;
    virtual void set_promiscuous_mode(bool enable) = 0;
};
\`\`\`

## Driver Loading

### Static Loading
\`\`\`cpp
void load_static_drivers() {
    static PCIDriver pci_driver;
    static ACPIDriver acpi_driver;
    static AHCIDriver ahci_driver;
    
    driver_manager.register_driver(&pci_driver);
    driver_manager.register_driver(&acpi_driver);
    driver_manager.register_driver(&ahci_driver);
}
\`\`\`

### Dynamic Loading
\`\`\`cpp
bool load_driver_module(const char* path) {
    void* module = load_kernel_module(path);
    if (!module) return false;
    
    driver_init_func init = get_symbol(module, "driver_init");
    if (!init) return false;
    
    return init(&driver_manager);
}
\`\`\`

## Interrupt Handling

### IRQ Registration
\`\`\`cpp
class InterruptHandler {
public:
    virtual void handle_interrupt(uint32_t irq) = 0;
};

void register_irq_handler(uint32_t irq, InterruptHandler* handler) {
    irq_handlers[irq] = handler;
}
\`\`\`

### MSI Support
\`\`\`cpp
struct MSIVector {
    uint64_t address;
    uint32_t data;
    bool enabled;
};

bool configure_msi(PCIDevice& device, uint32_t vector) {
    // Configure MSI capability
    uint32_t msi_cap = find_pci_capability(device, 0x05);
    if (!msi_cap) return false;
    
    // Set address and data
    configure_msi_vector(device, msi_cap, vector);
    return true;
}
\`\`\`

## Device Tree

### Device Enumeration
\`\`\`cpp
struct Device {
    const char* name;
    DeviceType type;
    Driver* driver;
    Device* parent;
    std::vector<Device*> children;
};

class DeviceTree {
    Device* root;
    
public:
    void add_device(Device* device, Device* parent);
    Device* find_device(const char* name);
    void enumerate_devices();
};
\`\`\`

## Power Management

### ACPI Power States
- **S0**: Working state
- **S1**: CPU and RAM powered, other components off
- **S3**: Suspend to RAM
- **S4**: Suspend to disk
- **S5**: Soft power off

\`\`\`cpp
void enter_sleep_state(uint8_t state) {
    prepare_for_sleep();
    acpi_enter_sleep_state(state);
}

void wake_from_sleep() {
    restore_cpu_state();
    reinitialize_drivers();
    resume_processes();
}
\`\`\`

## Debug and Diagnostics

### Driver Debug Interface
\`\`\`cpp
#ifdef DEBUG_DRIVERS
#define DRIVER_DEBUG(fmt, ...) \
    kprintf("[DRIVER] " fmt "\n", ##__VA_ARGS__)
#else
#define DRIVER_DEBUG(fmt, ...)
#endif
\`\`\`

### Hardware Detection
\`\`\`cpp
void dump_hardware_info() {
    printf("=== Hardware Information ===\n");
    pci_driver.dump_devices();
    acpi_driver.dump_tables();
    ahci_driver.dump_drives();
}
\`\`\`

The driver subsystem provides a solid foundation for hardware interaction while maintaining clean abstractions and extensibility for future hardware support.`
  },
  memory: {
    title: "Memory Management",
    file: "Memory-Management.md",
    content: `# NEO-OS Memory Management

## Overview

NEO-OS implements a sophisticated memory management system with both physical and virtual memory management. The system provides kernel heap allocation, page frame management, and virtual memory mapping suitable for a modern 64-bit operating system.

## Architecture

### Memory Layout

\`\`\`
Virtual Address Space (64-bit)
┌─────────────────────────────────────────┐ 0xFFFFFFFFFFFFFFFF
│           Kernel Space                  │
│  ┌─────────────────────────────────────┐│ 0xFFFFFFFF80000000
│  │        Kernel Code & Data           ││ (Text at 0xFFFFFFFF80000000)
│  ├─────────────────────────────────────┤│
│  │        Kernel Heap                  ││
│  ├─────────────────────────────────────┤│
│  │        Page Tables                  ││
│  ├─────────────────────────────────────┤│
│  │        Driver Memory                ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│     Higher Half Direct Map (HHDM)      │
│     (Physical Memory Mapped)           │
├─────────────────────────────────────────┤ 0x0000800000000000
│           User Space                    │
│         (Future Implementation)        │
└─────────────────────────────────────────┘ 0x0000000000000000
\`\`\`

## Core Components

### 1. Heap Management

#### Kernel Heap Allocator
The kernel heap provides dynamic memory allocation for kernel data structures and buffers.

**Main Functions:**
\`\`\`cpp
void heapInit();                          // Initialize heap allocator
void *kmalloc(uint64_t size);            // Allocate memory block
void kfree(void *ptr);                   // Free memory block
void *krealloc(void *ptr, uint64_t size); // Resize memory block
void *kcalloc(uint64_t count, uint64_t size); // Allocate zeroed memory
\`\`\`

#### Implementation Details
- **Allocation Strategy**: Best-fit allocation with coalescing
- **Metadata**: Block headers store size and allocation status
- **Alignment**: All allocations aligned to 8-byte boundaries
- **Free List**: Maintains linked list of free blocks
- **Coalescing**: Adjacent free blocks are merged automatically

#### C++ Integration
\`\`\`cpp
// Overloaded operators for C++ compatibility
void *operator new(size_t size);         // Maps to kmalloc
void *operator new[](size_t size);       // Array allocation
void operator delete(void *addr, uint64_t); // Maps to kfree
void operator delete[](void *addr, uint64_t); // Array deallocation
\`\`\`

### 2. Page Frame Allocator

#### Physical Memory Management
The page allocator manages physical memory in 4KB pages.

**Key Functions:**
\`\`\`cpp
void initialize_page_allocator();        // Initialize page allocator
void *allocate_page();                   // Allocate single page
void *allocate_pages(uint64_t count);    // Allocate multiple pages
void free_page(void *page);              // Free single page
void free_pages(void *pages, uint64_t count); // Free multiple pages
\`\`\`

#### Page Allocation Strategy
- **Bitmap Tracking**: Uses bitmap to track page allocation status
- **Memory Regions**: Manages available memory regions from bootloader
- **Alignment**: All pages aligned to 4KB boundaries
- **Contiguous Allocation**: Supports allocation of contiguous page ranges

### 3. Virtual Memory Management

#### Page Table Management
The virtual memory system manages page tables and virtual-to-physical mappings.

**Core Concepts:**
- **4-Level Paging**: Uses x86-64 4-level page table structure
- **Kernel Mapping**: Kernel mapped at higher-half addresses
- **Dynamic Mapping**: Support for runtime virtual memory allocation`
  },
  filesystem: {
    title: "File System",
    file: "File-System.md",
    content: `# NEO-OS File System

## Overview

NEO-OS implements a Virtual File System (VFS) layer that provides a unified interface for file operations across different file system types. The system currently supports FAT12/16/32 file systems with GPT partition support.

## Architecture

### Virtual File System Layer

The VFS provides an abstraction layer between applications and specific file system implementations:

\`\`\`cpp
struct File {
    stdlib::string filename;    // File name
    size_t filesize;           // File size in bytes
    void *fat_entry;           // File system specific data
};
\`\`\`

#### File Permissions
\`\`\`cpp
#define FILE_READABLE   (1 << 0)    // Read permission
#define FILE_WRITABLE   (1 << 1)    // Write permission  
#define FILE_EXECUTABLE (1 << 2)    // Execute permission
\`\`\`

#### Core VFS Functions
\`\`\`cpp
void vfs_init();                    // Initialize VFS subsystem
void mount_root(disk::rw_disk_t *disk, uint64_t partition);
File *get_root();                   // Get root directory
int open(File *file, stdlib::string *filepath); // Open file
void close(File *file);             // Close file
void *read(File *file);             // Read file contents
\`\`\`

## FAT File System

### Overview
The FAT (File Allocation Table) implementation supports FAT12, FAT16, and FAT32 variants, providing compatibility with many storage devices and operating systems.

### FAT Structure Components

#### Boot Sector
- **BPB (BIOS Parameter Block)**: Contains file system parameters
- **Boot Code**: Optional boot loader code
- **File System Type**: Identifies FAT variant (12/16/32)
- **Sector Size**: Usually 512 bytes
- **Cluster Size**: Number of sectors per cluster

#### Directory Entry Structure
\`\`\`cpp
struct fat_directory_entry {
    char name[8];              // File name (8.3 format)
    char extension[3];         // File extension
    uint8_t attributes;        // File attributes
    uint8_t reserved;          // Reserved byte
    uint8_t creation_time_ms;  // Creation time (milliseconds)
    uint16_t creation_time;    // Creation time
    uint16_t creation_date;    // Creation date
    uint16_t access_date;      // Last access date
    uint16_t cluster_high;     // High 16 bits of cluster (FAT32)
    uint16_t modify_time;      // Last modification time
    uint16_t modify_date;      // Last modification date
    uint16_t cluster_low;      // Low 16 bits of cluster
    uint32_t file_size;        // File size in bytes
};
\`\`\`

#### File Attributes
\`\`\`cpp
#define FAT_ATTR_READ_ONLY  0x01    // Read-only file
#define FAT_ATTR_HIDDEN     0x02    // Hidden file
#define FAT_ATTR_SYSTEM     0x04    // System file
#define FAT_ATTR_VOLUME_ID  0x08    // Volume label
#define FAT_ATTR_DIRECTORY  0x10    // Directory
#define FAT_ATTR_ARCHIVE    0x20    // Archive flag
#define FAT_ATTR_LONG_NAME  0x0F    // Long filename entry
\`\`\`

### Operations
- **Cluster Reading**: Read data from cluster chains
- **Directory Parsing**: Parse directory entries
- **File Lookup**: Find files by name in directories
- **Cluster Following**: Follow cluster chains to read files
- **Free Space**: Calculate available disk space`
  },
  stdlib: {
    title: "Standard Library",
    file: "Standard-Library.md",
    content: `# NEO-OS Standard Library

## Overview

NEO-OS includes a custom standard library implementation that provides essential functionality for kernel and system components. The library is designed for kernel-space usage with a focus on reliability, performance, and minimal resource usage.

## Library Structure

### Main Header
\`\`\`cpp
#ifndef STDLIB_H
#define STDLIB_H

#include <types.h>
#include <config.h>
#include <stdlib/assert.h>
#include <stdlib/lock.h>
#include <stdlib/math.h>
#include <stdlib/string.h>
#include <stdlib/timer.h>

#endif
\`\`\`

## Core Components

### 1. String Operations

#### String Class Implementation
The library provides a custom string class optimized for kernel use:

\`\`\`cpp
namespace stdlib {
    class string {
    private:
        char *data;         // String data buffer
        size_t length;      // Current string length
        size_t capacity;    // Buffer capacity
        
    public:
        // Constructors and destructor
        string();                           // Default constructor
        string(const char *cstr);           // C-string constructor
        string(const string &other);        // Copy constructor
        ~string();                          // Destructor
        
        // Assignment operators
        string &operator=(const string &other);
        string &operator=(const char *cstr);
        
        // Comparison operators
        bool operator==(const string &other) const;
        bool operator!=(const string &other) const;
        
        // Access operators
        char &operator[](size_t index);
        const char &operator[](size_t index) const;
        
        // String operations
        void append(const char *str);       // Append C-string
        void append(const string &str);     // Append string object
        void clear();                       // Clear string content
        const char *c_str() const;          // Get C-string
        size_t size() const;                // Get string length
        bool empty() const;                 // Check if empty
    };
}
\`\`\`

#### String Utilities
\`\`\`cpp
// C-style string functions
size_t strlen(const char *str);                     // String length
char *strcpy(char *dest, const char *src);          // String copy
char *strncpy(char *dest, const char *src, size_t n); // String copy with limit
int strcmp(const char *str1, const char *str2);     // String compare
int strncmp(const char *str1, const char *str2, size_t n); // Limited compare
char *strcat(char *dest, const char *src);          // String concatenate
char *strchr(const char *str, int c);               // Find character
char *strstr(const char *haystack, const char *needle); // Find substring
\`\`\`

#### String Formatting
\`\`\`cpp
// Number to string conversion
void itoa(int value, char *str, int base);          // Integer to ASCII
void utoa(unsigned int value, char *str, int base); // Unsigned to ASCII
void ltoa(long value, char *str, int base);         // Long to ASCII

// String parsing
int atoi(const char *str);                          // ASCII to integer
long atol(const char *str);                         // ASCII to long
\`\`\`

### 2. Mathematical Functions

#### Basic Operations
- Arithmetic functions optimized for kernel use
- Floating-point operations (where supported)
- Trigonometric functions
- Statistical functions

### 3. Timer System

#### Timer Management
\`\`\`cpp
// Timer callback system
typedef void (*timer_callback_t)(void* data);

// Timer registration
void register_timer(uint64_t ms, timer_callback_t callback, void* data);
void call_timers();              // Process timer callbacks
\`\`\`

### 4. Synchronization Primitives

#### Locking Mechanisms
\`\`\`cpp
// Spinlock implementation
struct spinlock {
    volatile uint32_t locked;
};

void spinlock_acquire(struct spinlock* lock);
void spinlock_release(struct spinlock* lock);
\`\`\`

This standard library provides the foundation for all system components, ensuring consistent and reliable operation across the entire operating system.`
  },
  build: {
    title: "Build System",
    file: "Build-System.md",
    content: `# NEO-OS Build System

## Overview

NEO-OS uses a comprehensive build system based on Make and GCC toolchain, designed for cross-compilation to x86-64 architecture. The build system handles kernel compilation, driver integration, and bootloader setup.

## Toolchain Requirements

### Required Tools
- **GCC Cross-Compiler**: x86_64-elf-gcc
- **GNU Binutils**: For linking and object manipulation
- **NASM**: Netwide Assembler for assembly code
- **Make**: GNU Make for build automation
- **QEMU**: For testing and debugging (optional)

### Installation
\`\`\`bash
# Install cross-compilation toolchain
./scripts/setup-toolchain.sh

# Verify installation
x86_64-elf-gcc --version
x86_64-elf-ld --version
nasm --version
\`\`\`

## Build Configuration

### Makefile Structure
\`\`\`makefile
# Main targets
all: kernel.elf iso

kernel.elf: $(KERNEL_OBJECTS)
	$(LD) $(LDFLAGS) -o $@ $^

iso: kernel.elf
	mkdir -p iso/boot
	cp kernel.elf iso/boot/
	grub-mkrescue -o neoos.iso iso/
\`\`\`

### Compiler Flags
\`\`\`makefile
CFLAGS = -Wall -Wextra -std=c++17 \\
         -ffreestanding -fno-exceptions \\
         -fno-rtti -mno-red-zone \\
         -mcmodel=kernel -mno-sse

LDFLAGS = -nostdlib -lgcc \\
          -T linker.ld
\`\`\`

## Build Process

### Compilation Steps
1. **Source Compilation**: Compile C++ and assembly sources
2. **Object Linking**: Link object files into kernel ELF
3. **ISO Generation**: Create bootable ISO with LIMINE
4. **Testing**: Run in QEMU for validation

### Directory Structure
\`\`\`
OS/
├── src/           # Source files
├── include/       # Header files  
├── build/         # Build artifacts
├── scripts/       # Build scripts
└── Makefile       # Main makefile
\`\`\`

## Cross-Compilation

### Target Architecture
- **Platform**: x86-64 (AMD64)
- **ABI**: System V AMD64 ABI
- **Kernel Model**: Large kernel model
- **Floating Point**: SSE/SSE2 disabled in kernel

### Memory Model
\`\`\`cpp
// Kernel memory layout
#define KERNEL_VMA      0xFFFFFFFF80000000
#define KERNEL_HEAP     0xFFFF880000000000
#define HHDM_OFFSET     0xFFFF800000000000
\`\`\`

## Testing and Debugging

### QEMU Integration
\`\`\`bash
# Run in QEMU
make qemu

# Debug with GDB
make qemu-debug
gdb kernel.elf -ex "target remote :1234"
\`\`\`

### Serial Debugging
- **Port**: COM1 (0x3F8)
- **Baud Rate**: 115200
- **Output**: Kernel logs and debug information

The build system provides a robust foundation for NEO-OS development with comprehensive tooling and debugging support.`
  },
  applications: {
    title: "Applications",
    file: "Applications.md", 
    content: `# NEO-OS Applications

## Overview

NEO-OS includes several built-in applications that provide essential system functionality and user interface components. These applications demonstrate the capabilities of the operating system and provide a foundation for user interaction.

## Core Applications

### 1. Terminal Application

#### Overview
The terminal provides a command-line interface for system interaction and program execution.

#### Features
- **Command Processing**: Parse and execute user commands
- **History**: Command history navigation
- **Tab Completion**: Automatic command completion
- **Color Support**: ANSI color codes for enhanced output

#### Implementation
\`\`\`cpp
class Terminal {
private:
    stdlib::string command_buffer;
    std::vector<stdlib::string> history;
    
public:
    void process_input(char c);
    void execute_command(const stdlib::string& cmd);
    void display_prompt();
};
\`\`\`

### 2. Login System

#### Overview
The login system manages user authentication and session initialization.

#### Features
- **User Authentication**: Verify user credentials
- **Session Management**: Create and manage user sessions
- **Security**: Password hashing and protection
- **Multi-user Support**: Support for multiple user accounts

#### User Database
\`\`\`cpp
struct User {
    stdlib::string username;
    stdlib::string password_hash;
    uint32_t uid;
    uint32_t gid;
    stdlib::string home_directory;
};
\`\`\`

### 3. File Manager

#### Overview
The file manager provides a graphical interface for file system navigation and manipulation.

#### Features
- **Directory Navigation**: Browse file system hierarchy
- **File Operations**: Copy, move, delete, rename files
- **Properties**: View file properties and permissions
- **Search**: Find files by name or content

#### File Operations
\`\`\`cpp
class FileManager {
public:
    void list_directory(const stdlib::string& path);
    bool copy_file(const stdlib::string& src, const stdlib::string& dest);
    bool move_file(const stdlib::string& src, const stdlib::string& dest);
    bool delete_file(const stdlib::string& path);
};
\`\`\`

## Built-in Shell

### Command Interpreter

#### Supported Commands
- **ls**: List directory contents
- **cd**: Change directory
- **cat**: Display file contents
- **cp**: Copy files
- **mv**: Move files
- **rm**: Remove files
- **mkdir**: Create directories
- **rmdir**: Remove directories
- **ps**: List processes
- **kill**: Terminate processes

#### Command Structure
\`\`\`cpp
struct Command {
    stdlib::string name;
    std::vector<stdlib::string> arguments;
    bool background;
};

class Shell {
public:
    void parse_command(const stdlib::string& input);
    int execute_command(const Command& cmd);
};
\`\`\`

### Environment Variables
\`\`\`cpp
// Environment management
std::map<stdlib::string, stdlib::string> environment;

void set_env(const stdlib::string& name, const stdlib::string& value);
stdlib::string get_env(const stdlib::string& name);
\`\`\`

## System Utilities

### Process Manager
- **Process Listing**: Display running processes
- **Resource Usage**: Show CPU and memory usage
- **Process Control**: Start, stop, and manage processes

### Network Utilities
- **Ping**: Test network connectivity
- **ifconfig**: Configure network interfaces
- **netstat**: Display network connections

### System Information
- **uptime**: System uptime and load
- **free**: Memory usage information
- **df**: Disk space usage

## Application Framework

### Window System (Future)
\`\`\`cpp
class Window {
private:
    uint32_t x, y, width, height;
    stdlib::string title;
    
public:
    void draw();
    void handle_event(Event& event);
    void resize(uint32_t w, uint32_t h);
};
\`\`\`

### Event System
\`\`\`cpp
enum EventType {
    KEY_PRESS,
    KEY_RELEASE,
    MOUSE_MOVE,
    MOUSE_CLICK
};

struct Event {
    EventType type;
    uint32_t data;
    uint32_t timestamp;
};
\`\`\`

These applications provide essential functionality for system operation and demonstrate the capabilities of the NEO-OS platform.`
  },
  api: {
    title: "API Reference",
    file: "API-Reference.md",
    content: `# NEO-OS API Reference

## Overview

This document provides a comprehensive reference for NEO-OS APIs, including system calls, kernel functions, and library interfaces available to developers.

## System Calls

### Process Management

#### \`fork()\`
Creates a new process by duplicating the current process.

\`\`\`cpp
pid_t fork(void);
\`\`\`

**Returns**: Process ID of child process, or 0 in child process, -1 on error

#### \`exec()\`
Replaces the current process image with a new program.

\`\`\`cpp
int exec(const char* path, char* const argv[]);
\`\`\`

**Parameters**:
- \`path\`: Path to executable file
- \`argv\`: Array of argument strings

#### \`exit()\`
Terminates the current process.

\`\`\`cpp
void exit(int status);
\`\`\`

**Parameters**:
- \`status\`: Exit status code

### File System Operations

#### \`open()\`
Opens a file for reading or writing.

\`\`\`cpp
int open(const char* path, int flags);
\`\`\`

**Parameters**:
- \`path\`: File path
- \`flags\`: Open flags (O_RDONLY, O_WRONLY, O_RDWR)

**Returns**: File descriptor, or -1 on error

#### \`read()\`
Reads data from a file descriptor.

\`\`\`cpp
ssize_t read(int fd, void* buffer, size_t count);
\`\`\`

**Parameters**:
- \`fd\`: File descriptor
- \`buffer\`: Buffer to read into
- \`count\`: Number of bytes to read

#### \`write()\`
Writes data to a file descriptor.

\`\`\`cpp
ssize_t write(int fd, const void* buffer, size_t count);
\`\`\`

**Parameters**:
- \`fd\`: File descriptor  
- \`buffer\`: Data to write
- \`count\`: Number of bytes to write

#### \`close()\`
Closes a file descriptor.

\`\`\`cpp
int close(int fd);
\`\`\`

### Memory Management

#### \`mmap()\`
Maps memory regions.

\`\`\`cpp
void* mmap(void* addr, size_t length, int prot, int flags);
\`\`\`

**Parameters**:
- \`addr\`: Preferred address (can be NULL)
- \`length\`: Size of mapping
- \`prot\`: Protection flags
- \`flags\`: Mapping flags

#### \`munmap()\`
Unmaps memory regions.

\`\`\`cpp
int munmap(void* addr, size_t length);
\`\`\`

## Kernel APIs

### Memory Management

#### Heap Functions
\`\`\`cpp
void* kmalloc(size_t size);                    // Allocate kernel memory
void kfree(void* ptr);                         // Free kernel memory
void* krealloc(void* ptr, size_t size);        // Reallocate memory
void* kcalloc(size_t count, size_t size);      // Allocate zeroed memory
\`\`\`

#### Page Allocation
\`\`\`cpp
void* allocate_page(void);                     // Allocate single page
void* allocate_pages(uint64_t count);          // Allocate multiple pages
void free_page(void* page);                    // Free single page
void free_pages(void* pages, uint64_t count);  // Free multiple pages
\`\`\`

### Process Management

#### Process Control
\`\`\`cpp
pid_t create_process(const char* name);        // Create new process
void destroy_process(pid_t pid);               // Destroy process
void schedule(void);                           // Invoke scheduler
void yield(void);                              // Yield CPU to other processes
\`\`\`

#### Thread Management
\`\`\`cpp
tid_t create_thread(void (*entry)(void*), void* arg);  // Create thread
void exit_thread(int status);                          // Exit current thread
void join_thread(tid_t tid);                           // Wait for thread
\`\`\`

### Synchronization

#### Mutex Operations
\`\`\`cpp
void mutex_init(mutex_t* mutex);               // Initialize mutex
void mutex_lock(mutex_t* mutex);               // Acquire mutex
void mutex_unlock(mutex_t* mutex);             // Release mutex
bool mutex_trylock(mutex_t* mutex);            // Try to acquire mutex
\`\`\`

#### Semaphore Operations
\`\`\`cpp
void semaphore_init(semaphore_t* sem, int value);  // Initialize semaphore
void semaphore_wait(semaphore_t* sem);              // Wait (P operation)
void semaphore_signal(semaphore_t* sem);            // Signal (V operation)
\`\`\`

## Driver Interface

### Device Registration
\`\`\`cpp
int register_device(device_t* device);         // Register device
int unregister_device(device_t* device);       // Unregister device
\`\`\`

### Interrupt Handling
\`\`\`cpp
void register_interrupt_handler(uint8_t irq, interrupt_handler_t handler);
void unregister_interrupt_handler(uint8_t irq);
\`\`\`

## Standard Library

### String Functions
\`\`\`cpp
size_t strlen(const char* str);                // String length
char* strcpy(char* dest, const char* src);     // String copy
int strcmp(const char* s1, const char* s2);    // String compare
char* strcat(char* dest, const char* src);     // String concatenate
\`\`\`

### Memory Functions  
\`\`\`cpp
void* memcpy(void* dest, const void* src, size_t n);   // Memory copy
void* memset(void* s, int c, size_t n);                // Memory set
int memcmp(const void* s1, const void* s2, size_t n);  // Memory compare
\`\`\`

### Math Functions
\`\`\`cpp
int abs(int x);                                // Absolute value
long labs(long x);                             // Long absolute value
double sqrt(double x);                         // Square root
double pow(double x, double y);                // Power function
\`\`\`

This API reference provides the essential interfaces for NEO-OS development and system programming.`
  },
  config: {
    title: "Configuration",
    file: "Configuration.md",
    content: `# NEO-OS Configuration

## Overview

NEO-OS provides various configuration options for customizing kernel behavior, enabling/disabling features, and optimizing performance for different use cases.

## Build-Time Configuration

### Main Configuration File (\`OS/include/config.h\`)

The main configuration header defines compile-time options:

\`\`\`cpp
#ifndef CONFIG_H
#define CONFIG_H

// Kernel configuration
#define KERNEL_VERSION_MAJOR    0
#define KERNEL_VERSION_MINOR    0
#define KERNEL_VERSION_PATCH    1
#define KERNEL_VERSION_SUFFIX   "A"

// Memory configuration
#define KERNEL_HEAP_SIZE        (16 * 1024 * 1024)    // 16MB
#define MAX_PHYSICAL_MEMORY     (4ULL * 1024 * 1024 * 1024) // 4GB
#define PAGE_SIZE               4096

// Process configuration
#define MAX_PROCESSES           256
#define DEFAULT_STACK_SIZE      (8 * 1024)            // 8KB
#define SCHEDULER_QUANTUM       10                     // 10ms

// Debug configuration
#define DEBUG_ENABLED           1
#define SERIAL_DEBUG            1
#define VGA_DEBUG               1

#endif
\`\`\`

### Feature Flags

#### Core Features
\`\`\`cpp
#define ENABLE_SMP              1    // Symmetric multiprocessing
#define ENABLE_ACPI             1    // ACPI support
#define ENABLE_NETWORKING       1    // Network stack
#define ENABLE_USB              0    // USB support (future)
\`\`\`

#### File System Support
\`\`\`cpp
#define ENABLE_FAT_FS           1    // FAT file system
#define ENABLE_EXT2_FS          0    // EXT2 file system (future)
#define ENABLE_TMPFS            1    // Temporary file system
\`\`\`

#### Driver Configuration
\`\`\`cpp
#define ENABLE_PCI_DRIVER       1    // PCI enumeration
#define ENABLE_AHCI_DRIVER      1    // SATA controller
#define ENABLE_VGA_DRIVER       1    // VGA graphics
#define ENABLE_PS2_DRIVER       1    // PS/2 keyboard/mouse
#define ENABLE_SERIAL_DRIVER    1    // Serial communication
\`\`\`

## Memory Configuration

### Heap Settings
\`\`\`cpp
// Kernel heap configuration
#define KERNEL_HEAP_START       0xFFFF880000000000
#define KERNEL_HEAP_SIZE        (16 * 1024 * 1024)
#define HEAP_ALIGNMENT          8
#define HEAP_MIN_BLOCK_SIZE     16
\`\`\`

### Page Allocation
\`\`\`cpp
// Page allocator settings
#define PAGE_SIZE               4096
#define PAGES_PER_ALLOCATION    1
#define MAX_PAGE_REGIONS        10
\`\`\`

### Virtual Memory
\`\`\`cpp
// Virtual memory layout
#define KERNEL_VIRTUAL_BASE     0xFFFFFFFF80000000
#define USER_VIRTUAL_BASE       0x0000000000400000
#define KERNEL_STACK_SIZE       (16 * 1024)
#define USER_STACK_SIZE         (8 * 1024 * 1024)
\`\`\`

## Process Configuration

### Scheduler Settings
\`\`\`cpp
// Scheduler configuration
#define SCHEDULER_TYPE          ROUND_ROBIN
#define TIME_SLICE_MS           10
#define MAX_PRIORITY_LEVELS     8
#define DEFAULT_PRIORITY        4
\`\`\`

### Process Limits
\`\`\`cpp
// Process limits
#define MAX_PROCESSES           256
#define MAX_THREADS_PER_PROCESS 64
#define MAX_OPEN_FILES          256
#define MAX_COMMAND_LENGTH      1024
\`\`\`

## Debug Configuration

### Debug Levels
\`\`\`cpp
#define DEBUG_LEVEL_NONE        0
#define DEBUG_LEVEL_ERROR       1
#define DEBUG_LEVEL_WARNING     2
#define DEBUG_LEVEL_INFO        3
#define DEBUG_LEVEL_DEBUG       4

#define CURRENT_DEBUG_LEVEL     DEBUG_LEVEL_INFO
\`\`\`

### Debug Output
\`\`\`cpp
// Debug output configuration
#define DEBUG_SERIAL_PORT       0x3F8    // COM1
#define DEBUG_BAUD_RATE         115200
#define DEBUG_VGA_ENABLED       1
#define DEBUG_LOG_TIMESTAMPS    1
\`\`\`

## Hardware Configuration

### CPU Features
\`\`\`cpp
// CPU feature detection
#define DETECT_SSE              1
#define DETECT_AVX              1
#define DETECT_APIC             1
#define DETECT_X2APIC           1
\`\`\`

### Interrupt Configuration
\`\`\`cpp
// Interrupt settings
#define IDT_SIZE                256
#define IRQ_BASE                0x20
#define TIMER_FREQUENCY         1000    // 1000 Hz
#define KEYBOARD_IRQ            1
#define TIMER_IRQ               0
\`\`\`

## Network Configuration

### Network Stack
\`\`\`cpp
// Network configuration
#define MAX_NETWORK_INTERFACES  4
#define DEFAULT_MTU             1500
#define ARP_TABLE_SIZE          256
#define ROUTING_TABLE_SIZE      128
\`\`\`

### Protocol Support
\`\`\`cpp
#define ENABLE_IPv4             1
#define ENABLE_IPv6             0
#define ENABLE_TCP              1
#define ENABLE_UDP              1
#define ENABLE_ICMP             1
\`\`\`

## File System Configuration

### VFS Settings
\`\`\`cpp
// Virtual File System
#define MAX_OPEN_FILES          1024
#define MAX_PATH_LENGTH         4096
#define DEFAULT_FILE_PERMISSIONS 0644
#define DEFAULT_DIR_PERMISSIONS  0755
\`\`\`

### Cache Configuration
\`\`\`cpp
// File system cache
#define BUFFER_CACHE_SIZE       (4 * 1024 * 1024)    // 4MB
#define INODE_CACHE_SIZE        1024
#define DENTRY_CACHE_SIZE       2048
\`\`\`

## Customization

### Build Profiles
\`\`\`makefile
# Debug build
CONFIG_DEBUG=1 make

# Release build
CONFIG_RELEASE=1 make

# Minimal build
CONFIG_MINIMAL=1 make
\`\`\`

### Runtime Configuration
Some settings can be modified at runtime through the \`/proc/sys\` interface (future implementation):

- Scheduler parameters
- Memory allocation limits
- Debug output levels
- Network settings

This configuration system provides flexibility for different deployment scenarios while maintaining system stability and performance.`
  }
}

interface DocumentationContentProps {
  section: string
}

export function DocumentationContent({ section }: DocumentationContentProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  
  const doc = documentationContent[section]
  
  if (!doc) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Documentation Not Found</h2>
        <p className="text-gray-400">The requested documentation section could not be loaded.</p>
      </div>
    )
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess("Copied!")
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      setCopySuccess("Failed to copy")
      setTimeout(() => setCopySuccess(null), 2000)
    }
  }

  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const renderedLines: React.ReactElement[] = []
    let inCodeBlock = false
    let codeLanguage = ''
    let codeContent: string[] = []

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          renderedLines.push(
            <div key={index} className="my-6">
              <div className="bg-gray-900/50 rounded-t-lg border border-gray-700 px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-gray-400 font-mono">
                  {codeLanguage || 'code'}
                </span>
                <button
                  onClick={() => copyToClipboard(codeContent.join('\n'))}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess || 'Copy'}
                </button>
              </div>
              <pre className="bg-gray-900/30 rounded-b-lg border border-t-0 border-gray-700 p-4 overflow-x-auto">
                <code className="text-sm text-gray-300 font-mono">
                  {codeContent.join('\n')}
                </code>
              </pre>
            </div>
          )
          inCodeBlock = false
          codeLanguage = ''
          codeContent = []
        } else {
          // Start of code block
          inCodeBlock = true
          codeLanguage = line.replace('```', '')
        }
      } else if (inCodeBlock) {
        codeContent.push(line)
      } else {
        // Regular content
        if (line.startsWith('# ')) {
          renderedLines.push(
            <h1 key={index} className="text-4xl font-bold text-white mb-6 mt-8">
              {line.replace('# ', '')}
            </h1>
          )
        } else if (line.startsWith('## ')) {
          renderedLines.push(
            <h2 key={index} className="text-2xl font-semibold text-blue-400 mb-4 mt-8">
              {line.replace('## ', '')}
            </h2>
          )
        } else if (line.startsWith('### ')) {
          renderedLines.push(
            <h3 key={index} className="text-xl font-semibold text-purple-400 mb-3 mt-6">
              {line.replace('### ', '')}
            </h3>
          )
        } else if (line.startsWith('- ')) {
          renderedLines.push(
            <li key={index} className="text-gray-300 ml-4 mb-1">
              {line.replace('- ', '')}
            </li>
          )
        } else if (line.includes('`') && !line.startsWith('```')) {
          // Inline code
          const parts = line.split('`')
          const processedLine = parts.map((part, i) => 
            i % 2 === 1 ? (
              <code key={i} className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm font-mono">
                {part}
              </code>
            ) : part
          )
          renderedLines.push(
            <p key={index} className="text-gray-300 mb-3">
              {processedLine}
            </p>
          )
        } else if (line.trim()) {
          renderedLines.push(
            <p key={index} className="text-gray-300 mb-3">
              {line}
            </p>
          )
        }
      }
    })

    return renderedLines
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{doc.title}</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {doc.file}
            </p>
          </div>
          <button
            onClick={() => window.open(`/Documentation/${doc.file}`, '_blank')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Source
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="prose prose-invert max-w-none">
          {renderContent(doc.content)}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
        <div className="text-gray-400">
          Part of NEO-OS Documentation
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
} 