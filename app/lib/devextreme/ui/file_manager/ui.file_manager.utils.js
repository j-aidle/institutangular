/**
 * DevExtreme (ui/file_manager/ui.file_manager.utils.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _iterator = require("../../core/utils/iterator");
var PATH_SEPARATOR = "/";
var getFileExtension = function(path) {
    var index = path.lastIndexOf(".");
    return index !== -1 ? path.substr(index) : ""
};
var getName = function(path) {
    var index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path
};
var getParentPath = function(path) {
    var index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(0, index) : ""
};
var getPathParts = function(path, includeFullPath) {
    if (!path || "/" === path) {
        return []
    }
    var result = [];
    var pathPart = "";
    for (var i = 0; i < path.length; i++) {
        var char = path.charAt(i);
        if (char === PATH_SEPARATOR) {
            var nextChar = path.charAt(i + 1);
            if (nextChar !== PATH_SEPARATOR) {
                if (pathPart) {
                    result.push(pathPart);
                    pathPart = ""
                }
                char = nextChar
            }
            i++
        }
        pathPart += char
    }
    if (pathPart) {
        result.push(pathPart)
    }
    if (includeFullPath) {
        for (var _i = 0; _i < result.length; _i++) {
            result[_i] = pathCombine(0 === _i ? "" : result[_i - 1], result[_i])
        }
    }
    return result
};
var getEscapedFileName = function(fileName) {
    return fileName.replace(/\//g, "//")
};
var pathCombine = function() {
    var result = "";
    (0, _iterator.each)(arguments, function(_, arg) {
        if (arg) {
            if (result) {
                result += PATH_SEPARATOR
            }
            result += arg
        }
    });
    return result
};
var getDisplayFileSize = function(byteSize) {
    var sizesTitles = ["B", "KB", "MB", "GB", "TB"];
    var index = 0;
    var displaySize = byteSize;
    while (displaySize >= 1024 && index <= sizesTitles.length - 1) {
        displaySize /= 1024;
        index++
    }
    displaySize = Math.round(10 * displaySize) / 10;
    return displaySize + " " + sizesTitles[index]
};
module.exports.getFileExtension = getFileExtension;
module.exports.getName = getName;
module.exports.getParentPath = getParentPath;
module.exports.getPathParts = getPathParts;
module.exports.getEscapedFileName = getEscapedFileName;
module.exports.pathCombine = pathCombine;
module.exports.getDisplayFileSize = getDisplayFileSize;
module.exports.PATH_SEPARATOR = PATH_SEPARATOR;
