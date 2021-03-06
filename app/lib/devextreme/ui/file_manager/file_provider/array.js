/**
 * DevExtreme (ui/file_manager/file_provider/array.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
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
var _array = require("../../../core/utils/array");
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _guid = require("../../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _type = require("../../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _errors = require("../../../data/errors");
var _file_provider = require("./file_provider");
var _uiFile_manager = require("../ui.file_manager.common");
var _uiFile_manager2 = require("../ui.file_manager.utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && ("object" === typeof call || "function" === typeof call) ? call : self
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
    }
}
var ArrayFileProvider = function(_FileProvider) {
    _inherits(ArrayFileProvider, _FileProvider);

    function ArrayFileProvider(options) {
        _classCallCheck(this, ArrayFileProvider);
        options = (0, _common.ensureDefined)(options, {});
        var _this = _possibleConstructorReturn(this, (ArrayFileProvider.__proto__ || Object.getPrototypeOf(ArrayFileProvider)).call(this, options));
        var initialArray = options.data;
        if (initialArray && !Array.isArray(initialArray)) {
            throw _errors.errors.Error("E4006")
        }
        var itemsExpr = options.itemsExpr || "items";
        _this._subFileItemsGetter = (0, _data.compileGetter)(itemsExpr);
        _this._subFileItemsSetter = _this._getSetter(itemsExpr);
        var nameExpr = _this._getNameExpr(options);
        _this._nameSetter = _this._getSetter(nameExpr);
        var isDirExpr = _this._getIsDirExpr(options);
        _this._getIsDirSetter = _this._getSetter(isDirExpr);
        var keyExpr = _this._getKeyExpr(options);
        _this._keySetter = _this._getSetter(keyExpr);
        _this._data = initialArray || [];
        return _this
    }
    _createClass(ArrayFileProvider, [{
        key: "getItems",
        value: function(pathInfo) {
            return this._getItems(pathInfo)
        }
    }, {
        key: "renameItem",
        value: function(item, name) {
            if (!item) {
                return
            }
            this._nameSetter(item.dataItem, name);
            item.name = name;
            item.key = this._ensureDataObjectKey(item.dataItem)
        }
    }, {
        key: "createFolder",
        value: function(parentDir, name) {
            if (!this._isFileItemExists(parentDir) || this._isDirGetter(parentDir.fileItem)) {
                throw {
                    errorId: _uiFile_manager.ErrorCode.DirectoryNotFound,
                    fileItem: parentDir
                }
            }
            var newDir = {};
            this._nameSetter(newDir, name);
            this._getIsDirSetter(newDir, true);
            this._keySetter(newDir, String(new _guid2.default));
            var array = this._getDirectoryDataItems(parentDir.dataItem);
            array.push(newDir);
            this._updateHasSubDirs(parentDir)
        }
    }, {
        key: "deleteItems",
        value: function(items) {
            var _this2 = this;
            items.forEach(function(item) {
                return _this2._deleteItem(item)
            })
        }
    }, {
        key: "moveItems",
        value: function(items, destinationDir) {
            var _this3 = this;
            var array = this._getDirectoryDataItems(destinationDir.dataItem);
            items.forEach(function(item) {
                _this3._checkAbilityToMoveOrCopyItem(item, destinationDir);
                _this3._deleteItem(item);
                array.push(item.dataItem)
            });
            this._updateHasSubDirs(destinationDir)
        }
    }, {
        key: "copyItems",
        value: function(items, destinationDir) {
            var _this4 = this;
            var array = this._getDirectoryDataItems(destinationDir.dataItem);
            items.forEach(function(item) {
                _this4._checkAbilityToMoveOrCopyItem(item, destinationDir);
                var copiedItem = _this4._createCopy(item.dataItem);
                array.push(copiedItem)
            });
            this._updateHasSubDirs(destinationDir)
        }
    }, {
        key: "_checkAbilityToMoveOrCopyItem",
        value: function(item, destinationDir) {
            var _this5 = this;
            var itemKey = this._getKeyFromDataObject(item.dataItem, item.parentPath);
            var pathInfo = destinationDir.getFullPathInfo();
            var currentPath = "";
            pathInfo.forEach(function(info) {
                currentPath = (0, _uiFile_manager2.pathCombine)(currentPath, info.name);
                var pathKey = _this5._getDataObjectKey(info.key, currentPath);
                if (pathKey === itemKey) {
                    throw {
                        errorId: _uiFile_manager.ErrorCode.Other,
                        fileItem: item
                    }
                }
            })
        }
    }, {
        key: "_createCopy",
        value: function(dataObj) {
            var _this6 = this;
            var copyObj = {};
            this._nameSetter(copyObj, this._nameGetter(dataObj));
            this._getIsDirSetter(copyObj, this._isDirGetter(dataObj));
            var items = this._subFileItemsGetter(dataObj);
            if (Array.isArray(items)) {
                var itemsCopy = [];
                items.forEach(function(childItem) {
                    var childCopy = _this6._createCopy(childItem);
                    itemsCopy.push(childCopy)
                });
                this._subFileItemsSetter(copyObj, itemsCopy)
            }
            return copyObj
        }
    }, {
        key: "_deleteItem",
        value: function(fileItem) {
            var fileItemObj = this._findFileItemObj(fileItem.getFullPathInfo());
            if (!fileItemObj) {
                throw {
                    errorId: fileItem.isDirectory ? _uiFile_manager.ErrorCode.DirectoryNotFound : _uiFile_manager.ErrorCode.FileNotFound,
                    fileItem: fileItem
                }
            }
            var parentDirDataObj = this._findFileItemObj(fileItem.pathInfo);
            var array = this._getDirectoryDataItems(parentDirDataObj);
            var index = array.indexOf(fileItemObj);
            array.splice(index, 1)
        }
    }, {
        key: "_getDirectoryDataItems",
        value: function(directoryDataObj) {
            if (!directoryDataObj) {
                return this._data
            }
            var dataItems = this._subFileItemsGetter(directoryDataObj);
            if (!Array.isArray(dataItems)) {
                dataItems = [];
                this._subFileItemsSetter(directoryDataObj, dataItems)
            }
            return dataItems
        }
    }, {
        key: "_getItems",
        value: function(pathInfo) {
            var parentDirKey = pathInfo && pathInfo.length > 0 ? pathInfo[pathInfo.length - 1].key : null;
            var dirFileObjects = this._data;
            if (parentDirKey) {
                var directoryEntry = this._findFileItemObj(pathInfo);
                dirFileObjects = directoryEntry && this._subFileItemsGetter(directoryEntry) || []
            }
            this._ensureKeysForDuplicateNameItems(dirFileObjects);
            return this._convertDataObjectsToFileItems(dirFileObjects, pathInfo)
        }
    }, {
        key: "_ensureKeysForDuplicateNameItems",
        value: function(dataObjects) {
            var _this7 = this;
            var names = {};
            dataObjects.forEach(function(obj) {
                var name = _this7._nameGetter(obj);
                if (names[name]) {
                    _this7._ensureDataObjectKey(obj)
                } else {
                    names[name] = true
                }
            })
        }
    }, {
        key: "_findFileItemObj",
        value: function(pathInfo) {
            var _this8 = this;
            if (!Array.isArray(pathInfo)) {
                pathInfo = []
            }
            var currentPath = "";
            var fileItemObj = null;
            var fileItemObjects = this._data;
            var _loop = function(i) {
                fileItemObj = (0, _array.find)(fileItemObjects, function(item) {
                    var hasCorrectFileItemType = _this8._isDirGetter(item) || i === pathInfo.length - 1;
                    return _this8._getKeyFromDataObject(item, currentPath) === pathInfo[i].key && _this8._nameGetter(item) === pathInfo[i].name && hasCorrectFileItemType
                });
                if (fileItemObj) {
                    currentPath = (0, _uiFile_manager2.pathCombine)(currentPath, _this8._nameGetter(fileItemObj));
                    fileItemObjects = _this8._subFileItemsGetter(fileItemObj)
                }
            };
            for (var i = 0; i < pathInfo.length && (0 === i || fileItemObj); i++) {
                _loop(i)
            }
            return fileItemObj
        }
    }, {
        key: "_getKeyFromDataObject",
        value: function(dataObj, defaultKeyPrefix) {
            var key = this._keyGetter(dataObj);
            var relativeName = (0, _uiFile_manager2.pathCombine)(defaultKeyPrefix, this._nameGetter(dataObj));
            return this._getDataObjectKey(key, relativeName)
        }
    }, {
        key: "_getDataObjectKey",
        value: function(key, relativeName) {
            return key ? key : relativeName
        }
    }, {
        key: "_ensureDataObjectKey",
        value: function(dataObj) {
            var key = this._keyGetter(dataObj);
            if (!key) {
                key = String(new _guid2.default);
                this._keySetter(dataObj, key)
            }
            return key
        }
    }, {
        key: "_updateHasSubDirs",
        value: function(dir) {
            if (dir && !dir.isRoot) {
                dir.hasSubDirs = this._hasSubDirs(dir.dataItem)
            }
        }
    }, {
        key: "_hasSubDirs",
        value: function(dataObj) {
            var subItems = (0, _common.ensureDefined)(this._subFileItemsGetter(dataObj), []);
            if (!Array.isArray(subItems)) {
                return true
            }
            for (var i = 0; i < subItems.length; i++) {
                if (true === this._isDirGetter(subItems[i])) {
                    return true
                }
            }
            return false
        }
    }, {
        key: "_getSetter",
        value: function(expr) {
            return _type2.default.isFunction(expr) ? expr : (0, _data.compileSetter)(expr)
        }
    }, {
        key: "_isFileItemExists",
        value: function(fileItem) {
            return fileItem.isDirectory && fileItem.isRoot || !!this._findFileItemObj(fileItem.getFullPathInfo())
        }
    }]);
    return ArrayFileProvider
}(_file_provider.FileProvider);
module.exports = ArrayFileProvider;
module.exports.default = module.exports;
