# NEO-OS Configuration

## Overview

NEO-OS provides various configuration options to customize build parameters, runtime behavior, and system features. Configuration is handled through build-time settings, runtime parameters, and configuration files.

## Build-Time Configuration

### Main Configuration File (`OS/include/config.h`)

The primary configuration file contains compile-time options:

```cpp
#ifndef CONFIG_H
#define CONFIG_H

// Debug and Logging Configuration
#define SERIAL_OUTPUT_ENABLE 1          // Enable serial debug output
#define DEBUG_MODE 1                    // Enable debug features
#define VERBOSE_BOOT 0                  // Verbose boot messages
#define KERNEL_LOGGING 1                // Enable kernel logging

// Memory Management Configuration
#define HEAP_SIZE_INITIAL_MB 16         // Initial heap size in MB
#define PAGE_POOL_SIZE 1024             // Page pool size
#define MAX_MEMORY_REGIONS 10           // Maximum memory regions
#define ENABLE_MEMORY_DEBUG 1           // Memory debugging

// Process Management Configuration
#define MAX_PROCESSES 100               // Maximum number of processes
#define PROCESS_STACK_SIZE 0x10000      // Process stack size (64KB)
#define ENABLE_SMP 1                    // Enable multiprocessing

// Driver Configuration
#define ENABLE_AHCI_DRIVER 1            // AHCI SATA driver
#define ENABLE_RTL8139_DRIVER 1         // RTL8139 network driver
#define ENABLE_VGA_DRIVER 1             // VGA graphics driver
#define ENABLE_PS2_DRIVER 1             // PS/2 input driver

// File System Configuration
#define MAX_OPEN_FILES 64               // Maximum open files per process
#define FILE_CACHE_SIZE_KB 512          // File cache size
#define MAX_FILENAME_LENGTH 256         // Maximum filename length
#define MAX_PATH_LENGTH 1024            // Maximum path length

// Graphics Configuration
#define DEFAULT_SCREEN_WIDTH 1024       // Default screen width
#define DEFAULT_SCREEN_HEIGHT 768       // Default screen height
#define DEFAULT_COLOR_DEPTH 32          // Default color depth (bits)
#define ENABLE_DOUBLE_BUFFERING 1       // Enable double buffering

// Network Configuration
#define ENABLE_NETWORKING 1             // Enable network stack
#define MAX_NETWORK_INTERFACES 4       // Maximum network interfaces
#define NETWORK_BUFFER_SIZE 1500        // Network buffer size (MTU)

// Application Configuration
#define ENABLE_TERMINAL 1               // Enable terminal application
#define ENABLE_FILE_VIEWER 1            // Enable file viewer
#define ENABLE_LOGIN_SYSTEM 1           // Enable login system
#define COMMAND_HISTORY_SIZE 50         // Command history entries

// Performance Configuration
#define TIMER_FREQUENCY_HZ 1000         // Timer frequency
#define SCHEDULER_TIMESLICE_MS 10       // Scheduler time slice
#define INTERRUPT_NESTING_LEVEL 3       // Maximum interrupt nesting

// Security Configuration
#define ENABLE_STACK_PROTECTION 0       // Stack canaries (future)
#define ENABLE_ASLR 0                   // Address space randomization (future)
#define ENABLE_NX_BIT 1                 // No-execute bit support

#endif
```

### Conditional Compilation

Features can be conditionally compiled based on configuration:

```cpp
// Example conditional compilation
#if SERIAL_OUTPUT_ENABLE
    #define serial_printf(fmt, ...) serial_write_formatted(fmt, ##__VA_ARGS__)
#else
    #define serial_printf(fmt, ...) do {} while(0)
#endif

#if DEBUG_MODE
    #define debug_assert(condition) assert(condition)
    #define debug_print(msg) kernel_debug_print(msg)
#else
    #define debug_assert(condition) do {} while(0)
    #define debug_print(msg) do {} while(0)
#endif
```

### Platform-Specific Configuration

```cpp
// Platform-specific settings
#ifdef TARGET_X86_64
    #define ARCH_PAGE_SIZE 4096
    #define ARCH_CACHE_LINE_SIZE 64
    #define ARCH_STACK_ALIGNMENT 16
#endif

#ifdef TARGET_ARM64
    #define ARCH_PAGE_SIZE 4096
    #define ARCH_CACHE_LINE_SIZE 64
    #define ARCH_STACK_ALIGNMENT 16
#endif
```

