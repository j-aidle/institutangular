/**
 * DevExtreme (ui/file_manager/ui.file_manager.file_uploader.js)
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _type = require("../../core/utils/type");
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _file_uploader = require("../file_uploader");
var _file_uploader2 = _interopRequireDefault(_file_uploader);
var _uiFile_manager = require("./ui.file_manager.common");
var _uiFile_manager2 = _interopRequireDefault(_uiFile_manager);

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
var FILE_MANAGER_FILE_UPLOADER_CLASS = "dx-filemanager-fileuploader";
var FileManagerFileUploader = function(_Widget) {
    _inherits(FileManagerFileUploader, _Widget);

    function FileManagerFileUploader() {
        _classCallCheck(this, FileManagerFileUploader);
        return _possibleConstructorReturn(this, (FileManagerFileUploader.__proto__ || Object.getPrototypeOf(FileManagerFileUploader)).apply(this, arguments))
    }
    _createClass(FileManagerFileUploader, [{
        key: "_initMarkup",
        value: function() {
            this._initActions();
            this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);
            this._uploaderInfos = [];
            this._createInternalFileUploader();
            _get(FileManagerFileUploader.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileUploader.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "_createInternalFileUploader",
        value: function() {
            var _this2 = this;
            var chunkSize = this._getController().chunkSize;
            var $fileUploader = (0, _renderer2.default)("<div>").appendTo(this.$element());
            var fileUploader = this._createComponent($fileUploader, _file_uploader2.default, {
                name: "file",
                multiple: true,
                showFileList: false,
                activeStateEnabled: false,
                focusStateEnabled: false,
                hoverStateEnabled: false,
                labelText: "",
                readyToUploadMessage: "",
                accept: "*",
                chunkSize: chunkSize,
                onValueChanged: function(e) {
                    return _this2._onFileUploaderValueChanged(e)
                },
                onProgress: function(e) {
                    return _this2._onFileUploaderProgress(e)
                },
                onUploaded: function(e) {
                    return _this2._onFileUploaderUploaded(e)
                },
                onUploadAborted: function(e) {
                    return _this2._onFileUploaderUploadAborted(e)
                },
                onUploadError: function(e) {
                    return _this2._onFileUploaderUploadError(e)
                }
            });
            fileUploader.option({
                uploadChunk: function(file, chunksData) {
                    return _this2._fileUploaderUploadChunk(fileUploader, file, chunksData)
                },
                abortUpload: function(file, chunksData) {
                    return _this2._fileUploaderAbortUpload(fileUploader, file, chunksData)
                }
            });
            var uploaderInfo = {
                fileUploader: fileUploader
            };
            this._uploaderInfos.push(uploaderInfo)
        }
    }, {
        key: "tryUpload",
        value: function() {
            var info = this._findAvailableUploaderInfo();
            if (info) {
                info.fileUploader._selectButtonClickHandler()
            }
        }
    }, {
        key: "cancelUpload",
        value: function(sessionId) {
            this._cancelUpload(sessionId)
        }
    }, {
        key: "cancelFileUpload",
        value: function(sessionId, fileIndex) {
            this._cancelUpload(sessionId, fileIndex)
        }
    }, {
        key: "_cancelUpload",
        value: function(sessionId, fileIndex) {
            var _findUploaderInfoBySe = this._findUploaderInfoBySessionId(sessionId),
                fileUploader = _findUploaderInfoBySe.fileUploader;
            var files = (0, _type.isDefined)(fileIndex) ? [fileUploader._files[fileIndex]] : fileUploader._files;
            fileUploader._preventFilesUploading(files)
        }
    }, {
        key: "_fileUploaderUploadChunk",
        value: function(fileUploader, file, chunksInfo) {
            var _findSessionByFile2 = this._findSessionByFile(fileUploader, file),
                session = _findSessionByFile2.session,
                fileIndex = _findSessionByFile2.fileIndex;
            var controller = session.controller;
            chunksInfo.fileIndex = fileIndex;
            return controller.uploadFileChunk(file, chunksInfo)
        }
    }, {
        key: "_fileUploaderAbortUpload",
        value: function(fileUploader, file, chunksInfo) {
            var _findSessionByFile3 = this._findSessionByFile(fileUploader, file),
                session = _findSessionByFile3.session,
                fileIndex = _findSessionByFile3.fileIndex;
            var controller = session.controller;
            chunksInfo.fileIndex = fileIndex;
            return controller.abortFileUpload(file, chunksInfo)
        }
    }, {
        key: "_onFileUploaderValueChanged",
        value: function(_ref) {
            var _this3 = this;
            var component = _ref.component,
                value = _ref.value;
            if (0 === value.length) {
                return
            }
            var files = value.slice();
            var uploaderInfo = this._findUploaderInfo(component);
            this._uploadFiles(uploaderInfo, files);
            setTimeout(function() {
                if (!_this3._findAvailableUploaderInfo()) {
                    _this3._createInternalFileUploader()
                }
            })
        }
    }, {
        key: "_onFileUploaderProgress",
        value: function(_ref2) {
            var component = _ref2.component,
                file = _ref2.file,
                bytesLoaded = _ref2.bytesLoaded,
                bytesTotal = _ref2.bytesTotal;
            var _findSessionByFile4 = this._findSessionByFile(component, file),
                session = _findSessionByFile4.session,
                fileIndex = _findSessionByFile4.fileIndex;
            var fileValue = 0 !== bytesTotal ? bytesLoaded / bytesTotal : 1;
            var commonValue = component.option("progress") / 100;
            var args = {
                sessionId: session.id,
                fileIndex: fileIndex,
                commonValue: commonValue,
                fileValue: fileValue
            };
            this._raiseUploadProgress(args)
        }
    }, {
        key: "_onFileUploaderUploaded",
        value: function(_ref3) {
            var component = _ref3.component,
                file = _ref3.file;
            var deferred = this._getDeferredForFile(component, file);
            deferred.resolve()
        }
    }, {
        key: "_onFileUploaderUploadAborted",
        value: function(_ref4) {
            var component = _ref4.component,
                file = _ref4.file;
            var deferred = this._getDeferredForFile(component, file);
            deferred.resolve({
                canceled: true
            })
        }
    }, {
        key: "_onFileUploaderUploadError",
        value: function(_ref5) {
            var component = _ref5.component,
                file = _ref5.file,
                error = _ref5.error;
            var deferred = this._getDeferredForFile(component, file);
            deferred.reject(error)
        }
    }, {
        key: "_uploadFiles",
        value: function(uploaderInfo, files) {
            var sessionId = (new _guid2.default).toString();
            var controller = this._getController();
            var deferreds = files.map(function() {
                return new _deferred.Deferred
            });
            var session = {
                id: sessionId,
                controller: controller,
                files: files,
                deferreds: deferreds
            };
            uploaderInfo.session = session;
            var sessionInfo = {
                sessionId: sessionId,
                deferreds: deferreds,
                files: files
            };
            this._raiseUploadSessionStarted(sessionInfo);
            return (0, _uiFile_manager2.default)(deferreds).always(function() {
                return setTimeout(function() {
                    uploaderInfo.fileUploader.option("value", []);
                    uploaderInfo.session = null
                })
            })
        }
    }, {
        key: "_getDeferredForFile",
        value: function(fileUploader, file) {
            var _findSessionByFile5 = this._findSessionByFile(fileUploader, file),
                session = _findSessionByFile5.session,
                fileIndex = _findSessionByFile5.fileIndex;
            return session.deferreds[fileIndex]
        }
    }, {
        key: "_findSessionByFile",
        value: function(fileUploader, file) {
            var uploaderInfo = this._findUploaderInfo(fileUploader);
            var session = uploaderInfo.session;
            var fileIndex = session.files.indexOf(file);
            return {
                session: session,
                fileIndex: fileIndex
            }
        }
    }, {
        key: "_findUploaderInfoBySessionId",
        value: function(sessionId) {
            for (var i = 0; i < this._uploaderInfos.length; i++) {
                var uploaderInfo = this._uploaderInfos[i];
                var session = uploaderInfo.session;
                if (session && session.id === sessionId) {
                    return uploaderInfo
                }
            }
            return null
        }
    }, {
        key: "_findAvailableUploaderInfo",
        value: function() {
            for (var i = 0; i < this._uploaderInfos.length; i++) {
                var info = this._uploaderInfos[i];
                if (!info.session) {
                    return info
                }
            }
            return null
        }
    }, {
        key: "_findUploaderInfo",
        value: function(fileUploader) {
            for (var i = 0; i < this._uploaderInfos.length; i++) {
                var info = this._uploaderInfos[i];
                if (info.fileUploader === fileUploader) {
                    return info
                }
            }
            return null
        }
    }, {
        key: "_getController",
        value: function() {
            var controllerGetter = this.option("getController");
            return controllerGetter()
        }
    }, {
        key: "_raiseUploadSessionStarted",
        value: function(sessionInfo) {
            this._actions.onUploadSessionStarted({
                sessionInfo: sessionInfo
            })
        }
    }, {
        key: "_raiseUploadProgress",
        value: function(args) {
            this._actions.onUploadProgress(args)
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onUploadSessionStarted: this._createActionByOption("onUploadSessionStarted"),
                onUploadProgress: this._createActionByOption("onUploadProgress")
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerFileUploader.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileUploader.prototype), "_getDefaultOptions", this).call(this), {
                getController: null,
                onUploadSessionStarted: null,
                onUploadProgress: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "getController":
                    this.repaint();
                    break;
                case "onUploadSessionStarted":
                case "onUploadProgress":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerFileUploader.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileUploader.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return FileManagerFileUploader
}(_ui2.default);
module.exports = FileManagerFileUploader;
