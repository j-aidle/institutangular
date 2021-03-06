/**
 * DevExtreme (ui/editor/editor.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _element_data = require("../../core/element_data");
var _element_data2 = _interopRequireDefault(_element_data);
var _callbacks = require("../../core/utils/callbacks");
var _callbacks2 = _interopRequireDefault(_callbacks);
var _common = require("../../core/utils/common");
var _common2 = _interopRequireDefault(_common);
var _window = require("../../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _utils = require("../../events/utils");
var _position = require("../../core/utils/position");
var _extend = require("../../core/utils/extend");
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _overlay = require("../overlay");
var _overlay2 = _interopRequireDefault(_overlay);
var _validation_engine = require("../validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var READONLY_STATE_CLASS = "dx-state-readonly";
var INVALID_CLASS = "dx-invalid";
var INVALID_MESSAGE = "dx-invalid-message";
var INVALID_MESSAGE_CONTENT = "dx-invalid-message-content";
var INVALID_MESSAGE_AUTO = "dx-invalid-message-auto";
var INVALID_MESSAGE_ALWAYS = "dx-invalid-message-always";
var DX_INVALID_BADGE_CLASS = "dx-show-invalid-badge";
var VALIDATION_TARGET = "dx-validation-target";
var VALIDATION_MESSAGE_MIN_WIDTH = 100;
var VALIDATION_STATUS_VALID = "valid";
var VALIDATION_STATUS_INVALID = "invalid";
var READONLY_NAMESPACE = "editorReadOnly";
var getValidationErrorMessage = function(validationErrors) {
    var validationErrorMessage = "";
    if (validationErrors) {
        validationErrors.forEach(function(err) {
            if (err.message) {
                validationErrorMessage += (validationErrorMessage ? "<br />" : "") + err.message
            }
        })
    }
    return validationErrorMessage
};
var Editor = _ui2.default.inherit({
    ctor: function() {
        this.showValidationMessageTimeout = null;
        this.validationRequest = (0, _callbacks2.default)();
        this.callBase.apply(this, arguments);
        var $element = this.$element();
        if ($element) {
            _element_data2.default.data($element[0], VALIDATION_TARGET, this)
        }
    },
    _initOptions: function(options) {
        this.callBase.apply(this, arguments);
        this.option(_validation_engine2.default.initValidationOptions(options))
    },
    _init: function() {
        this.callBase();
        this._initInnerOptionCache("validationTooltipOptions");
        var $element = this.$element();
        $element.addClass(DX_INVALID_BADGE_CLASS)
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            value: null,
            name: "",
            onValueChanged: null,
            readOnly: false,
            isValid: true,
            validationError: null,
            validationErrors: null,
            validationStatus: VALIDATION_STATUS_VALID,
            validationMessageMode: "auto",
            validationBoundary: void 0,
            validationMessageOffset: {
                h: 0,
                v: 0
            },
            validationTooltipOptions: {}
        })
    },
    _attachKeyboardEvents: function() {
        if (this.option("readOnly")) {
            return
        }
        this.callBase();
        if (this._keyboardProcessor) {
            this._attachChildKeyboardEvents()
        }
    },
    _attachChildKeyboardEvents: _common2.default.noop,
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            validationError: true
        })
    },
    _createValueChangeAction: function() {
        this._valueChangeAction = this._createActionByOption("onValueChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _suppressValueChangeAction: function() {
        this._valueChangeActionSuppressed = true
    },
    _resumeValueChangeAction: function() {
        this._valueChangeActionSuppressed = false
    },
    _initMarkup: function() {
        this._toggleReadOnlyState();
        this._setSubmitElementName(this.option("name"));
        this.callBase();
        this._renderValidationState()
    },
    _raiseValueChangeAction: function(value, previousValue) {
        if (!this._valueChangeAction) {
            this._createValueChangeAction()
        }
        this._valueChangeAction(this._valueChangeArgs(value, previousValue))
    },
    _valueChangeArgs: function(value, previousValue) {
        return {
            value: value,
            previousValue: previousValue,
            event: this._valueChangeEventInstance
        }
    },
    _saveValueChangeEvent: function(e) {
        this._valueChangeEventInstance = e
    },
    _focusInHandler: function(e) {
        var _this = this;
        var isValidationMessageShownOnFocus = "auto" === this.option("validationMessageMode");
        if (this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
            this._$validationMessage && this._$validationMessage.removeClass(INVALID_MESSAGE_AUTO);
            clearTimeout(this.showValidationMessageTimeout);
            this.showValidationMessageTimeout = setTimeout(function() {
                return _this._$validationMessage && _this._$validationMessage.addClass(INVALID_MESSAGE_AUTO)
            }, 150)
        }
        return this.callBase(e)
    },
    _canValueBeChangedByClick: function() {
        return false
    },
    _renderValidationState: function() {
        var isValid = this.option("isValid") && this.option("validationStatus") !== VALIDATION_STATUS_INVALID;
        var validationMessageMode = this.option("validationMessageMode");
        var $element = this.$element();
        var validationErrors = this.option("validationErrors");
        if (!validationErrors && this.option("validationError")) {
            validationErrors = [this.option("validationError")]
        }
        $element.toggleClass(INVALID_CLASS, !isValid);
        this.setAria(VALIDATION_STATUS_INVALID, !isValid || void 0);
        if (!_window2.default.hasWindow()) {
            return
        }
        if (this._$validationMessage) {
            this._$validationMessage.remove();
            this.setAria("describedby", null);
            this._$validationMessage = null
        }
        var validationErrorMessage = getValidationErrorMessage(validationErrors);
        if (!isValid && validationErrorMessage) {
            this._$validationMessage = (0, _renderer2.default)("<div>").addClass(INVALID_MESSAGE).html(validationErrorMessage).appendTo($element);
            var validationTarget = this._getValidationMessageTarget();
            this._validationMessage = this._createComponent(this._$validationMessage, _overlay2.default, (0, _extend.extend)({
                integrationOptions: {},
                templatesRenderAsynchronously: false,
                target: validationTarget,
                shading: false,
                width: "auto",
                height: "auto",
                container: $element,
                position: this._getValidationMessagePosition("below"),
                closeOnOutsideClick: false,
                closeOnTargetScroll: false,
                animation: null,
                visible: true,
                propagateOutsideClick: true,
                _checkParentVisibility: false
            }, this._getInnerOptionsCache("validationTooltipOptions")));
            this._$validationMessage.toggleClass(INVALID_MESSAGE_AUTO, "auto" === validationMessageMode).toggleClass(INVALID_MESSAGE_ALWAYS, "always" === validationMessageMode);
            var messageId = "dx-" + new _guid2.default;
            this._validationMessage.$content().addClass(INVALID_MESSAGE_CONTENT).attr("id", messageId);
            this.setAria("describedby", messageId);
            this._setValidationMessageMaxWidth();
            this._bindInnerWidgetOptions(this._validationMessage, "validationTooltipOptions")
        }
    },
    _setValidationMessageMaxWidth: function() {
        if (!this._validationMessage) {
            return
        }
        if (0 === this._getValidationMessageTarget().outerWidth()) {
            this._validationMessage.option("maxWidth", "100%");
            return
        }
        var validationMessageMaxWidth = Math.max(VALIDATION_MESSAGE_MIN_WIDTH, this._getValidationMessageTarget().outerWidth());
        this._validationMessage.option("maxWidth", validationMessageMaxWidth)
    },
    _getValidationMessageTarget: function() {
        return this.$element()
    },
    _getValidationMessagePosition: function(positionRequest) {
        var rtlEnabled = this.option("rtlEnabled");
        var messagePositionSide = (0, _position.getDefaultAlignment)(rtlEnabled);
        var messageOriginalOffset = this.option("validationMessageOffset");
        var messageOffset = {
            h: messageOriginalOffset.h,
            v: messageOriginalOffset.v
        };
        var verticalPositions = "below" === positionRequest ? [" top", " bottom"] : [" bottom", " top"];
        if (rtlEnabled) {
            messageOffset.h = -messageOffset.h
        }
        if ("below" !== positionRequest) {
            messageOffset.v = -messageOffset.v
        }
        return {
            offset: messageOffset,
            boundary: this.option("validationBoundary"),
            my: messagePositionSide + verticalPositions[0],
            at: messagePositionSide + verticalPositions[1],
            collision: "none flip"
        }
    },
    _toggleReadOnlyState: function() {
        var readOnly = this.option("readOnly");
        this._toggleBackspaceHandler(readOnly);
        this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
        this.setAria("readonly", readOnly || void 0)
    },
    _toggleBackspaceHandler: function(isReadOnly) {
        var $eventTarget = this._keyboardEventBindingTarget();
        var eventName = (0, _utils.addNamespace)("keydown", READONLY_NAMESPACE);
        _events_engine2.default.off($eventTarget, eventName);
        if (isReadOnly) {
            _events_engine2.default.on($eventTarget, eventName, function(e) {
                if ("backspace" === (0, _utils.normalizeKeyName)(e)) {
                    e.preventDefault()
                }
            })
        }
    },
    _dispose: function() {
        var element = this.$element()[0];
        _element_data2.default.data(element, VALIDATION_TARGET, null);
        clearTimeout(this.showValidationMessageTimeout);
        this.callBase()
    },
    _setSubmitElementName: function(name) {
        var $submitElement = this._getSubmitElement();
        if (!$submitElement) {
            return
        }
        if (name.length > 0) {
            $submitElement.attr("name", name)
        } else {
            $submitElement.removeAttr("name")
        }
    },
    _getSubmitElement: function() {
        return null
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onValueChanged":
                this._createValueChangeAction();
                break;
            case "isValid":
            case "validationError":
                this.option(_validation_engine2.default.synchronizeValidationOptions(args, this.option()));
                break;
            case "validationErrors":
            case "validationStatus":
                this.option(_validation_engine2.default.synchronizeValidationOptions(args, this.option()));
                this._renderValidationState();
                break;
            case "validationBoundary":
            case "validationMessageMode":
                this._renderValidationState();
                break;
            case "validationTooltipOptions":
                this._innerOptionChanged(this._validationMessage, args);
                break;
            case "readOnly":
                this._toggleReadOnlyState();
                this._refreshFocusState();
                break;
            case "value":
                if (!this._valueChangeActionSuppressed) {
                    this._raiseValueChangeAction(args.value, args.previousValue);
                    this._saveValueChangeEvent(void 0)
                }
                if (args.value != args.previousValue) {
                    this.validationRequest.fire({
                        value: args.value,
                        editor: this
                    })
                }
                break;
            case "width":
                this.callBase(args);
                this._setValidationMessageMaxWidth();
                break;
            case "name":
                this._setSubmitElementName(args.value);
                break;
            default:
                this.callBase(args)
        }
    },
    reset: function() {
        var defaultOptions = this._getDefaultOptions();
        this.option("value", defaultOptions.value)
    }
});
module.exports = Editor;
