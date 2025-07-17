# NEO-OS Kernel Core

## Overview

The NEO-OS kernel core provides fundamental operating system services including memory management, process control, interrupt handling, and system initialization. The kernel follows a modular design with clear separation of concerns.

## Kernel Entry Point

### Main Entry (`OS/src/kernel/_start.cpp`)

The kernel entry point `_start()` performs system initialization in a specific order:

```cpp
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
        
        if (vga::g_framebuffer_dirty)
            vga::repaintScreen();         // Refresh display if needed
        asm volatile("hlt");              // Halt until next interrupt
    }
}
```

## Core Subsystems

### 1. Memory Management (`OS/include/kernel/mem/`)

#### Heap Management
- **Allocator**: Custom heap allocator for kernel memory
- **Functions**: `kmalloc()`, `kfree()`, `krealloc()`, `kcalloc()`
- **Operators**: Overloaded C++ new/delete operators

**Key Functions:**
```cpp
void heapInit();                          // Initialize kernel heap
void *kmalloc(uint64_t size);            // Allocate memory
void kfree(void *ptr);                   // Free memory
void *krealloc(void *ptr, uint64_t size); // Reallocate memory
void *kcalloc(uint64_t count, uint64_t size); // Allocate zeroed memory
```

#### Page Management
- **Page Allocator**: Frame-based physical memory allocation
- **Virtual Memory**: Page table management for virtual addressing
- **Memory Mapping**: Higher-half direct mapping (HHDM)

#### Memory Utilities
```cpp
void memcpy(void *dest, const void *src, uint64_t num);
void memset_64(void *addr, uint64_t num, uint64_t value);
void memset_8(void *addr, uint64_t num, uint8_t value);
uint64_t getHHDM(void);                  // Get HHDM base address
```

### 2. Process Management (`OS/include/kernel/proc/`)

#### Process Structure
```cpp
struct process_t {
    uint64_t pid;              // Process ID
    uint64_t stack_frame;      // Stack pointer
    void *main;                // Entry point
    stream *stdin, *stdout;    // I/O streams
    kernel::File **files;      // Open file handles
    bool started;              // Process state
    bool exited;
    int exit_code;
};
```

#### Task Management
- **Task Creation**: `create_task()` for new processes
- **Task Switching**: Cooperative scheduling with `yield()`
- **Task Storage**: Array of process control blocks
- **Process Types**: Kernel processes and future user processes

**Key Functions:**
```cpp
void task_init(proc_main kernel_main);    // Initialize tasking
process_t *create_task(proc_main main);   // Create new task
void yield(process_t *proc);              // Yield CPU to scheduler
```

### 3. I/O and Streams (`OS/include/kernel/proc/stream.h`)

#### Stream Interface
- **Input/Output**: Standardized stream interface for I/O
- **Terminal Integration**: Connect processes to terminal I/O
- **File Integration**: Stream interface for file operations

### 4. Symmetric Multiprocessing (`OS/include/kernel/smp/`)

#### SMP Initialization
- **CPU Discovery**: Enumerate available CPU cores
- **APIC Setup**: Configure Advanced Programmable Interrupt Controller
- **Core Activation**: Bring up additional CPU cores

### 5. Interrupt Handling (`OS/include/kernel/x64/intr/`)

#### Interrupt Descriptor Table (IDT)
- **IDT Setup**: Configure interrupt handlers
- **Exception Handling**: CPU exception management
- **Hardware Interrupts**: Timer, keyboard, and device interrupts

#### APIC Management
```cpp
void initAPIC(uint8_t APICid);           // Initialize local APIC
void apicSendEOI(void);                  // Send End-of-Interrupt
void sleep(int64_t millis);              // Timer-based sleep
void ioapic_init();                      // Initialize I/O APIC
```

## Kernel Services

### 1. Logging and Debug (`OS/include/kernel/io/log.h`)
- **Kernel Logging**: Structured logging system
- **Debug Output**: Serial and console debug output
- **Log Levels**: Different verbosity levels for debugging

### 2. Terminal Interface (`OS/include/kernel/io/terminal.h`)
- **Console Management**: Text-based user interface
- **Input Handling**: Keyboard input processing
- **Output Formatting**: Text rendering and formatting

### 3. Scanning and Input (`OS/include/kernel/io/scan.h`)
- **Input Parsing**: Parse user input and commands
- **Command Processing**: Handle terminal commands
- **Input Validation**: Validate user input

## Kernel Applications

### Built-in Programs (`OS/src/kernel/programs/`)

#### 1. Login System (`login.cpp`)
- **Authentication**: Simple password-based login
- **Session Management**: User session handling
- **Security**: Basic access control

#### 2. Terminal (`terminal.cpp`)
- **Command Shell**: Interactive command interpreter
- **File Operations**: Basic file system commands
- **System Information**: Display system status

#### 3. File System Viewer (`fs_view.cpp`)
- **Directory Listing**: Browse file system hierarchy
- **File Display**: View file contents
- **Navigation**: Directory traversal

### Shell Commands
The kernel provides basic shell functionality:
- **File Listing**: `ls` equivalent for directory contents
- **File Display**: `cat` equivalent for file contents
- **Directory Navigation**: Basic path traversal
- **System Commands**: Clear screen, display information

## Error Handling

### Assertion System (`OS/include/stdlib/assert.h`)
- **Debug Assertions**: Runtime validation in debug builds
- **Error Reporting**: Structured error reporting
- **Failure Handling**: Graceful handling of assertion failures

### Exception Handling
- **CPU Exceptions**: Handle processor exceptions (page faults, etc.)
- **Hardware Errors**: Manage hardware-related errors
- **Recovery**: Attempt recovery from non-fatal errors

## Kernel Configuration

### Build Configuration (`OS/include/config.h`)
```cpp
#define SERIAL_OUTPUT_ENABLE 1    // Enable serial debug output
```

### Runtime Configuration
- **Memory Layout**: Configurable memory regions
- **Driver Selection**: Compile-time driver inclusion
- **Debug Options**: Runtime debug configuration

## Performance Considerations

### 1. Memory Efficiency
- **Page Alignment**: Proper memory alignment for performance
- **Cache Optimization**: Memory layout for cache efficiency
- **Minimal Fragmentation**: Efficient heap allocation strategy

### 2. Interrupt Latency
- **Fast Handlers**: Minimize time in interrupt context
- **Deferred Processing**: Move work to process context when possible
- **Priority Management**: Handle critical interrupts first

### 3. Scheduling Overhead
- **Cooperative Scheduling**: Minimal context switch overhead
- **Simple Scheduler**: Low-overhead task switching
- **Future Preemption**: Plans for preemptive scheduling

## Future Enhancements

### 1. Advanced Process Management
- **Preemptive Scheduling**: Time-slice based scheduling
- **Priority Levels**: Process priority management
- **Resource Limits**: CPU and memory usage limits

### 2. Inter-Process Communication
- **Message Passing**: Process communication mechanisms
- **Shared Memory**: Shared memory regions between processes
- **Synchronization**: Mutexes, semaphores, and other primitives

### 3. System Call Interface
- **Formal API**: Standardized system call interface
- **User/Kernel Separation**: Proper privilege separation
- **Security**: Access control and permission checking 