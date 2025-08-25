# C/C++ Quick Include

一个帮助你在C/C++项目中快速添加#include语句的VS Code 扩展。

## 功能

- 快速搜索并插入头文件包含语句
- 智能识别项目中的所有头文件（.h, .hpp, .hh, .hxx）
- 支持自定义输入头文件名
- 自动将#include语句插入到合适的位置
- 可配置默认包含样式（双引号或尖括号）
- 可配置标记位置，用于指定插入点
- 支持自定义头文件搜索路径

## 使用方法

1. 在C/C++文件中按下 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS) 打开命令面板
2. 输入 **C/C++ Quick Include: Add**
3. 从列表中选择一个头文件，或输入自定义头文件名
4. 插件会自动在合适的位置插入#include语句而不用离开当前的编辑位置

## 扩展设置

本扩展提供以下设置选项：

* `c-cpp-quick-include.includesMarkers`：用于标记头文件插入位置的正则表达式列表。默认值为 `["/INCLUDES/i"]`。扩展会在匹配这些正则表达式的注释下方插入#include语句。
  
  示例配置：
  ```json
  {
    "c-cpp-quick-include.includesMarkers": [
      "/INCLUDES/i",
      "/HEADERS/i"
    ]
  }
  ```

* `c-cpp-quick-include.searchPaths`：自定义头文件搜索路径。拓展会在这些路径中搜索头文件。
  配置示例：
  ```json
  {
    "c-cpp-quick-include.searchPaths": [
      "c:/path/to/headers",
    ]
  }
  ```

* `c-cpp-quick-include.defaultIncludeStyle`：默认的#include语句样式。
    - `quotes`：使用双引号（默认），例如 #include "file.h"
    - `angle-brackets`：使用尖括号，例如 #include <file.h>

## 工作原理
扩展会自动扫描工作区中的所有头文件，并在Quick Pick列表中展示。用户可以选择现有文件或输入自定义文件名。

#include语句的插入位置遵循以下规则：
1. 如果配置了标记正则表达式，会在第一个匹配的注释下方插入
2. 否则，会在文件开头的注释块之后插入
3. 如果已有#include语句，则在最后一个#include语句后插入