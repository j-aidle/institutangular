/**
 * DevExtreme (ui/file_uploader.js)
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
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _guid = require("../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _window = require("../core/utils/window");
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _callbacks = require("../core/utils/callbacks");
var _callbacks2 = _interopRequireDefault(_callbacks);
var _type = require("../core/utils/type");
var _iterator = require("../core/utils/iterator");
var _extend = require("../core/utils/extend");
var _array = require("../core/utils/array");
var _deferred = require("../core/utils/deferred");
var _ajax = require("../core/utils/ajax");
var _ajax2 = _interopRequireDefault(_ajax);
var _editor = require("./editor/editor");
var _editor2 = _interopRequireDefault(_editor);
var _button = require("./button");
var _button2 = _interopRequireDefault(_button);
var _progress_bar = require("./progress_bar");
var _progress_bar2 = _interopRequireDefault(_progress_bar);
var _browser = require("../core/utils/browser");
var _browser2 = _interopRequireDefault(_browser);
var _devices = require("../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _utils = require("../events/utils");
var _utils2 = _interopRequireDefault(_utils);
var _click = require("../events/click");
var _click2 = _interopRequireDefault(_click);
var _message = require("../localization/message");
var _message2 = _interopRequireDefault(_message);
var _themes = require("./themes");
var _themes2 = _interopRequireDefault(_themes);

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
var window = (0, _window.getWindow)();
var FILEUPLOADER_CLASS = "dx-fileuploader",
    FILEUPLOADER_EMPTY_CLASS = "dx-fileuploader-empty",
    FILEUPLOADER_SHOW_FILE_LIST_CLASS = "dx-fileuploader-show-file-list",
    FILEUPLOADER_DRAGOVER_CLASS = "dx-fileuploader-dragover",
    FILEUPLOADER_WRAPPER_CLASS = "dx-fileuploader-wrapper",
    FILEUPLOADER_CONTAINER_CLASS = "dx-fileuploader-container",
    FILEUPLOADER_CONTENT_CLASS = "dx-fileuploader-content",
    FILEUPLOADER_INPUT_WRAPPER_CLASS = "dx-fileuploader-input-wrapper",
    FILEUPLOADER_INPUT_CONTAINER_CLASS = "dx-fileuploader-input-container",
    FILEUPLOADER_INPUT_LABEL_CLASS = "dx-fileuploader-input-label",
    FILEUPLOADER_INPUT_CLASS = "dx-fileuploader-input",
    FILEUPLOADER_FILES_CONTAINER_CLASS = "dx-fileuploader-files-container",
    FILEUPLOADER_FILE_CONTAINER_CLASS = "dx-fileuploader-file-container",
    FILEUPLOADER_FILE_INFO_CLASS = "dx-fileuploader-file-info",
    FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = "dx-fileuploader-file-status-message",
    FILEUPLOADER_FILE_CLASS = "dx-fileuploader-file",
    FILEUPLOADER_FILE_NAME_CLASS = "dx-fileuploader-file-name",
    FILEUPLOADER_FILE_SIZE_CLASS = "dx-fileuploader-file-size",
    FILEUPLOADER_BUTTON_CLASS = "dx-fileuploader-button",
    FILEUPLOADER_BUTTON_CONTAINER_CLASS = "dx-fileuploader-button-container",
    FILEUPLOADER_CANCEL_BUTTON_CLASS = "dx-fileuploader-cancel-button",
    FILEUPLOADER_UPLOAD_BUTTON_CLASS = "dx-fileuploader-upload-button",
    FILEUPLOADER_INVALID_CLASS = "dx-fileuploader-invalid",
    FILEUPLOADER_AFTER_LOAD_DELAY = 400,
    FILEUPLOADER_CHUNK_META_DATA_NAME = "chunkMetadata";
var renderFileUploaderInput = function() {
    return (0, _renderer2.default)("<input>").attr("type", "file")
};
var isFormDataSupported = function() {
    return !!window.FormData
};
var FileUploader = function(_Editor) {
    _inherits(FileUploader, _Editor);

    function FileUploader() {
        _classCallCheck(this, FileUploader);
        return _possibleConstructorReturn(this, (FileUploader.__proto__ || Object.getPrototypeOf(FileUploader)).apply(this, arguments))
    }
    _createClass(FileUploader, [{
        key: "_supportedKeys",
        value: function() {
            var _this2 = this;
            var click = function(e) {
                e.preventDefault();
                var $selectButton = _this2._selectButton.$element();
                _events_engine2.default.trigger($selectButton, _click2.default.name)
            };
            return (0, _extend.extend)(_get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_supportedKeys", this).call(this), {
                space: click,
                enter: click
            })
        }
    }, {
        key: "_setOptionsByReference",
        value: function() {
            _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_setOptionsByReference", this).call(this);
            (0, _extend.extend)(this._optionsByReference, {
                value: true
            })
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_getDefaultOptions", this).call(this), {
                chunkSize: 0,
                value: [],
                selectButtonText: _message2.default.format("dxFileUploader-selectFile"),
                uploadButtonText: _message2.default.format("dxFileUploader-upload"),
                labelText: _message2.default.format("dxFileUploader-dropFile"),
                name: "files[]",
                multiple: false,
                accept: "",
                uploadUrl: "/",
                allowCanceling: true,
                showFileList: true,
                progress: 0,
                readyToUploadMessage: _message2.default.format("dxFileUploader-readyToUpload"),
                uploadedMessage: _message2.default.format("dxFileUploader-uploaded"),
                uploadFailedMessage: _message2.default.format("dxFileUploader-uploadFailedMessage"),
                uploadMode: "instantly",
                uploadMethod: "POST",
                uploadHeaders: {},
                onUploadStarted: null,
                onUploaded: null,
                onProgress: null,
                onUploadError: null,
                onUploadAborted: null,
                allowedFileExtensions: [],
                maxFileSize: 0,
                minFileSize: 0,
                invalidFileExtensionMessage: _message2.default.format("dxFileUploader-invalidFileExtension"),
                invalidMaxFileSizeMessage: _message2.default.format("dxFileUploader-invalidMaxFileSize"),
                invalidMinFileSizeMessage: _message2.default.format("dxFileUploader-invalidMinFileSize"),
                extendSelection: true,
                validationMessageMode: "always",
                uploadFile: null,
                uploadChunk: null,
                abortUpload: null,
                validationMessageOffset: {
                    h: 0,
                    v: 0
                },
                useNativeInputClick: false,
                useDragOver: true,
                nativeDropSupported: true,
                _uploadButtonType: "normal"
            })
        }
    }, {
        key: "_defaultOptionsRules",
        value: function() {
            return _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_defaultOptionsRules", this).call(this).concat([{
                device: function() {
                    return "desktop" === _devices2.default.real().deviceType && !_devices2.default.isSimulator()
                },
                options: {
                    focusStateEnabled: true
                }
            }, {
                device: [{
                    platform: "android"
                }],
                options: {
                    validationMessageOffset: {
                        v: 0
                    }
                }
            }, {
                device: function() {
                    return "desktop" !== _devices2.default.real().deviceType
                },
                options: {
                    useDragOver: false
                }
            }, {
                device: function() {
                    return !isFormDataSupported()
                },
                options: {
                    uploadMode: "useForm"
                }
            }, {
                device: function() {
                    return _browser2.default.msie || "desktop" !== _devices2.default.real().deviceType
                },
                options: {
                    nativeDropSupported: false
                }
            }, {
                device: function() {
                    return _themes2.default.isMaterial()
                },
                options: {
                    _uploadButtonType: "default"
                }
            }])
        }
    }, {
        key: "_init",
        value: function() {
            _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_init", this).call(this);
            this._initFileInput();
            this._initLabel();
            this._setUploadStrategy();
            this._createFiles();
            this._createUploadStartedAction();
            this._createUploadedAction();
            this._createProgressAction();
            this._createUploadErrorAction();
            this._createUploadAbortedAction()
        }
    }, {
        key: "_setUploadStrategy",
        value: function() {
            var strategy = null;
            if (this.option("chunkSize") > 0) {
                var uploadChunk = this.option("uploadChunk");
                strategy = uploadChunk && (0, _type.isFunction)(uploadChunk) ? new CustomChunksFileUploadStrategy(this) : new DefaultChunksFileUploadStrategy(this)
            } else {
                var uploadFile = this.option("uploadFile");
                strategy = uploadFile && (0, _type.isFunction)(uploadFile) ? new CustomWholeFileUploadStrategy(this) : new DefaultWholeFileUploadStrategy(this)
            }
            this._uploadStrategy = strategy
        }
    }, {
        key: "_initFileInput",
        value: function() {
            var _this3 = this;
            this._isCustomClickEvent = false;
            if (!this._$fileInput) {
                this._$fileInput = renderFileUploaderInput();
                _events_engine2.default.on(this._$fileInput, "change", this._inputChangeHandler.bind(this));
                _events_engine2.default.on(this._$fileInput, "click", function(e) {
                    e.stopPropagation();
                    return _this3.option("useNativeInputClick") || _this3._isCustomClickEvent
                })
            }
            this._$fileInput.prop({
                multiple: this.option("multiple"),
                accept: this.option("accept"),
                tabIndex: -1
            })
        }
    }, {
        key: "_inputChangeHandler",
        value: function() {
            if (this._doPreventInputChange) {
                return
            }
            var fileName = this._$fileInput.val().replace(/^.*\\/, ""),
                files = this._$fileInput.prop("files");
            if (files && !files.length) {
                return
            }
            var value = files ? this._getFiles(files) : [{
                name: fileName
            }];
            this._changeValue(value);
            if ("instantly" === this.option("uploadMode")) {
                this._uploadFiles()
            }
        }
    }, {
        key: "_shouldFileListBeExtended",
        value: function() {
            return "useForm" !== this.option("uploadMode") && this.option("extendSelection") && this.option("multiple")
        }
    }, {
        key: "_removeDuplicates",
        value: function(files, value) {
            var result = [];
            for (var i = 0; i < value.length; i++) {
                if (!this._isFileInArray(files, value[i])) {
                    result.push(value[i])
                }
            }
            return result
        }
    }, {
        key: "_isFileInArray",
        value: function(files, file) {
            for (var i = 0; i < files.length; i++) {
                var item = files[i];
                if (item.size === file.size && item.name === file.name) {
                    return true
                }
            }
            return false
        }
    }, {
        key: "_changeValue",
        value: function(value) {
            var files = this._shouldFileListBeExtended() ? this.option("value").slice() : [];
            if ("instantly" !== this.option("uploadMode")) {
                value = this._removeDuplicates(files, value)
            }
            this.option("value", files.concat(value))
        }
    }, {
        key: "_getFiles",
        value: function(fileList) {
            var values = [];
            (0, _iterator.each)(fileList, function(_, value) {
                return values.push(value)
            });
            return values
        }
    }, {
        key: "_initLabel",
        value: function() {
            if (!this._$inputLabel) {
                this._$inputLabel = (0, _renderer2.default)("<div>")
            }
            this._$inputLabel.text(this.option("labelText"))
        }
    }, {
        key: "_focusTarget",
        value: function() {
            return this.$element().find("." + FILEUPLOADER_BUTTON_CLASS)
        }
    }, {
        key: "_getSubmitElement",
        value: function() {
            return this._$fileInput
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_initMarkup", this).call(this);
            this.$element().addClass(FILEUPLOADER_CLASS);
            this._renderWrapper();
            this._renderInputWrapper();
            this._renderSelectButton();
            this._renderInputContainer();
            this._renderUploadButton();
            this._preventRecreatingFiles = true
        }
    }, {
        key: "_render",
        value: function() {
            this._preventRecreatingFiles = false;
            this._renderDragEvents();
            this._renderFiles();
            _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_render", this).call(this)
        }
    }, {
        key: "_createFileProgressBar",
        value: function(file) {
            file.progressBar = this._createProgressBar(file.value.size);
            file.progressBar.$element().appendTo(file.$file);
            this._initStatusMessage(file);
            this._initCancelButton(file)
        }
    }, {
        key: "_setStatusMessage",
        value: function(file, key) {
            var _this4 = this;
            setTimeout(function() {
                if (_this4.option("showFileList")) {
                    file.$statusMessage.text(_this4.option(key));
                    file.$statusMessage.css("display", "");
                    file.progressBar.$element().remove()
                }
            }, FILEUPLOADER_AFTER_LOAD_DELAY)
        }
    }, {
        key: "_createFiles",
        value: function() {
            var _this5 = this;
            var value = this.option("value");
            if (this._files && (0 === value.length || !this._shouldFileListBeExtended())) {
                this._preventFilesUploading(this._files);
                this._files = null
            }
            if (!this._files) {
                this._files = []
            }(0, _iterator.each)(value.slice(this._files.length), function(_, value) {
                var file = _this5._createFile(value);
                _this5._validateFile(file);
                _this5._files.push(file)
            })
        }
    }, {
        key: "_preventFilesUploading",
        value: function(files) {
            var _this6 = this;
            files.forEach(function(file) {
                return _this6._uploadStrategy.abortUpload(file)
            })
        }
    }, {
        key: "_validateFile",
        value: function(file) {
            file.isValidFileExtension = this._validateFileExtension(file);
            file.isValidMinSize = this._validateMinFileSize(file);
            file.isValidMaxSize = this._validateMaxFileSize(file)
        }
    }, {
        key: "_validateFileExtension",
        value: function(file) {
            var allowedExtensions = this.option("allowedFileExtensions"),
                fileExtension = file.value.name.substring(file.value.name.lastIndexOf(".")).toLowerCase();
            if (0 === allowedExtensions.length) {
                return true
            }
            for (var i = 0; i < allowedExtensions.length; i++) {
                if (fileExtension === allowedExtensions[i].toLowerCase()) {
                    return true
                }
            }
            return false
        }
    }, {
        key: "_validateMaxFileSize",
        value: function(file) {
            var fileSize = file.value.size,
                maxFileSize = this.option("maxFileSize");
            return maxFileSize > 0 ? fileSize <= maxFileSize : true
        }
    }, {
        key: "_validateMinFileSize",
        value: function(file) {
            var fileSize = file.value.size,
                minFileSize = this.option("minFileSize");
            return minFileSize > 0 ? fileSize >= minFileSize : true
        }
    }, {
        key: "_createUploadStartedAction",
        value: function() {
            this._uploadStartedAction = this._createActionByOption("onUploadStarted")
        }
    }, {
        key: "_createUploadedAction",
        value: function() {
            this._uploadedAction = this._createActionByOption("onUploaded")
        }
    }, {
        key: "_createProgressAction",
        value: function() {
            this._progressAction = this._createActionByOption("onProgress")
        }
    }, {
        key: "_createUploadAbortedAction",
        value: function() {
            this._uploadAbortedAction = this._createActionByOption("onUploadAborted")
        }
    }, {
        key: "_createUploadErrorAction",
        value: function() {
            this._uploadErrorAction = this._createActionByOption("onUploadError")
        }
    }, {
        key: "_createFile",
        value: function(value) {
            return {
                value: value,
                loadedSize: 0,
                onProgress: (0, _callbacks2.default)(),
                onAbort: (0, _callbacks2.default)(),
                onLoad: (0, _callbacks2.default)(),
                onError: (0, _callbacks2.default)(),
                onLoadStart: (0, _callbacks2.default)(),
                isValidFileExtension: true,
                isValidMaxSize: true,
                isValidMinSize: true,
                isValid: function() {
                    return this.isValidFileExtension && this.isValidMaxSize && this.isValidMinSize
                }
            }
        }
    }, {
        key: "_renderFiles",
        value: function() {
            var _this7 = this;
            var value = this.option("value");
            if (!this._$filesContainer) {
                this._$filesContainer = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILES_CONTAINER_CLASS).appendTo(this._$content)
            } else {
                if (!this._shouldFileListBeExtended() || 0 === value.length) {
                    this._$filesContainer.empty()
                }
            }
            var showFileList = this.option("showFileList");
            if (showFileList) {
                (0, _iterator.each)(this._files, function(_, file) {
                    if (!file.$file) {
                        _this7._renderFile(file)
                    }
                })
            }
            this.$element().toggleClass(FILEUPLOADER_SHOW_FILE_LIST_CLASS, showFileList);
            this._toggleFileUploaderEmptyClassName();
            this._updateFileNameMaxWidth();
            this._$validationMessage && this._$validationMessage.dxOverlay("instance").repaint()
        }
    }, {
        key: "_renderFile",
        value: function(file) {
            var value = file.value;
            var $fileContainer = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILE_CONTAINER_CLASS).appendTo(this._$filesContainer);
            this._renderFileButtons(file, $fileContainer);
            file.$file = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILE_CLASS).appendTo($fileContainer);
            var $fileInfo = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILE_INFO_CLASS).appendTo(file.$file);
            file.$statusMessage = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).appendTo(file.$file);
            (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILE_NAME_CLASS).text(value.name).appendTo($fileInfo);
            if ((0, _type.isDefined)(value.size)) {
                (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_FILE_SIZE_CLASS).text(this._getFileSize(value.size)).appendTo($fileInfo)
            }
            if (file.isValid()) {
                file.$statusMessage.text(this.option("readyToUploadMessage"))
            } else {
                if (!file.isValidFileExtension) {
                    file.$statusMessage.append(this._createValidationElement("invalidFileExtensionMessage"))
                }
                if (!file.isValidMaxSize) {
                    file.$statusMessage.append(this._createValidationElement("invalidMaxFileSizeMessage"))
                }
                if (!file.isValidMinSize) {
                    file.$statusMessage.append(this._createValidationElement("invalidMinFileSizeMessage"))
                }
                $fileContainer.addClass(FILEUPLOADER_INVALID_CLASS)
            }
        }
    }, {
        key: "_createValidationElement",
        value: function(key) {
            return (0, _renderer2.default)("<span>").text(this.option(key))
        }
    }, {
        key: "_updateFileNameMaxWidth",
        value: function() {
            var cancelButtonsCount = this.option("allowCanceling") && "useForm" !== this.option("uploadMode") ? 1 : 0,
                uploadButtonsCount = "useButtons" === this.option("uploadMode") ? 1 : 0,
                filesContainerWidth = this._$filesContainer.find("." + FILEUPLOADER_FILE_CONTAINER_CLASS).first().width() || this._$filesContainer.width(),
                $buttonContainer = this._$filesContainer.find("." + FILEUPLOADER_BUTTON_CONTAINER_CLASS).eq(0),
                buttonsWidth = $buttonContainer.width() * (cancelButtonsCount + uploadButtonsCount),
                $fileSize = this._$filesContainer.find("." + FILEUPLOADER_FILE_SIZE_CLASS).eq(0);
            var prevFileSize = $fileSize.text();
            $fileSize.text("1000 Mb");
            var fileSizeWidth = $fileSize.width();
            $fileSize.text(prevFileSize);
            this._$filesContainer.find("." + FILEUPLOADER_FILE_NAME_CLASS).css("maxWidth", filesContainerWidth - buttonsWidth - fileSizeWidth)
        }
    }, {
        key: "_renderFileButtons",
        value: function(file, $container) {
            var $cancelButton = this._getCancelButton(file);
            $cancelButton && $container.append($cancelButton);
            var $uploadButton = this._getUploadButton(file);
            $uploadButton && $container.append($uploadButton)
        }
    }, {
        key: "_getCancelButton",
        value: function(file) {
            var _this8 = this;
            if ("useForm" === this.option("uploadMode")) {
                return null
            }
            file.cancelButton = this._createComponent((0, _renderer2.default)("<div>").addClass(FILEUPLOADER_BUTTON_CLASS + " " + FILEUPLOADER_CANCEL_BUTTON_CLASS), _button2.default, {
                onClick: function() {
                    return _this8._removeFile(file)
                },
                icon: "close",
                visible: this.option("allowCanceling"),
                integrationOptions: {}
            });
            return (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS).append(file.cancelButton.$element())
        }
    }, {
        key: "_getUploadButton",
        value: function(file) {
            var _this9 = this;
            if (!file.isValid() || "useButtons" !== this.option("uploadMode")) {
                return null
            }
            file.uploadButton = this._createComponent((0, _renderer2.default)("<div>").addClass(FILEUPLOADER_BUTTON_CLASS + " " + FILEUPLOADER_UPLOAD_BUTTON_CLASS), _button2.default, {
                onClick: function() {
                    return _this9._uploadFile(file)
                },
                icon: "upload"
            });
            file.onLoadStart.add(function() {
                return file.uploadButton.$element().remove()
            });
            return (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS).append(file.uploadButton.$element())
        }
    }, {
        key: "_removeFile",
        value: function(file) {
            file.$file.parent().remove();
            this._files.splice((0, _array.inArray)(file, this._files), 1);
            var value = this.option("value").slice();
            value.splice((0, _array.inArray)(file.value, value), 1);
            this._preventRecreatingFiles = true;
            this.option("value", value);
            this._preventRecreatingFiles = false;
            this._toggleFileUploaderEmptyClassName();
            this._doPreventInputChange = true;
            this._$fileInput.val("");
            this._doPreventInputChange = false
        }
    }, {
        key: "_toggleFileUploaderEmptyClassName",
        value: function() {
            this.$element().toggleClass(FILEUPLOADER_EMPTY_CLASS, !this._files.length || this._hasInvalidFile(this._files))
        }
    }, {
        key: "_hasInvalidFile",
        value: function(files) {
            for (var i = 0; i < files.length; i++) {
                if (!files[i].isValid()) {
                    return true
                }
            }
            return false
        }
    }, {
        key: "_getFileSize",
        value: function(size) {
            var i = 0;
            var labels = [_message2.default.format("dxFileUploader-bytes"), _message2.default.format("dxFileUploader-kb"), _message2.default.format("dxFileUploader-Mb"), _message2.default.format("dxFileUploader-Gb")],
                count = labels.length - 1;
            while (i < count && size >= 1024) {
                size /= 1024;
                i++
            }
            return Math.round(size) + " " + labels[i]
        }
    }, {
        key: "_renderSelectButton",
        value: function() {
            var $button = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_BUTTON_CLASS).appendTo(this._$inputWrapper);
            this._selectButton = this._createComponent($button, _button2.default, {
                text: this.option("selectButtonText"),
                focusStateEnabled: false,
                integrationOptions: {}
            });
            if ("desktop" === _devices2.default.real().deviceType) {
                this._selectButton.option("onClick", this._selectButtonClickHandler.bind(this))
            } else {
                _events_engine2.default.off($button, "click");
                _events_engine2.default.on($button, "click", this._selectButtonClickHandler.bind(this))
            }
        }
    }, {
        key: "_selectButtonClickHandler",
        value: function() {
            if (this.option("useNativeInputClick")) {
                return
            }
            if (this.option("disabled")) {
                return false
            }
            this._isCustomClickEvent = true;
            _events_engine2.default.trigger(this._$fileInput, "click");
            this._isCustomClickEvent = false
        }
    }, {
        key: "_renderUploadButton",
        value: function() {
            if ("useButtons" !== this.option("uploadMode")) {
                return
            }
            var $uploadButton = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_BUTTON_CLASS).addClass(FILEUPLOADER_UPLOAD_BUTTON_CLASS).appendTo(this._$content);
            this._uploadButton = this._createComponent($uploadButton, _button2.default, {
                text: this.option("uploadButtonText"),
                onClick: this._uploadButtonClickHandler.bind(this),
                type: this.option("_uploadButtonType"),
                integrationOptions: {}
            })
        }
    }, {
        key: "_uploadButtonClickHandler",
        value: function() {
            this._uploadFiles()
        }
    }, {
        key: "_shouldDragOverBeRendered",
        value: function() {
            return "useForm" !== this.option("uploadMode") || this.option("nativeDropSupported")
        }
    }, {
        key: "_renderInputContainer",
        value: function() {
            this._$inputContainer = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_INPUT_CONTAINER_CLASS).appendTo(this._$inputWrapper);
            if (!this._shouldDragOverBeRendered()) {
                this._$inputContainer.css("display", "none")
            }
            this._$fileInput.addClass(FILEUPLOADER_INPUT_CLASS);
            this._renderInput();
            this._$inputLabel.addClass(FILEUPLOADER_INPUT_LABEL_CLASS).appendTo(this._$inputContainer)
        }
    }, {
        key: "_renderInput",
        value: function() {
            if (this.option("useNativeInputClick")) {
                this._selectButton.option("template", this._selectButtonInputTemplate.bind(this))
            } else {
                this._$fileInput.appendTo(this._$inputContainer);
                this._selectButton.option("template", "content")
            }
        }
    }, {
        key: "_selectButtonInputTemplate",
        value: function(data, content) {
            var $content = (0, _renderer2.default)(content);
            var $text = (0, _renderer2.default)("<span>").addClass("dx-button-text").text(data.text);
            $content.append($text).append(this._$fileInput);
            return $content
        }
    }, {
        key: "_renderInputWrapper",
        value: function() {
            this._$inputWrapper = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_INPUT_WRAPPER_CLASS).appendTo(this._$content)
        }
    }, {
        key: "_renderDragEvents",
        value: function() {
            _events_engine2.default.off(this._$inputWrapper, "." + this.NAME);
            if (!this._shouldDragOverBeRendered()) {
                return
            }
            this._dragEventsTargets = [];
            _events_engine2.default.on(this._$inputWrapper, _utils2.default.addNamespace("dragenter", this.NAME), this._dragEnterHandler.bind(this));
            _events_engine2.default.on(this._$inputWrapper, _utils2.default.addNamespace("dragover", this.NAME), this._dragOverHandler.bind(this));
            _events_engine2.default.on(this._$inputWrapper, _utils2.default.addNamespace("dragleave", this.NAME), this._dragLeaveHandler.bind(this));
            _events_engine2.default.on(this._$inputWrapper, _utils2.default.addNamespace("drop", this.NAME), this._dropHandler.bind(this))
        }
    }, {
        key: "_useInputForDrop",
        value: function() {
            return this.option("nativeDropSupported") && "useForm" === this.option("uploadMode")
        }
    }, {
        key: "_dragEnterHandler",
        value: function(e) {
            if (this.option("disabled")) {
                return false
            }
            if (!this._useInputForDrop()) {
                e.preventDefault()
            }
            this._updateEventTargets(e);
            this.$element().addClass(FILEUPLOADER_DRAGOVER_CLASS)
        }
    }, {
        key: "_dragOverHandler",
        value: function(e) {
            if (!this._useInputForDrop()) {
                e.preventDefault()
            }
        }
    }, {
        key: "_dragLeaveHandler",
        value: function(e) {
            if (!this._useInputForDrop()) {
                e.preventDefault()
            }
            this._updateEventTargets(e);
            if (!this._dragEventsTargets.length) {
                this.$element().removeClass(FILEUPLOADER_DRAGOVER_CLASS)
            }
        }
    }, {
        key: "_updateEventTargets",
        value: function(e) {
            var targetIndex = this._dragEventsTargets.indexOf(e.target),
                isTargetExists = targetIndex !== -1;
            if ("dragenter" === e.type) {
                !isTargetExists && this._dragEventsTargets.push(e.target)
            } else {
                isTargetExists && this._dragEventsTargets.splice(targetIndex, 1)
            }
        }
    }, {
        key: "_dropHandler",
        value: function(e) {
            this._dragEventsTargets = [];
            this.$element().removeClass(FILEUPLOADER_DRAGOVER_CLASS);
            if (this._useInputForDrop()) {
                return
            }
            e.preventDefault();
            var fileList = e.originalEvent.dataTransfer.files,
                files = this._getFiles(fileList);
            if (!this.option("multiple") && files.length > 1) {
                return
            }
            this._changeValue(this._filterFiles(files));
            if ("instantly" === this.option("uploadMode")) {
                this._uploadFiles()
            }
        }
    }, {
        key: "_filterFiles",
        value: function(files) {
            if (!files.length) {
                return files
            }
            var accept = this.option("accept");
            if (!accept.length) {
                return files
            }
            var result = [],
                allowedTypes = this._getAllowedFileTypes(accept);
            for (var i = 0, n = files.length; i < n; i++) {
                if (this._isFileTypeAllowed(files[i], allowedTypes)) {
                    result.push(files[i])
                }
            }
            return result
        }
    }, {
        key: "_getAllowedFileTypes",
        value: function(acceptSting) {
            if (!acceptSting.length) {
                return []
            }
            return acceptSting.split(",").map(function(item) {
                return item.trim()
            })
        }
    }, {
        key: "_isFileTypeAllowed",
        value: function(file, allowedTypes) {
            for (var i = 0, n = allowedTypes.length; i < n; i++) {
                var allowedType = allowedTypes[i];
                if ("." === allowedType[0]) {
                    allowedType = allowedType.replace(".", "\\.");
                    if (file.name.match(new RegExp(allowedType + "$", "i"))) {
                        return true
                    }
                } else {
                    allowedType = allowedType.replace("*", "");
                    if (file.type.match(new RegExp(allowedType, "i"))) {
                        return true
                    }
                }
            }
            return false
        }
    }, {
        key: "_renderWrapper",
        value: function() {
            var $wrapper = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_WRAPPER_CLASS).appendTo(this.$element());
            var $container = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_CONTAINER_CLASS).appendTo($wrapper);
            this._$content = (0, _renderer2.default)("<div>").addClass(FILEUPLOADER_CONTENT_CLASS).appendTo($container)
        }
    }, {
        key: "_clean",
        value: function() {
            this._$fileInput.detach();
            delete this._$filesContainer;
            if (this._files) {
                this._files.forEach(function(file) {
                    file.$file = null;
                    file.$statusMessage = null
                })
            }
            _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_clean", this).call(this)
        }
    }, {
        key: "_uploadFiles",
        value: function() {
            var _this10 = this;
            if (isFormDataSupported()) {
                (0, _iterator.each)(this._files, function(_, file) {
                    return _this10._uploadFile(file)
                })
            }
        }
    }, {
        key: "_uploadFile",
        value: function(file) {
            this._uploadStrategy.upload(file)
        }
    }, {
        key: "_updateProgressBar",
        value: function(file, loadedFileData) {
            file.progressBar && file.progressBar.option({
                value: loadedFileData.loaded,
                showStatus: true
            });
            this._progressAction({
                file: file.value,
                segmentSize: loadedFileData.currentSegmentSize,
                bytesLoaded: loadedFileData.loaded,
                bytesTotal: loadedFileData.total,
                event: loadedFileData.event,
                request: file.request
            })
        }
    }, {
        key: "_updateTotalProgress",
        value: function(totalFilesSize, totalLoadedFilesSize) {
            var progress = totalFilesSize ? Math.round(totalLoadedFilesSize / totalFilesSize * 100) : 0;
            this.option("progress", progress);
            this._setLoadedSize(totalLoadedFilesSize)
        }
    }, {
        key: "_initStatusMessage",
        value: function(file) {
            file.$statusMessage.css("display", "none")
        }
    }, {
        key: "_initCancelButton",
        value: function(file) {
            var _this11 = this;
            file.cancelButton.option("onClick", function() {
                _this11._preventFilesUploading([file]);
                _this11._removeFile(file)
            });
            var hideCancelButton = function() {
                setTimeout(function() {
                    file.cancelButton.option({
                        visible: false
                    })
                }, FILEUPLOADER_AFTER_LOAD_DELAY)
            };
            file.onLoad.add(hideCancelButton);
            file.onError.add(hideCancelButton)
        }
    }, {
        key: "_createProgressBar",
        value: function(fileSize) {
            return this._createComponent((0, _renderer2.default)("<div>"), _progress_bar2.default, {
                value: void 0,
                min: 0,
                max: fileSize,
                statusFormat: function(ratio) {
                    return Math.round(100 * ratio) + "%"
                },
                showStatus: false,
                statusPosition: "right"
            })
        }
    }, {
        key: "_getTotalFilesSize",
        value: function() {
            var _this12 = this;
            if (!this._totalFilesSize) {
                this._totalFilesSize = 0;
                (0, _iterator.each)(this._files, function(_, file) {
                    _this12._totalFilesSize += file.value.size
                })
            }
            return this._totalFilesSize
        }
    }, {
        key: "_getTotalLoadedFilesSize",
        value: function() {
            var _this13 = this;
            if (!this._totalLoadedFilesSize) {
                this._totalLoadedFilesSize = 0;
                (0, _iterator.each)(this._files, function(_, file) {
                    _this13._totalLoadedFilesSize += file.loadedSize
                })
            }
            return this._totalLoadedFilesSize
        }
    }, {
        key: "_setLoadedSize",
        value: function(value) {
            this._totalLoadedFilesSize = value
        }
    }, {
        key: "_recalculateProgress",
        value: function() {
            this._totalFilesSize = 0;
            this._totalLoadedFilesSize = 0;
            this._updateTotalProgress(this._getTotalFilesSize(), this._getTotalLoadedFilesSize())
        }
    }, {
        key: "_getValidationMessageTarget",
        value: function() {
            return this._$inputWrapper
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var value = args.value;
            switch (args.name) {
                case "height":
                case "width":
                    this._updateFileNameMaxWidth();
                    _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_optionChanged", this).call(this, args);
                    break;
                case "value":
                    !value.length && this._$fileInput.val("");
                    if (!this._preventRecreatingFiles) {
                        this._createFiles();
                        this._renderFiles()
                    }
                    this._recalculateProgress();
                    _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_optionChanged", this).call(this, args);
                    break;
                case "name":
                    this._initFileInput();
                    _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_optionChanged", this).call(this, args);
                    break;
                case "accept":
                    this._initFileInput();
                    break;
                case "multiple":
                    this._initFileInput();
                    if (!args.value) {
                        this.reset()
                    }
                    break;
                case "selectButtonText":
                    this._selectButton.option("text", value);
                    break;
                case "uploadButtonText":
                    this._uploadButton && this._uploadButton.option("text", value);
                    break;
                case "_uploadButtonType":
                    this._uploadButton && this._uploadButton.option("type", value);
                    break;
                case "maxFileSize":
                case "minFileSize":
                case "allowedFileExtensions":
                case "invalidFileExtensionMessage":
                case "invalidMaxFileSizeMessage":
                case "invalidMinFileSizeMessage":
                case "readyToUploadMessage":
                case "uploadedMessage":
                case "uploadFailedMessage":
                    this._invalidate();
                    break;
                case "labelText":
                    this._$inputLabel.text(value);
                    break;
                case "showFileList":
                    if (!this._preventRecreatingFiles) {
                        this._renderFiles()
                    }
                    break;
                case "uploadFile":
                case "uploadChunk":
                case "chunkSize":
                    this._setUploadStrategy();
                    break;
                case "abortUpload":
                case "uploadUrl":
                case "progress":
                case "uploadMethod":
                case "uploadHeaders":
                case "extendSelection":
                    break;
                case "allowCanceling":
                case "uploadMode":
                    this.reset();
                    this._invalidate();
                    break;
                case "onUploadStarted":
                    this._createUploadStartedAction();
                    break;
                case "onUploaded":
                    this._createUploadedAction();
                    break;
                case "onProgress":
                    this._createProgressAction();
                    break;
                case "onUploadError":
                    this._createUploadErrorAction();
                    break;
                case "onUploadAborted":
                    this._createUploadAbortedAction();
                    break;
                case "useNativeInputClick":
                    this._renderInput();
                    break;
                case "useDragOver":
                    this._renderDragEvents();
                    break;
                case "nativeDropSupported":
                    this._invalidate();
                    break;
                default:
                    _get(FileUploader.prototype.__proto__ || Object.getPrototypeOf(FileUploader.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "reset",
        value: function() {
            this.option("value", [])
        }
    }]);
    return FileUploader
}(_editor2.default);
var FileBlobReader = function() {
    function FileBlobReader(file, chunkSize) {
        _classCallCheck(this, FileBlobReader);
        this.file = file;
        this.chunkSize = chunkSize;
        this.index = 0
    }
    _createClass(FileBlobReader, [{
        key: "read",
        value: function() {
            if (!this.file) {
                return null
            }
            var result = this.createBlobResult(this.file, this.index, this.chunkSize);
            if (result.isCompleted) {
                this.file = null
            }
            this.index++;
            return result
        }
    }, {
        key: "createBlobResult",
        value: function(file, index, chunkSize) {
            var currentPosition = index * chunkSize;
            return {
                blob: this.sliceFile(file, currentPosition, chunkSize),
                index: index,
                isCompleted: currentPosition + chunkSize >= file.size
            }
        }
    }, {
        key: "sliceFile",
        value: function(file, startPos, length) {
            if (file.slice) {
                return file.slice(startPos, startPos + length)
            }
            if (file.webkitSlice) {
                return file.webkitSlice(startPos, startPos + length);
            }
            return null
        }
    }]);
    return FileBlobReader
}();
var FileUploadStrategyBase = function() {
    function FileUploadStrategyBase(fileUploader) {
        _classCallCheck(this, FileUploadStrategyBase);
        this.fileUploader = fileUploader
    }
    _createClass(FileUploadStrategyBase, [{
        key: "upload",
        value: function(file) {
            if (file.isValid() && !file.uploadStarted) {
                this._prepareFileBeforeUpload(file);
                this._uploadCore(file)
            }
        }
    }, {
        key: "abortUpload",
        value: function abortUpload(file) {
            var _this14 = this;
            if (file._isError || file._isLoaded || file.isAborted) {
                return
            }
            file.request && file.request.abort();
            file.isAborted = true;
            if (this._isCustomAbortUpload()) {
                var abortUpload = this.fileUploader.option("abortUpload");
                var arg = this._createAbortUploadArgument(file);
                var deferred = null;
                try {
                    var result = abortUpload(file.value, arg);
                    deferred = (0, _deferred.when)(result)
                } catch (error) {
                    deferred = (new _deferred.Deferred).reject(error).promise()
                }
                deferred.done(function() {
                    return file.onAbort.fire()
                }).fail(function(error) {
                    return _this14._handleFileError(file, error)
                })
            }
        }
    }, {
        key: "_createAbortUploadArgument",
        value: function(file) {}
    }, {
        key: "_uploadCore",
        value: function(file) {}
    }, {
        key: "_isCustomAbortUpload",
        value: function() {
            var callback = this.fileUploader.option("abortUpload");
            return callback && (0, _type.isFunction)(callback)
        }
    }, {
        key: "_handleFileError",
        value: function(file, error) {
            file._isError = true;
            file.onError.fire(error)
        }
    }, {
        key: "_prepareFileBeforeUpload",
        value: function(file) {
            if (file.$file) {
                this.fileUploader._createFileProgressBar(file)
            }
            file.onLoadStart.add(this._onUploadStarted.bind(this, file));
            file.onLoad.add(this._onLoadedHandler.bind(this, file));
            file.onError.add(this._onErrorHandler.bind(this, file));
            file.onAbort.add(this._onAbortHandler.bind(this, file));
            file.onProgress.add(this._onProgressHandler.bind(this, file))
        }
    }, {
        key: "_isStatusError",
        value: function(status) {
            return 400 <= status && status < 500 || 500 <= status && status < 600
        }
    }, {
        key: "_onUploadStarted",
        value: function(file, e) {
            file.uploadStarted = true;
            this.fileUploader._uploadStartedAction({
                file: file.value,
                event: e,
                request: file.request
            })
        }
    }, {
        key: "_onAbortHandler",
        value: function(file, e) {
            this.fileUploader._uploadAbortedAction({
                file: file.value,
                event: e,
                request: file.request
            })
        }
    }, {
        key: "_onErrorHandler",
        value: function(file, error) {
            this.fileUploader._setStatusMessage(file, "uploadFailedMessage");
            this.fileUploader._uploadErrorAction({
                file: file.value,
                event: void 0,
                request: file.request,
                error: error
            })
        }
    }, {
        key: "_onLoadedHandler",
        value: function(file, e) {
            file._isLoaded = true;
            this.fileUploader._setStatusMessage(file, "uploadedMessage");
            this.fileUploader._uploadedAction({
                file: file.value,
                event: e,
                request: file.request
            })
        }
    }, {
        key: "_onProgressHandler",
        value: function(file, e) {
            if (file) {
                var totalFilesSize = this.fileUploader._getTotalFilesSize();
                var totalLoadedFilesSize = this.fileUploader._getTotalLoadedFilesSize();
                var loadedSize = Math.min(e.loaded, file.value.size);
                var segmentSize = loadedSize - file.loadedSize;
                file.loadedSize = loadedSize;
                this.fileUploader._updateTotalProgress(totalFilesSize, totalLoadedFilesSize + segmentSize);
                this.fileUploader._updateProgressBar(file, this._getLoadedData(loadedSize, e.total, segmentSize, e))
            }
        }
    }, {
        key: "_getLoadedData",
        value: function(loaded, total, currentSegmentSize, event) {
            return {
                loaded: loaded,
                total: total,
                currentSegmentSize: currentSegmentSize
            }
        }
    }]);
    return FileUploadStrategyBase
}();
var ChunksFileUploadStrategyBase = function(_FileUploadStrategyBa) {
    _inherits(ChunksFileUploadStrategyBase, _FileUploadStrategyBa);

    function ChunksFileUploadStrategyBase(fileUploader) {
        _classCallCheck(this, ChunksFileUploadStrategyBase);
        var _this15 = _possibleConstructorReturn(this, (ChunksFileUploadStrategyBase.__proto__ || Object.getPrototypeOf(ChunksFileUploadStrategyBase)).call(this, fileUploader));
        _this15.chunkSize = _this15.fileUploader.option("chunkSize");
        return _this15
    }
    _createClass(ChunksFileUploadStrategyBase, [{
        key: "_uploadCore",
        value: function(file) {
            var realFile = file.value;
            var chunksData = {
                name: realFile.name,
                loadedBytes: 0,
                type: realFile.type,
                blobReader: new FileBlobReader(realFile, this.chunkSize),
                guid: new _guid2.default,
                fileSize: realFile.size,
                count: Math.ceil(realFile.size / this.chunkSize),
                customData: {}
            };
            file.chunksData = chunksData;
            this._sendChunk(file, chunksData)
        }
    }, {
        key: "_sendChunk",
        value: function(file, chunksData) {
            var _this16 = this;
            var chunk = chunksData.blobReader.read();
            chunksData.currentChunk = chunk;
            if (chunk) {
                this._sendChunkCore(file, chunksData, chunk).done(function() {
                    if (file.isAborted) {
                        return
                    }
                    chunksData.loadedBytes += chunk.blob.size;
                    file.onProgress.fire({
                        loaded: chunksData.loadedBytes,
                        total: file.value.size
                    });
                    if (chunk.isCompleted) {
                        file.onLoad.fire()
                    }
                    _this16._sendChunk(file, chunksData)
                }).fail(function(error) {
                    if (_this16._shouldHandleError(error)) {
                        _this16._handleFileError(file, error)
                    }
                })
            }
        }
    }, {
        key: "_sendChunkCore",
        value: function(file, chunksData, chunk) {}
    }, {
        key: "_shouldHandleError",
        value: function(error) {}
    }, {
        key: "_tryRaiseStartLoad",
        value: function(file) {
            if (!file.isStartLoad) {
                file.isStartLoad = true;
                file.onLoadStart.fire()
            }
        }
    }, {
        key: "_getEvent",
        value: function(e) {
            return null
        }
    }]);
    return ChunksFileUploadStrategyBase
}(FileUploadStrategyBase);
var DefaultChunksFileUploadStrategy = function(_ChunksFileUploadStra) {
    _inherits(DefaultChunksFileUploadStrategy, _ChunksFileUploadStra);

    function DefaultChunksFileUploadStrategy() {
        _classCallCheck(this, DefaultChunksFileUploadStrategy);
        return _possibleConstructorReturn(this, (DefaultChunksFileUploadStrategy.__proto__ || Object.getPrototypeOf(DefaultChunksFileUploadStrategy)).apply(this, arguments))
    }
    _createClass(DefaultChunksFileUploadStrategy, [{
        key: "_sendChunkCore",
        value: function(file, chunksData, chunk) {
            var _this18 = this;
            return _ajax2.default.sendRequest({
                url: this.fileUploader.option("uploadUrl"),
                method: this.fileUploader.option("uploadMethod"),
                headers: this.fileUploader.option("uploadHeaders"),
                beforeSend: function(xhr) {
                    file.request = xhr
                },
                upload: {
                    onloadstart: function() {
                        return _this18._tryRaiseStartLoad(file)
                    },
                    onabort: function() {
                        return file.onAbort.fire()
                    }
                },
                data: this._createFormData({
                    fileName: chunksData.name,
                    blobName: this.fileUploader.option("name"),
                    blob: chunk.blob,
                    index: chunk.index,
                    count: chunksData.count,
                    type: chunksData.type,
                    guid: chunksData.guid,
                    size: chunksData.fileSize
                })
            })
        }
    }, {
        key: "_shouldHandleError",
        value: function(e) {
            return this._isStatusError(e.status)
        }
    }, {
        key: "_createFormData",
        value: function(options) {
            var formData = new window.FormData;
            formData.append(options.blobName, options.blob);
            formData.append(FILEUPLOADER_CHUNK_META_DATA_NAME, JSON.stringify({
                FileName: options.fileName,
                Index: options.index,
                TotalCount: options.count,
                FileSize: options.size,
                FileType: options.type,
                FileGuid: options.guid
            }));
            return formData
        }
    }]);
    return DefaultChunksFileUploadStrategy
}(ChunksFileUploadStrategyBase);
var CustomChunksFileUploadStrategy = function(_ChunksFileUploadStra2) {
    _inherits(CustomChunksFileUploadStrategy, _ChunksFileUploadStra2);

    function CustomChunksFileUploadStrategy() {
        _classCallCheck(this, CustomChunksFileUploadStrategy);
        return _possibleConstructorReturn(this, (CustomChunksFileUploadStrategy.__proto__ || Object.getPrototypeOf(CustomChunksFileUploadStrategy)).apply(this, arguments))
    }
    _createClass(CustomChunksFileUploadStrategy, [{
        key: "_sendChunkCore",
        value: function(file, chunksData) {
            this._tryRaiseStartLoad(file);
            var chunksInfo = this._createChunksInfo(chunksData);
            var uploadChunk = this.fileUploader.option("uploadChunk");
            try {
                var result = uploadChunk(file.value, chunksInfo);
                return (0, _deferred.when)(result)
            } catch (error) {
                return (new _deferred.Deferred).reject(error).promise()
            }
        }
    }, {
        key: "_createAbortUploadArgument",
        value: function(file) {
            return this._createChunksInfo(file.chunksData)
        }
    }, {
        key: "_shouldHandleError",
        value: function(e) {
            return true
        }
    }, {
        key: "_createChunksInfo",
        value: function(chunksData) {
            return {
                bytesUploaded: chunksData.loadedBytes,
                chunkCount: chunksData.count,
                customData: chunksData.customData,
                chunkBlob: chunksData.currentChunk.blob,
                chunkIndex: chunksData.currentChunk.index
            }
        }
    }]);
    return CustomChunksFileUploadStrategy
}(ChunksFileUploadStrategyBase);
var WholeFileUploadStrategyBase = function(_FileUploadStrategyBa2) {
    _inherits(WholeFileUploadStrategyBase, _FileUploadStrategyBa2);

    function WholeFileUploadStrategyBase() {
        _classCallCheck(this, WholeFileUploadStrategyBase);
        return _possibleConstructorReturn(this, (WholeFileUploadStrategyBase.__proto__ || Object.getPrototypeOf(WholeFileUploadStrategyBase)).apply(this, arguments))
    }
    _createClass(WholeFileUploadStrategyBase, [{
        key: "_uploadCore",
        value: function(file) {
            var _this21 = this;
            file.loadedSize = 0;
            this._uploadFile(file).done(function() {
                if (!file.isAborted) {
                    file.onLoad.fire()
                }
            }).fail(function(error) {
                if (_this21._shouldHandleError(file, error)) {
                    _this21._handleFileError(file, error)
                }
            })
        }
    }, {
        key: "_uploadFile",
        value: function(file) {}
    }, {
        key: "_shouldHandleError",
        value: function(file, e) {}
    }, {
        key: "_handleProgress",
        value: function(file, e) {
            if (file._isError) {
                return
            }
            file._isProgressStarted = true;
            file.onProgress.fire(e)
        }
    }, {
        key: "_getLoadedData",
        value: function(loaded, total, segmentSize, event) {
            var result = _get(WholeFileUploadStrategyBase.prototype.__proto__ || Object.getPrototypeOf(WholeFileUploadStrategyBase.prototype), "_getLoadedData", this).call(this, loaded, total, segmentSize, event);
            result.event = event;
            return result
        }
    }]);
    return WholeFileUploadStrategyBase
}(FileUploadStrategyBase);
var DefaultWholeFileUploadStrategy = function(_WholeFileUploadStrat) {
    _inherits(DefaultWholeFileUploadStrategy, _WholeFileUploadStrat);

    function DefaultWholeFileUploadStrategy() {
        _classCallCheck(this, DefaultWholeFileUploadStrategy);
        return _possibleConstructorReturn(this, (DefaultWholeFileUploadStrategy.__proto__ || Object.getPrototypeOf(DefaultWholeFileUploadStrategy)).apply(this, arguments))
    }
    _createClass(DefaultWholeFileUploadStrategy, [{
        key: "_uploadFile",
        value: function(file) {
            var _this23 = this;
            return _ajax2.default.sendRequest({
                url: this.fileUploader.option("uploadUrl"),
                method: this.fileUploader.option("uploadMethod"),
                headers: this.fileUploader.option("uploadHeaders"),
                beforeSend: function(xhr) {
                    file.request = xhr
                },
                upload: {
                    onprogress: function(e) {
                        return _this23._handleProgress(file, e)
                    },
                    onloadstart: function() {
                        return file.onLoadStart.fire()
                    },
                    onabort: function() {
                        return file.onAbort.fire()
                    }
                },
                data: this._createFormData(this.fileUploader.option("name"), file.value)
            })
        }
    }, {
        key: "_shouldHandleError",
        value: function(file, e) {
            return this._isStatusError(e.status) || !file._isProgressStarted
        }
    }, {
        key: "_createFormData",
        value: function(fieldName, fieldValue) {
            var formData = new window.FormData;
            formData.append(fieldName, fieldValue);
            return formData
        }
    }]);
    return DefaultWholeFileUploadStrategy
}(WholeFileUploadStrategyBase);
var CustomWholeFileUploadStrategy = function(_WholeFileUploadStrat2) {
    _inherits(CustomWholeFileUploadStrategy, _WholeFileUploadStrat2);

    function CustomWholeFileUploadStrategy() {
        _classCallCheck(this, CustomWholeFileUploadStrategy);
        return _possibleConstructorReturn(this, (CustomWholeFileUploadStrategy.__proto__ || Object.getPrototypeOf(CustomWholeFileUploadStrategy)).apply(this, arguments))
    }
    _createClass(CustomWholeFileUploadStrategy, [{
        key: "_uploadFile",
        value: function(file) {
            var _this25 = this;
            file.onLoadStart.fire();
            var progressCallback = function(loadedBytes) {
                var arg = {
                    loaded: loadedBytes,
                    total: file.size
                };
                _this25._handleProgress(file, arg)
            };
            var uploadFile = this.fileUploader.option("uploadFile");
            try {
                var result = uploadFile(file, progressCallback);
                return (0, _deferred.when)(result)
            } catch (error) {
                return (new _deferred.Deferred).reject(error).promise()
            }
        }
    }, {
        key: "_shouldHandleError",
        value: function(file, e) {
            return true
        }
    }]);
    return CustomWholeFileUploadStrategy
}(WholeFileUploadStrategyBase);
(0, _component_registrator2.default)("dxFileUploader", FileUploader);
module.exports = FileUploader;
module.exports.default = module.exports;
