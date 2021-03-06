/**
 * DevExtreme (core/templates/template_base.js)
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
exports.TemplateBase = exports.renderedCallbacks = void 0;
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
var _dom_adapter = require("../dom_adapter");
var _callbacks = require("../utils/callbacks");
var _callbacks2 = _interopRequireDefault(_callbacks);
var _dom = require("../utils/dom");
var _errors = require("../errors");
var _errors2 = _interopRequireDefault(_errors);

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
var renderedCallbacks = exports.renderedCallbacks = (0, _callbacks2.default)({
    syncStrategy: true
});
var TemplateBase = exports.TemplateBase = function() {
    function TemplateBase() {
        _classCallCheck(this, TemplateBase)
    }
    _createClass(TemplateBase, [{
        key: "render",
        value: function(options) {
            options = options || {};
            var onRendered = options.onRendered;
            delete options.onRendered;
            var $result = this._renderCore(options);
            this._ensureResultInContainer($result, options.container);
            renderedCallbacks.fire($result, options.container);
            onRendered && onRendered();
            return $result
        }
    }, {
        key: "_ensureResultInContainer",
        value: function($result, container) {
            if (!container) {
                return
            }
            var $container = (0, _renderer2.default)(container);
            var resultInContainer = (0, _dom.contains)($container.get(0), $result.get(0));
            $container.append($result);
            if (resultInContainer) {
                return
            }
            var resultInBody = (0, _dom_adapter.getBody)().contains($container.get(0));
            if (!resultInBody) {
                return
            }(0, _dom.triggerShownEvent)($result)
        }
    }, {
        key: "_renderCore",
        value: function() {
            throw _errors2.default.Error("E0001")
        }
    }]);
    return TemplateBase
}();
