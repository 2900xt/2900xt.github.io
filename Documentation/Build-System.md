# NEO-OS Build System

## Overview

NEO-OS uses a comprehensive build system based on GNU Make with custom toolchain support. The build system handles kernel compilation, driver integration, dependency management, and creates bootable disk images for testing and deployment.

## Build Architecture

### Main Build Files
- **`GNUmakefile`** (Root) - Top-level build orchestration
- **`OS/GNUmakefile`** - Kernel and driver compilation
- **`OS/linker.ld`** - Kernel linker script
- **`toolchain.sh`** - Cross-compiler toolchain setup

## Toolchain Requirements

### Cross-Compilation Toolchain
NEO-OS requires a custom x86_64 cross-compilation toolchain:

```bash
# Toolchain location
CROSS_PREFIX = /usr/local/x86_64elfgcc/bin/x86_64-elf-

# Compilers and tools
C++ Compiler: x86_64-elf-g++
C Compiler: x86_64-elf-gcc  
Linker: x86_64-elf-ld
Assembler: nasm
Archive: x86_64-elf-ar
```

### Prerequisites

#### System Dependencies
- **libmpfr** - Multiple precision floating-point library
- **libgmp** - GNU Multiple Precision Arithmetic Library  
- **libmpc** - Multiple precision complex library
- **texinfo** - Documentation format tools
- **gcc** - Host GNU C compiler
- **nasm** - Netwide Assembler for x86/x86_64

#### Installation (Ubuntu/Debian)
```bash
sudo apt-get install libmpfr-dev libgmp-dev libmpc-dev texinfo gcc nasm
```

## Toolchain Setup

### Automated Toolchain Build (`toolchain.sh`)

The toolchain script automatically downloads, configures, and builds the cross-compilation environment:

```bash
#!/bin/bash
# toolchain.sh - Automated cross-compiler setup

# 1. Download binutils and GCC sources
# 2. Configure for x86_64-elf target
# 3. Build binutils (assembler, linker, etc.)
# 4. Build GCC cross-compiler
# 5. Install to /usr/local/x86_64elfgcc/
```

### Manual Toolchain Build

#### Step 1: Binutils
```bash
wget https://ftp.gnu.org/gnu/binutils/binutils-2.40.tar.xz
tar -xf binutils-2.40.tar.xz
mkdir binutils-build && cd binutils-build

../binutils-2.40/configure \
    --target=x86_64-elf \
    --prefix=/usr/local/x86_64elfgcc \
    --with-sysroot \
    --disable-nls \
    --disable-werror

make -j$(nproc)
sudo make install
```

#### Step 2: GCC Cross-Compiler
```bash
wget https://ftp.gnu.org/gnu/gcc/gcc-13.2.0/gcc-13.2.0.tar.xz
tar -xf gcc-13.2.0.tar.xz
mkdir gcc-build && cd gcc-build

../gcc-13.2.0/configure \
    --target=x86_64-elf \
    --prefix=/usr/local/x86_64elfgcc \
    --disable-nls \
    --enable-languages=c,c++ \
    --without-headers

make all-gcc -j$(nproc)
make all-target-libgcc -j$(nproc)
sudo make install-gcc
sudo make install-target-libgcc
```

## Kernel Build Configuration

### Compiler Flags (`OS/GNUmakefile`)

#### C++ Compilation Flags
```makefile
CROSSFLAGS = \
    -std=c++17           \  # C++17 standard
    -fno-exceptions      \  # Disable C++ exceptions
    -ffreestanding       \  # Freestanding environment
    -fno-stack-protector \  # Disable stack protection
    -fpermissive         \  # Allow some non-standard code
    -fno-stack-check     \  # Disable stack checking
    -fno-lto             \  # Disable link-time optimization
    -fno-pie             \  # Disable position-independent executable
    -fno-pic             \  # Disable position-independent code
    -m64                 \  # 64-bit target
    -march=x86-64        \  # x86-64 architecture
    -mabi=sysv           \  # System V ABI
    -mno-red-zone        \  # Disable red zone optimization
    -mcmodel=kernel      \  # Kernel code model
    -MMD                    # Generate dependency files
```

