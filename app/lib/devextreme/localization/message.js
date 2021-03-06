/**
 * DevExtreme (localization/message.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _dependency_injector = require("../core/utils/dependency_injector");
var _dependency_injector2 = _interopRequireDefault(_dependency_injector);
var _extend = require("../core/utils/extend");
var _iterator = require("../core/utils/iterator");
var _string = require("../core/utils/string");
var _inflector = require("../core/utils/inflector");
var _core = require("./core");
var _core2 = _interopRequireDefault(_core);
var _default_messages = require("./default_messages");
var _default_messages2 = _interopRequireDefault(_default_messages);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var baseDictionary = (0, _extend.extend)(true, {}, _default_messages2.default);
var getDataByLocale = function(localeData, locale) {
    return localeData[locale] || {}
};
var newMessages = {};
var messageLocalization = (0, _dependency_injector2.default)({
    engine: function() {
        return "base"
    },
    _dictionary: baseDictionary,
    load: function(messages) {
        (0, _extend.extend)(true, this._dictionary, messages)
    },
    _localizablePrefix: "@",
    setup: function(localizablePrefix) {
        this._localizablePrefix = localizablePrefix
    },
    localizeString: function(text) {
        var that = this;
        var regex = new RegExp("(^|[^a-zA-Z_0-9" + that._localizablePrefix + "-]+)(" + that._localizablePrefix + "{1,2})([a-zA-Z_0-9-]+)", "g");
        var escapeString = that._localizablePrefix + that._localizablePrefix;
        return text.replace(regex, function(str, prefix, escape, localizationKey) {
            var defaultResult = that._localizablePrefix + localizationKey;
            var result = void 0;
            if (escape !== escapeString) {
                result = that.format(localizationKey)
            }
            if (!result) {
                newMessages[localizationKey] = (0, _inflector.humanize)(localizationKey)
            }
            return prefix + (result || defaultResult)
        })
    },
    localizeNode: function(node) {
        var that = this;
        (0, _renderer2.default)(node).each(function(index, nodeItem) {
            if (!nodeItem.nodeType) {
                return
            }
            if (3 === nodeItem.nodeType) {
                nodeItem.nodeValue = that.localizeString(nodeItem.nodeValue)
            } else {
                if (!(0, _renderer2.default)(nodeItem).is("iframe")) {
                    (0, _iterator.each)(nodeItem.attributes || [], function(index, attr) {
                        if ("string" === typeof attr.value) {
                            var localizedValue = that.localizeString(attr.value);
                            if (attr.value !== localizedValue) {
                                attr.value = localizedValue
                            }
                        }
                    });
                    (0, _renderer2.default)(nodeItem).contents().each(function(index, node) {
                        that.localizeNode(node)
                    })
                }
            }
        })
    },
    getMessagesByLocales: function() {
        return this._dictionary
    },
    getDictionary: function(onlyNew) {
        if (onlyNew) {
            return newMessages
        }
        return (0, _extend.extend)({}, newMessages, this.getMessagesByLocales()[_core2.default.locale()])
    },
    getFormatter: function(key) {
        return this._getFormatterBase(key) || this._getFormatterBase(key, "en")
    },
    _getFormatterBase: function(key, locale) {
        var _this = this;
        var message = _core2.default.getValueByClosestLocale(function(locale) {
            return getDataByLocale(_this._dictionary, locale)[key]
        });
        if (message) {
            return function() {
                var args = 1 === arguments.length && Array.isArray(arguments[0]) ? arguments[0].slice(0) : Array.prototype.slice.call(arguments, 0);
                args.unshift(message);
                return _string.format.apply(this, args)
            }
        }
    },
    format: function(key) {
        var formatter = this.getFormatter(key);
        var values = Array.prototype.slice.call(arguments, 1);
        return formatter && formatter.apply(this, values) || ""
    }
});
module.exports = messageLocalization;
