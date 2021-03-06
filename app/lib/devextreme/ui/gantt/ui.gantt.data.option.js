/**
 * DevExtreme (ui/gantt/ui.gantt.data.option.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
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
var DataOption = function(_Component) {
    _inherits(DataOption, _Component);

    function DataOption(optionName, loadPanel, dataSourceChangedCallback) {
        _classCallCheck(this, DataOption);
        var _this = _possibleConstructorReturn(this, (DataOption.__proto__ || Object.getPrototypeOf(DataOption)).call(this));
        _this._optionName = optionName;
        _this._loadPanel = loadPanel;
        _this._dataSourceChangedCallback = dataSourceChangedCallback;
        return _this
    }
    _createClass(DataOption, [{
        key: "insert",
        value: function(data, callback, errorCallback) {
            var _this2 = this;
            this._showLoadPanel();
            this._getStore().insert(data).done(function(response) {
                if (callback) {
                    callback(response)
                }
                _this2._hideLoadPanel()
            }).fail(function(error) {
                if (errorCallback) {
                    errorCallback(error)
                }
                _this2._hideLoadPanel()
            })
        }
    }, {
        key: "update",
        value: function(key, data, callback, errorCallback) {
            var _this3 = this;
            this._showLoadPanel();
            this._getStore().update(key, data).done(function(data, key) {
                if (callback) {
                    callback(data, key)
                }
                _this3._hideLoadPanel()
            }).fail(function(error) {
                if (errorCallback) {
                    errorCallback(error)
                }
                _this3._hideLoadPanel()
            })
        }
    }, {
        key: "remove",
        value: function(key, callback, errorCallback) {
            var _this4 = this;
            this._showLoadPanel();
            this._getStore().remove(key).done(function(key) {
                if (callback) {
                    callback(key)
                }
                _this4._hideLoadPanel()
            }).fail(function(error) {
                if (errorCallback) {
                    errorCallback(error)
                }
                _this4._hideLoadPanel()
            })
        }
    }, {
        key: "_dataSourceChangedHandler",
        value: function(newItems, e) {
            this._dataSourceChangedCallback(this._optionName, newItems)
        }
    }, {
        key: "_dataSourceOptions",
        value: function() {
            return {
                paginate: false
            }
        }
    }, {
        key: "_dataSourceLoadingChangedHandler",
        value: function(isLoading) {
            if (isLoading && !this._dataSource.isLoaded()) {
                this._showLoadPanel()
            } else {
                this._hideLoadPanel()
            }
        }
    }, {
        key: "_showLoadPanel",
        value: function() {
            this._loadPanel.show()
        }
    }, {
        key: "_hideLoadPanel",
        value: function() {
            this._loadPanel.hide()
        }
    }, {
        key: "_getStore",
        value: function() {
            return this._dataSource.store()
        }
    }]);
    return DataOption
}(_component2.default);
DataOption.include(_data_helper2.default);
module.exports = DataOption;
