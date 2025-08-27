# C/C++ Quick Include  

[中文](https://github.com/luckyPtr/c-cpp-quick-include/blob/main/README_zh.md)

⚡ A lightweight VS Code extension that helps you **add C/C++ header files instantly** without breaking your coding flow.  

![](https://raw.githubusercontent.com/luckyPtr/c-cpp-quick-include/refs/heads/main/resources/demo.gif)  

## Features  

- 🔍 **Smart detection** of project header files  
- ✍️ **Custom input** for non-listed headers  
- ⚙️ **Configurable include style** — quotes (`"file.h"`) or angle brackets (`<file.h>`)  
- 📌 **Marker support** — define custom insertion points with regex  
- 📂 **Custom search paths** for external headers  
- 🚀 Automatically inserts `#include` at the right place  

## How to Use  

1. Open the Command Palette with  
   - `Ctrl+Shift+P` (Windows/Linux)  
   - `Cmd+Shift+P` (macOS)  
2. Run **C/C++ Quick Include: Add**  
3. Pick a header from the list, or type your own  
4. The extension inserts the `#include` statement automatically — no cursor jumping required  

## Settings  

| Setting | Description | Example |
|---------|-------------|---------|
| `c-cpp-quick-include.includesMarkers` | Regex patterns for insertion markers | `["/INCLUDES/i", "/HEADERS/i"]` |
| `c-cpp-quick-include.searchPaths` | Custom header search paths | `["c:/path/to/headers"]` |
| `c-cpp-quick-include.defaultIncludeStyle` | Default include style | `"quotes"` or `"angle-brackets"` |

## Insert Rules  

The extension determines the best insertion point automatically:  
1. Below the first matched marker (if defined)  
2. Otherwise, after the initial comment block  
3. Or, after the last existing `#include`  

---

✨ Keep your focus on coding — let **C/C++ Quick Include** handle your headers.  