## Build System Configuration

### Makefile Configuration (`OS/GNUmakefile`)

Build parameters can be customized through makefile variables:

```makefile
# Compiler optimization level
OPTIMIZATION_LEVEL ?= -O0           # Debug build
# OPTIMIZATION_LEVEL ?= -O2         # Release build
# OPTIMIZATION_LEVEL ?= -Os         # Size-optimized build

# Debug information
DEBUG_INFO ?= -g                    # Include debug symbols
# DEBUG_INFO ?=                     # No debug symbols

# Warning levels
WARNING_FLAGS ?= -Wall -Wextra      # Standard warnings
# WARNING_FLAGS ?= -Wall -Wextra -Werror  # Warnings as errors

# Feature flags
FEATURE_FLAGS ?= -DDEBUG_MODE=1     # Enable debug mode
# FEATURE_FLAGS ?= -DRELEASE_MODE=1  # Enable release mode

# Architecture-specific flags
ARCH_FLAGS ?= -march=x86-64 -mtune=generic
# ARCH_FLAGS ?= -march=native       # Optimize for build machine
```

### Toolchain Configuration

```makefile
# Cross-compiler paths
CROSS_PREFIX ?= /usr/local/x86_64elfgcc/bin/x86_64-elf-
CC := $(CROSS_PREFIX)gcc
CXX := $(CROSS_PREFIX)g++
LD := $(CROSS_PREFIX)ld
AS := $(CROSS_PREFIX)as
AR := $(CROSS_PREFIX)ar

# Alternative toolchain (if available)
# CROSS_PREFIX ?= x86_64-linux-gnu-
```

## Runtime Configuration

### Boot Configuration (`limine.cfg`)

LIMINE bootloader configuration:

```ini
# Boot timeout (seconds)
TIMEOUT=3

# Default boot entry
DEFAULT_ENTRY=1

# Graphics mode
GRAPHICS=yes
RESOLUTION=1024x768x32

# Serial console
SERIAL=yes
SERIAL_BAUDRATE=115200

# Boot entry
:NEO-OS Debug
PROTOCOL=limine
KERNEL_PATH=boot:///bin/kernel.elf
MODULE_PATH=boot:///bin/logo.nic
MODULE_STRING=logo
CMDLINE=debug serial_console

:NEO-OS Release
PROTOCOL=limine
KERNEL_PATH=boot:///bin/kernel.elf
MODULE_PATH=boot:///bin/logo.nic
MODULE_STRING=logo
CMDLINE=quiet
```

### Kernel Command Line

The kernel accepts command line parameters:

```cpp
// Kernel command line parser
struct kernel_cmdline {
    bool debug_mode;            // Enable debug output
    bool serial_console;        // Use serial console
    bool quiet_boot;            // Suppress boot messages
    bool safe_mode;             // Boot in safe mode
    const char *init_program;   // Initial program to run
    int log_level;              // Logging verbosity level
};

// Parse command line
void parse_kernel_cmdline(const char *cmdline) {
    // Parse parameters like: debug serial_console quiet
}
```

### System Configuration Files

#### Login Configuration (`/etc/login`)
```
# Login system configuration
default_user=user
password_hash=5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
session_timeout=1800
max_login_attempts=3
lockout_duration=300
```

#### System Settings (`/etc/system.conf`)
```ini
[display]
resolution=1024x768
color_depth=32
refresh_rate=60

[memory]
heap_size_mb=32
cache_size_mb=8
swap_enabled=false

[network]
hostname=neo-os
domain=local
dhcp_enabled=true

[applications]
default_shell=/bin/terminal
startup_applications=terminal,file_viewer

[debugging]
serial_debug=true
log_level=info
core_dumps=false
```

## Driver Configuration

### PCI Device Configuration
```cpp
// PCI device configuration
struct pci_device_config {
    uint16_t vendor_id;         // Device vendor ID
    uint16_t device_id;         // Device product ID
    const char *driver_name;    // Driver to load
    bool auto_load;             // Automatically load driver
    void *driver_data;          // Driver-specific configuration
};

// PCI device table
static pci_device_config pci_devices[] = {
    {0x8086, 0x2922, "ahci", true, nullptr},       // Intel AHCI
    {0x10EC, 0x8139, "rtl8139", true, nullptr},    // Realtek RTL8139
    {0x1234, 0x1111, "qemu_vga", true, nullptr},   // QEMU VGA
    {0, 0, nullptr, false, nullptr}                // End marker
};
```

