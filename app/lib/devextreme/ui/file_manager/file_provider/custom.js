/**
 * DevExtreme (ui/file_manager/file_provider/custom.js)
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
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _common = require("../../../core/utils/common");
var _type = require("../../../core/utils/type");
var _deferred = require("../../../core/utils/deferred");
var _data = require("../../../core/utils/data");
var _file_provider = require("./file_provider");

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
var CustomFileProvider = function(_FileProvider) {
    _inherits(CustomFileProvider, _FileProvider);

    function CustomFileProvider(options) {
        _classCallCheck(this, CustomFileProvider);
        options = (0, _common.ensureDefined)(options, {});
        var _this = _possibleConstructorReturn(this, (CustomFileProvider.__proto__ || Object.getPrototypeOf(CustomFileProvider)).call(this, options));
        _this._hasSubDirsGetter = (0, _data.compileGetter)(options.hasSubDirectoriesExpr || "hasSubDirectories");
        _this._getItemsFunction = _this._ensureFunction(options.getItems, function() {
            return []
        });
        _this._renameItemFunction = _this._ensureFunction(options.renameItem);
        _this._createDirectoryFunction = _this._ensureFunction(options.createDirectory);
        _this._deleteItemFunction = _this._ensureFunction(options.deleteItem);
        _this._moveItemFunction = _this._ensureFunction(options.moveItem);
        _this._copyItemFunction = _this._ensureFunction(options.copyItem);
        _this._uploadFileChunkFunction = _this._ensureFunction(options.uploadFileChunk);
        _this._abortFileUploadFunction = _this._ensureFunction(options.abortFileUpload);
        _this._downloadItemsFunction = _this._ensureFunction(options.downloadItems);
        _this._getItemsContentFunction = _this._ensureFunction(options.getItemsContent);
        _this._uploadChunkSize = options.uploadChunkSize;
        return _this
    }
    _createClass(CustomFileProvider, [{
        key: "getItems",
        value: function(pathInfo) {
            var _this2 = this;
            return (0, _deferred.when)(this._getItemsFunction(pathInfo)).then(function(dataItems) {
                return _this2._convertDataObjectsToFileItems(dataItems, pathInfo)
            })
        }
    }, {
        key: "renameItem",
        value: function(item, name) {
            return this._renameItemFunction(item, name)
        }
    }, {
        key: "createFolder",
        value: function(parentDir, name) {
            return this._createDirectoryFunction(parentDir, name)
        }
    }, {
        key: "deleteItems",
        value: function(items) {
            var _this3 = this;
            return items.map(function(item) {
                return _this3._deleteItemFunction(item)
            })
        }
    }, {
        key: "moveItems",
        value: function(items, destinationDirectory) {
            var _this4 = this;
            return items.map(function(item) {
                return _this4._moveItemFunction(item, destinationDirectory)
            })
        }
    }, {
        key: "copyItems",
        value: function(items, destinationFolder) {
            var _this5 = this;
            return items.map(function(item) {
                return _this5._copyItemFunction(item, destinationFolder)
            })
        }
    }, {
        key: "uploadFileChunk",
        value: function(fileData, chunksInfo, destinationDirectory) {
            return this._uploadFileChunkFunction(fileData, chunksInfo, destinationDirectory)
        }
    }, {
        key: "abortFileUpload",
        value: function(fileData, chunksInfo, destinationDirectory) {
            return this._abortFileUploadFunction(fileData, chunksInfo, destinationDirectory)
        }
    }, {
        key: "downloadItems",
        value: function(items) {
            return this._downloadItemsFunction(items)
        }
    }, {
        key: "getItemContent",
        value: function(items) {
            return this._getItemsContentFunction(items)
        }
    }, {
        key: "getFileUploadChunkSize",
        value: function() {
            return (0, _common.ensureDefined)(this._uploadChunkSize, _get(CustomFileProvider.prototype.__proto__ || Object.getPrototypeOf(CustomFileProvider.prototype), "getFileUploadChunkSize", this).call(this))
        }
    }, {
        key: "_hasSubDirs",
        value: function(dataObj) {
            var hasSubDirs = this._hasSubDirsGetter(dataObj);
            return "boolean" === typeof hasSubDirs ? hasSubDirs : true
        }
    }, {
        key: "_getKeyExpr",
        value: function(options) {
            return options.keyExpr || "key"
        }
    }, {
        key: "_ensureFunction",
        value: function(functionObject, defaultFunction) {
            defaultFunction = defaultFunction || _common.noop;
            return (0, _type.isFunction)(functionObject) ? functionObject : defaultFunction
        }
    }]);
    return CustomFileProvider
}(_file_provider.FileProvider);
module.exports = CustomFileProvider;
module.exports.default = module.exports;
