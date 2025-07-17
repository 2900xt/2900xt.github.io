# NEO-OS API Reference

## Overview

This document provides a comprehensive reference for all public APIs in NEO-OS, including kernel functions, driver interfaces, and standard library components.

## Kernel Core APIs

### Memory Management (`OS/include/kernel/mem/mem.h`)

#### Heap Allocation
```cpp
namespace kernel {
    // Initialize kernel heap
    void heapInit();
    
    // Allocate memory block
    void *kmalloc(uint64_t size);
    
    // Free memory block
    void kfree(void *ptr);
    
    // Reallocate memory block
    void *krealloc(void *ptr, uint64_t size);
    
    // Allocate zeroed memory
    void *kcalloc(uint64_t count, uint64_t size);
    
    // Memory utility functions
    void memcpy(void *destination, const void *src, uint64_t num);
    void memset_64(void *addr, uint64_t num, uint64_t value);
    void memset_8(void *addr, uint64_t num, uint8_t value);
    
    // Get higher-half direct mapping base
    uint64_t getHHDM(void);
}
```

#### Page Management (`OS/include/kernel/mem/paging.h`)
```cpp
namespace kernel {
    // Initialize page allocator
    void initialize_page_allocator();
    
    // Allocate single page (4KB)
    void *allocate_page();
    
    // Allocate multiple contiguous pages
    void *allocate_pages(uint64_t count);
    
    // Free single page
    void free_page(void *page);
    
    // Free multiple pages
    void free_pages(void *pages, uint64_t count);
}
```

### Process Management (`OS/include/kernel/proc/proc.h`)

#### Process Control
```cpp
namespace kernel {
    // Process structure
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
    
    // Process entry point type
    typedef void (*proc_main)(process_t *);
    
    // Task management functions
    void task_init(proc_main kernel_main);
    process_t *create_task(proc_main main);
    void yield(process_t *proc);
    
    // Process list
    extern process_t *task_list[100];
}
```

### Interrupt Handling (`OS/include/kernel/x64/intr/apic.h`)

#### APIC Management
```cpp
namespace kernel {
    // Initialize local APIC
    void initAPIC(uint8_t APICid);
    
    // Send End-of-Interrupt signal
    void apicSendEOI(void);
    
    // Timer-based sleep (milliseconds)
    void sleep(int64_t millis);
    
    // Initialize I/O APIC
    void ioapic_init();
    
    // I/O APIC redirection table entry
    struct ioapic_redir_table_entry {
        uint8_t vector;
        uint8_t delivery_mode : 3;
        uint8_t destination_mode : 1;
        uint8_t delivery_status : 1;
        uint8_t pin_polarity : 1;
        uint8_t remote_irr : 1;
        uint8_t trigger_mode : 1;
        uint8_t mask : 1;
        uint64_t reserved : 39;
        uint8_t destination;
    };
    
    // Add I/O APIC redirection table entry
    void add_io_red_table_entry(uint8_t entry_number, 
                               ioapic_redir_table_entry* entry);
}
```

### File System APIs (`OS/include/kernel/vfs/file.h`)

#### Virtual File System
```cpp
namespace kernel {
    // File structure
    struct File {
        stdlib::string filename;    // File name
        size_t filesize;           // File size in bytes
        void *fat_entry;           // File system specific data
    };
    
    // File permissions
    #define FILE_READABLE   (1 << 0)
    #define FILE_WRITABLE   (1 << 1)
    #define FILE_EXECUTABLE (1 << 2)
    
    // VFS functions
    void vfs_init();
    void mount_root(disk::rw_disk_t *disk, uint64_t partition);
    File *get_root();
    int open(File *file, stdlib::string *filepath);
    void close(File *file);
    void *read(File *file);
}
```

## Driver APIs

### PCI Bus (`OS/include/drivers/pci/pci.h`)

