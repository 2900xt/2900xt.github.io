# NEO-OS File System

## Overview

NEO-OS implements a Virtual File System (VFS) layer that provides a unified interface for file operations across different file system types. The system currently supports FAT12/16/32 file systems with GPT partition support, providing a foundation for file storage and retrieval.

## Architecture

### Virtual File System Layer (`OS/include/kernel/vfs/file.h`)

The VFS provides an abstraction layer between applications and specific file system implementations:

```cpp
struct File {
    stdlib::string filename;    // File name
    size_t filesize;           // File size in bytes
    void *fat_entry;           // File system specific data
};
```

#### File Permissions
```cpp
#define FILE_READABLE   (1 << 0)    // Read permission
#define FILE_WRITABLE   (1 << 1)    // Write permission  
#define FILE_EXECUTABLE (1 << 2)    // Execute permission
```

#### Core VFS Functions
```cpp
void vfs_init();                    // Initialize VFS subsystem
void mount_root(disk::rw_disk_t *disk, uint64_t partition);
File *get_root();                   // Get root directory
int open(File *file, stdlib::string *filepath); // Open file
void close(File *file);             // Close file
void *read(File *file);             // Read file contents
```

## File System Types

### 1. FAT File System (`OS/src/drivers/fs/fat/`)

#### Overview
The FAT (File Allocation Table) implementation supports FAT12, FAT16, and FAT32 variants, providing compatibility with many storage devices and operating systems.

#### FAT Structure Components

##### Boot Sector
- **BPB (BIOS Parameter Block)**: Contains file system parameters
- **Boot Code**: Optional boot loader code
- **File System Type**: Identifies FAT variant (12/16/32)
- **Sector Size**: Usually 512 bytes
- **Cluster Size**: Number of sectors per cluster

##### File Allocation Table
- **Cluster Chains**: Linked list of clusters forming files
- **Special Values**: End-of-chain, bad clusters, free clusters
- **Multiple Copies**: Usually 2 FAT copies for redundancy
- **Size Calculation**: Based on number of clusters and FAT type

##### Root Directory
- **FAT12/16**: Fixed-size root directory
- **FAT32**: Root directory is a regular cluster chain
- **Directory Entries**: 32-byte entries describing files/directories

#### Directory Entry Structure
```cpp
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
```

#### File Attributes
```cpp
#define FAT_ATTR_READ_ONLY  0x01    // Read-only file
#define FAT_ATTR_HIDDEN     0x02    // Hidden file
#define FAT_ATTR_SYSTEM     0x04    // System file
#define FAT_ATTR_VOLUME_ID  0x08    // Volume label
#define FAT_ATTR_DIRECTORY  0x10    // Directory
#define FAT_ATTR_ARCHIVE    0x20    // Archive flag
#define FAT_ATTR_LONG_NAME  0x0F    // Long filename entry
```

#### FAT Operations
- **Cluster Reading**: Read data from cluster chains
- **Directory Parsing**: Parse directory entries
- **File Lookup**: Find files by name in directories
- **Cluster Following**: Follow cluster chains to read files
- **Free Space**: Calculate available disk space

### 2. GPT Partition Support (`OS/src/drivers/fs/gpt.cpp`)

#### GUID Partition Table Overview
GPT is a modern partitioning scheme that replaces the legacy MBR partitioning system.

#### GPT Structure

##### Protective MBR
- **Legacy Compatibility**: Protects GPT from old tools
- **Single Partition**: Covers entire disk
- **Partition Type**: 0xEE (GPT protective)

##### GPT Header
```cpp
struct gpt_header {
    char signature[8];         // "EFI PART"
    uint32_t revision;         // GPT revision
    uint32_t header_size;      // Header size
    uint32_t header_crc32;     // Header checksum
    uint32_t reserved;         // Must be zero
    uint64_t current_lba;      // Current header LBA
    uint64_t backup_lba;       // Backup header LBA
    uint64_t first_usable_lba; // First usable LBA
    uint64_t last_usable_lba;  // Last usable LBA
    uint8_t disk_guid[16];     // Disk GUID
    uint64_t partition_array_lba; // Partition array LBA
    uint32_t partition_count;  // Number of partitions
    uint32_t partition_size;   // Size of partition entry
    uint32_t partition_crc32;  // Partition array checksum
};
```

##### Partition Entry
```cpp
struct gpt_partition_entry {
    uint8_t type_guid[16];     // Partition type GUID
    uint8_t partition_guid[16]; // Unique partition GUID
    uint64_t start_lba;        // Starting LBA
    uint64_t end_lba;          // Ending LBA
    uint64_t attributes;       // Partition attributes
    uint16_t name[36];         // Partition name (UTF-16)
};
```

#### GPT Operations
- **Header Validation**: Verify GPT header integrity
- **Partition Discovery**: Enumerate disk partitions
- **GUID Recognition**: Identify partition types by GUID
- **Backup Recovery**: Use backup GPT if primary is corrupted

#### Common Partition Types
- **EFI System Partition**: C12A7328-F81F-11D2-BA4B-00A0C93EC93B
- **Microsoft Basic Data**: EBD0A0A2-B9E5-4433-87C0-68B6B72699C7
- **Linux Filesystem**: 0FC63DAF-8483-4772-8E79-3D69D8477DE4
- **Linux Swap**: 0657FD6D-A4AB-43C4-84E5-0933C84B4F4F

## Storage Interface

### Disk Driver Integration (`OS/include/drivers/disk/disk_driver.h`)

The VFS integrates with storage drivers through a standardized interface:

