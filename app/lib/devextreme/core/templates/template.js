/**
 * DevExtreme (core/templates/template.js)
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
exports.Template = void 0;
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
var _renderer = require("../renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _template_base = require("./template_base");
var _dom = require("../utils/dom");
var _template_engine_registry = require("./template_engine_registry");
require("./template_engines");

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
}(0, _template_engine_registry.registerTemplateEngine)("default", {
    compile: function(element) {
        return (0, _dom.normalizeTemplateElement)(element)
    },
    render: function(template, model, index) {
        return template.clone()
    }
});
(0, _template_engine_registry.setTemplateEngine)("default");
var Template = exports.Template = function(_TemplateBase) {
    _inherits(Template, _TemplateBase);

    function Template(element) {
        _classCallCheck(this, Template);
        var _this = _possibleConstructorReturn(this, (Template.__proto__ || Object.getPrototypeOf(Template)).call(this));
        _this._element = element;
        return _this
    }
    _createClass(Template, [{
        key: "_renderCore",
        value: function(options) {
            var transclude = options.transclude;
            if (!transclude && !this._compiledTemplate) {
                this._compiledTemplate = (0, _template_engine_registry.getCurrentTemplateEngine)().compile(this._element)
            }
            return (0, _renderer2.default)("<div>").append(transclude ? this._element : (0, _template_engine_registry.getCurrentTemplateEngine)().render(this._compiledTemplate, options.model, options.index)).contents()
        }
    }, {
        key: "source",
        value: function() {
            return (0, _renderer2.default)(this._element).clone()
        }
    }]);
    return Template
}(_template_base.TemplateBase);
