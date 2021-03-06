/**
 * DevExtreme (ui/form/ui.form.utils.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _type = require("../../core/utils/type");

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
    }
}
var createItemPathByIndex = function(index, isTabs) {
    return (isTabs ? "tabs" : "items") + "[" + index + "]"
};
var concatPaths = function(path1, path2) {
    if ((0, _type.isDefined)(path1) && (0, _type.isDefined)(path2)) {
        return path1 + "." + path2
    }
    return path1 || path2
};
var getTextWithoutSpaces = function(text) {
    return text ? text.replace(/\s/g, "") : void 0
};
var isExpectedItem = function(item, fieldName) {
    return item && (item.dataField === fieldName || item.name === fieldName || getTextWithoutSpaces(item.title) === fieldName || "group" === item.itemType && getTextWithoutSpaces(item.caption) === fieldName)
};
var getFullOptionName = function(path, optionName) {
    return path + "." + optionName
};
var getOptionNameFromFullName = function(fullName) {
    var parts = fullName.split(".");
    return parts[parts.length - 1].replace(/\[\d+]/, "")
};
var tryGetTabPath = function(fullPath) {
    var pathParts = fullPath.split(".");
    var resultPathParts = [].concat(_toConsumableArray(pathParts));
    for (var i = pathParts.length - 1; i >= 0; i--) {
        if (isFullPathContainsTabs(pathParts[i])) {
            return resultPathParts.join(".")
        }
        resultPathParts.splice(i, 1)
    }
    return ""
};
var isFullPathContainsTabs = function(fullPath) {
    return fullPath.indexOf("tabs") > -1
};
exports.getOptionNameFromFullName = getOptionNameFromFullName;
exports.getFullOptionName = getFullOptionName;
exports.getTextWithoutSpaces = getTextWithoutSpaces;
exports.isExpectedItem = isExpectedItem;
exports.createItemPathByIndex = createItemPathByIndex;
exports.concatPaths = concatPaths;
exports.tryGetTabPath = tryGetTabPath;
exports.isFullPathContainsTabs = isFullPathContainsTabs;
