# NEO-OS Documentation

Welcome to the comprehensive documentation for NEO-OS - an open source, fast, and secure amd64 operating system built on the LIMINE protocol with UEFI booting support.

## Documentation Structure

This documentation is organized into the following sections:

### Core Documentation
- **[Architecture Overview](Architecture-Overview.md)** - High-level system architecture and design principles
- **[Kernel Core](Kernel-Core.md)** - Memory management, process handling, and core kernel functionality
- **[Boot Process](Boot-Process.md)** - System initialization and boot sequence

### System Components
- **[Drivers](Drivers.md)** - Hardware drivers (PCI, ACPI, AHCI, VGA, Network, etc.)
- **[File System](File-System.md)** - Virtual File System (VFS) and FAT implementation
- **[Interrupt Handling](Interrupt-Handling.md)** - APIC, IDT, and interrupt management
- **[Memory Management](Memory-Management.md)** - Page allocation, heap management, and virtual memory

### Development
- **[Standard Library](Standard-Library.md)** - Built-in string, math, and utility functions
- **[Build System](Build-System.md)** - Compilation process and toolchain requirements
- **[Applications](Applications.md)** - Built-in programs and shell implementation

### Reference
- **[API Reference](API-Reference.md)** - Function and structure references
- **[Configuration](Configuration.md)** - Build-time configuration options

## Quick Start

1. See [Build System](Build-System.md) for compilation instructions
2. Review [Architecture Overview](Architecture-Overview.md) to understand the system design
3. Check [Kernel Core](Kernel-Core.md) for core functionality details

## Current Version: 0.001A

### Key Features
- Modular page frame allocator
- Standard library with basic string, math and I/O functions
- Heap management
- Virtual file system
- Custom icon file format
- Timers
- Simultaneous multiprocessing (SMP)
- APIC, ACPI, AHCI, PCI, serial & VGA drivers

### Development Goals
- Processes and scheduler improvements
- Enhanced shell functionality
- Expanded standard library
- USB support
- BusyBox port 