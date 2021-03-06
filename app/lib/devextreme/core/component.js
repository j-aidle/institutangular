/**
 * DevExtreme (core/component.js)
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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var Config = require("./config"),
    extend = require("./utils/extend").extend,
    optionManager = require("./option_manager").OptionManager,
    Class = require("./class"),
    Action = require("./action"),
    errors = require("./errors"),
    commonUtils = require("./utils/common"),
    typeUtils = require("./utils/type"),
    objectUtils = require("./utils/object"),
    deferredUtils = require("../core/utils/deferred"),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when,
    Callbacks = require("./utils/callbacks"),
    EventsMixin = require("./events_mixin"),
    publicComponentUtils = require("./utils/public_component"),
    devices = require("./devices"),
    isFunction = typeUtils.isFunction,
    noop = commonUtils.noop;
var PostponedOperations = function() {
    function PostponedOperations() {
        _classCallCheck(this, PostponedOperations);
        this._postponedOperations = {}
    }
    _createClass(PostponedOperations, [{
        key: "add",
        value: function(key, fn, postponedPromise) {
            if (key in this._postponedOperations) {
                postponedPromise && this._postponedOperations[key].promises.push(postponedPromise)
            } else {
                var completePromise = new Deferred;
                this._postponedOperations[key] = {
                    fn: fn,
                    completePromise: completePromise,
                    promises: postponedPromise ? [postponedPromise] : []
                }
            }
            return this._postponedOperations[key].completePromise.promise()
        }
    }, {
        key: "callPostponedOperations",
        value: function() {
            for (var key in this._postponedOperations) {
                var operation = this._postponedOperations[key];
                if (typeUtils.isDefined(operation)) {
                    if (operation.promises && operation.promises.length) {
                        when.apply(void 0, _toConsumableArray(operation.promises)).done(operation.fn).then(operation.completePromise.resolve)
                    } else {
                        operation.fn().done(operation.completePromise.resolve)
                    }
                }
            }
            this._postponedOperations = {}
        }
    }]);
    return PostponedOperations
}();
var normalizeOptions = function(options, value) {
    if ("string" !== typeof options) {
        return options
    }
    var result = {};
    result[options] = value;
    return result
};
var Component = Class.inherit({
    _setDeprecatedOptions: function() {
        this._deprecatedOptions = {}
    },
    _getDeprecatedOptions: function() {
        return this._deprecatedOptions
    },
    _getOptionAliasesByName: function(optionName) {
        var _this = this;
        return Object.keys(this._deprecatedOptions).filter(function(aliasName) {
            return optionName === _this._deprecatedOptions[aliasName].alias
        })
    },
    _getDefaultOptions: function() {
        return {
            onInitialized: null,
            onOptionChanged: null,
            onDisposing: null,
            defaultOptionsRules: null
        }
    },
    _defaultOptionsRules: function() {
        return []
    },
    _getOptionByRules: function(customRules) {
        var rules = this._defaultOptionsRules();
        if (Array.isArray(customRules)) {
            rules = rules.concat(customRules)
        }
        return this._convertRulesToOptions(rules)
    },
    _setOptionsByDevice: function(customRules) {
        var rulesOptions = this._getOptionByRules(customRules);
        this._setOptionByStealth(rulesOptions)
    },
    _convertRulesToOptions: function(rules) {
        var options = {};
        var currentDevice = devices.current();
        var deviceMatch = function(device, filter) {
            var filterArray = [];
            Array.prototype.push.call(filterArray, filter);
            return 1 === filterArray.length && typeUtils.isEmptyObject(filterArray[0]) || commonUtils.findBestMatches(device, filterArray).length > 0
        };
        for (var i = 0; i < rules.length; i++) {
            var match, rule = rules[i],
                deviceFilter = rule.device || {};
            if (isFunction(deviceFilter)) {
                match = deviceFilter(currentDevice)
            } else {
                match = deviceMatch(currentDevice, deviceFilter)
            }
            if (match) {
                extend(options, rule.options)
            }
        }
        return options
    },
    _isInitialOptionValue: function(name) {
        var optionValue = this.option(name),
            initialOptionValue = this.initialOption(name),
            isInitialOption = isFunction(optionValue) && isFunction(initialOptionValue) ? optionValue.toString() === initialOptionValue.toString() : commonUtils.equalByValue(optionValue, initialOptionValue);
        return isInitialOption
    },
    _setOptionsByReference: function() {
        this._optionsByReference = {}
    },
    _getOptionsByReference: function() {
        return this._optionsByReference
    },
    ctor: function(options) {
        var _this2 = this;
        this.NAME = publicComponentUtils.name(this.constructor);
        options = options || {};
        if (options.eventsStrategy) {
            this.setEventsStrategy(options.eventsStrategy)
        }
        this._options = {};
        this._updateLockCount = 0;
        this._optionChangedCallbacks = options._optionChangedCallbacks || Callbacks();
        this._disposingCallbacks = options._disposingCallbacks || Callbacks();
        this.postponedOperations = new PostponedOperations;
        this.beginUpdate();
        try {
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._options = this._getDefaultOptions();
            this._optionManager = new optionManager(this._options, this._getOptionsByReference(), this._deprecatedOptions);
            this._optionManager.onChanging(function(name, previousValue, value) {
                if (_this2._initialized) {
                    _this2._optionChanging(name, previousValue, value)
                }
            });
            this._optionManager.onDeprecated(function(option, info) {
                _this2._logDeprecatedWarning(option, info)
            });
            this._optionManager.onChanged(function(name, value, previousValue) {
                _this2._notifyOptionChanged(name, value, previousValue)
            });
            if (options && options.onInitializing) {
                options.onInitializing.apply(this, [options])
            }
            this._setOptionsByDevice(options.defaultOptionsRules);
            this._initOptions(options)
        } finally {
            this.endUpdate()
        }
    },
    _initOptions: function(options) {
        this.option(options)
    },
    _init: function() {
        this._createOptionChangedAction();
        this.on("disposing", function(args) {
            this._disposingCallbacks.fireWith(this, [args])
        }.bind(this))
    },
    _logDeprecatedWarning: function(option, info) {
        var message = info.message || "Use the '" + info.alias + "' option instead";
        errors.log("W0001", this.NAME, option, info.since, message)
    },
    _createOptionChangedAction: function() {
        this._optionChangedAction = this._createActionByOption("onOptionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _createDisposingAction: function() {
        this._disposingAction = this._createActionByOption("onDisposing", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onDisposing":
            case "onInitialized":
                break;
            case "onOptionChanged":
                this._createOptionChangedAction();
                break;
            case "defaultOptionsRules":
        }
    },
    _dispose: function() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._disposeEvents();
        this._optionManager.dispose();
        this._disposed = true
    },
    instance: function() {
        return this
    },
    beginUpdate: function() {
        this._updateLockCount++
    },
    endUpdate: function() {
        this._updateLockCount = Math.max(this._updateLockCount - 1, 0);
        if (!this._updateLockCount) {
            this.postponedOperations.callPostponedOperations();
            if (!this._initializing && !this._initialized) {
                this._initializing = true;
                try {
                    this._init()
                } finally {
                    this._initializing = false;
                    this._updateLockCount++;
                    this._createActionByOption("onInitialized", {
                        excludeValidators: ["disabled", "readOnly"]
                    })();
                    this._updateLockCount--;
                    this._initialized = true
                }
            }
        }
    },
    _optionChanging: noop,
    _notifyOptionChanged: function(option, value, previousValue) {
        var that = this;
        if (this._initialized) {
            var optionNames = [option].concat(that._getOptionAliasesByName(option));
            for (var i = 0; i < optionNames.length; i++) {
                var name = optionNames[i],
                    args = {
                        name: name.split(/[.[]/)[0],
                        fullName: name,
                        value: value,
                        previousValue: previousValue
                    };
                that._optionChangedCallbacks.fireWith(that, [extend(that._defaultActionArgs(), args)]);
                that._optionChangedAction(extend({}, args));
                if (!that._disposed && this._cancelOptionChange !== args.name) {
                    that._optionChanged(args)
                }
            }
        }
    },
    initialOption: function(optionName) {
        var _this3 = this;
        if (!this._initialOptions) {
            this._initialOptions = this._getDefaultOptions();
            var rulesOptions = this._getOptionByRules(this._getOptionByStealth("defaultOptionsRules"));
            this._optionManager.setValueByReference(this._initialOptions, rulesOptions)
        }
        optionName = optionName.replace(/\[/g, ".").replace(/\]/g, "");
        var fullPath = optionName.split(".");
        var value = void 0;
        fullPath.forEach(function(path) {
            value = value ? value[path] : _this3._initialOptions[path]
        });
        value = typeUtils.isObject(value) ? objectUtils.clone(value) : value;
        return value
    },
    _defaultActionConfig: function() {
        return {
            context: this,
            component: this
        }
    },
    _defaultActionArgs: function() {
        return {
            component: this
        }
    },
    _createAction: function(actionSource, config) {
        var action, that = this;
        return function(e) {
            if (!arguments.length) {
                e = {}
            }
            if (!typeUtils.isPlainObject(e)) {
                e = {
                    actionValue: e
                }
            }
            action = action || new Action(actionSource, extend(config, that._defaultActionConfig()));
            return action.execute.call(action, extend(e, that._defaultActionArgs()))
        }
    },
    _createActionByOption: function(optionName, config) {
        var action, eventName, actionFunc, that = this;
        var result = function() {
            if (!eventName) {
                config = config || {};
                if ("string" !== typeof optionName) {
                    throw errors.Error("E0008")
                }
                if (0 === optionName.indexOf("on")) {
                    eventName = that._getEventName(optionName)
                }
                actionFunc = that.option(optionName)
            }
            if (!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !that.hasEvent(eventName)) {
                return
            }
            if (!action) {
                var beforeExecute = config.beforeExecute;
                config.beforeExecute = function(args) {
                    beforeExecute && beforeExecute.apply(that, arguments);
                    that.fireEvent(eventName, args.args)
                };
                action = that._createAction(actionFunc, config)
            }
            if (Config().wrapActionsBeforeExecute) {
                var beforeActionExecute = that.option("beforeActionExecute") || noop;
                var wrappedAction = beforeActionExecute(that, action, config) || action;
                return wrappedAction.apply(that, arguments)
            }
            return action.apply(that, arguments)
        };
        if (!Config().wrapActionsBeforeExecute) {
            var onActionCreated = that.option("onActionCreated") || noop;
            result = onActionCreated(that, result, config) || result
        }
        return result
    },
    _getOptionByStealth: function(name) {
        return this._optionManager.getValueSilently(name)
    },
    _setOptionByStealth: function(options, value) {
        this._optionManager.setValueSilently(normalizeOptions(options, value))
    },
    _getEventName: function(actionName) {
        return actionName.charAt(2).toLowerCase() + actionName.substr(3)
    },
    hasActionSubscription: function(actionName) {
        return !!this.option(actionName) || this.hasEvent(this._getEventName(actionName))
    },
    isOptionDeprecated: function(name) {
        var deprecatedOptions = this._getDeprecatedOptions();
        return Object.prototype.hasOwnProperty.call(deprecatedOptions, name)
    },
    _setOptionSilent: function(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false
    },
    _getOptionValue: function(name, context) {
        var value = this.option(name);
        if (isFunction(value)) {
            return value.bind(context)()
        }
        return value
    },
    option: function(options, value) {
        if (arguments.length < 2 && "object" !== typeUtils.type(options)) {
            return this._optionManager.getValue(options)
        }
        this.beginUpdate();
        try {
            this._optionManager.setValue(normalizeOptions(options, value))
        } finally {
            this.endUpdate()
        }
    },
    resetOption: function(name) {
        if (!name) {
            return
        }
        var defaultValue = this.initialOption(name);
        this.beginUpdate();
        this._optionManager.setValue(normalizeOptions(name, defaultValue), false);
        this.endUpdate()
    }
}).include(EventsMixin);
module.exports = Component;
module.exports.PostponedOperations = PostponedOperations;
