/**
 * DevExtreme (localization/globalize/currency.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
    return typeof obj
} : function(obj) {
    return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
};
var _open_xml_currency_format = require("../open_xml_currency_format");
var _open_xml_currency_format2 = _interopRequireDefault(_open_xml_currency_format);
require("./core");
require("./number");
require("../currency");
require("globalize/currency");
var _globalize = require("globalize");
var _globalize2 = _interopRequireDefault(_globalize);
var _config = require("../../core/config");
var _config2 = _interopRequireDefault(_config);
var _number = require("../number");
var _number2 = _interopRequireDefault(_number);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var enCurrencyUSD = {
    main: {
        en: {
            identity: {
                version: {
                    _cldrVersion: "28",
                    _number: "$Revision: 11972 $"
                },
                language: "en"
            },
            numbers: {
                currencies: {
                    USD: {
                        displayName: "US Dollar",
                        "displayName-count-one": "US dollar",
                        "displayName-count-other": "US dollars",
                        symbol: "$",
                        "symbol-alt-narrow": "$"
                    }
                }
            }
        }
    }
};
var currencyData = {
    supplemental: {
        version: {
            _cldrVersion: "28",
            _unicodeVersion: "8.0.0",
            _number: "$Revision: 11969 $"
        },
        currencyData: {
            fractions: {
                DEFAULT: {
                    _rounding: "0",
                    _digits: "2"
                }
            }
        }
    }
};
if (_globalize2.default && _globalize2.default.formatCurrency) {
    if ("en" === _globalize2.default.locale().locale) {
        _globalize2.default.load(enCurrencyUSD, currencyData);
        _globalize2.default.locale("en")
    }
    var formattersCache = {};
    var getFormatter = function(currency, format) {
        var formatter = void 0;
        var formatCacheKey = void 0;
        if ("object" === ("undefined" === typeof format ? "undefined" : _typeof(format))) {
            formatCacheKey = _globalize2.default.locale().locale + ":" + currency + ":" + JSON.stringify(format)
        } else {
            formatCacheKey = _globalize2.default.locale().locale + ":" + currency + ":" + format
        }
        formatter = formattersCache[formatCacheKey];
        if (!formatter) {
            formatter = formattersCache[formatCacheKey] = _globalize2.default.currencyFormatter(currency, format)
        }
        return formatter
    };
    var globalizeCurrencyLocalization = {
        _formatNumberCore: function(value, format, formatConfig) {
            if ("currency" === format) {
                var currency = formatConfig && formatConfig.currency || (0, _config2.default)().defaultCurrency;
                return getFormatter(currency, this._normalizeFormatConfig(format, formatConfig, value))(value)
            }
            return this.callBase.apply(this, arguments)
        },
        _normalizeFormatConfig: function(format, formatConfig, value) {
            var config = this.callBase(format, formatConfig, value);
            if ("currency" === format) {
                config.style = "accounting"
            }
            return config
        },
        format: function(value, _format) {
            if ("number" !== typeof value) {
                return value
            }
            _format = this._normalizeFormat(_format);
            if (_format) {
                if ("default" === _format.currency) {
                    _format.currency = (0, _config2.default)().defaultCurrency
                }
                if ("currency" === _format.type) {
                    return this._formatNumber(value, this._parseNumberFormatString("currency"), _format)
                } else {
                    if (!_format.type && _format.currency) {
                        return getFormatter(_format.currency, _format)(value)
                    }
                }
            }
            return this.callBase.apply(this, arguments)
        },
        getCurrencySymbol: function(currency) {
            if (!currency) {
                currency = (0, _config2.default)().defaultCurrency
            }
            return _globalize2.default.cldr.main("numbers/currencies/" + currency)
        },
        getOpenXmlCurrencyFormat: function(currency) {
            var currencySymbol = this.getCurrencySymbol(currency).symbol;
            var accountingFormat = _globalize2.default.cldr.main("numbers/currencyFormats-numberSystem-latn").accounting;
            return (0, _open_xml_currency_format2.default)(currencySymbol, accountingFormat)
        }
    };
    _number2.default.inject(globalizeCurrencyLocalization)
}
