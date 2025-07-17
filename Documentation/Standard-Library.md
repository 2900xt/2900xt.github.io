# NEO-OS Standard Library

## Overview

NEO-OS includes a custom standard library implementation that provides essential functionality for kernel and system components. The library is designed for kernel-space usage with a focus on reliability, performance, and minimal resource usage.

## Library Structure

### Main Header (`OS/include/stdlib/stdlib.h`)

The main standard library header includes all core components:

```cpp
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
```

## Core Components

### 1. String Operations (`OS/include/stdlib/string.h`)

#### String Class Implementation
The library provides a custom string class optimized for kernel use:

```cpp
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
```

#### String Utilities
```cpp
// C-style string functions
size_t strlen(const char *str);                     // String length
char *strcpy(char *dest, const char *src);          // String copy
char *strncpy(char *dest, const char *src, size_t n); // String copy with limit
int strcmp(const char *str1, const char *str2);     // String compare
int strncmp(const char *str1, const char *str2, size_t n); // Limited compare
char *strcat(char *dest, const char *src);          // String concatenate
char *strchr(const char *str, int c);               // Find character
char *strstr(const char *haystack, const char *needle); // Find substring
```

#### String Formatting
```cpp
// Number to string conversion
void itoa(int value, char *str, int base);          // Integer to ASCII
void utoa(unsigned int value, char *str, int base); // Unsigned to ASCII
void ltoa(long value, char *str, int base);         // Long to ASCII

// String parsing
int atoi(const char *str);                          // ASCII to integer
long atol(const char *str);                         // ASCII to long
```

### 2. Mathematical Functions (`OS/include/stdlib/math.h`)

#### Basic Arithmetic
```cpp
namespace stdlib {
    namespace math {
        // Basic operations
        int abs(int x);                     // Absolute value
        long labs(long x);                  // Long absolute value
        
        // Division with remainder
        struct div_t { int quot, rem; };
        struct ldiv_t { long quot, rem; };
        div_t div(int numer, int denom);
        ldiv_t ldiv(long numer, long denom);
        
        // Power and root functions
        double pow(double base, double exp); // Power function
        double sqrt(double x);               // Square root
        
        // Trigonometric functions (basic)
        double sin(double x);                // Sine
        double cos(double x);                // Cosine
        double tan(double x);                // Tangent
        
        // Logarithmic functions
        double log(double x);                // Natural logarithm
        double log10(double x);              // Base-10 logarithm
        
        // Rounding functions
        double floor(double x);              // Floor function
        double ceil(double x);               // Ceiling function
        double round(double x);              // Round to nearest
    }
}
```

#### Mathematical Constants
```cpp
#define M_PI       3.14159265358979323846  // Pi
#define M_E        2.71828182845904523536  // Euler's number
#define M_LOG2E    1.44269504088896340736  // log2(e)
#define M_LOG10E   0.43429448190325182765  // log10(e)
#define M_LN2      0.69314718055994530942  // ln(2)
#define M_LN10     2.30258509299404568402  // ln(10)
```

### 3. Timer System (`OS/include/stdlib/timer.h`)

#### Timer Interface
```cpp
namespace stdlib {
    // Timer callback function type
    typedef void (*timer_callback_t)(void *data);
    
    // Timer structure
    struct timer_t {
        uint64_t expire_time;           // When timer expires (ms)
        uint64_t interval;              // Repeat interval (0 = one-shot)
        timer_callback_t callback;      // Function to call
        void *user_data;                // User data for callback
        bool active;                    // Timer is active
        timer_t *next;                  // Next timer in list
    };
    
    // Timer management functions
    timer_t *create_timer(uint64_t delay_ms, timer_callback_t callback, void *data);
    timer_t *create_periodic_timer(uint64_t interval_ms, timer_callback_t callback, void *data);
    void destroy_timer(timer_t *timer);
    void call_timers();                 // Process expired timers
    uint64_t get_system_time_ms();      // Get current time in milliseconds
}
```

#### Timer Usage Example
```cpp
// One-shot timer
void delayed_function(void *data) {
    // Function called after delay
}

timer_t *timer = create_timer(1000, delayed_function, nullptr);

// Periodic timer
void periodic_function(void *data) {
    // Function called every interval
}

timer_t *periodic = create_periodic_timer(500, periodic_function, nullptr);
```

### 4. Assertion System (`OS/include/stdlib/assert.h`)