#### PCI Device Management
```cpp
namespace pci {
    // PCI device configuration header
    struct dev_common_hdr {
        uint16_t vendor_id;        // Device manufacturer ID
        uint16_t device_id;        // Specific device ID
        pci_command_t command;     // Device control register
        uint16_t status;           // Device status
        uint8_t revision_id;       // Device revision
        uint8_t prog_ifb;          // Programming interface
        uint8_t subclass;          // Device subclass
        uint8_t class_code;        // Device class
        uint8_t cache_size;        // Cache line size
        uint8_t latency_timer;     // Bus latency timer
        uint8_t header_type;       // Header type
        uint8_t BIST;              // Built-in self test
    };
    
    // PCI command register
    struct pci_command_t {
        uint16_t io_space_enable : 1;
        uint16_t mem_space_enable : 1;
        uint16_t bus_master_enable : 1;
        uint16_t special_cycle_enable : 1;
        uint16_t mvi_enable : 1;
        uint16_t VGA_pallete_snoop_enable : 1;
        uint16_t parity_err_response_enable : 1;
        uint16_t wait_cycle_enable : 1;
        uint16_t SERR_enable : 1;
        uint16_t fast_back_to_back_enable : 1;
        uint16_t intr_disable : 1;
        uint16_t rsv0 : 5;
    };
    
    // PCI enumeration
    void enumerate_pci();
}
```

### Storage Interface (`OS/include/drivers/disk/disk_driver.h`)

#### Disk Driver Interface
```cpp
namespace disk {
    // Read/write disk interface
    struct rw_disk_t {
        uint64_t sector_count;     // Total sectors
        uint32_t sector_size;      // Bytes per sector
        
        // I/O operations
        int (*read_sectors)(uint64_t lba, uint32_t count, void *buffer);
        int (*write_sectors)(uint64_t lba, uint32_t count, void *buffer);
        
        // Device information
        char model[40];            // Device model
        char serial[20];           // Device serial number
    };
}
```

### Graphics (`OS/include/drivers/vga/vga.h`)

#### VGA/Framebuffer Interface
```cpp
namespace vga {
    // Initialize framebuffer
    void framebuffer_init();
    
    // Initialize font system
    void initialize_font();
    
    // Screen management
    void repaintScreen();
    extern bool g_framebuffer_dirty;
    
    // Drawing functions
    void putpixel(int x, int y, uint32_t color);
    void draw_char(int x, int y, char c, uint32_t color);
    void draw_string(int x, int y, const char *str, uint32_t color);
    
    // Screen properties
    extern int screen_width;
    extern int screen_height;
    extern int screen_pitch;
    extern uint32_t *framebuffer;
}
```

### Input (`OS/include/drivers/ps2/ps2.h`)

#### PS/2 Keyboard Interface
```cpp
namespace ps2 {
    // Initialize PS/2 controller
    void ps2_init();
    
    // Keyboard functions
    uint8_t ps2_read_key();
    bool ps2_key_available();
    void ps2_enable_keyboard();
    
    // Key code definitions
    #define KEY_ESCAPE      0x01
    #define KEY_BACKSPACE   0x0E
    #define KEY_TAB         0x0F
    #define KEY_ENTER       0x1C
    #define KEY_LEFT_SHIFT  0x2A
    #define KEY_RIGHT_SHIFT 0x36
    #define KEY_LEFT_CTRL   0x1D
    #define KEY_LEFT_ALT    0x38
    #define KEY_SPACE       0x39
}
```

## Standard Library APIs

### String Operations (`OS/include/stdlib/string.h`)

#### String Class
```cpp
namespace stdlib {
    class string {
    public:
        // Constructors
        string();
        string(const char *cstr);
        string(const string &other);
        ~string();
        
        // Assignment
        string &operator=(const string &other);
        string &operator=(const char *cstr);
        
        // Comparison
        bool operator==(const string &other) const;
        bool operator!=(const string &other) const;
        
        // Access
        char &operator[](size_t index);
        const char &operator[](size_t index) const;
        
        // Operations
        void append(const char *str);
        void append(const string &str);
        void clear();
        const char *c_str() const;
        size_t size() const;
        bool empty() const;
    };
}
```

