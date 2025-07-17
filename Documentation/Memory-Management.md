# NEO-OS Memory Management

## Overview

NEO-OS implements a sophisticated memory management system with both physical and virtual memory management. The system provides kernel heap allocation, page frame management, and virtual memory mapping suitable for a modern 64-bit operating system.

## Architecture

### Memory Layout

```
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
```

## Core Components

### 1. Heap Management (`OS/src/kernel/mem/heap/`)

#### Kernel Heap Allocator
The kernel heap provides dynamic memory allocation for kernel data structures and buffers.

**Main Functions:**
```cpp
void heapInit();                          // Initialize heap allocator
void *kmalloc(uint64_t size);            // Allocate memory block
void kfree(void *ptr);                   // Free memory block
void *krealloc(void *ptr, uint64_t size); // Resize memory block
void *kcalloc(uint64_t count, uint64_t size); // Allocate zeroed memory
```

#### Implementation Details
- **Allocation Strategy**: Best-fit allocation with coalescing
- **Metadata**: Block headers store size and allocation status
- **Alignment**: All allocations aligned to 8-byte boundaries
- **Free List**: Maintains linked list of free blocks
- **Coalescing**: Adjacent free blocks are merged automatically

#### C++ Integration
```cpp
// Overloaded operators for C++ compatibility
void *operator new(size_t size);         // Maps to kmalloc
void *operator new[](size_t size);       // Array allocation
void operator delete(void *addr, uint64_t); // Maps to kfree
void operator delete[](void *addr, uint64_t); // Array deallocation
```

### 2. Page Frame Allocator (`OS/src/kernel/mem/paging/`)

#### Physical Memory Management
The page allocator manages physical memory in 4KB pages.

**Key Functions:**
```cpp
void initialize_page_allocator();        // Initialize page allocator
void *allocate_page();                   // Allocate single page
void *allocate_pages(uint64_t count);    // Allocate multiple pages
void free_page(void *page);              // Free single page
void free_pages(void *pages, uint64_t count); // Free multiple pages
```

#### Page Allocation Strategy
- **Bitmap Tracking**: Uses bitmap to track page allocation status
- **Memory Regions**: Manages available memory regions from bootloader
- **Alignment**: All pages aligned to 4KB boundaries
- **Contiguous Allocation**: Supports allocation of contiguous page ranges

#### Memory Region Management
```cpp
extern limine::limine_memmap_entry *availableMemoryRegions[10];
```
- **Bootloader Integration**: Uses LIMINE memory map
- **Region Types**: Distinguishes between usable, reserved, and reclaimable memory
- **Dynamic Discovery**: Automatically detects available memory at boot

### 3. Virtual Memory Management (`OS/include/kernel/mem/paging.h`)

#### Page Table Management
The virtual memory system manages page tables and virtual-to-physical mappings.

**Core Concepts:**
- **4-Level Paging**: Uses x86-64 4-level page table structure
- **Kernel Mapping**: Kernel mapped at higher-half addresses
- **Identity Mapping**: Physical memory directly mapped for kernel access
- **Page Permissions**: Read/write/execute permissions per page

### 4. Memory Utilities (`OS/src/kernel/mem/mem.cpp`)

#### Low-Level Memory Operations
```cpp
void memcpy(void *destination, const void *src, uint64_t num);
void memset_64(void *addr, uint64_t num, uint64_t value);
void memset_8(void *addr, uint64_t num, uint8_t value);
```

#### Higher-Half Direct Mapping (HHDM)
```cpp
uint64_t getHHDM(void);                  // Get HHDM base address
```
- **Direct Access**: Physical memory directly accessible via HHDM
- **Performance**: Eliminates need for temporary mappings
- **Simplicity**: Simplifies kernel memory management

## Memory Allocation Patterns

### 1. Small Object Allocation
- **Size Range**: 8 bytes to 4KB
- **Strategy**: Heap allocation with coalescing
- **Use Cases**: Data structures, buffers, temporary storage

### 2. Large Object Allocation
- **Size Range**: 4KB and larger
- **Strategy**: Direct page allocation
- **Use Cases**: Driver buffers, large data structures

### 3. DMA Buffers
- **Requirements**: Physically contiguous memory
- **Implementation**: Contiguous page allocation
- **Use Cases**: Hardware device communication

## Memory Protection

