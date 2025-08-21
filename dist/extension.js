"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/vscode-nls/lib/common/ral.js
var require_ral = __commonJS({
  "node_modules/vscode-nls/lib/common/ral.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var _ral;
    function RAL() {
      if (_ral === void 0) {
        throw new Error("No runtime abstraction layer installed");
      }
      return _ral;
    }
    (function(RAL2) {
      function install(ral) {
        if (ral === void 0) {
          throw new Error("No runtime abstraction layer provided");
        }
        _ral = ral;
      }
      RAL2.install = install;
    })(RAL || (RAL = {}));
    exports2.default = RAL;
  }
});

// node_modules/vscode-nls/lib/common/common.js
var require_common = __commonJS({
  "node_modules/vscode-nls/lib/common/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.config = exports2.loadMessageBundle = exports2.localize = exports2.format = exports2.setPseudo = exports2.isPseudo = exports2.isDefined = exports2.BundleFormat = exports2.MessageFormat = void 0;
    var ral_1 = require_ral();
    var MessageFormat2;
    (function(MessageFormat3) {
      MessageFormat3["file"] = "file";
      MessageFormat3["bundle"] = "bundle";
      MessageFormat3["both"] = "both";
    })(MessageFormat2 = exports2.MessageFormat || (exports2.MessageFormat = {}));
    var BundleFormat;
    (function(BundleFormat2) {
      BundleFormat2["standalone"] = "standalone";
      BundleFormat2["languagePack"] = "languagePack";
    })(BundleFormat = exports2.BundleFormat || (exports2.BundleFormat = {}));
    var LocalizeInfo;
    (function(LocalizeInfo2) {
      function is(value) {
        var candidate = value;
        return candidate && isDefined(candidate.key) && isDefined(candidate.comment);
      }
      LocalizeInfo2.is = is;
    })(LocalizeInfo || (LocalizeInfo = {}));
    function isDefined(value) {
      return typeof value !== "undefined";
    }
    exports2.isDefined = isDefined;
    exports2.isPseudo = false;
    function setPseudo(pseudo) {
      exports2.isPseudo = pseudo;
    }
    exports2.setPseudo = setPseudo;
    function format(message, args) {
      var result;
      if (exports2.isPseudo) {
        message = "\uFF3B" + message.replace(/[aouei]/g, "$&$&") + "\uFF3D";
      }
      if (args.length === 0) {
        result = message;
      } else {
        result = message.replace(/\{(\d+)\}/g, function(match, rest) {
          var index = rest[0];
          var arg = args[index];
          var replacement = match;
          if (typeof arg === "string") {
            replacement = arg;
          } else if (typeof arg === "number" || typeof arg === "boolean" || arg === void 0 || arg === null) {
            replacement = String(arg);
          }
          return replacement;
        });
      }
      return result;
    }
    exports2.format = format;
    function localize2(_key, message) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      return format(message, args);
    }
    exports2.localize = localize2;
    function loadMessageBundle(file) {
      return (0, ral_1.default)().loadMessageBundle(file);
    }
    exports2.loadMessageBundle = loadMessageBundle;
    function config2(opts) {
      return (0, ral_1.default)().config(opts);
    }
    exports2.config = config2;
  }
});