#### C-Style String Functions
```cpp
// String manipulation
size_t strlen(const char *str);
char *strcpy(char *dest, const char *src);
char *strncpy(char *dest, const char *src, size_t n);
int strcmp(const char *str1, const char *str2);
int strncmp(const char *str1, const char *str2, size_t n);
char *strcat(char *dest, const char *src);
char *strchr(const char *str, int c);
char *strstr(const char *haystack, const char *needle);

// Conversion functions
void itoa(int value, char *str, int base);
void utoa(unsigned int value, char *str, int base);
void ltoa(long value, char *str, int base);
int atoi(const char *str);
long atol(const char *str);
```

### Mathematical Functions (`OS/include/stdlib/math.h`)

#### Basic Math Operations
```cpp
namespace stdlib {
    namespace math {
        // Basic operations
        int abs(int x);
        long labs(long x);
        
        // Division with remainder
        struct div_t { int quot, rem; };
        struct ldiv_t { long quot, rem; };
        div_t div(int numer, int denom);
        ldiv_t ldiv(long numer, long denom);
        
        // Power and root functions
        double pow(double base, double exp);
        double sqrt(double x);
        
        // Trigonometric functions
        double sin(double x);
        double cos(double x);
        double tan(double x);
        
        // Logarithmic functions
        double log(double x);
        double log10(double x);
        
        // Rounding functions
        double floor(double x);
        double ceil(double x);
        double round(double x);
    }
}
```

### Timer System (`OS/include/stdlib/timer.h`)

#### Timer Management
```cpp
namespace stdlib {
    // Timer callback type
    typedef void (*timer_callback_t)(void *data);
    
    // Timer structure
    struct timer_t {
        uint64_t expire_time;
        uint64_t interval;
        timer_callback_t callback;
        void *user_data;
        bool active;
        timer_t *next;
    };
    
    // Timer functions
    timer_t *create_timer(uint64_t delay_ms, timer_callback_t callback, void *data);
    timer_t *create_periodic_timer(uint64_t interval_ms, timer_callback_t callback, void *data);
    void destroy_timer(timer_t *timer);
    void call_timers();
    uint64_t get_system_time_ms();
}
```

### Synchronization (`OS/include/stdlib/lock.h`)

#### Spinlock
```cpp
namespace stdlib {
    class spinlock {
    public:
        spinlock();
        void lock();
        void unlock();
        bool try_lock();
    };
    
    // RAII lock guard
    class lock_guard {
    public:
        explicit lock_guard(spinlock &lock);
        ~lock_guard();
    };
}
```

### Data Structures (`OS/include/stdlib/structures/bitmap.h`)

#### Bitmap
```cpp
namespace stdlib {
    class bitmap {
    public:
        bitmap(size_t bits);
        ~bitmap();
        
        void set_bit(size_t index);
        void clear_bit(size_t index);
        bool test_bit(size_t index) const;
        void toggle_bit(size_t index);
        
        size_t find_first_clear();
        size_t find_first_set();
        size_t count_set_bits() const;
        size_t count_clear_bits() const;
        
        void clear_all();
        void set_all();
    };
}
```

## Application APIs

### Terminal Interface (`OS/include/kernel/io/terminal.h`)

#### Terminal Functions
```cpp
namespace kernel {
    // Terminal initialization
    void terminal_init();
    void terminal_clear();
    
    // Command processing
    void print_prompt();
    void clear_input_buffer();
    
    // File operations
    void list_files(const char *path);
    void print_file_contents(const char *path);
    
    // Input handling
    void pollNextChar();
}
```

### Logging (`OS/include/kernel/io/log.h`)