### Current Implementation
- **Kernel Protection**: Kernel memory protected from user access
- **Read-Only Sections**: Code sections marked read-only
- **Stack Guards**: Stack overflow protection (planned)

### Future Enhancements
- **User/Kernel Separation**: Strict user/kernel memory separation
- **Page-Level Protection**: Fine-grained page permissions
- **SMEP/SMAP**: Supervisor mode execution/access prevention

## Performance Optimizations

### 1. Allocation Performance
- **Free List Caching**: Cached free blocks for common sizes
- **Alignment Optimization**: Efficient alignment calculations
- **Minimal Fragmentation**: Coalescing reduces fragmentation

### 2. Cache Efficiency
- **Page Alignment**: Critical structures aligned to page boundaries
- **Locality**: Related data structures placed together
- **Prefetching**: Cache-friendly memory access patterns

### 3. TLB Management
- **Page Size**: Uses 4KB pages for optimal TLB usage
- **Mapping Strategy**: Minimizes TLB misses
- **Future Support**: Large page support planned

## Debugging and Diagnostics

### Memory Leak Detection
- **Allocation Tracking**: Debug builds track all allocations
- **Leak Reports**: Report unfreed memory at shutdown
- **Stack Traces**: Track allocation call stacks (planned)

### Memory Corruption Detection
- **Guard Patterns**: Magic values to detect overwrites
- **Bounds Checking**: Validate pointer access (debug mode)
- **Canaries**: Stack canaries for overflow detection (planned)

## Memory Statistics

### Runtime Information
- **Total Memory**: Physical memory size from bootloader
- **Available Memory**: Free physical memory
- **Kernel Usage**: Memory used by kernel
- **Heap Statistics**: Allocation/deallocation counts

### Monitoring Interface
```cpp
struct memory_stats {
    uint64_t total_physical;      // Total physical memory
    uint64_t available_physical;  // Free physical memory
    uint64_t kernel_heap_used;    // Kernel heap usage
    uint64_t pages_allocated;     // Allocated pages
};
```

## Error Handling

### Allocation Failures
- **Null Returns**: Failed allocations return null
- **Graceful Degradation**: System continues with reduced functionality
- **Error Logging**: Log allocation failures for debugging

### Corruption Detection
- **Assertion Checks**: Validate heap consistency
- **Magic Numbers**: Detect buffer overruns
- **Panic Handling**: System panic on severe corruption

## Configuration Options

### Build-Time Configuration
```cpp
// Example configuration options (in config.h)
#define HEAP_SIZE_MB 16           // Initial heap size
#define PAGE_POOL_SIZE 1024       // Page pool size
#define DEBUG_MEMORY 1            // Enable memory debugging
```

### Runtime Tuning
- **Heap Growth**: Dynamic heap expansion
- **Page Pool**: Adjustable page pool size
- **Cache Sizes**: Tunable cache parameters

## Integration with Other Subsystems

### Driver Integration
- **DMA Allocation**: Contiguous memory for device DMA
- **Buffer Management**: Device-specific buffer allocation
- **Memory Mapping**: Map hardware registers

### File System Integration
- **Buffer Cache**: File system buffers in kernel heap
- **Metadata Caching**: Directory and inode caching
- **Large File Support**: Efficient large file handling

### Network Integration
- **Packet Buffers**: Network packet allocation
- **Socket Buffers**: Socket buffer management
- **Protocol Stacks**: Memory for network protocols (planned)

## Future Enhancements

### 1. Advanced Features
- **Memory Compression**: Compress unused pages
- **Swap Support**: Virtual memory swapping to disk
- **NUMA Awareness**: Non-uniform memory access optimization

### 2. Security Features
- **ASLR**: Address space layout randomization
- **Stack Cookies**: Stack overflow protection
- **CFI**: Control flow integrity

### 3. Performance Improvements
- **Large Pages**: 2MB/1GB page support
- **Memory Pools**: Object-specific memory pools
- **Lock-Free Algorithms**: Reduce synchronization overhead

## Reference Implementation

### Key Files
- `OS/include/kernel/mem/mem.h` - Memory management interface
- `OS/src/kernel/mem/mem.cpp` - Core memory utilities
- `OS/src/kernel/mem/heap/kernel_heap.cpp` - Heap allocator
- `OS/src/kernel/mem/paging/page_allocator.cpp` - Page allocator
- `OS/src/kernel/mem/paging/page.cpp` - Page management 