### AHCI Configuration
```cpp
// AHCI driver configuration
struct ahci_config {
    bool enable_ncq;            // Enable Native Command Queuing
    int max_commands;           // Maximum concurrent commands
    int timeout_ms;             // Command timeout
    bool enable_hotplug;        // Enable hot-plug detection
};

static ahci_config ahci_settings = {
    .enable_ncq = true,
    .max_commands = 32,
    .timeout_ms = 5000,
    .enable_hotplug = false
};
```

### Network Configuration
```cpp
// Network interface configuration
struct network_config {
    char interface_name[16];    // Interface name
    uint8_t mac_address[6];     // MAC address (0 = use hardware)
    bool dhcp_enabled;          // Use DHCP
    uint32_t static_ip;         // Static IP address
    uint32_t netmask;           // Network mask
    uint32_t gateway;           // Default gateway
    uint32_t dns_server;        // DNS server
};
```

## Application Configuration

### Terminal Configuration
```cpp
// Terminal application settings
struct terminal_config {
    int screen_rows;            // Terminal rows
    int screen_cols;            // Terminal columns
    uint32_t text_color;        // Text color
    uint32_t background_color;  // Background color
    bool echo_enabled;          // Echo input
    bool command_history;       // Enable command history
    int history_size;           // History buffer size
    const char *prompt;         // Command prompt
};

static terminal_config term_settings = {
    .screen_rows = 25,
    .screen_cols = 80,
    .text_color = 0xFFFFFF,     // White
    .background_color = 0x000000, // Black
    .echo_enabled = true,
    .command_history = true,
    .history_size = 50,
    .prompt = "neo-os> "
};
```

### File System Configuration
```cpp
// VFS configuration
struct vfs_config {
    int max_open_files;         // Maximum open files
    int cache_size_kb;          // File cache size
    bool case_sensitive;        // Case-sensitive filenames
    bool long_filename_support; // Support long filenames
    const char *default_mount;  // Default mount point
};
```

## Performance Tuning

### Memory Management Tuning
```cpp
// Memory allocator settings
struct memory_config {
    size_t initial_heap_size;   // Initial heap size
    size_t max_heap_size;       // Maximum heap size
    size_t heap_growth_factor;  // Heap growth factor (percentage)
    bool use_large_pages;       // Use 2MB pages when possible
    int page_pool_size;         // Page pool size
    bool enable_compression;    // Enable memory compression
};
```

### I/O Performance Settings
```cpp
// I/O subsystem configuration
struct io_config {
    int disk_queue_depth;       // Disk command queue depth
    int network_buffer_count;   // Network buffer count
    bool async_io;              // Enable asynchronous I/O
    int io_scheduler;           // I/O scheduler algorithm
    bool write_caching;         // Enable write caching
};
```

### Interrupt Configuration
```cpp
// Interrupt system settings
struct interrupt_config {
    bool interrupt_coalescing;  // Coalesce interrupts
    int coalescing_timeout_us;  // Coalescing timeout
    int max_interrupts_per_sec; // Rate limiting
    bool msi_enabled;           // Enable MSI interrupts
    bool msi_x_enabled;         // Enable MSI-X interrupts
};
```

## Debug Configuration

### Logging Configuration
```cpp
// Kernel logging settings
enum log_level {
    LOG_FATAL = 0,              // Fatal errors only
    LOG_ERROR = 1,              // Errors and above
    LOG_WARN = 2,               // Warnings and above
    LOG_INFO = 3,               // Informational and above
    LOG_DEBUG = 4,              // All messages
    LOG_TRACE = 5               // Trace level (very verbose)
};

struct logging_config {
    enum log_level console_level;   // Console log level
    enum log_level serial_level;    // Serial log level
    enum log_level file_level;      // File log level (future)
    bool timestamp_enabled;         // Include timestamps
    bool source_location;           // Include source file/line
    bool color_output;              // Colored log output
};
```

### Debug Output Configuration
```cpp
// Debug output settings
struct debug_config {
    bool serial_debug;          // Enable serial debug output
    int serial_port;            // Serial port number
    int serial_baudrate;        // Serial baud rate
    bool gdb_stub;              // Enable GDB stub (future)
    int gdb_port;               // GDB port number
    bool kernel_symbols;        // Include kernel symbols
};
```