#### Kernel Logging
```cpp
namespace kernel {
    // Log levels
    enum log_level {
        LOG_DEBUG = 0,
        LOG_INFO = 1,
        LOG_WARN = 2,
        LOG_ERROR = 3,
        LOG_FATAL = 4
    };
    
    // Logging functions
    void log_printf(log_level level, const char *format, ...);
    void log_debug(const char *format, ...);
    void log_info(const char *format, ...);
    void log_warn(const char *format, ...);
    void log_error(const char *format, ...);
    void log_fatal(const char *format, ...);
}
```

## System Constants

### Error Codes
```cpp
#define SUCCESS                 0
#define ERROR_INVALID_ARGUMENT -1
#define ERROR_OUT_OF_MEMORY    -2
#define ERROR_NOT_FOUND        -3
#define ERROR_ACCESS_DENIED    -4
#define ERROR_TIMEOUT          -5
#define ERROR_DEVICE_ERROR     -6
#define ERROR_BUSY             -7
#define ERROR_ALREADY_EXISTS   -8
#define ERROR_NOT_SUPPORTED    -9
#define ERROR_BUFFER_TOO_SMALL -10
```

### Memory Constants
```cpp
#define PAGE_SIZE              4096      // 4KB pages
#define KERNEL_VIRTUAL_BASE    0xFFFFFFFF80000000
#define HHDM_BASE              0x0000800000000000
#define MAX_PHYSICAL_MEMORY    0x100000000000     // 16TB
```

### System Limits
```cpp
#define MAX_PROCESSES          100
#define MAX_OPEN_FILES         64
#define MAX_FILENAME_LENGTH    256
#define MAX_PATH_LENGTH        1024
#define MAX_COMMAND_LENGTH     512
```

## Usage Examples

### Memory Allocation
```cpp
// Allocate and free memory
void *buffer = kernel::kmalloc(1024);
if (buffer) {
    // Use buffer
    kernel::kfree(buffer);
}

// Allocate zeroed memory
int *array = static_cast<int*>(kernel::kcalloc(10, sizeof(int)));
```

### Process Creation
```cpp
// Create a new process
void my_process_main(process_t *proc) {
    // Process implementation
}

process_t *proc = kernel::create_task(my_process_main);
```

### File Operations
```cpp
// Open and read a file
kernel::File file;
if (kernel::open(&file, &stdlib::string("/etc/config")) == SUCCESS) {
    void *data = kernel::read(&file);
    // Use file data
    kernel::close(&file);
}
```

### Timer Usage
```cpp
// Create a timer
void timer_callback(void *data) {
    // Timer expired
}

stdlib::timer_t *timer = stdlib::create_timer(1000, timer_callback, nullptr);
```

### String Manipulation
```cpp
// String operations
stdlib::string str("Hello");
str.append(" World");
const char *cstr = str.c_str();  // "Hello World"
```

## Error Handling Patterns

### Return Code Checking
```cpp
int result = some_function();
if (result != SUCCESS) {
    // Handle error
    kernel::log_error("Function failed with code %d", result);
    return result;
}
```

### Null Pointer Checking
```cpp
void *ptr = kernel::kmalloc(size);
if (!ptr) {
    kernel::log_error("Memory allocation failed");
    return ERROR_OUT_OF_MEMORY;
}
```

### Assertion Usage
```cpp
#include <stdlib/assert.h>

void function(void *ptr) {
    assert(ptr != nullptr);  // Debug builds only
    // Function implementation
}
```

## Threading and Synchronization (Future)

### Mutex Usage (Planned)
```cpp
stdlib::mutex mtx;

void thread_safe_function() {
    stdlib::lock_guard guard(mtx);
    // Critical section
}
```

### Atomic Operations (Planned)
```cpp
#include <stdlib/atomic.h>

stdlib::atomic<int> counter(0);
counter.fetch_add(1);  // Atomic increment
```

This API reference provides the foundation for developing applications and extending NEO-OS. All APIs are subject to evolution as the system develops. 