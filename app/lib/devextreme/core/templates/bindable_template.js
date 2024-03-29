/**
 * DevExtreme (core/templates/bindable_template.js)
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
exports.BindableTemplate = void 0;
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
var _events_engine = require("../../events/core/events_engine");
var _remove_event = require("../remove_event");
var _remove_event2 = _interopRequireDefault(_remove_event);
var _type = require("../utils/type");

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
var watchChanges = function() {
    var globalWatch = function(data, watchMethod, callback) {
        return watchMethod(function() {
            return data
        }, callback)
    };
    var fieldsWatch = function(data, watchMethod, fields, fieldsMap, callback) {
        var resolvedData = {};
        var missedFields = fields.slice();
        var watchHandlers = fields.map(function(name) {
            var fieldGetter = fieldsMap[name];
            return watchMethod(fieldGetter ? function() {
                return fieldGetter(data)
            } : function() {
                return data[name]
            }, function(value) {
                resolvedData[name] = value;
                if (missedFields.length) {
                    var index = missedFields.indexOf(name);
                    if (index >= 0) {
                        missedFields.splice(index, 1)
                    }
                }
                if (!missedFields.length) {
                    callback(resolvedData)
                }
            })
        });
        return function() {
            watchHandlers.forEach(function(dispose) {
                return dispose()
            })
        }
    };
    return function(rawData, watchMethod, fields, fieldsMap, callback) {
        var fieldsDispose = void 0;
        var globalDispose = globalWatch(rawData, watchMethod, function(dataWithRawFields) {
            fieldsDispose && fieldsDispose();
            if ((0, _type.isPrimitive)(dataWithRawFields)) {
                callback(dataWithRawFields);
                return
            }
            fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, callback)
        });
        return function() {
            fieldsDispose && fieldsDispose();
            globalDispose && globalDispose()
        }
    }
}();
var BindableTemplate = exports.BindableTemplate = function(_TemplateBase) {
    _inherits(BindableTemplate, _TemplateBase);

    function BindableTemplate(render, fields, watchMethod, fieldsMap) {
        _classCallCheck(this, BindableTemplate);
        var _this = _possibleConstructorReturn(this, (BindableTemplate.__proto__ || Object.getPrototypeOf(BindableTemplate)).call(this));
        _this._render = render;
        _this._fields = fields;
        _this._fieldsMap = fieldsMap || {};
        _this._watchMethod = watchMethod;
        return _this
    }
    _createClass(BindableTemplate, [{
        key: "_renderCore",
        value: function(options) {
            var _this2 = this;
            var $container = (0, _renderer2.default)(options.container);
            var dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, function(data) {
                $container.empty();
                _this2._render($container, data, options.model)
            });
            (0, _events_engine.on)($container, _remove_event2.default, dispose);
            return $container.contents()
        }
    }]);
    return BindableTemplate
}(_template_base.TemplateBase);
