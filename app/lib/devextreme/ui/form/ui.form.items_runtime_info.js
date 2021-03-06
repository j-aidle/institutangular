/**
 * DevExtreme (ui/form/ui.form.items_runtime_info.js)
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
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");

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
var FormItemsRunTimeInfo = function() {
    function FormItemsRunTimeInfo() {
        _classCallCheck(this, FormItemsRunTimeInfo);
        this._map = {}
    }
    _createClass(FormItemsRunTimeInfo, [{
        key: "_findWidgetInstance",
        value: function(condition) {
            var result = void 0;
            (0, _iterator.each)(this._map, function(guid, _ref) {
                var widgetInstance = _ref.widgetInstance,
                    item = _ref.item;
                if (condition(item)) {
                    result = widgetInstance;
                    return false
                }
            });
            return result
        }
    }, {
        key: "_findFieldByCondition",
        value: function(callback, valueExpr) {
            var result = void 0;
            (0, _iterator.each)(this._map, function(key, value) {
                if (callback(value)) {
                    result = "guid" === valueExpr ? key : value[valueExpr];
                    return false
                }
            });
            return result
        }
    }, {
        key: "clear",
        value: function() {
            this._map = {}
        }
    }, {
        key: "removeItemsByItems",
        value: function(itemsRunTimeInfo) {
            var _this = this;
            (0, _iterator.each)(itemsRunTimeInfo.getItems(), function(guid) {
                delete _this._map[guid]
            })
        }
    }, {
        key: "add",
        value: function(options) {
            var key = options.guid || new _guid2.default;
            this._map[key] = options;
            return key
        }
    }, {
        key: "addItemsOrExtendFrom",
        value: function(itemsRunTimeInfo) {
            var _this2 = this;
            itemsRunTimeInfo.each(function(key, itemRunTimeInfo) {
                if (_this2._map[key]) {
                    _this2._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
                    _this2._map[key].$itemContainer = itemRunTimeInfo.$itemContainer
                } else {
                    _this2.add({
                        item: itemRunTimeInfo.item,
                        widgetInstance: itemRunTimeInfo.widgetInstance,
                        guid: key,
                        $itemContainer: itemRunTimeInfo.$itemContainer
                    })
                }
            })
        }
    }, {
        key: "extendRunTimeItemInfoByKey",
        value: function(key, options) {
            this._map[key] = (0, _extend.extend)(this._map[key], options)
        }
    }, {
        key: "findWidgetInstanceByItem",
        value: function(item) {
            return this._findWidgetInstance(function(storedItem) {
                return storedItem === item
            })
        }
    }, {
        key: "getGroupOrTabLayoutManagerByPath",
        value: function(targetPath) {
            return this._findFieldByCondition(function(_ref2) {
                var path = _ref2.path;
                return path === targetPath
            }, "layoutManager")
        }
    }, {
        key: "getKeyByPath",
        value: function(targetPath) {
            return this._findFieldByCondition(function(_ref3) {
                var path = _ref3.path;
                return path === targetPath
            }, "guid")
        }
    }, {
        key: "getPathFromItem",
        value: function(targetItem) {
            return this._findFieldByCondition(function(_ref4) {
                var item = _ref4.item;
                return item === targetItem
            }, "path")
        }
    }, {
        key: "findWidgetInstanceByName",
        value: function(name) {
            return this._findWidgetInstance(function(item) {
                return name === item.name
            })
        }
    }, {
        key: "findWidgetInstanceByDataField",
        value: function(dataField) {
            return this._findWidgetInstance(function(item) {
                return dataField === item.dataField
            })
        }
    }, {
        key: "findItemContainerByItem",
        value: function(item) {
            for (var key in this._map) {
                if (this._map[key].item === item) {
                    return this._map[key].$itemContainer
                }
            }
            return null
        }
    }, {
        key: "findItemIndexByItem",
        value: function(targetItem) {
            return this._findFieldByCondition(function(_ref5) {
                var item = _ref5.item;
                return item === targetItem
            }, "itemIndex")
        }
    }, {
        key: "getItems",
        value: function() {
            return this._map
        }
    }, {
        key: "each",
        value: function(handler) {
            (0, _iterator.each)(this._map, function(key, itemRunTimeInfo) {
                handler(key, itemRunTimeInfo)
            })
        }
    }]);
    return FormItemsRunTimeInfo
}();
exports.default = FormItemsRunTimeInfo;