#### Additional Build Flags
```makefile
# User controllable flags
CROSSFLAGS += -g -I include -Wall -Wno-deprecated-declarations
CROSSFLAGS += -Ttext 0xffffffff80000000  # Kernel text address
CROSSFLAGS += -Wno-char-subscripts -Wno-sign-compare
CROSSFLAGS += -Wno-int-to-pointer-cast -O0  # Debug build
```

#### NASM Assembly Flags
```makefile
NASMFLAGS = \
    -F dwarf     \  # DWARF debug format
    -g           \  # Generate debug info
    -f elf64        # 64-bit ELF output
```

### Linker Configuration

#### Linker Flags
```makefile
LDFLAGS = \
    -z max-page-size=0x1000  \  # 4KB page alignment
    -T linker.ld             \  # Use custom linker script
    -no-pie                     # Disable PIE if supported
```

#### Linker Script (`OS/linker.ld`)
```ld
/* Kernel linker script */
ENTRY(_start)

SECTIONS {
    . = 0xffffffff80000000;  /* Kernel virtual address */
    
    .text : {
        *(.text)             /* Code sections */
    }
    
    .rodata : {
        *(.rodata)           /* Read-only data */
    }
    
    .data : {
        *(.data)             /* Initialized data */
    }
    
    .bss : {
        *(.bss)              /* Uninitialized data */
    }
}
```

## Source File Organization

### File Discovery
The build system automatically discovers source files:

```makefile
# Find all source files recursively
CPPFILES := $(shell find ./src -type f -name '*.cpp')
CFILES   := $(shell find ./src -type f -name '*.c')
ASFILES  := $(shell find ./src -type f -name '*.S')
NASMFILES := $(shell find ./src -type f -name '*.asm')
```

### Object File Generation
```makefile
# Generate object file names
CPPOBJS := $(CPPFILES:.cpp=.o)
COBJS   := $(CFILES:.c=.o)
ASOBJS  := $(ASFILES:.S=.o)
NASMOBJS := $(NASMFILES:.asm=.o)

OBJS := $(CPPOBJS) $(COBJS) $(ASOBJS) $(NASMOBJS)
```

## Build Targets

### Primary Targets

#### Kernel Build
```makefile
# Build kernel ELF binary
$(KERNEL): $(OBJS)
    $(LD) $(OBJS) $(LDFLAGS) -o $@
```

#### Clean Build
```makefile
clean:
    rm -rf $(OBJS) $(KERNEL) *.d
```

#### Complete Rebuild
```makefile
rebuild: clean $(KERNEL)
```

### Compilation Rules

#### C++ Source Files
```makefile
%.o: %.cpp
    $(CROSS) $(CROSSFLAGS) -c $< -o $@
```

#### C Source Files
```makefile
%.o: %.c
    $(CROSS) $(CROSSFLAGS) -c $< -o $@
```

#### Assembly Files (GAS)
```makefile
%.o: %.S
    $(CROSS) $(CROSSFLAGS) -c $< -o $@
```

#### NASM Assembly Files
```makefile
%.o: %.asm
    nasm $(NASMFLAGS) $< -o $@
```

## Bootloader Integration

### LIMINE Bootloader
NEO-OS uses the LIMINE bootloader for UEFI systems:

#### LIMINE Configuration (`limine.cfg`)
```ini
# LIMINE bootloader configuration
TIMEOUT=3
DEFAULT_ENTRY=1

:NEO-OS
PROTOCOL=limine
KERNEL_PATH=boot:///bin/kernel.elf
```

#### Required Files
- **`limine/limine.sys`** - LIMINE core system
- **`efi/boot/BOOTX64.EFI`** - UEFI bootloader
- **`bin/kernel.elf`** - Compiled kernel binary

## File System Image Creation

### Disk Image Structure
```
filesystem/
├── bin/
│   ├── kernel.elf      # Compiled kernel
│   ├── font.psf        # System font
│   └── logo.nic        # Boot logo
├── efi/
│   └── boot/
│       └── BOOTX64.EFI # UEFI bootloader
├── limine/
│   └── limine.sys      # LIMINE system
├── etc/
│   └── login           # Login configuration
└── limine.cfg          # Boot configuration
```