#### Assertion Macros
```cpp
#ifdef DEBUG
    #define assert(condition) \
        do { \
            if (!(condition)) { \
                assert_fail(#condition, __FILE__, __LINE__, __func__); \
            } \
        } while(0)
#else
    #define assert(condition) ((void)0)
#endif

// Static assertions (compile-time)
#define static_assert(condition, message) \
    _Static_assert(condition, message)
```

#### Assertion Implementation
```cpp
namespace stdlib {
    // Assertion failure handler
    void assert_fail(const char *expr, const char *file, 
                    int line, const char *func);
    
    // Custom assertion handler (can be overridden)
    extern void (*assertion_handler)(const char *expr, const char *file,
                                   int line, const char *func);
}
```

### 5. Synchronization Primitives (`OS/include/stdlib/lock.h`)

#### Spinlock Implementation
```cpp
namespace stdlib {
    class spinlock {
    private:
        volatile bool locked;
        
    public:
        spinlock() : locked(false) {}
        
        void lock() {
            while (__sync_lock_test_and_set(&locked, true)) {
                // Spin until lock is acquired
                asm volatile("pause");
            }
        }
        
        void unlock() {
            __sync_lock_release(&locked);
        }
        
        bool try_lock() {
            return !__sync_lock_test_and_set(&locked, true);
        }
    };
    
    // RAII lock guard
    class lock_guard {
    private:
        spinlock &lock_ref;
        
    public:
        explicit lock_guard(spinlock &lock) : lock_ref(lock) {
            lock_ref.lock();
        }
        
        ~lock_guard() {
            lock_ref.unlock();
        }
    };
}
```

#### Mutex (Future Implementation)
```cpp
namespace stdlib {
    class mutex {
    private:
        volatile int state;
        process_t *waiting_queue;
        
    public:
        mutex();
        ~mutex();
        
        void lock();
        void unlock();
        bool try_lock();
    };
}
```

### 6. Data Structures (`OS/include/stdlib/structures/`)

#### Bitmap Implementation (`bitmap.h`)
```cpp
namespace stdlib {
    class bitmap {
    private:
        uint8_t *data;
        size_t bit_count;
        size_t byte_count;
        
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

#### Vector Implementation (Future)
```cpp
namespace stdlib {
    template<typename T>
    class vector {
    private:
        T *data;
        size_t size_;
        size_t capacity_;
        
    public:
        vector();
        ~vector();
        
        void push_back(const T &item);
        void pop_back();
        T &operator[](size_t index);
        const T &operator[](size_t index) const;
        
        size_t size() const { return size_; }
        bool empty() const { return size_ == 0; }
        void clear();
    };
}
```

## Memory Management Integration

### Allocation Functions
The standard library integrates with the kernel memory allocator:

```cpp
// Standard allocation functions
void *malloc(size_t size);              // Allocate memory
void free(void *ptr);                   // Free memory
void *calloc(size_t num, size_t size);  // Allocate zeroed memory
void *realloc(void *ptr, size_t size);  // Reallocate memory

// Implementation maps to kernel allocator
inline void *malloc(size_t size) {
    return kernel::kmalloc(size);
}

inline void free(void *ptr) {
    kernel::kfree(ptr);
}
```

### Memory Utilities
```cpp
// Memory manipulation functions
void *memset(void *ptr, int value, size_t num);
void *memcpy(void *dest, const void *src, size_t num);
void *memmove(void *dest, const void *src, size_t num);
int memcmp(const void *ptr1, const void *ptr2, size_t num);
```

## Error Handling

### Error Codes
```cpp
namespace stdlib {
    enum error_code {
        SUCCESS = 0,
        ERROR_INVALID_ARGUMENT = -1,
        ERROR_OUT_OF_MEMORY = -2,
        ERROR_NOT_FOUND = -3,
        ERROR_ACCESS_DENIED = -4,
        ERROR_TIMEOUT = -5,
        ERROR_DEVICE_ERROR = -6
    };
}
```

### Exception Alternatives
Since exceptions are disabled in kernel mode, the library uses return codes and optional types:

```cpp
namespace stdlib {
    template<typename T>
    class optional {
    private:
        bool has_value_;
        union {
            T value_;
            char dummy_;
        };
        
    public:
        optional() : has_value_(false), dummy_('\0') {}
        optional(const T &value) : has_value_(true), value_(value) {}
        
        bool has_value() const { return has_value_; }
        T &value() { return value_; }
        const T &value() const { return value_; }
        
