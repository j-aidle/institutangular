/**
 * DevExtreme (integration/knockout/template.js)
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
exports.KoTemplate = void 0;
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
var _dom_adapter = require("../../core/dom_adapter");
var _knockout = require("knockout");
var _knockout2 = _interopRequireDefault(_knockout);
var _type = require("../../core/utils/type");
var _template_base = require("../../core/templates/template_base");
var _dom = require("../../core/utils/dom");
var _utils = require("./utils");

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
var getParentContext = function(data) {
    var parentNode = (0, _dom_adapter.createElement)("div");
    _knockout2.default.applyBindingsToNode(parentNode, null, data);
    var parentContext = _knockout2.default.contextFor(parentNode);
    _knockout2.default.cleanNode(parentNode);
    return parentContext
};
var KoTemplate = exports.KoTemplate = function(_TemplateBase) {
    _inherits(KoTemplate, _TemplateBase);

    function KoTemplate(element) {
        _classCallCheck(this, KoTemplate);
        var _this = _possibleConstructorReturn(this, (KoTemplate.__proto__ || Object.getPrototypeOf(KoTemplate)).call(this));
        _this._element = element;
        _this._template = (0, _renderer2.default)("<div>").append((0, _dom.normalizeTemplateElement)(element));
        _this._registerKoTemplate();
        return _this
    }
    _createClass(KoTemplate, [{
        key: "_registerKoTemplate",
        value: function() {
            var template = this._template.get(0);
            new _knockout2.default.templateSources.anonymousTemplate(template).nodes(template)
        }
    }, {
        key: "_prepareDataForContainer",
        value: function(data, container) {
            if (container && container.length) {
                var node = (0, _utils.getClosestNodeWithContext)(container.get(0));
                var containerContext = _knockout2.default.contextFor(node);
                data = void 0 !== data ? data : _knockout2.default.dataFor(node) || {};
                if (containerContext) {
                    return data === containerContext.$data ? containerContext : containerContext.createChildContext(data)
                }
            }
            return getParentContext(data).createChildContext(data)
        }
    }, {
        key: "_renderCore",
        value: function(options) {
            var model = this._prepareDataForContainer(options.model, (0, _renderer2.default)(options.container));
            if ((0, _type.isDefined)(options.index)) {
                model.$index = options.index
            }
            var $placeholder = (0, _renderer2.default)("<div>").appendTo(options.container);
            var $result = void 0;
            _knockout2.default.renderTemplate(this._template.get(0), model, {
                afterRender: function(nodes) {
                    $result = (0, _renderer2.default)(nodes)
                }
            }, $placeholder.get(0), "replaceNode");
            return $result
        }
    }, {
        key: "source",
        value: function() {
            return (0, _renderer2.default)(this._element).clone()
        }
    }, {
        key: "dispose",
        value: function() {
            this._template.remove()
        }
    }]);
    return KoTemplate
}(_template_base.TemplateBase);
