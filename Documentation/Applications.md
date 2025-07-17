# NEO-OS Applications

## Overview

NEO-OS includes several built-in applications that provide essential system functionality and user interface. These applications are implemented as kernel processes and demonstrate the system's capabilities while providing practical utility.

## Application Architecture

### Kernel Process Integration
All built-in applications run as kernel processes using the process management system:

```cpp
// Application entry point type
typedef void (*proc_main)(process_t *);

// Application process structure
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

### Application Lifecycle
1. **Process Creation**: `create_task()` creates application process
2. **Initialization**: Application initializes its internal state
3. **Main Loop**: Application processes user input and events
4. **Cleanup**: Application releases resources on exit

## Built-in Applications

### 1. Login System (`OS/src/kernel/programs/login.cpp`)

#### Overview
The login system provides basic authentication and session management for the operating system.

#### Features
- **Password Authentication**: Simple password-based login
- **Session Management**: Manages user sessions
- **Security**: Basic access control and authentication
- **Retry Handling**: Handles failed login attempts

#### Implementation Details
```cpp
namespace kernel {
    void login_init();                      // Initialize login system
    bool login_check();                     // Check login status
    void login_prompt(bool failed = false); // Display login prompt
}
```

#### Login Process
1. **Display Prompt**: Shows system logo and login prompt
2. **Credential Input**: Accepts username and password
3. **Validation**: Verifies credentials against stored data
4. **Session Creation**: Creates authenticated session on success
5. **Access Grant**: Grants access to shell and system functions

#### Configuration
- **Password Storage**: Stored in `/etc/login` file
- **Session Timeout**: Configurable session timeout
- **Retry Limits**: Maximum failed attempts before lockout

#### Security Features
- **Password Masking**: Input password not displayed
- **Failed Attempt Tracking**: Monitors authentication failures
- **Basic Brute Force Protection**: Temporary lockout after failures

### 2. Terminal/Shell (`OS/src/kernel/programs/terminal.cpp`)

#### Overview
The terminal provides an interactive command-line interface for system interaction and file management.

#### Core Features
- **Command Interpretation**: Parse and execute user commands
- **File Operations**: Basic file system navigation and manipulation
- **System Information**: Display system status and information
- **Input/Output**: Handle user input and display output

#### Command Interface
```cpp
// Command structure
struct command_t {
    const char *name;           // Command name
    void (*handler)(const char *args); // Command handler function
    const char *description;    // Command description
};
```

#### Built-in Commands

##### File System Commands
```bash
# Directory listing
ls [path]                   # List directory contents
dir [path]                  # Alternative directory listing

# File viewing
cat <filename>              # Display file contents
type <filename>             # Alternative file display

# Navigation
cd <directory>              # Change directory
pwd                         # Print working directory
```

##### System Commands
```bash
# System information
info                        # Display system information
version                     # Show OS version
uptime                      # System uptime

# Display control
clear                       # Clear screen
cls                         # Alternative clear screen

# Process management
ps                          # List running processes (future)
kill <pid>                  # Terminate process (future)
```

##### Utility Commands
```bash
# Help system
help                        # Display available commands
help <command>              # Show command help

