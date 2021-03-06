/**
 * DevExtreme (ui/file_manager/file_items_controller.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                descriptor.writable = true
            }
            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps)
        }
        if (staticProps) {
            defineProperties(Constructor, staticProps)
        }
        return Constructor
    }
}();
var _file_provider = require("./file_provider/file_provider");
var _array = require("./file_provider/array");
var _array2 = _interopRequireDefault(_array);
var _ajax = require("./file_provider/ajax");
var _ajax2 = _interopRequireDefault(_ajax);
var _remote = require("./file_provider/remote");
var _remote2 = _interopRequireDefault(_remote);
var _custom = require("./file_provider/custom");
var _custom2 = _interopRequireDefault(_custom);
var _uiFile_manager = require("./ui.file_manager.utils");
var _uiFile_manager2 = require("./ui.file_manager.common");
var _uiFile_manager3 = _interopRequireDefault(_uiFile_manager2);
var _deferred = require("../../core/utils/deferred");
var _array3 = require("../../core/utils/array");
var _extend = require("../../core/utils/extend");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var FileItemsController = function() {
    function FileItemsController(options) {
        _classCallCheck(this, FileItemsController);
        options = options || {};
        this._options = (0, _extend.extend)({}, options);
        var rootDirectory = this._createRootDirectory(options.rootText);
        this._rootDirectoryInfo = this._createDirectoryInfo(rootDirectory, null);
        this._currentDirectoryInfo = this._rootDirectoryInfo;
        this._defaultIconMap = this._createDefaultIconMap();
        this._securityController = new FileSecurityController({
            allowedFileExtensions: this._options.allowedFileExtensions,
            maxFileSize: this._options.maxUploadFileSize
        });
        this.setProvider(options.fileProvider);
        this._onSelectedDirectoryChanged = options && options.onSelectedDirectoryChanged;
        this._loadedItems = {};
        this.setCurrentPath(options.currentPath)
    }
    _createClass(FileItemsController, [{
        key: "setProvider",
        value: function(fileProvider) {
            this._fileProvider = this._createFileProvider(fileProvider);
            this._resetState()
        }
    }, {
        key: "_createFileProvider",
        value: function(fileProvider) {
            if (!fileProvider) {
                fileProvider = []
            }
            if (Array.isArray(fileProvider)) {
                return new _array2.default({
                    data: fileProvider
                })
            }
            if ("string" === typeof fileProvider) {
                return new _ajax2.default({
                    url: fileProvider
                })
            }
            if (fileProvider instanceof _file_provider.FileProvider) {
                return fileProvider
            }
            switch (fileProvider.type) {
                case "remote":
                    return new _remote2.default(fileProvider);
                case "custom":
                    return new _custom2.default(fileProvider)
            }
            return new _array2.default(fileProvider)
        }
    }, {
        key: "setCurrentPath",
        value: function(path) {
            var _this = this;
            var pathParts = (0, _uiFile_manager.getPathParts)(path);
            var rawPath = _uiFile_manager.pathCombine.apply(void 0, _toConsumableArray(pathParts));
            if (this.getCurrentDirectory().fileItem.relativeName === rawPath) {
                return
            }
            return this._getDirectoryByPathParts(this._rootDirectoryInfo, pathParts).then(function(directoryInfo) {
                for (var info = directoryInfo.parentDirectory; info; info = info.parentDirectory) {
                    info.expanded = true
                }
                _this.setCurrentDirectory(directoryInfo)
            })
        }
    }, {
        key: "getCurrentPath",
        value: function() {
            var currentPath = "";
            var directory = this.getCurrentDirectory();
            while (directory && !directory.fileItem.isRoot) {
                var escapedName = (0, _uiFile_manager.getEscapedFileName)(directory.fileItem.name);
                currentPath = (0, _uiFile_manager.pathCombine)(escapedName, currentPath);
                directory = directory.parentDirectory
            }
            return currentPath
        }
    }, {
        key: "getCurrentDirectory",
        value: function() {
            return this._currentDirectoryInfo
        }
    }, {
        key: "setCurrentDirectory",
        value: function(directoryInfo) {
            if (!directoryInfo) {
                return
            }
            if (this._currentDirectoryInfo && this._currentDirectoryInfo === directoryInfo) {
                return
            }
            var requireRaiseSelectedDirectory = this._currentDirectoryInfo.fileItem.key !== directoryInfo.fileItem.key;
            this._currentDirectoryInfo = directoryInfo;
            requireRaiseSelectedDirectory && this._raiseSelectedDirectoryChanged(directoryInfo)
        }
    }, {
        key: "getDirectories",
        value: function(parentDirectoryInfo) {
            return this.getDirectoryContents(parentDirectoryInfo).then(function(itemInfos) {
                return itemInfos.filter(function(info) {
                    return info.fileItem.isDirectory
                })
            })
        }
    }, {
        key: "getFiles",
        value: function(parentDirectoryInfo) {
            return this.getDirectoryContents(parentDirectoryInfo).then(function(itemInfos) {
                return itemInfos.filter(function(info) {
                    return !info.fileItem.isDirectory
                })
            })
        }
    }, {
        key: "getDirectoryContents",
        value: function(parentDirectoryInfo) {
            var _this2 = this;
            if (!parentDirectoryInfo) {
                return (new _deferred.Deferred).resolve([this._rootDirectoryInfo]).promise()
            }
            if (parentDirectoryInfo.itemsLoaded) {
                return (new _deferred.Deferred).resolve(parentDirectoryInfo.items).promise()
            }
            var dirKey = parentDirectoryInfo.fileItem.key;
            var loadItemsDeferred = this._loadedItems[dirKey];
            if (loadItemsDeferred) {
                return loadItemsDeferred
            }
            var pathInfo = this._getPathInfo(parentDirectoryInfo);
            loadItemsDeferred = this._getFileItems(pathInfo).then(function(fileItems) {
                parentDirectoryInfo.items = fileItems.map(function(fileItem) {
                    return fileItem.isDirectory && _this2._createDirectoryInfo(fileItem, parentDirectoryInfo) || _this2._createFileInfo(fileItem, parentDirectoryInfo)
                });
                parentDirectoryInfo.itemsLoaded = true;
                return parentDirectoryInfo.items
            });
            this._loadedItems[dirKey] = loadItemsDeferred;
            loadItemsDeferred.then(function() {
                delete _this2._loadedItems[dirKey]
            });
            return loadItemsDeferred
        }
    }, {
        key: "_getFileItems",
        value: function(pathInfo) {
            var _this3 = this;
            return (0, _deferred.when)(this._fileProvider.getItems(pathInfo)).then(function(fileItems) {
                return _this3._securityController.getAllowedItems(fileItems)
            })
        }
    }, {
        key: "createDirectory",
        value: function(parentDirectoryInfo, name) {
            var _this4 = this;
            var actionInfo = this._createEditActionInfo("create", parentDirectoryInfo, parentDirectoryInfo);
            return this._processEditAction(actionInfo, function() {
                return _this4._fileProvider.createFolder(parentDirectoryInfo.fileItem, name)
            }, function() {
                return _this4._resetDirectoryState(parentDirectoryInfo)
            })
        }
    }, {
        key: "renameItem",
        value: function(fileItemInfo, name) {
            var _this5 = this;
            var actionInfo = this._createEditActionInfo("rename", fileItemInfo, fileItemInfo.parentDirectory);
            return this._processEditAction(actionInfo, function() {
                if (!fileItemInfo.fileItem.isDirectory) {
                    _this5._securityController.validateExtension(name)
                }
                return _this5._fileProvider.renameItem(fileItemInfo.fileItem, name)
            }, function() {
                _this5._resetDirectoryState(fileItemInfo.parentDirectory);
                _this5.setCurrentDirectory(fileItemInfo.parentDirectory)
            })
        }
    }, {
        key: "moveItems",
        value: function(itemInfos, destinationDirectory) {
            var _this6 = this;
            var items = itemInfos.map(function(i) {
                return i.fileItem
            });
            var actionInfo = this._createEditActionInfo("move", itemInfos, destinationDirectory);
            return this._processEditAction(actionInfo, function() {
                return _this6._fileProvider.moveItems(items, destinationDirectory.fileItem)
            }, function() {
                itemInfos.forEach(function(itemInfo) {
                    return _this6._resetDirectoryState(itemInfo.parentDirectory)
                });
                _this6._resetDirectoryState(destinationDirectory);
                _this6.setCurrentDirectory(destinationDirectory)
            })
        }
    }, {
        key: "copyItems",
        value: function(itemInfos, destinationDirectory) {
            var _this7 = this;
            var items = itemInfos.map(function(i) {
                return i.fileItem
            });
            var actionInfo = this._createEditActionInfo("copy", itemInfos, destinationDirectory);
            return this._processEditAction(actionInfo, function() {
                return _this7._fileProvider.copyItems(items, destinationDirectory.fileItem)
            }, function() {
                _this7._resetDirectoryState(destinationDirectory);
                _this7.setCurrentDirectory(destinationDirectory);
                destinationDirectory.expanded = true
            })
        }
    }, {
        key: "deleteItems",
        value: function(itemInfos) {
            var _this8 = this;
            var items = itemInfos.map(function(i) {
                return i.fileItem
            });
            var directory = itemInfos.length > 0 ? itemInfos[0].parentDirectory : null;
            var actionInfo = this._createEditActionInfo("delete", itemInfos, directory);
            return this._processEditAction(actionInfo, function() {
                return _this8._fileProvider.deleteItems(items)
            }, function() {
                itemInfos.forEach(function(itemInfo) {
                    var parentDir = itemInfo.parentDirectory;
                    _this8._resetDirectoryState(parentDir);
                    _this8.setCurrentDirectory(parentDir)
                })
            })
        }
    }, {
        key: "processUploadSession",
        value: function(sessionInfo, uploadDirectoryInfo) {
            var _this9 = this;
            var itemInfos = this._getItemInfosForUploaderFiles(sessionInfo.files, uploadDirectoryInfo);
            var actionInfo = this._createEditActionInfo("upload", itemInfos, uploadDirectoryInfo, {
                sessionInfo: sessionInfo
            });
            return this._processEditAction(actionInfo, function() {
                return sessionInfo.deferreds
            }, function() {
                return _this9._resetDirectoryState(uploadDirectoryInfo)
            })
        }
    }, {
        key: "uploadFileChunk",
        value: function(fileData, chunksInfo, destinationDirectory) {
            this._securityController.validateMaxFileSize(fileData.size);
            this._securityController.validateExtension(fileData.name);
            return (0, _deferred.when)(this._fileProvider.uploadFileChunk(fileData, chunksInfo, destinationDirectory))
        }
    }, {
        key: "abortFileUpload",
        value: function(fileData, chunksInfo, destinationDirectory) {
            return (0, _deferred.when)(this._fileProvider.abortFileUpload(fileData, chunksInfo, destinationDirectory))
        }
    }, {
        key: "getFileUploadChunkSize",
        value: function() {
            return this._fileProvider.getFileUploadChunkSize()
        }
    }, {
        key: "downloadItems",
        value: function(itemInfos) {
            var items = itemInfos.map(function(i) {
                return i.fileItem
            });
            this._fileProvider.downloadItems(items)
        }
    }, {
        key: "getItemContent",
        value: function(itemInfos) {
            var items = itemInfos.map(function(i) {
                return i.fileItem
            });
            return (0, _deferred.when)(this._fileProvider.getItemContent(items))
        }
    }, {
        key: "_processEditAction",
        value: function(actionInfo, action, completeAction) {
            var _this10 = this;
            var actionResult = null;
            this._raiseEditActionStarting(actionInfo);
            try {
                actionResult = action()
            } catch (error) {
                this._raiseEditActionError(actionInfo, error);
                return (new _deferred.Deferred).reject().promise()
            }
            if (!Array.isArray(actionResult)) {
                actionResult = [actionResult]
            } else {
                if (actionResult.length > 1) {
                    actionInfo.singleRequest = false
                }
            }
            this._raiseEditActionResultAcquired(actionInfo);
            return (0, _uiFile_manager3.default)(actionResult, function(info) {
                return _this10._raiseCompleteEditActionItem(actionInfo, info)
            }, function(info) {
                return _this10._raiseEditActionItemError(actionInfo, info)
            }).then(function() {
                completeAction();
                _this10._raiseCompleteEditAction(actionInfo)
            })
        }
    }, {
        key: "_createEditActionInfo",
        value: function(name, itemInfos, directory, customData) {
            itemInfos = Array.isArray(itemInfos) ? itemInfos : [itemInfos];
            customData = customData || {};
            var items = itemInfos.map(function(itemInfo) {
                return itemInfo.fileItem
            });
            return {
                name: name,
                itemInfos: itemInfos,
                items: items,
                directory: directory,
                customData: customData,
                singleRequest: true
            }
        }
    }, {
        key: "_getItemInfosForUploaderFiles",
        value: function(files, parentDirectoryInfo) {
            var pathInfo = this._getPathInfo(parentDirectoryInfo);
            var result = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var item = new _file_provider.FileManagerItem(pathInfo, file.name, false);
                var itemInfo = this._createFileInfo(item, parentDirectoryInfo);
                result.push(itemInfo)
            }
            return result
        }
    }, {
        key: "refresh",
        value: function() {
            var _this11 = this;
            if (this._lockRefresh) {
                return this._refreshDeferred
            }
            this._lockRefresh = true;
            var cachedRootInfo = {
                items: this._rootDirectoryInfo.items
            };
            var selectedKeyParts = this._getDirectoryPathKeyParts(this.getCurrentDirectory());
            this._resetDirectoryState(this._rootDirectoryInfo);
            this.setCurrentDirectory(null);
            return this._refreshDeferred = this._loadItemsRecursive(this._rootDirectoryInfo, cachedRootInfo).then(function() {
                var dirInfo = _this11._findSelectedDirectoryByPathKeyParts(selectedKeyParts);
                _this11.setCurrentDirectory(dirInfo);
                delete _this11._lockRefresh
            })
        }
    }, {
        key: "_loadItemsRecursive",
        value: function(directoryInfo, cachedDirectoryInfo) {
            var _this12 = this;
            return this.getDirectories(directoryInfo).then(function(dirInfos) {
                var itemDeferreds = [];
                var _loop = function(i) {
                    var cachedItem = (0, _array3.find)(cachedDirectoryInfo.items, function(cache) {
                        return dirInfos[i].fileItem.key === cache.fileItem.key
                    });
                    if (!cachedItem) {
                        return "continue"
                    }
                    dirInfos[i].expanded = cachedItem.expanded;
                    if (dirInfos[i].expanded) {
                        itemDeferreds.push(_this12._loadItemsRecursive(dirInfos[i], cachedItem))
                    }
                };
                for (var i = 0; i < dirInfos.length; i++) {
                    var _ret = _loop(i);
                    if ("continue" === _ret) {
                        continue
                    }
                }
                return (0, _uiFile_manager3.default)(itemDeferreds)
            }, function() {
                return null
            })
        }
    }, {
        key: "_getDirectoryByPathParts",
        value: function(parentDirectoryInfo, pathParts) {
            var _this13 = this;
            if (pathParts.length < 1) {
                return (new _deferred.Deferred).resolve(parentDirectoryInfo).promise()
            }
            return this.getDirectories(parentDirectoryInfo).then(function(dirInfos) {
                var subDirInfo = (0, _array3.find)(dirInfos, function(d) {
                    return d.fileItem.name === pathParts[0]
                });
                if (!subDirInfo) {
                    return (new _deferred.Deferred).reject().promise()
                }
                return _this13._getDirectoryByPathParts(subDirInfo, pathParts.splice(1))
            })
        }
    }, {
        key: "_getDirectoryPathKeyParts",
        value: function(directoryInfo) {
            var pathParts = [directoryInfo.fileItem.key];
            while (directoryInfo && directoryInfo.parentDirectory) {
                pathParts.unshift(directoryInfo.parentDirectory.fileItem.key);
                directoryInfo = directoryInfo.parentDirectory
            }
            return pathParts
        }
    }, {
        key: "_findSelectedDirectoryByPathKeyParts",
        value: function(keyParts) {
            var selectedDirInfo = this._rootDirectoryInfo;
            if (keyParts.length < 2 || keyParts[0] !== this._rootDirectoryInfo.fileItem.key) {
                return selectedDirInfo
            }
            var i = 1;
            var newSelectedDir = selectedDirInfo;
            while (newSelectedDir && i < keyParts.length) {
                newSelectedDir = (0, _array3.find)(selectedDirInfo.items, function(info) {
                    return info.fileItem.key === keyParts[i]
                });
                if (newSelectedDir) {
                    selectedDirInfo = newSelectedDir
                }
                i++
            }
            return selectedDirInfo
        }
    }, {
        key: "_createDirectoryInfo",
        value: function(fileItem, parentDirectoryInfo) {
            return (0, _extend.extend)(this._createFileInfo(fileItem, parentDirectoryInfo), {
                icon: "folder",
                expanded: fileItem.isRoot,
                items: []
            })
        }
    }, {
        key: "_createFileInfo",
        value: function(fileItem, parentDirectoryInfo) {
            return {
                fileItem: fileItem,
                parentDirectory: parentDirectoryInfo,
                icon: this._getFileItemDefaultIcon(fileItem)
            }
        }
    }, {
        key: "_resetDirectoryState",
        value: function(directoryInfo) {
            directoryInfo.itemsLoaded = false;
            directoryInfo.items = []
        }
    }, {
        key: "_getFileItemDefaultIcon",
        value: function(fileItem) {
            if (fileItem.isDirectory) {
                return "folder"
            }
            var extension = fileItem.getExtension();
            var icon = this._defaultIconMap[extension];
            return icon || "doc"
        }
    }, {
        key: "_createDefaultIconMap",
        value: function() {
            var result = {
                ".txt": "txtfile",
                ".rtf": "rtffile",
                ".doc": "docfile",
                ".docx": "docxfile",
                ".xls": "xlsfile",
                ".xlsx": "xlsxfile",
                ".ppt": "pptfile",
                ".pptx": "pptxfile",
                ".pdf": "pdffile"
            };
            [".png", ".gif", ".jpg", ".jpeg", ".ico", ".bmp"].forEach(function(extension) {
                result[extension] = "image"
            });
            return result
        }
    }, {
        key: "_createRootDirectory",
        value: function(text) {
            var root = new _file_provider.FileManagerRootItem;
            root.name = text || "";
            return root
        }
    }, {
        key: "_raiseSelectedDirectoryChanged",
        value: function(directoryInfo) {
            var e = {
                selectedDirectoryInfo: directoryInfo
            };
            this._onSelectedDirectoryChanged && this._onSelectedDirectoryChanged(e)
        }
    }, {
        key: "_raiseEditActionStarting",
        value: function(actionInfo) {
            if (this._options.onEditActionStarting) {
                this._options.onEditActionStarting(actionInfo)
            }
        }
    }, {
        key: "_raiseEditActionResultAcquired",
        value: function(actionInfo) {
            if (this._options.onEditActionResultAcquired) {
                this._options.onEditActionResultAcquired(actionInfo)
            }
        }
    }, {
        key: "_raiseEditActionError",
        value: function(actionInfo, error) {
            if (this._options.onEditActionError) {
                this._options.onEditActionError(actionInfo, error)
            }
        }
    }, {
        key: "_raiseEditActionItemError",
        value: function(actionInfo, info) {
            if (this._options.onEditActionItemError) {
                this._options.onEditActionItemError(actionInfo, info)
            }
        }
    }, {
        key: "_raiseCompleteEditActionItem",
        value: function(actionInfo, info) {
            if (this._options.onCompleteEditActionItem) {
                this._options.onCompleteEditActionItem(actionInfo, info)
            }
        }
    }, {
        key: "_raiseCompleteEditAction",
        value: function(actionInfo) {
            if (this._options.onCompleteEditAction) {
                this._options.onCompleteEditAction(actionInfo)
            }
        }
    }, {
        key: "_resetState",
        value: function() {
            this._selectedDirectory = null;
            this._rootDirectoryInfo.items = [];
            this._loadedItems = {}
        }
    }, {
        key: "_getPathInfo",
        value: function(directoryInfo) {
            var pathInfo = [];
            for (var dirInfo = directoryInfo; dirInfo && !dirInfo.fileItem.isRoot; dirInfo = dirInfo.parentDirectory) {
                pathInfo.unshift({
                    key: dirInfo.fileItem.key,
                    name: dirInfo.fileItem.name
                })
            }
            return pathInfo
        }
    }, {
        key: "on",
        value: function(eventName, eventHandler) {
            var finalEventName = "on" + eventName;
            this._options[finalEventName] = eventHandler
        }
    }]);
    return FileItemsController
}();
exports.default = FileItemsController;
var FileSecurityController = function() {
    function FileSecurityController(options) {
        var _this14 = this;
        _classCallCheck(this, FileSecurityController);
        var defaultOptions = {
            allowedFileExtensions: [],
            maxFileSize: 0
        };
        this._options = (0, _extend.extend)(defaultOptions, options);
        this._extensionsMap = {};
        this._allowedFileExtensions.forEach(function(extension) {
            _this14._extensionsMap[extension] = true
        })
    }
    _createClass(FileSecurityController, [{
        key: "getAllowedItems",
        value: function(items) {
            var _this15 = this;
            if (0 === this._allowedFileExtensions.length) {
                return items
            }
            return items.filter(function(item) {
                return item.isDirectory || _this15._isValidExtension(item.name)
            })
        }
    }, {
        key: "validateExtension",
        value: function(name) {
            if (!this._isValidExtension(name)) {
                this._throwError(_uiFile_manager2.ErrorCode.WrongFileExtension)
            }
        }
    }, {
        key: "validateMaxFileSize",
        value: function(size) {
            if (this._maxFileSize && size > this._maxFileSize) {
                this._throwError(_uiFile_manager2.ErrorCode.MaxFileSizeExceeded)
            }
        }
    }, {
        key: "_isValidExtension",
        value: function(name) {
            if (0 === this._allowedFileExtensions.length) {
                return true
            }
            var extension = (0, _uiFile_manager.getFileExtension)(name).toLowerCase();
            return this._extensionsMap[extension]
        }
    }, {
        key: "_throwError",
        value: function(errorId) {
            throw {
                errorId: errorId
            }
        }
    }, {
        key: "_allowedFileExtensions",
        get: function() {
            return this._options.allowedFileExtensions
        }
    }, {
        key: "_maxFileSize",
        get: function() {
            return this._options.maxFileSize
        }
    }]);
    return FileSecurityController
}();
