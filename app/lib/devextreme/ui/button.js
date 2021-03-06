/**
 * DevExtreme (ui/button.js)
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
var _devices = require("../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("./widget/utils.ink_ripple");
var _utils2 = _interopRequireDefault(_utils);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _themes = require("./themes");
var _themes2 = _interopRequireDefault(_themes);
var _validation_engine = require("./validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _ui = require("./widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _utils3 = require("../events/utils");
var _extend = require("../core/utils/extend");
var _function_template = require("../core/templates/function_template");
var _icon = require("../core/utils/icon");
var _dom = require("../core/utils/dom");
var _click = require("../events/click");

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
var Button = function(_Widget) {
    _inherits(Button, _Widget);

    function Button() {
        var _ref;
        _classCallCheck(this, Button);
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key]
        }
        var _this = _possibleConstructorReturn(this, (_ref = Button.__proto__ || Object.getPrototypeOf(Button)).call.apply(_ref, [this].concat(args)));
        _this._feedbackHideTimeout = 100;
        return _this
    }
    _createClass(Button, [{
        key: "_clean",
        value: function() {
            delete this._inkRipple;
            delete this._$content;
            _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_clean", this).call(this)
        }
    }, {
        key: "_defaultOptionsRules",
        value: function() {
            return _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_defaultOptionsRules", this).call(this).concat([{
                device: function() {
                    return "desktop" === _devices2.default.real().deviceType && !_devices2.default.isSimulator()
                },
                options: {
                    focusStateEnabled: true
                }
            }, {
                device: function() {
                    return _themes2.default.isMaterial(_themes2.default.current())
                },
                options: {
                    useInkRipple: true
                }
            }])
        }
    }, {
        key: "_executeClickAction",
        value: function(event) {
            this._clickAction({
                validationGroup: this._validationGroupConfig,
                event: event
            })
        }
    }, {
        key: "_findGroup",
        value: function() {
            var $element = this.$element();
            return this.option("validationGroup") || _validation_engine2.default.findGroup($element, this._modelByElement($element))
        }
    }, {
        key: "_getAnonymousTemplateName",
        value: function() {
            return "content"
        }
    }, {
        key: "_getContentData",
        value: function() {
            var _option = this.option(),
                icon = _option.icon,
                text = _option.text,
                type = _option.type,
                _templateData = _option._templateData;
            return (0, _extend.extend)({
                icon: "back" === type && !icon ? "back" : icon,
                text: text
            }, _templateData)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_getDefaultOptions", this).call(this), {
                hoverStateEnabled: true,
                onClick: null,
                type: "normal",
                text: "",
                icon: "",
                iconPosition: "left",
                validationGroup: void 0,
                activeStateEnabled: true,
                template: "content",
                useSubmitBehavior: false,
                useInkRipple: false,
                _templateData: {},
                stylingMode: "contained"
            })
        }
    }, {
        key: "_getSubmitAction",
        value: function() {
            var _this2 = this;
            return this._createAction(function(_ref2) {
                var e = _ref2.event;
                if (_this2._needValidate) {
                    var validationGroup = _this2._validationGroupConfig;
                    if (validationGroup) {
                        var _validationGroup$vali = validationGroup.validate(),
                            status = _validationGroup$vali.status,
                            complete = _validationGroup$vali.complete;
                        _this2._validationStatus = status;
                        if ("pending" === status) {
                            _this2._needValidate = false;
                            _this2._setDisabled(true);
                            _this2._waitForValidationCompleting(complete)
                        }
                    }
                } else {
                    _this2._needValidate = true
                }
                "valid" !== _this2._validationStatus && e.preventDefault();
                e.stopPropagation()
            })
        }
    }, {
        key: "_initMarkup",
        value: function() {
            this.$element().addClass("dx-button");
            this._renderType();
            this._renderStylingMode();
            this.option("useInkRipple") && this._renderInkRipple();
            this._renderClick();
            this.setAria("role", "button");
            this._updateAriaLabel();
            _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_initMarkup", this).call(this);
            this._updateContent()
        }
    }, {
        key: "_initTemplates",
        value: function() {
            var _this3 = this;
            _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_initTemplates", this).call(this);
            this._defaultTemplates.content = new _function_template.FunctionTemplate(function(_ref3) {
                var _ref3$model = _ref3.model,
                    model = void 0 === _ref3$model ? {} : _ref3$model,
                    container = _ref3.container;
                var text = model.text,
                    icon = model.icon;
                var $icon = (0, _icon.getImageContainer)(icon);
                var $textContainer = text && (0, _renderer2.default)("<span>").text(text).addClass("dx-button-text");
                var $container = (0, _renderer2.default)(container);
                $container.append($textContainer);
                if ("left" === _this3.option("iconPosition")) {
                    $container.prepend($icon)
                } else {
                    $icon.addClass("dx-icon-right");
                    $container.append($icon)
                }
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name,
                previousValue = args.previousValue;
            switch (name) {
                case "onClick":
                    this._renderClick();
                    break;
                case "icon":
                case "text":
                    this._updateContent();
                    this._updateAriaLabel();
                    break;
                case "type":
                    this._refreshType(previousValue);
                    this._updateContent();
                    this._updateAriaLabel();
                    break;
                case "_templateData":
                    break;
                case "template":
                case "iconPosition":
                    this._updateContent();
                    break;
                case "stylingMode":
                    this._renderStylingMode();
                    break;
                case "useInkRipple":
                case "useSubmitBehavior":
                    this._invalidate();
                    break;
                default:
                    _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_refreshType",
        value: function(prevType) {
            var type = this.option("type");
            var $element = this.$element();
            prevType && $element.removeClass("dx-button-" + prevType).addClass("dx-button-" + type);
            if (!$element.hasClass("dx-button-has-icon") && "back" === type) {
                this._updateContent()
            }
        }
    }, {
        key: "_renderClick",
        value: function() {
            var actionConfig = {
                excludeValidators: ["readOnly"]
            };
            if (this.option("useSubmitBehavior")) {
                actionConfig.afterExecute = function(_ref4) {
                    var component = _ref4.component;
                    return setTimeout(function() {
                        return component._$submitInput.get(0).click()
                    })
                }
            }
            this._clickAction = this._createActionByOption("onClick", actionConfig);
            var $element = this.$element();
            var eventName = (0, _utils3.addNamespace)(_click.name, this.NAME);
            _events_engine2.default.off($element, eventName);
            _events_engine2.default.on($element, eventName, this._executeClickAction.bind(this))
        }
    }, {
        key: "_renderInkRipple",
        value: function() {
            var _option2 = this.option(),
                text = _option2.text,
                icon = _option2.icon,
                type = _option2.type;
            var isOnlyIconButton = !text && icon || "back" === type;
            var config = {};
            if (isOnlyIconButton) {
                (0, _extend.extend)(config, {
                    waveSizeCoefficient: 1,
                    useHoldAnimation: false,
                    isCentered: true
                })
            }
            this._inkRipple = _utils2.default.render(config)
        }
    }, {
        key: "_renderStylingMode",
        value: function() {
            var $element = this.$element();
            var stylingMode = this.option("stylingMode");
            var stylingModeClass = "dx-button-mode-" + stylingMode;
            ["dx-button-mode-contained", "dx-button-mode-text", "dx-button-mode-outlined"].forEach($element.removeClass.bind($element));
            if (["contained", "text", "outlined"].indexOf(stylingMode) === -1) {
                var defaultOptionValue = this._getDefaultOptions().stylingMode;
                stylingModeClass = "dx-button-mode-" + defaultOptionValue
            }
            $element.addClass(stylingModeClass)
        }
    }, {
        key: "_renderSubmitInput",
        value: function() {
            var submitAction = this._getSubmitAction();
            this._needValidate = true;
            this._validationStatus = "valid";
            this._$submitInput = (0, _renderer2.default)("<input>").attr("type", "submit").attr("tabindex", -1).addClass("dx-button-submit-input").appendTo(this._$content);
            _events_engine2.default.on(this._$submitInput, "click", function(e) {
                return submitAction({
                    event: e
                })
            })
        }
    }, {
        key: "_renderType",
        value: function() {
            var type = this.option("type");
            type && this.$element().addClass("dx-button-" + type)
        }
    }, {
        key: "_setDisabled",
        value: function(value) {
            this.option("disabled", value)
        }
    }, {
        key: "_supportedKeys",
        value: function() {
            var _this4 = this;
            var click = function(e) {
                e.preventDefault();
                _this4._executeClickAction(e)
            };
            return (0, _extend.extend)(_get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_supportedKeys", this).call(this), {
                space: click,
                enter: click
            })
        }
    }, {
        key: "_toggleActiveState",
        value: function($el, value, event) {
            _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_toggleActiveState", this).call(this, $el, value, event);
            if (this._inkRipple) {
                var config = {
                    element: this._$content,
                    event: event
                };
                value ? this._inkRipple.showWave(config) : this._inkRipple.hideWave(config)
            }
        }
    }, {
        key: "_updateAriaLabel",
        value: function() {
            var _option3 = this.option(),
                icon = _option3.icon,
                text = _option3.text;
            if ("image" === (0, _icon.getImageSourceType)(icon)) {
                icon = icon.indexOf("base64") === -1 ? icon.replace(/.+\/([^.]+)\..+$/, "$1") : "Base64"
            }
            var ariaLabel = text || icon || "";
            ariaLabel = ariaLabel.toString().trim();
            this.setAria("label", ariaLabel.length ? ariaLabel : null)
        }
    }, {
        key: "_updateContent",
        value: function() {
            var $element = this.$element();
            var data = this._getContentData();
            var icon = data.icon,
                text = data.text;
            this._$content ? this._$content.empty() : this._$content = (0, _renderer2.default)("<div>").addClass("dx-button-content").appendTo($element);
            $element.toggleClass("dx-button-has-icon", !!icon).toggleClass("dx-button-icon-right", !!icon && "left" !== this.option("iconPosition")).toggleClass("dx-button-has-text", !!text);
            var transclude = this._getAnonymousTemplateName() === this.option("template");
            var template = this._getTemplateByOption("template");
            var $result = (0, _renderer2.default)(template.render({
                model: data,
                container: (0, _dom.getPublicElement)(this._$content),
                transclude: transclude
            }));
            if ($result.hasClass("dx-template-wrapper")) {
                this._$content.replaceWith($result);
                this._$content = $result;
                this._$content.addClass("dx-button-content")
            }
            this.option("useSubmitBehavior") && this._renderSubmitInput()
        }
    }, {
        key: "_waitForValidationCompleting",
        value: function(complete) {
            var _this5 = this;
            complete.then(function(result) {
                _this5._validationStatus = result.status;
                _this5._setDisabled(false);
                "valid" === _this5._validationStatus && _this5._$submitInput.get(0).click();
                return result
            })
        }
    }, {
        key: "_validationGroupConfig",
        get: function() {
            return _validation_engine2.default.getGroupConfig(this._findGroup())
        }
    }]);
    return Button
}(_ui2.default);
(0, _component_registrator2.default)("dxButton", Button);
module.exports = Button;
module.exports.default = module.exports;
