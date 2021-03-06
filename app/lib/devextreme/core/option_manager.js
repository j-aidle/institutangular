/**
 * DevExtreme (core/option_manager.js)
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
exports.OptionManager = void 0;
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
var _data = require("./utils/data");
var _data2 = _interopRequireDefault(_data);
var _comparator = require("./utils/comparator");
var _type = require("./utils/type");
var _type2 = _interopRequireDefault(_type);
var _callbacks = require("./utils/callbacks");
var _callbacks2 = _interopRequireDefault(_callbacks);
var _extend = require("./utils/extend");

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
var OptionManager = exports.OptionManager = function() {
    function OptionManager(options, optionsByReference, deprecatedOptions) {
        _classCallCheck(this, OptionManager);
        this._options = options;
        this._optionsByReference = optionsByReference;
        this._deprecatedOptions = deprecatedOptions;
        this._changingCallbacks = (0, _callbacks2.default)({
            syncStrategy: true
        });
        this._changedCallbacks = (0, _callbacks2.default)({
            syncStrategy: true
        });
        this._deprecatedCallbacks = (0, _callbacks2.default)({
            syncStrategy: true
        });
        this._cachedDeprecateNames = [];
        this.cachedGetters = {};
        this.cachedSetters = {}
    }
    _createClass(OptionManager, [{
        key: "_notifyDeprecated",
        value: function(option) {
            var info = this._deprecatedOptions[option];
            if (info) {
                this._deprecatedCallbacks.fire(option, info)
            }
        }
    }, {
        key: "_clearField",
        value: function(options, name) {
            delete options[name];
            var previousFieldName = this._getParentName(name);
            var fieldObject = previousFieldName ? this._getValue(options, previousFieldName, false) : options;
            if (fieldObject) {
                delete fieldObject[this._getFieldName(name)]
            }
        }
    }, {
        key: "_getParentName",
        value: function(fullName) {
            return fullName.substr(0, fullName.lastIndexOf("."))
        }
    }, {
        key: "_getFieldName",
        value: function(fullName) {
            return fullName.substr(fullName.lastIndexOf(".") + 1)
        }
    }, {
        key: "_setField",
        value: function(options, fullName, value) {
            var fieldName = "";
            var fieldObject = void 0;
            do {
                if (fieldName) {
                    fieldName = "." + fieldName
                }
                fieldName = this._getFieldName(fullName) + fieldName;
                fullName = this._getParentName(fullName);
                fieldObject = fullName ? this._getValue(options, fullName, false) : options
            } while (!fieldObject);
            fieldObject[fieldName] = value
        }
    }, {
        key: "_setValue",
        value: function(name, value, merge) {
            if (!this.cachedSetters[name]) {
                this.cachedSetters[name] = _data2.default.compileSetter(name)
            }
            var path = name.split(/[.[]/);
            merge = _type2.default.isDefined(merge) ? merge : !this._optionsByReference[name];
            this.cachedSetters[name](this._options, value, {
                functionsAsIs: true,
                merge: merge,
                unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
            })
        }
    }, {
        key: "_setPreparedValue",
        value: function(name, value, merge) {
            var previousValue = this._getValue(this._options, name, false);
            if ((0, _comparator.equals)(previousValue, value)) {
                return
            }
            this._changingCallbacks.fire(name, previousValue, value);
            this._setValue(name, value, merge);
            this._changedCallbacks.fire(name, value, previousValue)
        }
    }, {
        key: "_setRelevantNames",
        value: function(options, name, value) {
            if (!name) {
                return
            }
            var normalizedName = this._normalizeName(name);
            if (normalizedName && normalizedName !== name) {
                this._setField(options, normalizedName, value);
                this._clearField(options, name)
            }
        }
    }, {
        key: "_normalizeName",
        value: function(name) {
            if (!name) {
                return
            }
            var deprecate = void 0;
            if (!this._cachedDeprecateNames.length) {
                for (var optionName in this._deprecatedOptions) {
                    this._cachedDeprecateNames.push(optionName)
                }
            }
            for (var i = 0; i < this._cachedDeprecateNames.length; i++) {
                if (this._cachedDeprecateNames[i] === name) {
                    deprecate = this._deprecatedOptions[name];
                    break
                }
            }
            if (deprecate) {
                this._notifyDeprecated(name);
                if (deprecate.alias) {
                    name = deprecate.alias
                }
            }
            return name
        }
    }, {
        key: "_prepareRelevantNames",
        value: function(options, name, value) {
            if (_type2.default.isPlainObject(value)) {
                for (var valueName in value) {
                    this._prepareRelevantNames(options, name + "." + valueName, value[valueName])
                }
            }
            this._setRelevantNames(options, name, value)
        }
    }, {
        key: "_getValue",
        value: function(options, name, unwrapObservables) {
            var getter = this.cachedGetters[name];
            if (!getter) {
                getter = this.cachedGetters[name] = _data2.default.compileGetter(name)
            }
            return getter(options, {
                functionsAsIs: true,
                unwrapObservables: unwrapObservables
            })
        }
    }, {
        key: "onChanging",
        value: function(callBack) {
            this._changingCallbacks.add(callBack)
        }
    }, {
        key: "onChanged",
        value: function(callBack) {
            this._changedCallbacks.add(callBack)
        }
    }, {
        key: "onDeprecated",
        value: function(callBack) {
            this._deprecatedCallbacks.add(callBack)
        }
    }, {
        key: "setValueByReference",
        value: function(options, rulesOptions) {
            (0, _extend.extend)(true, options, rulesOptions);
            for (var fieldName in this._optionsByReference) {
                if (Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                    options[fieldName] = rulesOptions[fieldName]
                }
            }
        }
    }, {
        key: "getValue",
        value: function(name) {
            return this._getValue(this._options, this._normalizeName(name))
        }
    }, {
        key: "setValue",
        value: function(options, merge) {
            for (var optionName in options) {
                this._prepareRelevantNames(options, optionName, options[optionName])
            }
            for (var _optionName in options) {
                this._setPreparedValue(_optionName, options[_optionName], merge)
            }
        }
    }, {
        key: "getValueSilently",
        value: function(name) {
            return this._options[name]
        }
    }, {
        key: "setValueSilently",
        value: function(options) {
            this.setValueByReference(this._options, options)
        }
    }, {
        key: "dispose",
        value: function() {
            this._changingCallbacks.empty();
            this._changedCallbacks.empty();
            this._deprecatedCallbacks.empty()
        }
    }]);
    return OptionManager
}();