# System control
reboot                      # Restart system
shutdown                    # Power off system
```

#### Command Processing
```cpp
void process_command(const char *input) {
    // 1. Parse command line
    // 2. Extract command and arguments
    // 3. Lookup command handler
    // 4. Execute command with arguments
    // 5. Display results
}
```

#### Input Handling
- **Line Editing**: Basic line editing capabilities
- **History**: Command history (future enhancement)
- **Tab Completion**: Command and filename completion (future)
- **Special Keys**: Handle escape sequences and function keys

#### Output Formatting
- **Text Rendering**: Formatted text output to framebuffer
- **Color Support**: Basic color support for text
- **Scrolling**: Screen scrolling for long output
- **Word Wrapping**: Automatic line wrapping

### 3. File System Viewer (`OS/src/kernel/programs/fs_view.cpp`)

#### Overview
The file system viewer provides a graphical interface for browsing and managing files and directories.

#### Features
- **Directory Navigation**: Browse directory hierarchy
- **File Information**: Display file details (size, type, attributes)
- **File Operations**: Basic file operations (view, copy, delete)
- **Visual Interface**: Graphical file browser interface

#### Display Modes
```cpp
enum display_mode {
    LIST_VIEW,              // Detailed list view
    ICON_VIEW,              // Icon-based view
    TREE_VIEW               // Hierarchical tree view
};
```

#### File Information Display
- **File Name**: Display full filename
- **File Size**: Show file size in bytes/KB/MB
- **File Type**: Identify file type by extension
- **Attributes**: Show file attributes (hidden, read-only, etc.)
- **Date/Time**: File creation and modification times

#### Navigation Interface
- **Arrow Keys**: Navigate file list
- **Enter Key**: Enter directories or open files
- **Backspace**: Go to parent directory
- **Home/End**: Jump to beginning/end of list

#### File Operations
```cpp
// File operation functions
void view_file(const char *filename);      // View file contents
void copy_file(const char *src, const char *dest); // Copy file
void delete_file(const char *filename);    // Delete file
void create_directory(const char *dirname); // Create directory
```

## Shell Implementation

### Command Parser
```cpp
struct parsed_command {
    char command[64];           // Command name
    char args[256];             // Command arguments
    int argc;                   // Argument count
    char *argv[16];             // Argument vector
};

parsed_command parse_command_line(const char *input);
```

### Command Execution
```cpp
int execute_command(const parsed_command &cmd) {
    // 1. Lookup command in command table
    // 2. Validate arguments
    // 3. Call command handler
    // 4. Return exit code
}
```

### Built-in Command Implementation

#### Directory Listing (`ls`)
```cpp
void cmd_ls(const char *args) {
    const char *path = args ? args : ".";
    
    // 1. Open directory
    // 2. Read directory entries
    // 3. Format and display entries
    // 4. Show file information
}
```

#### File Display (`cat`)
```cpp
void cmd_cat(const char *args) {
    if (!args) {
        kprintf("Usage: cat <filename>\n");
        return;
    }
    
    // 1. Open file
    // 2. Read file contents
    // 3. Display contents to screen
    // 4. Handle large files with paging
}
```

#### System Information (`info`)
```cpp
void cmd_info(const char *args) {
    // Display system information
    kprintf("NEO-OS version %s\n", OS_VERSION);
    kprintf("Memory: %d MB available\n", get_available_memory_mb());
    kprintf("CPU cores: %d\n", get_cpu_count());
    kprintf("Uptime: %d seconds\n", get_uptime_seconds());
}
```

## User Interface Components

### Text Rendering
```cpp
// Text output functions
void print_char(char c, int x, int y, uint32_t color);
void print_string(const char *str, int x, int y, uint32_t color);
void print_formatted(int x, int y, uint32_t color, const char *fmt, ...);
```

### Screen Management
```cpp
// Screen control functions
void clear_screen();                    // Clear entire screen
void scroll_screen(int lines);          // Scroll screen up/down
void set_cursor_position(int x, int y); // Set cursor position
void show_cursor();                     // Show cursor
void hide_cursor();                     // Hide cursor
```

### Color Management
```cpp
// Color definitions
#define COLOR_BLACK     0x000000
#define COLOR_WHITE     0xFFFFFF
#define COLOR_RED       0xFF0000
#define COLOR_GREEN     0x00FF00
#define COLOR_BLUE      0x0000FF
#define COLOR_YELLOW    0xFFFF00
#define COLOR_CYAN      0x00FFFF
#define COLOR_MAGENTA   0xFF00FF

