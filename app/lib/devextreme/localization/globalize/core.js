/**
 * DevExtreme (localization/globalize/core.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _globalize = require("globalize");
var _globalize2 = _interopRequireDefault(_globalize);
var _core = require("../core");
var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
if (_globalize2.default && _globalize2.default.load) {
    var likelySubtags = {
        supplemental: {
            version: {
                _cldrVersion: "28",
                _unicodeVersion: "8.0.0",
                _number: "$Revision: 11965 $"
            },
            likelySubtags: {
                en: "en-Latn-US",
                de: "de-Latn-DE",
                ru: "ru-Cyrl-RU",
                ja: "ja-Jpan-JP"
            }
        }
    };
    if (!_globalize2.default.locale()) {
        _globalize2.default.load(likelySubtags);
        _globalize2.default.locale("en")
    }
    _core2.default.inject({
        locale: function(_locale) {
            if (!_locale) {
                return _globalize2.default.locale().locale
            }
            _globalize2.default.locale(_locale)
        }
    })
}
