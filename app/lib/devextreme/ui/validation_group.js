/**
 * DevExtreme (ui/validation_group.js)
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
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _dom_component = require("../core/dom_component");
var _dom_component2 = _interopRequireDefault(_dom_component);
var _validation_summary = require("./validation_summary");
var _validation_summary2 = _interopRequireDefault(_validation_summary);
var _validation_engine = require("./validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _validator = require("./validator");
var _validator2 = _interopRequireDefault(_validator);

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
var VALIDATION_ENGINE_CLASS = "dx-validationgroup";
var VALIDATOR_CLASS = "dx-validator";
var VALIDATION_SUMMARY_CLASS = "dx-validationsummary";
var ValidationGroup = function(_DOMComponent) {
    _inherits(ValidationGroup, _DOMComponent);

    function ValidationGroup() {
        _classCallCheck(this, ValidationGroup);
        return _possibleConstructorReturn(this, (ValidationGroup.__proto__ || Object.getPrototypeOf(ValidationGroup)).apply(this, arguments))
    }
    _createClass(ValidationGroup, [{
        key: "_getDefaultOptions",
        value: function() {
            return _get(ValidationGroup.prototype.__proto__ || Object.getPrototypeOf(ValidationGroup.prototype), "_getDefaultOptions", this).call(this)
        }
    }, {
        key: "_init",
        value: function() {
            _get(ValidationGroup.prototype.__proto__ || Object.getPrototypeOf(ValidationGroup.prototype), "_init", this).call(this);
            _validation_engine2.default.addGroup(this)
        }
    }, {
        key: "_initMarkup",
        value: function() {
            var $element = this.$element();
            $element.addClass(VALIDATION_ENGINE_CLASS);
            $element.find("." + VALIDATOR_CLASS).each(function(_, validatorContainer) {
                _validator2.default.getInstance((0, _renderer2.default)(validatorContainer))._initGroupRegistration()
            });
            $element.find("." + VALIDATION_SUMMARY_CLASS).each(function(_, summaryContainer) {
                _validation_summary2.default.getInstance((0, _renderer2.default)(summaryContainer))._initGroupRegistration()
            });
            _get(ValidationGroup.prototype.__proto__ || Object.getPrototypeOf(ValidationGroup.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "validate",
        value: function() {
            return _validation_engine2.default.validateGroup(this)
        }
    }, {
        key: "reset",
        value: function() {
            return _validation_engine2.default.resetGroup(this)
        }
    }, {
        key: "_dispose",
        value: function() {
            _validation_engine2.default.removeGroup(this);
            this.$element().removeClass(VALIDATION_ENGINE_CLASS);
            _get(ValidationGroup.prototype.__proto__ || Object.getPrototypeOf(ValidationGroup.prototype), "_dispose", this).call(this)
        }
    }]);
    return ValidationGroup
}(_dom_component2.default);
(0, _component_registrator2.default)("dxValidationGroup", ValidationGroup);
module.exports = ValidationGroup;
module.exports.default = module.exports;