## Configuration Management

### Configuration Loading
```cpp
// Configuration loading system
class ConfigManager {
public:
    // Load configuration from file
    bool load_config(const char *filename);
    
    // Save configuration to file
    bool save_config(const char *filename);
    
    // Get configuration value
    template<typename T>
    T get_value(const char *key, T default_value);
    
    // Set configuration value
    template<typename T>
    void set_value(const char *key, T value);
    
    // Validate configuration
    bool validate_config();
};
```

### Configuration File Format
```ini
# NEO-OS Configuration File
[system]
version=0.001A
build_date=2024-01-15
debug_mode=true

[memory]
heap_size_mb=32
page_cache_mb=8
swap_enabled=false

[graphics]
resolution=1024x768
color_depth=32
vsync_enabled=true

[network]
hostname=neo-os
dhcp_enabled=true
dns_server=8.8.8.8

[applications]
startup_terminal=true
startup_file_viewer=false
command_timeout=30
```

## Environment Variables (Future)

### System Environment
```cpp
// Environment variable system
class Environment {
public:
    // Set environment variable
    void set_var(const char *name, const char *value);
    
    // Get environment variable
    const char *get_var(const char *name);
    
    // Remove environment variable
    void unset_var(const char *name);
    
    // List all variables
    void list_vars();
};

// Common environment variables
PATH=/bin:/usr/bin
HOME=/home/user
USER=user
TERM=neo-terminal
SHELL=/bin/terminal
```

## Configuration Validation

### Validation Rules
```cpp
// Configuration validation
struct config_rule {
    const char *key;            // Configuration key
    enum value_type type;       // Expected value type
    void *min_value;            // Minimum value (if applicable)
    void *max_value;            // Maximum value (if applicable)
    bool required;              // Is this setting required
};

// Validation table
static config_rule validation_rules[] = {
    {"memory.heap_size_mb", TYPE_INT, &(int){8}, &(int){1024}, true},
    {"graphics.resolution", TYPE_STRING, nullptr, nullptr, false},
    {"network.dhcp_enabled", TYPE_BOOL, nullptr, nullptr, false},
    {nullptr, TYPE_INVALID, nullptr, nullptr, false}
};
```

### Configuration Errors
```cpp
// Configuration error handling
enum config_error {
    CONFIG_OK = 0,
    CONFIG_FILE_NOT_FOUND = 1,
    CONFIG_PARSE_ERROR = 2,
    CONFIG_INVALID_VALUE = 3,
    CONFIG_MISSING_REQUIRED = 4,
    CONFIG_OUT_OF_RANGE = 5
};

// Error reporting
void report_config_error(enum config_error error, const char *key) {
    switch (error) {
        case CONFIG_INVALID_VALUE:
            kernel::log_error("Invalid value for configuration key: %s", key);
            break;
        case CONFIG_OUT_OF_RANGE:
            kernel::log_error("Value out of range for key: %s", key);
            break;
        // ... other error cases
    }
}
```

## Default Configurations

### Development Configuration
```cpp
// Development/debug configuration
#ifdef DEBUG_BUILD
    #define DEFAULT_LOG_LEVEL LOG_DEBUG
    #define DEFAULT_SERIAL_OUTPUT 1
    #define DEFAULT_MEMORY_DEBUG 1
    #define DEFAULT_ASSERT_ENABLED 1
    #define DEFAULT_OPTIMIZATION_LEVEL 0
#endif
```

### Production Configuration
```cpp
// Production/release configuration
#ifdef RELEASE_BUILD
    #define DEFAULT_LOG_LEVEL LOG_ERROR
    #define DEFAULT_SERIAL_OUTPUT 0
    #define DEFAULT_MEMORY_DEBUG 0
    #define DEFAULT_ASSERT_ENABLED 0
    #define DEFAULT_OPTIMIZATION_LEVEL 2
#endif
```

### Minimal Configuration
```cpp
// Minimal configuration for resource-constrained systems
#ifdef MINIMAL_BUILD
    #define MAX_PROCESSES 10
    #define HEAP_SIZE_INITIAL_MB 4
    #define FILE_CACHE_SIZE_KB 64
    #define ENABLE_NETWORKING 0
    #define ENABLE_GRAPHICS 0
#endif
```

This configuration system provides flexible control over NEO-OS behavior while maintaining reasonable defaults and proper validation. 