```cpp
struct rw_disk_t {
    // Disk identification
    uint64_t sector_count;     // Total sectors on disk
    uint32_t sector_size;      // Bytes per sector
    
    // I/O operations
    int (*read_sectors)(uint64_t lba, uint32_t count, void *buffer);
    int (*write_sectors)(uint64_t lba, uint32_t count, void *buffer);
    
    // Device information
    char model[40];            // Device model string
    char serial[20];           // Device serial number
};
```

### AHCI Integration
- **SATA Drives**: Primary storage interface via AHCI
- **Sector Access**: 512-byte sector standard
- **DMA Transfers**: Efficient data transfer via DMA
- **Error Handling**: Handle SATA communication errors

## File Operations

### Opening Files
```cpp
int open(File *file, stdlib::string *filepath) {
    // 1. Parse file path
    // 2. Navigate directory structure
    // 3. Locate file entry
    // 4. Initialize file structure
    // 5. Return success/error code
}
```

### Reading Files
```cpp
void *read(File *file) {
    // 1. Allocate buffer for file contents
    // 2. Read clusters from disk
    // 3. Assemble file data
    // 4. Return buffer pointer
}
```

### Directory Operations
- **Directory Listing**: Enumerate directory contents
- **Path Resolution**: Resolve relative and absolute paths
- **Name Lookup**: Find files and directories by name
- **Traversal**: Navigate directory tree structure

## Memory Management

### File Buffering
- **Read Buffers**: Temporary buffers for file reading
- **Directory Cache**: Cache directory entries for performance
- **Cluster Buffers**: Temporary storage for cluster data

### Cache Management
- **LRU Eviction**: Least recently used cache eviction
- **Write-Through**: Immediate write to disk for reliability
- **Dirty Tracking**: Track modified cache entries

## Mount System

### Root Mount
```cpp
void mount_root(disk::rw_disk_t *disk, uint64_t partition) {
    // 1. Validate partition
    // 2. Read file system superblock
    // 3. Initialize file system structures
    // 4. Set as root file system
}
```

### Mount Points (Future)
- **Multiple File Systems**: Support multiple mounted file systems
- **Mount Tree**: Hierarchical mount point structure
- **Namespace**: Unified file system namespace

## Error Handling

### File System Errors
- **Corrupt File System**: Handle corrupted file system structures
- **Bad Sectors**: Skip or remap bad disk sectors
- **Insufficient Space**: Handle out-of-space conditions
- **Permission Denied**: Enforce file permissions

### Recovery Mechanisms
- **Checksum Validation**: Verify data integrity
- **Redundant Structures**: Use backup copies when available
- **Graceful Degradation**: Continue operation with limited functionality
- **Error Reporting**: Log errors for debugging

## Performance Optimizations

### Read Optimizations
- **Cluster Prefetching**: Read ahead for sequential access
- **Directory Caching**: Cache frequently accessed directories
- **Metadata Caching**: Cache file system metadata

### Write Optimizations (Future)
- **Write Buffering**: Buffer writes for efficiency
- **Batch Operations**: Group multiple operations
- **Delayed Allocation**: Optimize cluster allocation

## Security and Permissions

### Current Implementation
- **Basic Permissions**: Read/write/execute flags
- **File Attributes**: System, hidden, read-only attributes
- **Directory Protection**: Basic directory access control

### Future Enhancements
- **User/Group Permissions**: Multi-user permission system
- **Access Control Lists**: Fine-grained access control
- **File Encryption**: Transparent file encryption
- **Audit Logging**: Log file access for security

## Debugging and Diagnostics

### File System Checking
- **Consistency Checks**: Verify file system consistency
- **Orphaned Clusters**: Detect and recover orphaned clusters
- **Cross-Link Detection**: Find cross-linked clusters
- **Directory Validation**: Verify directory structure integrity

### Performance Monitoring
- **I/O Statistics**: Track read/write operations
- **Cache Statistics**: Monitor cache hit rates
- **Error Rates**: Track file system error frequency

## Future File System Support

### Planned File Systems
- **EXT2/3/4**: Linux native file systems
- **NTFS**: Windows NT file system (read-only)
- **ISO 9660**: CD-ROM file system
- **Network File Systems**: NFS, SMB/CIFS support

### Advanced Features
- **Journaling**: File system transaction logging
- **Compression**: Transparent file compression
- **Snapshots**: File system snapshots
- **Deduplication**: Block-level deduplication

## Integration Points

### Kernel Integration
- **VFS Layer**: Unified file system interface
- **System Calls**: File operation system calls (future)
- **Process Integration**: Per-process file descriptors
- **Memory Mapping**: Memory-mapped files (future)

### Application Support
- **Standard Library**: File I/O functions in stdlib
- **Shell Integration**: File operations in command shell
- **Configuration Files**: System configuration file support

## Configuration

### File System Parameters
```cpp
// Example configuration options
#define MAX_OPEN_FILES 64        // Maximum open files per process
#define FILE_CACHE_SIZE 1024     // File cache size in KB
#define MAX_PATH_LENGTH 256      // Maximum path length
```

### Runtime Configuration
- **Cache Sizes**: Adjustable cache parameters
- **Buffer Sizes**: Configurable I/O buffer sizes
- **Timeout Values**: I/O operation timeouts

## Reference Implementation

### Key Files
- `OS/include/kernel/vfs/file.h` - VFS interface
- `OS/src/kernel/vfs/file.cpp` - VFS implementation
- `OS/include/drivers/fs/fat/fat.h` - FAT file system interface
- `OS/src/drivers/fs/fat/fat.cpp` - FAT implementation
- `OS/include/drivers/fs/gpt.h` - GPT partition interface
- `OS/src/drivers/fs/gpt.cpp` - GPT implementation
- `OS/include/drivers/disk/disk_driver.h` - Storage interface 