        T value_or(const T &default_value) const {
            return has_value_ ? value_ : default_value;
        }
    };
}
```

## Input/Output Support

### Basic I/O Functions
```cpp
namespace stdlib {
    // Character I/O
    int putchar(int c);                 // Output character
    int getchar();                      // Input character
    
    // String I/O
    int puts(const char *str);          // Output string
    char *gets(char *str);              // Input string (unsafe)
    char *fgets(char *str, int n);      // Input string (safe)
    
    // Formatted output (basic)
    int printf(const char *format, ...); // Formatted output
    int sprintf(char *str, const char *format, ...); // String formatting
}
```

### Format Specifiers
```cpp
// Supported printf format specifiers
%d, %i  - Signed decimal integer
%u      - Unsigned decimal integer
%x, %X  - Hexadecimal integer
%o      - Octal integer
%c      - Character
%s      - String
%p      - Pointer
%%      - Literal %
```

## Performance Optimizations

### Compiler Optimizations
```cpp
// Inline functions for performance-critical operations
inline size_t strlen_fast(const char *str) {
    const char *start = str;
    while (*str) ++str;
    return str - start;
}

// Assembly-optimized memory operations
extern "C" void *memcpy_fast(void *dest, const void *src, size_t n);
extern "C" void *memset_fast(void *dest, int value, size_t n);
```

### Cache-Friendly Implementations
- **String operations**: Optimized for cache line sizes
- **Memory copying**: Use SIMD instructions when available
- **Data structures**: Aligned to cache boundaries

## Testing and Validation

### Unit Tests (Future)
```cpp
// Example unit test structure
namespace stdlib_tests {
    void test_string_operations();
    void test_math_functions();
    void test_timer_system();
    void test_bitmap_operations();
    
    void run_all_tests();
}
```

### Validation Macros
```cpp
#define VALIDATE_POINTER(ptr) \
    assert((ptr) != nullptr && "Null pointer detected")

#define VALIDATE_RANGE(index, max) \
    assert((index) < (max) && "Index out of range")
```

## Configuration and Customization

### Build-Time Configuration
```cpp
// Configuration options in config.h
#define STDLIB_ENABLE_MATH 1        // Enable math functions
#define STDLIB_ENABLE_TIMERS 1      // Enable timer system
#define STDLIB_ENABLE_ASSERTS 1     // Enable assertions
#define STDLIB_STRING_POOL_SIZE 64  // String object pool size
```

### Feature Selection
```cpp
// Conditional compilation for features
#if STDLIB_ENABLE_MATH
    // Include math functions
#endif

#if STDLIB_ENABLE_TIMERS
    // Include timer system
#endif
```

## Integration with Kernel

### Kernel Service Integration
```cpp
// Integration with kernel logging
#define kprintf(fmt, ...) \
    kernel::log_printf(kernel::LOG_INFO, fmt, ##__VA_ARGS__)

// Integration with kernel memory
#define kmalloc_typed(type) \
    static_cast<type*>(kernel::kmalloc(sizeof(type)))
```

### System Call Preparation (Future)
```cpp
// Prepare for user-space system calls
namespace stdlib {
    namespace syscalls {
        int open(const char *path, int flags);
        int read(int fd, void *buf, size_t count);
        int write(int fd, const void *buf, size_t count);
        int close(int fd);
    }
}
```

## Future Enhancements

### Planned Features
- **STL Containers**: Vector, list, map implementations
- **Algorithm Library**: Sort, search, and utility algorithms
- **Regular Expressions**: Pattern matching support
- **Locale Support**: Internationalization features
- **Threading Support**: Thread-safe containers and utilities

### Performance Improvements
- **SIMD Optimizations**: Use vector instructions for bulk operations
- **Memory Pools**: Object-specific memory pools for efficiency
- **Lock-Free Structures**: Lock-free data structures for concurrency

## Reference Implementation

### Key Files
- `OS/include/stdlib/stdlib.h` - Main library header
- `OS/include/stdlib/string.h` - String operations
- `OS/include/stdlib/math.h` - Mathematical functions
- `OS/include/stdlib/timer.h` - Timer system
- `OS/include/stdlib/assert.h` - Assertion system
- `OS/include/stdlib/lock.h` - Synchronization primitives
- `OS/src/stdlib/` - Implementation files

### Build Integration
The standard library is automatically included in kernel builds and provides essential functionality for all kernel components and drivers. 