/**
 * DevExtreme (core/templates/child_default_template.js)
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
exports.ChildDefaultTemplate = void 0;
var _template_base = require("./template_base");

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
var ChildDefaultTemplate = exports.ChildDefaultTemplate = function(_TemplateBase) {
    _inherits(ChildDefaultTemplate, _TemplateBase);

    function ChildDefaultTemplate(name) {
        _classCallCheck(this, ChildDefaultTemplate);
        var _this = _possibleConstructorReturn(this, (ChildDefaultTemplate.__proto__ || Object.getPrototypeOf(ChildDefaultTemplate)).call(this));
        _this.name = name;
        return _this
    }
    return ChildDefaultTemplate
}(_template_base.TemplateBase);
