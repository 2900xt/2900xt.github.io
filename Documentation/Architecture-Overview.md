# NEO-OS Architecture Overview

## System Architecture

NEO-OS is a 64-bit operating system designed for x86-64 architecture with a modular, microkernel-inspired design. The system is built around several core components that work together to provide a complete operating environment.

## High-Level Design

```
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
```

## Core Components

### 1. Boot System (LIMINE Protocol)
- **Boot Loader**: Uses LIMINE bootloader for UEFI systems
- **Kernel Loading**: 64-bit ELF kernel loaded at high memory addresses
- **Memory Map**: Initialization with system memory layout from bootloader

### 2. Kernel Core
Located in `OS/src/kernel/` and `OS/include/kernel/`

**Entry Point**: `_start.cpp`
```cpp
void _start(void) {
    kernel::tty_init();           // Initialize terminal
    kernel::enableSSE();          // Enable SSE instructions
    kernel::fillIDT();            // Setup interrupt descriptor table
    kernel::heapInit();           // Initialize heap allocator
    kernel::initialize_page_allocator(); // Setup page management
    vga::framebuffer_init();      // Initialize graphics
    kernel::load_drivers();       // Load hardware drivers
    kernel::smp_init();           // Initialize SMP
    kernel::terminal_init();      // Start terminal
    kernel::login_init();         // Initialize login system
    // Main kernel loop...
}
```

### 3. Memory Management
- **Page Allocator**: Frame-based physical memory allocation
- **Heap Management**: Dynamic memory allocation (kmalloc/kfree)
- **Virtual Memory**: Page-based virtual memory management
- **Memory Mapping**: Higher-half direct mapping (HHDM)

### 4. Process Management
- **Task Structure**: Process control blocks with PID, stack, I/O streams
- **SMP Support**: Symmetric multiprocessing initialization
- **Scheduling**: Cooperative scheduling with yield functionality

### 5. Driver Architecture
**Modular Design**: Drivers are loaded during kernel initialization
- **PCI Enumeration**: Automatic hardware discovery
- **ACPI Tables**: Hardware configuration and power management
- **Storage**: AHCI SATA controller support
- **Graphics**: VGA framebuffer with font rendering
- **Input**: PS/2 keyboard support
- **Network**: RTL8139 Ethernet controller

### 6. File System
- **VFS Layer**: Virtual file system abstraction
- **FAT Support**: FAT16/32 file system implementation
- **GPT Partitions**: GUID Partition Table support
- **File Operations**: Standard open/read/close operations

### 7. Standard Library
Custom implementation providing:
- **String Operations**: String manipulation and formatting
- **Math Functions**: Basic mathematical operations
- **Memory Functions**: memcpy, memset, memory allocation
- **Timer System**: Kernel timing and delay functions
- **Assertions**: Debug assertion system

## Design Principles

### 1. Modularity
- Clean separation between kernel core and drivers
- Pluggable driver architecture
- Standardized interfaces between components

### 2. Performance
- Direct hardware access for critical operations
- Minimal abstraction layers where performance matters
- Efficient memory management with page-based allocation

### 3. Simplicity
- Clear, readable code structure
- Minimal feature creep in core components
- Straightforward build system

### 4. Standards Compliance
- UEFI boot standard via LIMINE
- Standard calling conventions (System V ABI)
- Industry-standard hardware interfaces

## Memory Layout

```
High Memory (0xFFFFFFFF80000000+)
├── Kernel Code & Data
├── Kernel Heap
├── Page Tables
└── Driver Memory

Low Memory (0x0000000000000000+)
├── Real Mode Memory
├── BIOS/UEFI Data
├── Hardware Buffers
└── User Space (Future)
```

## Boot Sequence

1. **UEFI Firmware** loads LIMINE bootloader
2. **LIMINE** loads kernel ELF and sets up initial environment
3. **Kernel Entry** (`_start`) initializes core systems
4. **Driver Loading** enumerates and initializes hardware
5. **User Interface** starts terminal and login system
6. **Main Loop** handles events and maintains system operation

## Configuration

Build-time configuration via `OS/include/config.h`:
- Serial output enable/disable
- Debug options
- Memory layout parameters

## Future Architecture Plans

- **User Space**: Separate user and kernel address spaces
- **System Calls**: Formal system call interface
- **Scheduler**: Preemptive task scheduling
- **IPC**: Inter-process communication mechanisms
- **Networking Stack**: TCP/IP implementation 