### Image Creation Process
1. **Kernel Compilation** - Build kernel ELF binary
2. **File System Preparation** - Organize required files
3. **Partition Creation** - Create GPT partitioned disk
4. **File System Format** - Format partitions as FAT32
5. **File Installation** - Copy files to appropriate locations
6. **Bootloader Installation** - Install LIMINE bootloader

## Dependency Management

### Automatic Dependencies
```makefile
# Include dependency files
-include $(OBJS:.o=.d)

# Dependencies generated automatically via -MMD flag
```

### Header Dependencies
The build system automatically tracks header file dependencies and rebuilds affected source files when headers change.

## Build Optimization

### Parallel Building
```makefile
# Use multiple CPU cores for building
make -j$(nproc)
```

### Incremental Builds
- Only rebuild changed source files
- Track header dependencies
- Minimize recompilation time

### Build Caching
- Object files cached until source changes
- Dependency files cached for fast rebuilds
- Clean builds when necessary

## Testing and Deployment

### QEMU Testing
```bash
# Build and test in QEMU
make run

# QEMU command line
qemu-system-x86_64 \
    -M q35 \
    -m 512M \
    -drive if=pflash,file=OVMF.fd,format=raw \
    -drive file=neo-OS.hdd,format=raw \
    -serial stdio
```

### Real Hardware Deployment
1. **Create Bootable USB** - Write disk image to USB drive
2. **UEFI Boot** - Boot from USB on UEFI system
3. **Hardware Testing** - Test on real hardware

## Debug Builds

### Debug Configuration
```makefile
# Debug build flags
DEBUG_FLAGS = -g -O0 -DDEBUG
CROSSFLAGS += $(DEBUG_FLAGS)
```

### Debug Features
- **Symbol Information** - Full debug symbols in kernel
- **Assertion Checks** - Runtime assertion validation
- **Memory Debugging** - Memory allocation tracking
- **Serial Output** - Debug output via serial port

## Release Builds

### Optimization Flags
```makefile
# Release build optimization
RELEASE_FLAGS = -O2 -DNDEBUG -fomit-frame-pointer
```

### Size Optimization
```makefile
# Minimize binary size
SIZE_FLAGS = -Os -ffunction-sections -fdata-sections
LDFLAGS += -Wl,--gc-sections  # Remove unused sections
```

## Cross-Platform Support

### Build Host Support
- **Linux** - Primary development platform
- **macOS** - Supported with Homebrew toolchain
- **Windows** - Supported with WSL or MinGW

### Target Architecture
- **x86_64** - Primary target architecture
- **Future Support** - ARM64, RISC-V planned

## Troubleshooting

### Common Build Issues

#### Toolchain Problems
```bash
# Toolchain not found
export PATH=/usr/local/x86_64elfgcc/bin:$PATH

# Missing dependencies
sudo apt-get install build-essential
```

#### Linker Errors
- Check linker script syntax
- Verify object file generation
- Ensure all symbols are defined

#### Assembly Errors
- Verify NASM syntax
- Check assembly file format
- Validate include paths

### Build Debugging
```makefile
# Verbose build output
make V=1

# Show commands being executed
make --debug=v
```

## Build Performance

### Optimization Strategies
- **Parallel Compilation** - Use all available CPU cores
- **Incremental Builds** - Only rebuild changed files
- **Dependency Caching** - Cache dependency information
- **Object File Reuse** - Reuse object files when possible

### Build Time Monitoring
```bash
# Time complete build
time make clean && time make

# Profile build performance
make --debug=j
```

## Customization

### Build Configuration
```makefile
# Custom flags can be set via environment
export EXTRA_CFLAGS="-DCUSTOM_FEATURE"
export EXTRA_LDFLAGS="-Map=kernel.map"
```

### Feature Selection
```cpp
// Conditional compilation in config.h
#define SERIAL_OUTPUT_ENABLE 1
#define DEBUG_MEMORY 0
#define ENABLE_NETWORKING 1
```

## Future Enhancements

### Planned Improvements
- **CMake Support** - Modern build system alternative
- **Package Management** - Dependency package management
- **Cross-Compilation** - Support for multiple architectures
- **Continuous Integration** - Automated build and testing

### Advanced Features
- **Link-Time Optimization** - Whole-program optimization
- **Profile-Guided Optimization** - Performance-based optimization
- **Static Analysis** - Automated code quality checking
- **Fuzzing Integration** - Security testing automation 