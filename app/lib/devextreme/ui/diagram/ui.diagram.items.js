/**
 * DevExtreme (ui/diagram/ui.diagram.items.js)
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
var _component = require("../../core/component");
var _component2 = _interopRequireDefault(_component);
var _data_helper = require("../../data_helper");
var _data_helper2 = _interopRequireDefault(_data_helper);

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
var ItemsOption = function(_Component) {
    _inherits(ItemsOption, _Component);

    function ItemsOption(diagramWidget) {
        _classCallCheck(this, ItemsOption);
        var _this = _possibleConstructorReturn(this, (ItemsOption.__proto__ || Object.getPrototypeOf(ItemsOption)).call(this));
        _this._diagramWidget = diagramWidget;
        _this._resetCache();
        return _this
    }
    _createClass(ItemsOption, [{
        key: "_dataSourceChangedHandler",
        value: function(newItems, e) {
            this._items = newItems;
            this._diagramWidget._onDataSourceChanged()
        }
    }, {
        key: "_dataSourceLoadingChangedHandler",
        value: function(isLoading) {
            if (isLoading && !this._dataSource.isLoaded()) {
                this._diagramWidget._showLoadingIndicator()
            } else {
                this._diagramWidget._hideLoadingIndicator()
            }
        }
    }, {
        key: "insert",
        value: function(data, callback, errorCallback) {
            var _this2 = this;
            this._resetCache();
            this._getStore().insert(data).done(function(data) {
                if (callback) {
                    callback(data)
                }
                _this2._resetCache()
            }).fail(function(error) {
                if (errorCallback) {
                    errorCallback(error)
                }
                _this2._resetCache()
            })
        }
    }, {
        key: "update",
        value: function(key, data, callback, errorCallback) {
            var storeKey = this._getStoreKey(data);
            this._getStore().update(storeKey, data).done(function(data, key) {
                if (callback) {
                    callback(key, data)
                }
            }).fail(function(error) {
                if (errorCallback) {
                    errorCallback(error)
                }
            })
        }
    }, {
        key: "remove",
        value: function(key, data, callback, errorCallback) {
            var _this3 = this;
            this._resetCache();
            var storeKey = this._getStoreKey(data);
            this._getStore().remove(storeKey).done(function(key) {
                if (callback) {
                    callback(key, data)
                }
                _this3._resetCache()
            }).fail(function(error) {
                if (errorCallback) {
                    errorCallback(error)
                }
                _this3._resetCache()
            })
        }
    }, {
        key: "findItem",
        value: function(itemKey) {
            if (!this._items) {
                return null
            }
            var index = this._getIndexByKey(itemKey);
            return this._items[index]
        }
    }, {
        key: "getItems",
        value: function() {
            return this._items
        }
    }, {
        key: "hasItems",
        value: function() {
            return !!this._items
        }
    }, {
        key: "_getIndexByKey",
        value: function(key) {
            var cache = this._cache,
                keys = cache.keys || this._getKeys() || [];
            if (!cache.keys) {
                cache.keys = keys
            }
            if ("object" === ("undefined" === typeof key ? "undefined" : _typeof(key))) {
                for (var i = 0, length = keys.length; i < length; i++) {
                    if (keys[i] === key) {
                        return i
                    }
                }
            } else {
                var set = cache.set || keys.reduce(function(accumulator, key, index) {
                    accumulator[key] = index;
                    return accumulator
                }, {});
                if (!cache.set) {
                    cache.set = set
                }
                return set[key]
            }
            return -1
        }
    }, {
        key: "_getKeys",
        value: function() {
            if (!this._items) {
                return []
            }
            var keyExpr = this._getKeyExpr();
            return keyExpr && this._items && this._items.map(function(item) {
                return keyExpr(item)
            })
        }
    }, {
        key: "_getKeyExpr",
        value: function() {
            throw "Not Implemented"
        }
    }, {
        key: "_dataSourceOptions",
        value: function() {
            return {
                paginate: false
            }
        }
    }, {
        key: "_getStore",
        value: function() {
            return this._dataSource.store()
        }
    }, {
        key: "_getStoreKey",
        value: function(data) {
            return this._getStore().keyOf(data)
        }
    }, {
        key: "_resetCache",
        value: function() {
            this._cache = {}
        }
    }]);
    return ItemsOption
}(_component2.default);
ItemsOption.include(_data_helper2.default);
module.exports = ItemsOption;