// Text color control
void set_text_color(uint32_t foreground, uint32_t background);
```

## Application Communication

### Inter-Application Messaging (Future)
```cpp
// Message passing between applications
struct message {
    uint32_t type;              // Message type
    uint32_t sender_pid;        // Sender process ID
    uint32_t data_length;       // Data length
    void *data;                 // Message data
};

int send_message(uint32_t dest_pid, const message &msg);
int receive_message(message &msg);
```

### Shared Resources
- **Display**: Shared framebuffer access
- **Input**: Shared keyboard input
- **File System**: Shared file system access
- **Memory**: Shared memory regions

## Error Handling

### Application Error Handling
```cpp
// Error reporting functions
void report_error(const char *app_name, const char *error_msg);
void show_error_dialog(const char *title, const char *message);

// Error recovery
void restart_application(const char *app_name);
void force_quit_application(uint32_t pid);
```

### User Error Messages
- **File Not Found**: Clear error when files don't exist
- **Permission Denied**: Informative permission error messages
- **Invalid Command**: Help suggestions for invalid commands
- **System Errors**: User-friendly system error reporting

## Configuration

### Application Settings
```cpp
// Configuration structure
struct app_config {
    char default_directory[256];    // Default working directory
    uint32_t text_color;            // Default text color
    uint32_t background_color;      // Default background color
    bool show_hidden_files;         // Show hidden files in listings
    int screen_rows;                // Terminal screen rows
    int screen_cols;                // Terminal screen columns
};
```

### Persistent Configuration
- **Configuration Files**: Store settings in system files
- **User Preferences**: Per-user configuration options
- **System Defaults**: System-wide default settings

## Performance Optimizations

### Rendering Optimizations
- **Dirty Region Tracking**: Only redraw changed screen areas
- **Text Caching**: Cache rendered text for reuse
- **Double Buffering**: Smooth screen updates

### Memory Management
- **Buffer Pools**: Reuse buffers for text and graphics
- **Lazy Loading**: Load resources only when needed
- **Memory Limits**: Prevent applications from using too much memory

## Future Enhancements

### Planned Applications
- **Text Editor**: Simple text file editor
- **Calculator**: Basic calculator application
- **System Monitor**: Real-time system monitoring
- **Network Tools**: Network diagnostic utilities

### Enhanced Features
- **GUI Framework**: Graphical user interface framework
- **Window Management**: Multiple application windows
- **Application Launcher**: Graphical application launcher
- **Settings Panel**: System configuration interface

### Advanced Functionality
- **Scripting Support**: Simple scripting language
- **Plugin System**: Loadable application plugins
- **Remote Access**: Network-based remote terminal
- **Application Store**: Install additional applications

## Development Guidelines

### Application Development
```cpp
// Template for new applications
void my_application_main(process_t *process) {
    // 1. Initialize application state
    // 2. Set up I/O streams
    // 3. Main application loop
    // 4. Handle user input
    // 5. Update display
    // 6. Cleanup on exit
}
```

### Best Practices
- **Resource Management**: Always free allocated resources
- **Error Handling**: Gracefully handle all error conditions
- **User Experience**: Provide clear feedback and help
- **Performance**: Minimize CPU and memory usage

### Testing
- **Unit Testing**: Test individual application components
- **Integration Testing**: Test application interaction
- **User Testing**: Validate user interface and experience
- **Stress Testing**: Test under high load conditions

## Reference Implementation

### Key Files
- `OS/src/kernel/programs/login.cpp` - Login system implementation
- `OS/src/kernel/programs/terminal.cpp` - Terminal/shell implementation
- `OS/src/kernel/programs/fs_view.cpp` - File system viewer
- `OS/include/kernel/io/terminal.h` - Terminal interface definitions
- `OS/src/kernel/shell.cpp` - Shell command processing

### Integration Points
- **Process Management**: Applications run as kernel processes
- **I/O System**: Applications use stream I/O interface
- **File System**: Applications access files through VFS
- **Graphics**: Applications render to VGA framebuffer 