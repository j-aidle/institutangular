/**
 * DevExtreme (ui/file_manager/ui.file_manager.common.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _deferred = require("../../core/utils/deferred");
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ErrorCode = {
    NoAccess: 0,
    FileExists: 1,
    FileNotFound: 2,
    DirectoryExists: 3,
    DirectoryNotFound: 4,
    WrongFileExtension: 5,
    MaxFileSizeExceeded: 6,
    InvalidSymbols: 7,
    Other: 32767
};
var whenSome = function(arg, onSuccess, onError) {
    onSuccess = onSuccess || _common.noop;
    onError = onError || _common.noop;
    if (!Array.isArray(arg)) {
        arg = [arg]
    }
    var deferreds = arg.map(function(item, index) {
        return (0, _deferred.when)(item).then(function(result) {
            _type2.default.isFunction(onSuccess) && onSuccess({
                item: item,
                index: index,
                result: result
            });
            return result
        }, function(error) {
            if (!error) {
                error = {}
            }
            error.index = index;
            _type2.default.isFunction(onError) && onError(error);
            return (new _deferred.Deferred).resolve().promise()
        })
    });
    return _deferred.when.apply(null, deferreds)
};
module.exports = whenSome;
module.exports.ErrorCode = ErrorCode;