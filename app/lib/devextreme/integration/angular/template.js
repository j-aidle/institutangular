/**
 * DevExtreme (integration/angular/template.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NgTemplate = void 0;
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _template_base = require("../../core/templates/template_base");
var _type = require("../../core/utils/type");
var _dom = require("../../core/utils/dom");

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
var NgTemplate = exports.NgTemplate = function(_TemplateBase) {
    _inherits(NgTemplate, _TemplateBase);

    function NgTemplate(element, templateCompiler) {
        _classCallCheck(this, NgTemplate);
        var _this = _possibleConstructorReturn(this, (NgTemplate.__proto__ || Object.getPrototypeOf(NgTemplate)).call(this));
        _this._element = element;
        _this._compiledTemplate = templateCompiler((0, _dom.normalizeTemplateElement)(_this._element));
        return _this
    }
    _createClass(NgTemplate, [{
        key: "_renderCore",
        value: function(options) {
            var compiledTemplate = this._compiledTemplate;
            return (0, _type.isFunction)(compiledTemplate) ? compiledTemplate(options) : compiledTemplate
        }
    }, {
        key: "source",
        value: function() {
            return (0, _renderer2.default)(this._element).clone()
        }
    }]);
    return NgTemplate
}(_template_base.TemplateBase);
