/**
 * DevExtreme (ui/file_manager/ui.file_manager.notification.progress_panel.js)
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
var _common = require("../../core/utils/common");
var _icon = require("../../core/utils/icon");
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _progress_bar = require("../progress_bar");
var _progress_bar2 = _interopRequireDefault(_progress_bar);
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);
var _ui3 = require("../scroll_view/ui.scroll_view");
var _ui4 = _interopRequireDefault(_ui3);

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
var FILE_MANAGER_PROGRESS_PANEL_CLASS = "dx-filemanager-progress-panel";
var FILE_MANAGER_PROGRESS_PANEL_CONTAINER_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-container";
var FILE_MANAGER_PROGRESS_PANEL_TITLE_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-title";
var FILE_MANAGER_PROGRESS_PANEL_TITLE_TEXT_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-title-text";
var FILE_MANAGER_PROGRESS_PANEL_CLOSE_BUTTON_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-close-button";
var FILE_MANAGER_PROGRESS_PANEL_INFOS_CONTAINER_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-infos-container";
var FILE_MANAGER_PROGRESS_PANEL_SEPARATOR_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-separator";
var FILE_MANAGER_PROGRESS_PANEL_INFO_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-info";
var FILE_MANAGER_PROGRESS_PANEL_COMMON_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-common";
var FILE_MANAGER_PROGRESS_PANEL_INFO_WITH_DETAILS_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-info-with-details";
var FILE_MANAGER_PROGRESS_PANEL_DETAILS_CLASS = FILE_MANAGER_PROGRESS_PANEL_CLASS + "-details";
var FILE_MANAGER_PROGRESS_BOX_CLASS = "dx-filemanager-progress-box";
var FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-error";
var FILE_MANAGER_PROGRESS_BOX_WITHOUT_CLOSE_BUTTON_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-without-close-button";
var FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-image";
var FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-wrapper";
var FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-common";
var FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-progress-bar";
var FILE_MANAGER_PROGRESS_BOX_CLOSE_BUTTON_CLASS = FILE_MANAGER_PROGRESS_BOX_CLASS + "-close-button";
var FileManagerProgressPanel = function(_Widget) {
    _inherits(FileManagerProgressPanel, _Widget);

    function FileManagerProgressPanel() {
        _classCallCheck(this, FileManagerProgressPanel);
        return _possibleConstructorReturn(this, (FileManagerProgressPanel.__proto__ || Object.getPrototypeOf(FileManagerProgressPanel)).apply(this, arguments))
    }
    _createClass(FileManagerProgressPanel, [{
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            _get(FileManagerProgressPanel.prototype.__proto__ || Object.getPrototypeOf(FileManagerProgressPanel.prototype), "_initMarkup", this).call(this);
            this._initActions();
            this._operationCount = 0;
            this.$element().addClass(FILE_MANAGER_PROGRESS_PANEL_CLASS);
            var $scrollView = (0, _renderer2.default)("<div>").appendTo(this.$element());
            var $container = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_CONTAINER_CLASS).appendTo($scrollView);
            this._scrollView = this._createComponent($scrollView, _ui4.default, {
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "onScroll"
            });
            var $title = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_TITLE_CLASS).appendTo($container);
            (0, _renderer2.default)("<div>").text(_message2.default.format("dxFileManager-notificationProgressPanelTitle")).addClass(FILE_MANAGER_PROGRESS_PANEL_TITLE_TEXT_CLASS).appendTo($title);
            var $closeButton = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_CLOSE_BUTTON_CLASS).appendTo($title);
            this._createComponent($closeButton, _button2.default, {
                icon: "close",
                stylingMode: "text",
                onClick: function() {
                    return _this2._raisePanelClosed()
                }
            });
            this._$infosContainer = (0, _renderer2.default)("<div>").text(_message2.default.format("dxFileManager-notificationProgressPanelEmptyListText")).addClass(FILE_MANAGER_PROGRESS_PANEL_INFOS_CONTAINER_CLASS).appendTo($container)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerProgressPanel.prototype.__proto__ || Object.getPrototypeOf(FileManagerProgressPanel.prototype), "_getDefaultOptions", this).call(this), {
                onOperationClosed: null,
                onOperationCanceled: null,
                onOperationItemCanceled: null,
                onPanelClosed: null
            })
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onOperationClosed: this._createActionByOption("onOperationClosed"),
                onOperationCanceled: this._createActionByOption("onOperationCanceled"),
                onOperationItemCanceled: this._createActionByOption("onOperationItemCanceled"),
                onPanelClosed: this._createActionByOption("onPanelClosed")
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "test":
                    break;
                case "onOperationClosed":
                case "onOperationCanceled":
                case "onOperationItemCanceled":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerProgressPanel.prototype.__proto__ || Object.getPrototypeOf(FileManagerProgressPanel.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "addOperation",
        value: function(commonText, showCloseButtonAlways, allowProgressAutoUpdate) {
            var _this3 = this;
            if (this._operationCount) {
                (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_SEPARATOR_CLASS).prependTo(this._$infosContainer)
            } else {
                this._$infosContainer.empty()
            }
            this._operationCount++;
            var info = {
                customCloseHandling: showCloseButtonAlways,
                allowProgressAutoUpdate: (0, _common.ensureDefined)(allowProgressAutoUpdate, true)
            };
            var $info = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_INFO_CLASS).prependTo(this._$infosContainer);
            info.$info = $info;
            var $common = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_COMMON_CLASS).appendTo($info);
            info.common = this._createProgressBox($common, {
                commonText: commonText,
                showCloseButton: true,
                showCloseButtonAlways: showCloseButtonAlways,
                onCloseButtonClick: function() {
                    return _this3._closeOperation(info)
                }
            });
            return info
        }
    }, {
        key: "addOperationDetails",
        value: function(info, details, showCloseButton) {
            var _this4 = this;
            info.$info.addClass(FILE_MANAGER_PROGRESS_PANEL_INFO_WITH_DETAILS_CLASS);
            var $details = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL_DETAILS_CLASS).appendTo(info.$info);
            info.details = details.map(function(itemInfo, index) {
                itemInfo.info = info;
                return _this4._createDetailsItem($details, itemInfo, index, false, showCloseButton)
            })
        }
    }, {
        key: "_createDetailsItem",
        value: function($container, item, itemIndex, skipProgressBox, showCloseButton) {
            var _this5 = this;
            var $detailsItem = (0, _renderer2.default)("<div>").appendTo($container);
            return this._createProgressBox($detailsItem, {
                commonText: item.commonText,
                imageUrl: item.imageUrl,
                skipProgressBox: skipProgressBox,
                showCloseButton: showCloseButton,
                showCloseButtonAlways: showCloseButton,
                onCloseButtonClick: function() {
                    return _this5._cancelOperationItem(item, itemIndex)
                }
            })
        }
    }, {
        key: "completeOperationItem",
        value: function(operationInfo, itemIndex, commonProgress) {
            if (operationInfo.allowProgressAutoUpdate) {
                this.updateOperationItemProgress(operationInfo, itemIndex, 100, commonProgress)
            }
            this._setCloseButtonVisible(operationInfo.details[itemIndex], false)
        }
    }, {
        key: "updateOperationItemProgress",
        value: function(operationInfo, itemIndex, itemProgress, commonProgress) {
            operationInfo.common.progressBar.option("value", commonProgress);
            if (operationInfo.details) {
                var detailsItem = operationInfo.details[itemIndex];
                detailsItem.progressBar.option("value", itemProgress)
            }
        }
    }, {
        key: "completeOperation",
        value: function(info, commonText, isError, statusText) {
            info.completed = true;
            info.common.$commonText.text(commonText);
            if (isError) {
                this._removeProgressBar(info.common)
            } else {
                if (info.allowProgressAutoUpdate) {
                    info.common.progressBar.option("value", 100)
                }
            }
            if (statusText) {
                this._setProgressBarText(info.common, statusText)
            }
            this._setCloseButtonVisible(info.common, true)
        }
    }, {
        key: "completeSingleOperationWithError",
        value: function(info, errorText) {
            info.completed = true;
            this._renderOperationError(info.common, errorText);
            this._setCloseButtonVisible(info.common, true)
        }
    }, {
        key: "addOperationDetailsError",
        value: function(info, index, errorText) {
            var detailsItem = info.details[index];
            this._renderOperationError(detailsItem, errorText);
            this._setCloseButtonVisible(detailsItem, false)
        }
    }, {
        key: "renderError",
        value: function($container, $target, errorText) {
            (0, _renderer2.default)("<div>").text(errorText).addClass(FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS).appendTo($container)
        }
    }, {
        key: "createErrorDetailsProgressBox",
        value: function($container, item, errorText) {
            var detailsItem = this._createDetailsItem($container, item, -1, true);
            this._renderOperationError(detailsItem, errorText)
        }
    }, {
        key: "_renderOperationError",
        value: function(info, errorText) {
            this._removeProgressBar(info);
            this.renderError(info.$wrapper, info.$commonText, errorText)
        }
    }, {
        key: "_removeProgressBar",
        value: function(progressBox) {
            if (progressBox.progressBar) {
                progressBox.progressBar.dispose();
                progressBox.progressBar.$element().remove();
                progressBox.progressBar = null
            }
        }
    }, {
        key: "_createProgressBox",
        value: function($container, options) {
            var _this6 = this;
            $container.addClass(FILE_MANAGER_PROGRESS_BOX_CLASS);
            if (!options.showCloseButtonAlways) {
                $container.addClass(FILE_MANAGER_PROGRESS_BOX_WITHOUT_CLOSE_BUTTON_CLASS)
            }
            if (options.imageUrl) {
                (0, _icon.getImageContainer)(options.imageUrl).addClass(FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS).appendTo($container)
            }
            var $wrapper = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS).appendTo($container);
            var $commonText = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS).text(options.commonText).appendTo($wrapper);
            var progressBar = null;
            if (!options.skipProgressBox) {
                var $progressBar = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR_CLASS).appendTo($wrapper);
                progressBar = this._createComponent($progressBar, _progress_bar2.default, {
                    min: 0,
                    max: 100,
                    width: "100%",
                    validationMessageMode: "always",
                    statusFormat: function(ratio, value) {
                        return _this6._getStatusString(ratio, value)
                    }
                })
            }
            var closeButton = null;
            if (options.showCloseButton) {
                var $button = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_BOX_CLOSE_BUTTON_CLASS).appendTo($container);
                closeButton = this._createComponent($button, _button2.default, {
                    icon: "dx-filemanager-i dx-filemanager-i-cancel",
                    stylingMode: "text",
                    visible: options.showCloseButtonAlways,
                    onClick: options.onCloseButtonClick
                })
            }
            return {
                $commonText: $commonText,
                progressBar: progressBar,
                $element: $container,
                $wrapper: $wrapper,
                closeButton: closeButton
            }
        }
    }, {
        key: "_setCloseButtonVisible",
        value: function(progressBox, visible) {
            if (progressBox.closeButton) {
                progressBox.$element.toggleClass(FILE_MANAGER_PROGRESS_BOX_WITHOUT_CLOSE_BUTTON_CLASS, !visible);
                progressBox.closeButton.option("visible", visible)
            }
        }
    }, {
        key: "_setProgressBarText",
        value: function(progressBox, text) {
            progressBox.progressBar.option("statusFormat", function() {
                return text
            })
        }
    }, {
        key: "_closeOperation",
        value: function(info) {
            var _this7 = this;
            if (info.customCloseHandling && !info.completed) {
                this._raiseOperationCanceled(info);
                this._setCloseButtonVisible(info.common, false);
                info.details.forEach(function(item) {
                    return _this7._displayClosedOperationItem(item)
                })
            } else {
                this._raiseOperationClosed(info);
                info.$info.next("." + FILE_MANAGER_PROGRESS_PANEL_SEPARATOR_CLASS).remove();
                info.$info.remove()
            }
        }
    }, {
        key: "_cancelOperationItem",
        value: function(item, itemIndex) {
            this._raiseOperationItemCanceled(item, itemIndex);
            var itemInfo = item.info.details[itemIndex];
            this._displayClosedOperationItem(itemInfo)
        }
    }, {
        key: "_displayClosedOperationItem",
        value: function(itemInfo) {
            this._setProgressBarText(itemInfo, _message2.default.format("dxFileManager-notificationProgressPanelOperationCanceled"));
            this._setCloseButtonVisible(itemInfo, false)
        }
    }, {
        key: "_getStatusString",
        value: function(ratio, value) {
            return 1 === ratio ? _message2.default.format("Done") : Math.round(100 * ratio) + "%"
        }
    }, {
        key: "_raiseOperationClosed",
        value: function(info) {
            this._actions.onOperationClosed({
                info: info
            })
        }
    }, {
        key: "_raiseOperationCanceled",
        value: function(info) {
            this._actions.onOperationCanceled({
                info: info
            })
        }
    }, {
        key: "_raiseOperationItemCanceled",
        value: function(item, itemIndex) {
            this._actions.onOperationItemCanceled({
                item: item,
                itemIndex: itemIndex
            })
        }
    }, {
        key: "_raisePanelClosed",
        value: function() {
            this._actions.onPanelClosed()
        }
    }]);
    return FileManagerProgressPanel
}(_ui2.default);
module.exports = FileManagerProgressPanel;
