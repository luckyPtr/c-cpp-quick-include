import path from 'path';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export function activate(context: vscode.ExtensionContext) {

let disposable = vscode.commands.registerCommand('c-cpp-quick-include.quickInclude', () => {
        selectHeaderFile().then(res => {
            const config = vscode.workspace.getConfiguration('c-cpp-quick-include');
            const markers: string[] = config.get('includesMarkers', []);
            const regexMarkers = markers.map(marker => {
                // 如果是有效的正则表达式字符串（带有分隔符），则解析它
                if (marker.startsWith('/') && marker.lastIndexOf('/') > 0) {
                    const lastSlashIndex = marker.lastIndexOf('/');
                    const pattern = marker.substring(1, lastSlashIndex);
                    const flags = marker.substring(lastSlashIndex + 1);
                    return new RegExp(pattern, flags);
                } else {
                    return new RegExp(marker);
                }
            });
            insertHeader(res, regexMarkers);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

// 选择要插入的头文件
export async function selectHeaderFile() {
    // 在工作区中查找所有头文件
    const files = await vscode.workspace.findFiles('**/*.{h,hpp,hh,hxx}');

    const pickItems: vscode.QuickPickItem[] = files.map(file => {
        const fileName = vscode.workspace.asRelativePath(file);
        return {
            label: path.basename(fileName),
            description: file.fsPath.replace(/\\/g, '/')
        };
    });

    // 创建 QuickPick 实例
    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = localize('c-cpp-quick-include.add.quickPick.placeholder', 'Select header file to include');
    quickPick.matchOnDescription = true;
    quickPick.items = pickItems;
    
    return new Promise<string | undefined>((resolve) => {
        quickPick.onDidChangeValue(() => {
            // 检查当前是否有匹配项
            const hasMatch = quickPick.items.some(item => {
                // 检查 label 或 detail 是否匹配输入值
                return item.label.toLowerCase().includes(quickPick.value.toLowerCase()) || 
                       (item.description && item.description.toLowerCase().includes(quickPick.value.toLowerCase()));
            });
            
            // 只有在没有匹配项时才添加自定义输入项
            if (quickPick.value && !hasMatch) {
                quickPick.items = [
                    { 
                        label: `${quickPick.value}`, 
                    },
                    ...pickItems
                ];
            } else if (!quickPick.value) {
                // 如果输入为空，恢复原始列表
                quickPick.items = pickItems;
            }
        });

        quickPick.onDidAccept(() => {
            const selection = quickPick.selectedItems[0];
            const inputValue = quickPick.value;
            
            if (selection) {
                // 这是选择的现有文件，根据输入内容判断返回相对路径还是文件名
                const matchedFile = files.find(file => {
                    const fileName = path.basename(file.path);
                    return fileName === selection.label;
                });

                if (matchedFile) {
                    if (inputValue.includes('/')) {
                        const relativePath = selection.description ? getRelativePath(selection.description, inputValue) : undefined; 
                        quickPick.hide();
                        resolve(relativePath);
                    }
                    else {
                        quickPick.hide();
                        resolve(selection.label);
                    }
                }
                else {   // 自定义文件 
                    quickPick.hide();
                    resolve(inputValue);
                }
                
            } else {
                // 没有选择任何项
                quickPick.hide();
                resolve(undefined);
            }
        });

        quickPick.onDidHide(() => {
            quickPick.dispose();
            resolve(undefined);
        });

        quickPick.show();
    });
}


function getRelativePath(fullPath: string, keyword: string): string | undefined {
    // 把 Windows 的 \ 全部转为 / 统一处理
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const normalizedKeyword = keyword.replace(/\\/g, '/');
    const index = normalizedPath.toLowerCase().indexOf(normalizedKeyword.toLowerCase());
    if (index === -1) {
        return undefined;
    }
    return normalizedPath.substring(index);
}

export async function insertHeader(header: string | undefined, markerRe?: RegExp[]) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !header) {
        return;
    }

    const document = editor.document;
    const formattedHeader = formatHeader(header); 
    const includeText = `#include ${formattedHeader}\n`;
    let i = 0;
    let foundMarker = false;

    // 如果有头文件开始regex，则查找匹配的行
    if (markerRe && markerRe.length > 0) {
        let inBlockComment = false;
        for (let l = 0; l < document.lineCount; l++) {
            const text = document.lineAt(l).text;
            if (text.trim().startsWith('/*')) {
                inBlockComment = true;
            }
            else if (text.trim().includes('*/')) {
                if (foundMarker) {
                    i = l + 1;
                    break;
                }
            }

            const isMatch = markerRe.some(re => re.test(text));
            if (isMatch) {
                foundMarker = true;
                if (!inBlockComment) {
                    i = l + 1;
                    break;
                }
            }
        }
    }

    if (!foundMarker) {
        let inBlockComment = false;
        // 跳过头注释
        for (; i < document.lineCount; i++) {
            const line = document.lineAt(i).text.trim();
            if (inBlockComment) {
                if (line.includes('*/')) {
                    inBlockComment = false;
                }
                continue;
            }
            if (line.startsWith('/*')) {
                inBlockComment = true;
                continue;
            }
            if (line.startsWith('//')) {
                continue;
            }
            break;
        }
    }

    let lineNum = i;
    let foundInclude = false;
    // 找最后一个 include
    for (; i < document.lineCount; i++) {
        const line = document.lineAt(i).text.trim();
        if (line.startsWith('#include')) {
            lineNum = i + 1;
            foundInclude = true;
        }
        else if (foundInclude) {
            break;
        }
    }
    const insertPos = new vscode.Position(lineNum, 0);

    await editor.edit(editBuilder => {
        // 如果在文档末尾，确保前面有换行符
        if (lineNum >= document.lineCount) {
            editBuilder.insert(insertPos, '\n' + includeText);
        } else {
            editBuilder.insert(insertPos, includeText);
        }
    });
}

// 把头文件格式化
function formatHeader(header: string) {
    const config = vscode.workspace.getConfiguration('c-cpp-quick-include');
    const includeStyle: string = config.get('defaultIncludeStyle', 'quotes');
    const left = includeStyle === 'quotes' ? '"' : '<';
    const right = includeStyle === 'quotes' ? '"' : '>';
    
    // 处理 header 格式，自动补全不完整的输入
    let formattedHeader: string;
    if (header.startsWith('"') && !header.endsWith('"')) {
        // 以 " 开头但不以 " 结尾，补全右侧引号
        formattedHeader = `${header}"`;
    } else if (header.startsWith('<') && !header.endsWith('>')) {
        // 以 < 开头但不以 > 结尾，补全右侧尖括号
        formattedHeader = `${header}>`;
    } else if (header.startsWith('"') || header.startsWith('<')) {
        // 已经是完整格式，直接使用
        formattedHeader = header;
    } else {
        // 没有引号或尖括号，使用配置的默认样式
        formattedHeader = `${left}${header}${right}`;
    }
    return formattedHeader;
}


function splitRelativeHeader(p: string): { prefix: string, subpath: string } {
    // 匹配诸如 ../、../../ 这样的相对路径前缀
    const match = p.match(/^(\.\.\/)+/);
    if (match) {
        const prefix = match[0];                  
        const subpath = p.substring(prefix.length);
        return { prefix, subpath };
    } else {
        return { prefix: "", subpath: p };
    }
}
