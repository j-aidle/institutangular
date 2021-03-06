/**
 * DevExtreme (ui/speed_dial_action/speed_dial_action.js)
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
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../../core/utils/extend");
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _ready_callbacks = require("../../core/utils/ready_callbacks");
var _ready_callbacks2 = _interopRequireDefault(_ready_callbacks);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _common = require("../../core/utils/common");
var _speed_dial_main_item = require("./speed_dial_main_item");
var _swatch_container = require("../widget/swatch_container");

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
var ready = _ready_callbacks2.default.add;
var SpeedDialAction = function(_Widget) {
    _inherits(SpeedDialAction, _Widget);

    function SpeedDialAction() {
        _classCallCheck(this, SpeedDialAction);
        return _possibleConstructorReturn(this, (SpeedDialAction.__proto__ || Object.getPrototypeOf(SpeedDialAction)).apply(this, arguments))
    }
    _createClass(SpeedDialAction, [{
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(SpeedDialAction.prototype.__proto__ || Object.getPrototypeOf(SpeedDialAction.prototype), "_getDefaultOptions", this).call(this), {
                icon: "",
                onClick: null,
                label: "",
                visible: true,
                index: 0,
                onContentReady: null,
                onInitialized: null,
                onDisposing: null,
                activeStateEnabled: true,
                hoverStateEnabled: true,
                animation: {
                    show: {
                        type: "pop",
                        duration: 200,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        from: {
                            scale: 0,
                            opacity: 0
                        },
                        to: {
                            scale: 1,
                            opacity: 1
                        }
                    },
                    hide: {
                        type: "pop",
                        duration: 200,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        from: {
                            scale: 1,
                            opacity: 1
                        },
                        to: {
                            scale: 0,
                            opacity: 0
                        }
                    }
                },
                id: new _guid2.default
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "onClick":
                case "icon":
                case "label":
                case "visible":
                case "index":
                    (0, _speed_dial_main_item.initAction)(this);
                    break;
                case "animation":
                case "id":
                    break;
                default:
                    _get(SpeedDialAction.prototype.__proto__ || Object.getPrototypeOf(SpeedDialAction.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_createActionByOption",
        value: function(optionName, config, isExecute) {
            return !!isExecute || "onInitialized" !== optionName && "onDisposing" !== optionName ? _get(SpeedDialAction.prototype.__proto__ || Object.getPrototypeOf(SpeedDialAction.prototype), "_createActionByOption", this).call(this, optionName, config) : _common.noop
        }
    }, {
        key: "_render",
        value: function() {
            var _this2 = this;
            this._toggleVisibility(false);
            if (!(0, _swatch_container.getSwatchContainer)(this.$element())) {
                ready(function() {
                    return (0, _speed_dial_main_item.initAction)(_this2)
                })
            } else {
                (0, _speed_dial_main_item.initAction)(this)
            }
        }
    }, {
        key: "_dispose",
        value: function() {
            (0, _speed_dial_main_item.disposeAction)(this._options.id);
            _get(SpeedDialAction.prototype.__proto__ || Object.getPrototypeOf(SpeedDialAction.prototype), "_dispose", this).call(this)
        }
    }]);
    return SpeedDialAction
}(_ui2.default);
(0, _component_registrator2.default)("dxSpeedDialAction", SpeedDialAction);
module.exports = SpeedDialAction;
