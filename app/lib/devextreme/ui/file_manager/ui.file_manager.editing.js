/**
 * DevExtreme (ui/file_manager/ui.file_manager.editing.js)
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
var _iterator = require("../../core/utils/iterator");
var _string = require("../../core/utils/string");
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _uiFile_managerDialog = require("./ui.file_manager.dialog.name_editor");
var _uiFile_managerDialog2 = _interopRequireDefault(_uiFile_managerDialog);
var _uiFile_managerDialog3 = require("./ui.file_manager.dialog.folder_chooser");
var _uiFile_managerDialog4 = _interopRequireDefault(_uiFile_managerDialog3);
var _uiFile_manager = require("./ui.file_manager.file_uploader");
var _uiFile_manager2 = _interopRequireDefault(_uiFile_manager);
var _uiFile_manager3 = require("./ui.file_manager.messages");

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
var FileManagerEditingControl = function(_Widget) {
    _inherits(FileManagerEditingControl, _Widget);

    function FileManagerEditingControl() {
        _classCallCheck(this, FileManagerEditingControl);
        return _possibleConstructorReturn(this, (FileManagerEditingControl.__proto__ || Object.getPrototypeOf(FileManagerEditingControl)).apply(this, arguments))
    }
    _createClass(FileManagerEditingControl, [{
        key: "_initMarkup",
        value: function() {
            _get(FileManagerEditingControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerEditingControl.prototype), "_initMarkup", this).call(this);
            this._initActions();
            this._controller = this.option("controller");
            this._controller.on("EditActionStarting", this._onEditActionStarting.bind(this));
            this._controller.on("EditActionResultAcquired", this._onEditActionResultAcquired.bind(this));
            this._controller.on("EditActionItemError", this._onEditActionItemError.bind(this));
            this._controller.on("EditActionError", this._onEditActionError.bind(this));
            this._controller.on("CompleteEditActionItem", this._onCompleteEditActionItem.bind(this));
            this._controller.on("CompleteEditAction", this._onCompleteEditAction.bind(this));
            this._model = this.option("model");
            this._uploadOperationInfoMap = {};
            this._renameItemDialog = this._createEnterNameDialog(_message2.default.format("dxFileManager-dialogRenameItemTitle"), _message2.default.format("dxFileManager-dialogRenameItemButtonText"));
            this._createFolderDialog = this._createEnterNameDialog(_message2.default.format("dxFileManager-dialogCreateDirectoryTitle"), _message2.default.format("dxFileManager-dialogCreateDirectoryButtonText"));
            var $chooseFolderDialog = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._chooseFolderDialog = this._createComponent($chooseFolderDialog, _uiFile_managerDialog4.default, {
                provider: this._controller._fileProvider,
                getDirectories: this._controller.getDirectories.bind(this._controller),
                getCurrentDirectory: this._controller.getCurrentDirectory.bind(this._controller),
                onClosed: this._onDialogClosed.bind(this)
            });
            this._confirmationDialog = this._createConfirmationDialog();
            this._fileUploader = this._createFileUploader();
            this._createMetadataMap()
        }
    }, {
        key: "_initNotificationControl",
        value: function(notificationControl) {
            var _this2 = this;
            this._notificationControl = notificationControl;
            this._notificationControl.option({
                onOperationCanceled: function(_ref) {
                    var info = _ref.info;
                    return _this2._onCancelUploadSession(info)
                },
                onOperationItemCanceled: function(_ref2) {
                    var item = _ref2.item,
                        itemIndex = _ref2.itemIndex;
                    return _this2._onCancelFileUpload(item, itemIndex)
                }
            })
        }
    }, {
        key: "_getFileUploaderComponent",
        value: function() {
            return _uiFile_manager2.default
        }
    }, {
        key: "_createFileUploader",
        value: function() {
            var _this3 = this;
            var $fileUploader = (0, _renderer2.default)("<div>").appendTo(this.$element());
            return this._createComponent($fileUploader, this._getFileUploaderComponent(), {
                getController: this._getFileUploaderController.bind(this),
                onUploadSessionStarted: function(e) {
                    return _this3._onUploadSessionStarted(e)
                },
                onUploadProgress: function(e) {
                    return _this3._onUploadProgress(e)
                }
            })
        }
    }, {
        key: "_getFileUploaderController",
        value: function() {
            var _this4 = this;
            var uploadDirectory = this._uploadDirectoryInfo && this._uploadDirectoryInfo.fileItem;
            return {
                chunkSize: this._controller.getFileUploadChunkSize(),
                uploadFileChunk: function(fileData, chunksInfo) {
                    return _this4._controller.uploadFileChunk(fileData, chunksInfo, uploadDirectory)
                },
                abortFileUpload: function(fileData, chunksInfo) {
                    return _this4._controller.abortFileUpload(fileData, chunksInfo, uploadDirectory)
                }
            }
        }
    }, {
        key: "_createEnterNameDialog",
        value: function(title, buttonText) {
            var $dialog = (0, _renderer2.default)("<div>").appendTo(this.$element());
            return this._createComponent($dialog, _uiFile_managerDialog2.default, {
                title: title,
                buttonText: buttonText,
                onClosed: this._onDialogClosed.bind(this)
            })
        }
    }, {
        key: "_createConfirmationDialog",
        value: function() {
            var _this5 = this;
            return {
                show: function() {
                    setTimeout(function() {
                        _this5._onDialogClosed({
                            dialogResult: {}
                        })
                    })
                }
            }
        }
    }, {
        key: "_createMetadataMap",
        value: function() {
            var _this6 = this;
            this._metadataMap = {
                create: {
                    action: function(arg) {
                        return _this6._tryCreate(arg)
                    },
                    affectsAllItems: true,
                    singleItemProcessingMessage: _message2.default.format("dxFileManager-editingCreateSingleItemProcessingMessage"),
                    singleItemSuccessMessage: _message2.default.format("dxFileManager-editingCreateSingleItemSuccessMessage"),
                    singleItemErrorMessage: _message2.default.format("dxFileManager-editingCreateSingleItemErrorMessage"),
                    commonErrorMessage: _message2.default.format("dxFileManager-editingCreateCommonErrorMessage")
                },
                rename: {
                    action: function(arg) {
                        return _this6._tryRename(arg)
                    },
                    singleItemProcessingMessage: _message2.default.format("dxFileManager-editingRenameSingleItemProcessingMessage"),
                    singleItemSuccessMessage: _message2.default.format("dxFileManager-editingRenameSingleItemSuccessMessage"),
                    singleItemErrorMessage: _message2.default.format("dxFileManager-editingRenameSingleItemErrorMessage"),
                    commonErrorMessage: _message2.default.format("dxFileManager-editingRenameCommonErrorMessage")
                },
                "delete": {
                    action: function(arg) {
                        return _this6._tryDelete(arg)
                    },
                    singleItemProcessingMessage: _message2.default.format("dxFileManager-editingDeleteSingleItemProcessingMessage"),
                    multipleItemsProcessingMessage: _message2.default.format("dxFileManager-editingDeleteMultipleItemsProcessingMessage"),
                    singleItemSuccessMessage: _message2.default.format("dxFileManager-editingDeleteSingleItemSuccessMessage"),
                    multipleItemsSuccessMessage: _message2.default.format("dxFileManager-editingDeleteMultipleItemsSuccessMessage"),
                    singleItemErrorMessage: _message2.default.format("dxFileManager-editingDeleteSingleItemErrorMessage"),
                    multipleItemsErrorMessage: _message2.default.format("dxFileManager-editingDeleteMultipleItemsErrorMessage"),
                    commonErrorMessage: _message2.default.format("dxFileManager-editingDeleteCommonErrorMessage")
                },
                move: {
                    action: function(arg) {
                        return _this6._tryMove(arg)
                    },
                    singleItemProcessingMessage: _message2.default.format("dxFileManager-editingMoveSingleItemProcessingMessage"),
                    multipleItemsProcessingMessage: _message2.default.format("dxFileManager-editingMoveMultipleItemsProcessingMessage"),
                    singleItemSuccessMessage: _message2.default.format("dxFileManager-editingMoveSingleItemSuccessMessage"),
                    multipleItemsSuccessMessage: _message2.default.format("dxFileManager-editingMoveMultipleItemsSuccessMessage"),
                    singleItemErrorMessage: _message2.default.format("dxFileManager-editingMoveSingleItemErrorMessage"),
                    multipleItemsErrorMessage: _message2.default.format("dxFileManager-editingMoveMultipleItemsErrorMessage"),
                    commonErrorMessage: _message2.default.format("dxFileManager-editingMoveCommonErrorMessage")
                },
                copy: {
                    action: function(arg) {
                        return _this6._tryCopy(arg)
                    },
                    singleItemProcessingMessage: _message2.default.format("dxFileManager-editingCopySingleItemProcessingMessage"),
                    multipleItemsProcessingMessage: _message2.default.format("dxFileManager-editingCopyMultipleItemsProcessingMessage"),
                    singleItemSuccessMessage: _message2.default.format("dxFileManager-editingCopySingleItemSuccessMessage"),
                    multipleItemsSuccessMessage: _message2.default.format("dxFileManager-editingCopyMultipleItemsSuccessMessage"),
                    singleItemErrorMessage: _message2.default.format("dxFileManager-editingCopySingleItemErrorMessage"),
                    multipleItemsErrorMessage: _message2.default.format("dxFileManager-editingCopyMultipleItemsErrorMessage"),
                    commonErrorMessage: _message2.default.format("dxFileManager-editingCopyCommonErrorMessage")
                },
                upload: {
                    action: function() {
                        return _this6._tryUpload()
                    },
                    allowCancel: true,
                    allowItemProgress: true,
                    singleItemProcessingMessage: _message2.default.format("dxFileManager-editingUploadSingleItemProcessingMessage"),
                    multipleItemsProcessingMessage: _message2.default.format("dxFileManager-editingUploadMultipleItemsProcessingMessage"),
                    singleItemSuccessMessage: _message2.default.format("dxFileManager-editingUploadSingleItemSuccessMessage"),
                    multipleItemsSuccessMessage: _message2.default.format("dxFileManager-editingUploadMultipleItemsSuccessMessage"),
                    singleItemErrorMessage: _message2.default.format("dxFileManager-editingUploadSingleItemErrorMessage"),
                    multipleItemsErrorMessage: _message2.default.format("dxFileManager-editingUploadMultipleItemsErrorMessage"),
                    canceledMessage: _message2.default.format("dxFileManager-editingUploadCanceledMessage")
                },
                download: {
                    action: function(arg) {
                        return _this6._download(arg)
                    }
                },
                getItemContent: {
                    action: function(arg) {
                        return _this6._getItemContent(arg)
                    }
                }
            }
        }
    }, {
        key: "getCommandActions",
        value: function() {
            var _this7 = this;
            var result = {};
            (0, _iterator.each)(this._metadataMap, function(name) {
                if (Object.prototype.hasOwnProperty.call(_this7._metadataMap, name)) {
                    result[name] = function(arg) {
                        return _this7._executeAction(name, arg)
                    }
                }
            });
            return result
        }
    }, {
        key: "_executeAction",
        value: function(actionName, arg) {
            var actionMetadata = this._metadataMap[actionName];
            return actionMetadata ? actionMetadata.action(arg) : null
        }
    }, {
        key: "_onCancelUploadSession",
        value: function(info) {
            this._fileUploader.cancelUpload(info.uploadSessionId)
        }
    }, {
        key: "_onCancelFileUpload",
        value: function(item, itemIndex) {
            this._fileUploader.cancelFileUpload(item.info.uploadSessionId, itemIndex)
        }
    }, {
        key: "_onUploadProgress",
        value: function(_ref3) {
            var sessionId = _ref3.sessionId,
                fileIndex = _ref3.fileIndex,
                commonValue = _ref3.commonValue,
                fileValue = _ref3.fileValue;
            var operationInfo = this._uploadOperationInfoMap[sessionId];
            this._notificationControl.updateOperationItemProgress(operationInfo, fileIndex, 100 * fileValue, 100 * commonValue)
        }
    }, {
        key: "_onUploadSessionStarted",
        value: function(_ref4) {
            var sessionInfo = _ref4.sessionInfo;
            this._controller.processUploadSession(sessionInfo, this._uploadDirectoryInfo)
        }
    }, {
        key: "_onEditActionStarting",
        value: function(actionInfo) {
            var actionMetadata = this._metadataMap[actionInfo.name];
            var context = new FileManagerActionContext(actionMetadata, actionInfo.itemInfos, actionInfo.directory);
            var operationInfo = this._notificationControl.addOperation(context.processingMessage, actionMetadata.allowCancel, !actionMetadata.allowItemProgress);
            (0, _extend.extend)(actionInfo.customData, {
                context: context,
                operationInfo: operationInfo
            });
            if ("upload" === actionInfo.name) {
                var sessionId = actionInfo.customData.sessionInfo.sessionId;
                operationInfo.uploadSessionId = sessionId;
                this._uploadOperationInfoMap[sessionId] = operationInfo
            }
        }
    }, {
        key: "_onEditActionResultAcquired",
        value: function(actionInfo) {
            var _this8 = this;
            var _actionInfo$customDat = actionInfo.customData,
                context = _actionInfo$customDat.context,
                operationInfo = _actionInfo$customDat.operationInfo;
            context.singleRequest = actionInfo.singleRequest;
            if (!context.singleRequest) {
                var details = context.itemInfos.map(function(itemInfo) {
                    return _this8._getItemProgressDisplayInfo(itemInfo)
                });
                this._notificationControl.addOperationDetails(operationInfo, details, context.actionMetadata.allowCancel)
            }
        }
    }, {
        key: "_onEditActionError",
        value: function(actionInfo, error) {
            var _actionInfo$customDat2 = actionInfo.customData,
                context = _actionInfo$customDat2.context,
                operationInfo = _actionInfo$customDat2.operationInfo;
            context.singleRequest = actionInfo.singleRequest;
            this._handleActionError(operationInfo, context, error);
            this._completeAction(operationInfo, context)
        }
    }, {
        key: "_onEditActionItemError",
        value: function(actionInfo, info) {
            var _actionInfo$customDat3 = actionInfo.customData,
                context = _actionInfo$customDat3.context,
                operationInfo = _actionInfo$customDat3.operationInfo;
            this._handleActionError(operationInfo, context, info)
        }
    }, {
        key: "_onCompleteEditActionItem",
        value: function(actionInfo, info) {
            var _actionInfo$customDat4 = actionInfo.customData,
                context = _actionInfo$customDat4.context,
                operationInfo = _actionInfo$customDat4.operationInfo;
            if (!info.result || !info.result.canceled) {
                context.completeOperationItem(info.index);
                if (!context.singleRequest) {
                    this._notificationControl.completeOperationItem(operationInfo, info.index, context.commonProgress)
                }
            }
        }
    }, {
        key: "_onCompleteEditAction",
        value: function(actionInfo) {
            var _actionInfo$customDat5 = actionInfo.customData,
                context = _actionInfo$customDat5.context,
                operationInfo = _actionInfo$customDat5.operationInfo;
            this._completeAction(operationInfo, context);
            if ("upload" === actionInfo.name) {
                delete this._uploadOperationInfoMap[actionInfo.customData.sessionInfo.sessionId]
            }
        }
    }, {
        key: "_tryCreate",
        value: function(parentDirectories) {
            var _this9 = this;
            var parentDirectoryInfo = parentDirectories && parentDirectories[0] || this._getCurrentDirectory();
            var newDirName = _message2.default.format("dxFileManager-newDirectoryName");
            return this._showDialog(this._createFolderDialog, newDirName).then(function(_ref5) {
                var name = _ref5.name;
                return _this9._controller.createDirectory(parentDirectoryInfo, name)
            })
        }
    }, {
        key: "_tryRename",
        value: function(itemInfos) {
            var _this10 = this;
            var itemInfo = itemInfos && itemInfos[0] || this._model.getMultipleSelectedItems()[0];
            return this._showDialog(this._renameItemDialog, itemInfo.fileItem.name).then(function(_ref6) {
                var name = _ref6.name;
                return _this10._controller.renameItem(itemInfo, name)
            })
        }
    }, {
        key: "_tryDelete",
        value: function(itemInfos) {
            var _this11 = this;
            itemInfos = itemInfos || this._model.getMultipleSelectedItems();
            return this._showDialog(this._confirmationDialog).then(function() {
                return _this11._controller.deleteItems(itemInfos)
            })
        }
    }, {
        key: "_tryMove",
        value: function(itemInfos) {
            var _this12 = this;
            itemInfos = itemInfos || this._model.getMultipleSelectedItems();
            return this._showDialog(this._chooseFolderDialog).then(function(_ref7) {
                var folder = _ref7.folder;
                return _this12._controller.moveItems(itemInfos, folder)
            })
        }
    }, {
        key: "_tryCopy",
        value: function(itemInfos) {
            var _this13 = this;
            itemInfos = itemInfos || this._model.getMultipleSelectedItems();
            return this._showDialog(this._chooseFolderDialog).then(function(_ref8) {
                var folder = _ref8.folder;
                return _this13._controller.copyItems(itemInfos, folder)
            })
        }
    }, {
        key: "_tryUpload",
        value: function(destinationFolder) {
            this._uploadDirectoryInfo = destinationFolder && destinationFolder[0] || this._getCurrentDirectory();
            this._fileUploader.tryUpload()
        }
    }, {
        key: "_download",
        value: function(itemInfos) {
            itemInfos = itemInfos || this._model.getMultipleSelectedItems();
            return this._controller.downloadItems(itemInfos)
        }
    }, {
        key: "_getItemContent",
        value: function(itemInfos) {
            itemInfos = itemInfos || this._model.getMultipleSelectedItems();
            return this._controller.getItemContent(itemInfos)
        }
    }, {
        key: "_completeAction",
        value: function(operationInfo, context) {
            this._notificationControl.completeOperation(operationInfo, context.completionMessage, !context.success, context.statusText);
            if (context.hasModifiedItems()) {
                this._raiseOnSuccess(context.onlyFiles)
            }
        }
    }, {
        key: "_handleActionError",
        value: function(operationInfo, context, errorInfo) {
            operationInfo.hasError = true;
            if (context.singleRequest) {
                this._handleSingleRequestActionError(operationInfo, context, errorInfo)
            } else {
                this._handleMultipleRequestActionError(operationInfo, context, errorInfo)
            }
        }
    }, {
        key: "_handleSingleRequestActionError",
        value: function(operationInfo, context, errorInfo) {
            var itemInfo = context.getItemForSingleRequestError();
            var errorText = this._getErrorText(errorInfo, itemInfo);
            context.processSingleRequestError(errorText);
            var operationErrorInfo = this._getOperationErrorInfo(context);
            this._notificationControl.completeSingleOperationWithError(operationInfo, operationErrorInfo);
            if (context.multipleItems) {
                this._raiseOnSuccess(context.onlyFiles)
            }
        }
    }, {
        key: "_handleMultipleRequestActionError",
        value: function(operationInfo, context, errorInfo) {
            var itemInfo = context.getItemForMultipleRequestError(errorInfo.index);
            var errorText = this._getErrorText(errorInfo, itemInfo);
            context.processMultipleRequestError(errorInfo.index, errorText);
            var operationErrorInfo = this._getOperationErrorInfo(context);
            this._notificationControl.addOperationDetailsError(operationInfo, operationErrorInfo)
        }
    }, {
        key: "_getOperationErrorInfo",
        value: function(context) {
            var detailError = context.errorState.currentDetailError;
            return {
                commonErrorText: context.errorState.commonErrorText,
                item: detailError.itemInfo ? this._getItemProgressDisplayInfo(detailError.itemInfo) : null,
                itemIndex: detailError.itemIndex,
                detailErrorText: detailError.errorText
            }
        }
    }, {
        key: "_getErrorText",
        value: function(errorInfo, itemInfo) {
            var itemName = itemInfo ? itemInfo.fileItem.name : null;
            return _uiFile_manager3.FileManagerMessages.get(errorInfo.errorId, itemName)
        }
    }, {
        key: "_getItemProgressDisplayInfo",
        value: function(itemInfo) {
            return {
                commonText: itemInfo.fileItem.name,
                imageUrl: this._getItemThumbnail(itemInfo)
            }
        }
    }, {
        key: "_showDialog",
        value: function(dialog, dialogArgument) {
            this._dialogDeferred = new _deferred.Deferred;
            dialog.show(dialogArgument);
            return this._dialogDeferred.promise()
        }
    }, {
        key: "_onDialogClosed",
        value: function(e) {
            var result = e.dialogResult;
            if (result) {
                this._dialogDeferred.resolve(result)
            } else {
                this._dialogDeferred.reject()
            }
        }
    }, {
        key: "_getItemThumbnail",
        value: function(item) {
            var itemThumbnailGetter = this.option("getItemThumbnail");
            if (!itemThumbnailGetter) {
                return null
            }
            var info = itemThumbnailGetter(item);
            return info ? info.thumbnail : null
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onSuccess: this._createActionByOption("onSuccess"),
                onError: this._createActionByOption("onError"),
                onCreating: this._createActionByOption("onCreating")
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerEditingControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerEditingControl.prototype), "_getDefaultOptions", this).call(this), {
                model: {
                    getMultipleSelectedItems: null
                },
                notificationControl: null,
                getItemThumbnail: null,
                onSuccess: null,
                onError: null,
                onCreating: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "model":
                    this.repaint();
                    break;
                case "notificationControl":
                    this._initNotificationControl(args.value);
                    break;
                case "getItemThumbnail":
                    break;
                case "onSuccess":
                case "onError":
                case "onCreating":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerEditingControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerEditingControl.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_raiseOnSuccess",
        value: function(updatedOnlyFiles) {
            this._actions.onSuccess({
                updatedOnlyFiles: updatedOnlyFiles
            })
        }
    }, {
        key: "_raiseOnError",
        value: function(errorId, fileItem) {
            var fileItemName = fileItem ? fileItem.name : null;
            var message = _uiFile_manager3.FileManagerMessages.get(errorId, fileItemName);
            this._actions.onError({
                message: message
            })
        }
    }, {
        key: "_getCurrentDirectory",
        value: function() {
            return this._controller.getCurrentDirectory()
        }
    }]);
    return FileManagerEditingControl
}(_ui2.default);
var FileManagerActionContext = function() {
    function FileManagerActionContext(actionMetadata, itemInfos, directoryInfo) {
        _classCallCheck(this, FileManagerActionContext);
        this._actionMetadata = actionMetadata;
        this._itemInfos = itemInfos;
        this._onlyFiles = !this._actionMetadata.affectsAllItems && this._itemInfos.every(function(info) {
            return !info.fileItem.isDirectory
        });
        this._items = this._itemInfos.map(function(itemInfo) {
            return itemInfo.fileItem
        });
        this._multipleItems = this._items.length > 1;
        this._location = directoryInfo.fileItem.name;
        this._singleRequest = true;
        this._completedItems = [];
        this._commonProgress = 0;
        this._errorState = {
            failedCount: 0
        }
    }
    _createClass(FileManagerActionContext, [{
        key: "completeOperationItem",
        value: function(itemIndex) {
            if (this._singleRequest) {
                this._completedItems = [].concat(_toConsumableArray(this._items))
            } else {
                var item = this._items[itemIndex];
                this._completedItems.push(item)
            }
            if (!this._actionMetadata.allowItemProgress) {
                this._commonProgress = this._completedItems.length / this._items.length * 100
            }
        }
    }, {
        key: "processSingleRequestError",
        value: function(errorText) {
            this._errorState.failedCount = 1;
            this._errorState.commonErrorText = this._multipleItems ? this._actionMetadata.commonErrorMessage : this._actionMetadata.singleItemErrorMessage;
            var itemIndex = this._multipleItems ? -1 : 1;
            var itemInfo = this.getItemForSingleRequestError();
            this._setCurrentDetailError(itemIndex, itemInfo, errorText)
        }
    }, {
        key: "processMultipleRequestError",
        value: function(itemIndex, errorText) {
            this._errorState.failedCount++;
            this._errorState.commonErrorText = this._errorState.failedCount > 1 ? (0, _string.format)(this._actionMetadata.multipleItemsErrorMessage, this._errorState.failedCount) : this._actionMetadata.singleItemErrorMessage;
            var itemInfo = this.getItemForMultipleRequestError(itemIndex);
            this._setCurrentDetailError(itemIndex, itemInfo, errorText)
        }
    }, {
        key: "hasModifiedItems",
        value: function() {
            return this._hasCompletedItems() || this._singleRequest && !this.success && this._multipleItems
        }
    }, {
        key: "getItemForSingleRequestError",
        value: function() {
            return this._multipleItems ? null : this._itemInfos[0]
        }
    }, {
        key: "getItemForMultipleRequestError",
        value: function(itemIndex) {
            return this._itemInfos[itemIndex]
        }
    }, {
        key: "_setCurrentDetailError",
        value: function(itemIndex, itemInfo, errorText) {
            this._errorState.currentDetailError = {
                itemIndex: itemIndex,
                itemInfo: itemInfo,
                errorText: errorText
            }
        }
    }, {
        key: "_hasCompletedItems",
        value: function() {
            return this._completedItems.length > 0
        }
    }, {
        key: "actionMetadata",
        get: function() {
            return this._actionMetadata
        }
    }, {
        key: "itemInfos",
        get: function() {
            return this._itemInfos
        }
    }, {
        key: "errorState",
        get: function() {
            return this._errorState
        }
    }, {
        key: "singleRequest",
        get: function() {
            return this._singleRequest
        },
        set: function(value) {
            this._singleRequest = value
        }
    }, {
        key: "multipleItems",
        get: function() {
            return this._multipleItems
        }
    }, {
        key: "onlyFiles",
        get: function() {
            return this._onlyFiles
        }
    }, {
        key: "processingMessage",
        get: function() {
            return this._multipleItems ? (0, _string.format)(this._actionMetadata.multipleItemsProcessingMessage, this._items.length, this._location) : (0, _string.format)(this._actionMetadata.singleItemProcessingMessage, this._location)
        }
    }, {
        key: "successMessage",
        get: function() {
            if (this._hasCompletedItems()) {
                return this._multipleItems ? (0, _string.format)(this._actionMetadata.multipleItemsSuccessMessage, this._completedItems.length, this._location) : (0, _string.format)(this._actionMetadata.singleItemSuccessMessage, this._location)
            } else {
                return this._multipleItems ? (0, _string.format)(this._actionMetadata.multipleItemsErrorMessage, this._items.length) : this._actionMetadata.singleItemErrorMessage
            }
        }
    }, {
        key: "completionMessage",
        get: function() {
            return this.success ? this.successMessage : this.errorState.commonErrorText
        }
    }, {
        key: "statusText",
        get: function() {
            return this.success && !this._hasCompletedItems() ? this._actionMetadata.canceledMessage : void 0
        }
    }, {
        key: "commonProgress",
        get: function() {
            return this._commonProgress
        }
    }, {
        key: "success",
        get: function() {
            return !this._errorState.failedCount
        }
    }]);
    return FileManagerActionContext
}();
module.exports = FileManagerEditingControl;