// node_modules/vscode-nls/lib/node/main.js
var require_main = __commonJS({
  "node_modules/vscode-nls/lib/node/main.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.config = exports2.loadMessageBundle = exports2.BundleFormat = exports2.MessageFormat = void 0;
    var path2 = require("path");
    var fs = require("fs");
    var ral_1 = require_ral();
    var common_1 = require_common();
    var common_2 = require_common();
    Object.defineProperty(exports2, "MessageFormat", { enumerable: true, get: function() {
      return common_2.MessageFormat;
    } });
    Object.defineProperty(exports2, "BundleFormat", { enumerable: true, get: function() {
      return common_2.BundleFormat;
    } });
    var toString = Object.prototype.toString;
    function isNumber(value) {
      return toString.call(value) === "[object Number]";
    }
    function isString(value) {
      return toString.call(value) === "[object String]";
    }
    function isBoolean(value) {
      return value === true || value === false;
    }
    function readJsonFileSync(filename) {
      return JSON.parse(fs.readFileSync(filename, "utf8"));
    }
    var resolvedBundles;
    var options;
    function initializeSettings() {
      options = { locale: void 0, language: void 0, languagePackSupport: false, cacheLanguageResolution: true, messageFormat: common_1.MessageFormat.bundle };
      if (isString(process.env.VSCODE_NLS_CONFIG)) {
        try {
          var vscodeOptions_1 = JSON.parse(process.env.VSCODE_NLS_CONFIG);
          var language = void 0;
          if (vscodeOptions_1.availableLanguages) {
            var value = vscodeOptions_1.availableLanguages["*"];
            if (isString(value)) {
              language = value;
            }
          }
          if (isString(vscodeOptions_1.locale)) {
            options.locale = vscodeOptions_1.locale.toLowerCase();
          }
          if (language === void 0) {
            options.language = options.locale;
          } else if (language !== "en") {
            options.language = language;
          }
          if (isBoolean(vscodeOptions_1._languagePackSupport)) {
            options.languagePackSupport = vscodeOptions_1._languagePackSupport;
          }
          if (isString(vscodeOptions_1._cacheRoot)) {
            options.cacheRoot = vscodeOptions_1._cacheRoot;
          }
          if (isString(vscodeOptions_1._languagePackId)) {
            options.languagePackId = vscodeOptions_1._languagePackId;
          }
          if (isString(vscodeOptions_1._translationsConfigFile)) {
            options.translationsConfigFile = vscodeOptions_1._translationsConfigFile;
            try {
              options.translationsConfig = readJsonFileSync(options.translationsConfigFile);
            } catch (error) {
              if (vscodeOptions_1._corruptedFile) {
                var dirname = path2.dirname(vscodeOptions_1._corruptedFile);
                fs.exists(dirname, function(exists) {
                  if (exists) {
                    fs.writeFile(vscodeOptions_1._corruptedFile, "corrupted", "utf8", function(err) {
                      console.error(err);
                    });
                  }
                });
              }
            }
          }
        } catch (_a) {
        }
      }
      (0, common_1.setPseudo)(options.locale === "pseudo");
      resolvedBundles = /* @__PURE__ */ Object.create(null);
    }
    initializeSettings();
    function supportsLanguagePack() {
      return options.languagePackSupport === true && options.cacheRoot !== void 0 && options.languagePackId !== void 0 && options.translationsConfigFile !== void 0 && options.translationsConfig !== void 0;
    }
    function createScopedLocalizeFunction(messages) {
      return function(key, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
          args[_i - 2] = arguments[_i];
        }
        if (isNumber(key)) {
          if (key >= messages.length) {
            console.error("Broken localize call found. Index out of bounds. Stacktrace is\n: ".concat(new Error("").stack));
            return;
          }
          return (0, common_1.format)(messages[key], args);
        } else {
          if (isString(message)) {
            console.warn("Message ".concat(message, " didn't get externalized correctly."));
            return (0, common_1.format)(message, args);
          } else {
            console.error("Broken localize call found. Stacktrace is\n: ".concat(new Error("").stack));
          }
        }
      };
    }
    function resolveLanguage(file) {
      var resolvedLanguage;
      if (options.cacheLanguageResolution && resolvedLanguage) {
        resolvedLanguage = resolvedLanguage;
      } else {
        if (common_1.isPseudo || !options.language) {
          resolvedLanguage = ".nls.json";
        } else {
          var locale = options.language;
          while (locale) {
            var candidate = ".nls." + locale + ".json";
            if (fs.existsSync(file + candidate)) {
              resolvedLanguage = candidate;
              break;
            } else {
              var index = locale.lastIndexOf("-");
              if (index > 0) {
                locale = locale.substring(0, index);
              } else {
                resolvedLanguage = ".nls.json";
                locale = null;
              }
            }
          }
        }
        if (options.cacheLanguageResolution) {
          resolvedLanguage = resolvedLanguage;
        }
      }
      return file + resolvedLanguage;
    }
    function findInTheBoxBundle(root) {
      var language = options.language;
      while (language) {
        var candidate = path2.join(root, "nls.bundle.".concat(language, ".json"));
        if (fs.existsSync(candidate)) {
          return candidate;
        } else {
          var index = language.lastIndexOf("-");
          if (index > 0) {
            language = language.substring(0, index);
          } else {
            language = void 0;
          }
        }
      }
      if (language === void 0) {
        var candidate = path2.join(root, "nls.bundle.json");
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
      return void 0;
    }
    function createDefaultNlsBundle(folder) {
      var metaData = readJsonFileSync(path2.join(folder, "nls.metadata.json"));
      var result = /* @__PURE__ */ Object.create(null);
      for (var module_1 in metaData) {
        var entry = metaData[module_1];
        result[module_1] = entry.messages;
      }
      return result;
    }
    function createNLSBundle(header, metaDataPath) {
      var languagePackLocation = options.translationsConfig[header.id];
      if (!languagePackLocation) {
        return void 0;
      }
      var languagePack = readJsonFileSync(languagePackLocation).contents;
      var metaData = readJsonFileSync(path2.join(metaDataPath, "nls.metadata.json"));
      var result = /* @__PURE__ */ Object.create(null);
      for (var module_2 in metaData) {
        var entry = metaData[module_2];
        var translations = languagePack["".concat(header.outDir, "/").concat(module_2)];
        if (translations) {
          var resultMessages = [];
          for (var i = 0; i < entry.keys.length; i++) {
            var messageKey = entry.keys[i];
            var key = isString(messageKey) ? messageKey : messageKey.key;
            var translatedMessage = translations[key];
            if (translatedMessage === void 0) {
              translatedMessage = entry.messages[i];
            }
            resultMessages.push(translatedMessage);
          }
          result[module_2] = resultMessages;
        } else {
          result[module_2] = entry.messages;
        }
      }
      return result;
    }
    function touch(file) {
      var d = /* @__PURE__ */ new Date();
      fs.utimes(file, d, d, function() {
      });
    }
    function cacheBundle(key, bundle) {
      resolvedBundles[key] = bundle;
      return bundle;
    }
    function loadNlsBundleOrCreateFromI18n(header, bundlePath) {
      var result;
      var bundle = path2.join(options.cacheRoot, "".concat(header.id, "-").concat(header.hash, ".json"));
      var useMemoryOnly = false;
      var writeBundle = false;
      try {
        result = JSON.parse(fs.readFileSync(bundle, { encoding: "utf8", flag: "r" }));
        touch(bundle);
        return result;
      } catch (err) {
        if (err.code === "ENOENT") {
          writeBundle = true;
        } else if (err instanceof SyntaxError) {
          console.log("Syntax error parsing message bundle: ".concat(err.message, "."));
          fs.unlink(bundle, function(err2) {
            if (err2) {
              console.error("Deleting corrupted bundle ".concat(bundle, " failed."));
            }
          });
          useMemoryOnly = true;
        } else {
          throw err;
        }
      }
      result = createNLSBundle(header, bundlePath);
      if (!result || useMemoryOnly) {
        return result;
      }
      if (writeBundle) {
        try {
          fs.writeFileSync(bundle, JSON.stringify(result), { encoding: "utf8", flag: "wx" });
        } catch (err) {
          if (err.code === "EEXIST") {
            return result;
          }
          throw err;
        }
      }
      return result;
    }
    function loadDefaultNlsBundle(bundlePath) {
      try {
        return createDefaultNlsBundle(bundlePath);
      } catch (err) {
        console.log("Generating default bundle from meta data failed.", err);
        return void 0;
      }
    }
    function loadNlsBundle(header, bundlePath) {
      var result;
      if (supportsLanguagePack()) {
        try {
          result = loadNlsBundleOrCreateFromI18n(header, bundlePath);
        } catch (err) {
          console.log("Load or create bundle failed ", err);
        }
      }
      if (!result) {
        if (options.languagePackSupport) {
          return loadDefaultNlsBundle(bundlePath);
        }
        var candidate = findInTheBoxBundle(bundlePath);
        if (candidate) {
          try {
            return readJsonFileSync(candidate);
          } catch (err) {
            console.log("Loading in the box message bundle failed.", err);
          }
        }
        result = loadDefaultNlsBundle(bundlePath);
      }
      return result;
    }
    function tryFindMetaDataHeaderFile(file) {
      var result;
      var dirname = path2.dirname(file);
      while (true) {
        result = path2.join(dirname, "nls.metadata.header.json");
        if (fs.existsSync(result)) {
          break;
        }
        var parent = path2.dirname(dirname);
        if (parent === dirname) {
          result = void 0;
          break;
        } else {
          dirname = parent;
        }
      }
      return result;
    }
    function loadMessageBundle(file) {
      if (!file) {
        return common_1.localize;
      }
      var ext = path2.extname(file);
      if (ext) {
        file = file.substr(0, file.length - ext.length);
      }
      if (options.messageFormat === common_1.MessageFormat.both || options.messageFormat === common_1.MessageFormat.bundle) {
        var headerFile = tryFindMetaDataHeaderFile(file);
        if (headerFile) {
          var bundlePath = path2.dirname(headerFile);
          var bundle = resolvedBundles[bundlePath];
          if (bundle === void 0) {
            try {
              var header = JSON.parse(fs.readFileSync(headerFile, "utf8"));
              try {
                var nlsBundle = loadNlsBundle(header, bundlePath);
                bundle = cacheBundle(bundlePath, nlsBundle ? { header, nlsBundle } : null);
              } catch (err) {
                console.error("Failed to load nls bundle", err);
                bundle = cacheBundle(bundlePath, null);
              }
            } catch (err) {
              console.error("Failed to read header file", err);
              bundle = cacheBundle(bundlePath, null);
            }
          }
          if (bundle) {
            var module_3 = file.substr(bundlePath.length + 1).replace(/\\/g, "/");
            var messages = bundle.nlsBundle[module_3];
            if (messages === void 0) {
              console.error("Messages for file ".concat(file, " not found. See console for details."));
              return function() {
                return "Messages not found.";
              };
            }
            return createScopedLocalizeFunction(messages);
          }
        }
      }
      if (options.messageFormat === common_1.MessageFormat.both || options.messageFormat === common_1.MessageFormat.file) {
        try {
          var json = readJsonFileSync(resolveLanguage(file));
          if (Array.isArray(json)) {
            return createScopedLocalizeFunction(json);
          } else {
            if ((0, common_1.isDefined)(json.messages) && (0, common_1.isDefined)(json.keys)) {
              return createScopedLocalizeFunction(json.messages);
            } else {
              console.error("String bundle '".concat(file, "' uses an unsupported format."));
              return function() {
                return "File bundle has unsupported format. See console for details";
              };
            }
          }
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error("Failed to load single file bundle", err);
          }
        }
      }
      console.error("Failed to load message bundle for file ".concat(file));
      return function() {
        return "Failed to load message bundle. See console for details.";
      };
    }
    exports2.loadMessageBundle = loadMessageBundle;
    function config2(opts) {
      if (opts) {
        if (isString(opts.locale)) {
          options.locale = opts.locale.toLowerCase();
          options.language = options.locale;
          resolvedBundles = /* @__PURE__ */ Object.create(null);
        }
        if (opts.messageFormat !== void 0) {
          options.messageFormat = opts.messageFormat;
        }
        if (opts.bundleFormat === common_1.BundleFormat.standalone && options.languagePackSupport === true) {
          options.languagePackSupport = false;
        }
      }
      (0, common_1.setPseudo)(options.locale === "pseudo");
      return loadMessageBundle;
    }
    exports2.config = config2;
    ral_1.default.install(Object.freeze({
      loadMessageBundle,
      config: config2
    }));
  }
});

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
var nls = __toESM(require_main());
var localize = nls.config({ messageFormat: nls.MessageFormat.file })();
function activate(context) {
  let disposable = vscode.commands.registerCommand("c-cpp-quick-include.quickInclude", () => {
    selectHeaderFile().then((res) => {
      const config2 = vscode.workspace.getConfiguration("c-cpp-quick-include");
      const markers = config2.get("includesMarkers", []);
      const regexMarkers = markers.map((marker) => {
        if (marker.startsWith("/") && marker.lastIndexOf("/") > 0) {
          const lastSlashIndex = marker.lastIndexOf("/");
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
  quickPick.placeholder = localize("c-cpp-quick-include.add.quickPick.placeholder", "Select header file to include");
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
  if (markerRe && markerRe.length > 0) {
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
      const isMatch = markerRe.some((re) => re.test(text));
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
  const config2 = vscode.workspace.getConfiguration("c-cpp-quick-include");
  const includeStyle = config2.get("defaultIncludeStyle", "quotes");
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
