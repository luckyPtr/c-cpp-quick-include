"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate,
  insertHeader: () => insertHeader,
  selectHeaderFile: () => selectHeaderFile
});
module.exports = __toCommonJS(extension_exports);
var import_path = __toESM(require("path"));
var vscode = __toESM(require("vscode"));
function activate(context) {
  let disposable = vscode.commands.registerCommand("c-cpp-quick-include.quickInclude", () => {
    selectHeaderFile().then((res) => {
      console.log(res);
      insertHeader(res, /INCLUDES/i);
    });
  });
  context.subscriptions.push(disposable);
}
function deactivate() {
}
async function selectHeaderFile() {
  const files = await vscode.workspace.findFiles("**/*.{h,hpp,hh,hxx}");
  const pickItems = files.map((file) => {
    const fileName = vscode.workspace.asRelativePath(file);
    return {
      label: import_path.default.basename(fileName),
      description: file.fsPath.replace(/\\/g, "/")
    };
  });
  const quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = "\u8BF7\u9009\u62E9\u8981\u63D2\u5165\u7684\u5934\u6587\u4EF6";
  quickPick.matchOnDescription = true;
  quickPick.items = pickItems;
  return new Promise((resolve) => {
    quickPick.onDidChangeValue(() => {
      const hasMatch = quickPick.items.some((item) => {
        return item.label.toLowerCase().includes(quickPick.value.toLowerCase()) || item.description && item.description.toLowerCase().includes(quickPick.value.toLowerCase());
      });
      if (quickPick.value && !hasMatch) {
        quickPick.items = [
          {
            label: `${quickPick.value}`
          },
          ...pickItems
        ];
      } else if (!quickPick.value) {
        quickPick.items = pickItems;
      }
    });
    quickPick.onDidAccept(() => {
      const selection = quickPick.selectedItems[0];
      const inputValue = quickPick.value;
      if (selection) {
        const matchedFile = files.find((file) => {
          const fileName = import_path.default.basename(file.path);
          return fileName === selection.label;
        });
        if (matchedFile) {
          if (inputValue.includes("/")) {
            const relativePath = selection.description ? getRelativePath(selection.description, inputValue) : void 0;
            quickPick.hide();
            resolve(relativePath);
          } else {
            quickPick.hide();
            resolve(selection.label);
          }
        } else {
          quickPick.hide();
          resolve(inputValue);
        }
      } else {
        quickPick.hide();
        resolve(void 0);
      }
    });
    quickPick.onDidHide(() => {
      quickPick.dispose();
      resolve(void 0);
    });
    quickPick.show();
  });
}
function getRelativePath(fullPath, keyword) {
  const normalizedPath = fullPath.replace(/\\/g, "/");
  const normalizedKeyword = keyword.replace(/\\/g, "/");
  const index = normalizedPath.toLowerCase().indexOf(normalizedKeyword.toLowerCase());
  if (index === -1) {
    return void 0;
  }
  return normalizedPath.substring(index);
}
async function insertHeader(header, markerRe) {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !header) {
    return;
  }
  const document = editor.document;
  const formattedHeader = formatHeader(header);
  const includeText = `#include ${formattedHeader}
`;
  let i = 0;
  let foundMarker = false;
  if (markerRe) {
    let inBlockComment = false;
    for (let l = 0; l < document.lineCount; l++) {
      const text = document.lineAt(l).text;
      if (text.trim().startsWith("/*")) {
        inBlockComment = true;
      } else if (text.trim().includes("*/")) {
        if (foundMarker) {
          i = l + 1;
          break;
        }
      }
      if (markerRe.test(text)) {
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
    for (; i < document.lineCount; i++) {
      const line = document.lineAt(i).text.trim();
      if (inBlockComment) {
        if (line.includes("*/")) {
          inBlockComment = false;
        }
        continue;
      }
      if (line.startsWith("/*")) {
        inBlockComment = true;
        continue;
      }
      if (line.startsWith("//")) {
        continue;
      }
      break;
    }
  }
  let lineNum = i;
  let foundInclude = false;
  for (; i < document.lineCount; i++) {
    const line = document.lineAt(i).text.trim();
    if (line.startsWith("#include")) {
      lineNum = i + 1;
      foundInclude = true;
    } else if (foundInclude) {
      break;
    }
  }
  const insertPos = new vscode.Position(lineNum, 0);
  await editor.edit((editBuilder) => {
    if (lineNum >= document.lineCount) {
      editBuilder.insert(insertPos, "\n" + includeText);
    } else {
      editBuilder.insert(insertPos, includeText);
    }
  });
}
function formatHeader(header) {
  const config = vscode.workspace.getConfiguration("c-cpp-quick-include");
  const includeStyle = config.get("defaultIncludeStyle", "quotes");
  const left = includeStyle === "quotes" ? '"' : "<";
  const right = includeStyle === "quotes" ? '"' : ">";
  let formattedHeader;
  if (header.startsWith('"') && !header.endsWith('"')) {
    formattedHeader = `${header}"`;
  } else if (header.startsWith("<") && !header.endsWith(">")) {
    formattedHeader = `${header}>`;
  } else if (header.startsWith('"') || header.startsWith("<")) {
    formattedHeader = header;
  } else {
    formattedHeader = `${left}${header}${right}`;
  }
  return formattedHeader;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate,
  insertHeader,
  selectHeaderFile
});
//# sourceMappingURL=extension.js.map
