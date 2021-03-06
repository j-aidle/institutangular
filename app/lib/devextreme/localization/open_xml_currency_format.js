/**
 * DevExtreme (localization/open_xml_currency_format.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
module.exports = function(currencySymbol, accountingFormat) {
    if (!accountingFormat) {
        return
    }
    var encodeSymbols = {
        ".00": "{0}",
        "'": "\\'",
        "\\(": "\\(",
        "\\)": "\\)",
        " ": "\\ ",
        '"': "&quot;",
        "\\\xa4": currencySymbol
    };
    var result = accountingFormat.split(";");
    for (var i = 0; i < result.length; i++) {
        for (var symbol in encodeSymbols) {
            if (Object.prototype.hasOwnProperty.call(encodeSymbols, symbol)) {
                result[i] = result[i].replace(new RegExp(symbol, "g"), encodeSymbols[symbol])
            }
        }
    }
    return 2 === result.length ? result[0] + "_);" + result[1] : result[0]
};
