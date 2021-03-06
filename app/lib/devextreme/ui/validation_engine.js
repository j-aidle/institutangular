/**
 * DevExtreme (ui/validation_engine.js)
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
var _class = require("../core/class");
var _class2 = _interopRequireDefault(_class);
var _extend = require("../core/utils/extend");
var _array = require("../core/utils/array");
var _iterator = require("../core/utils/iterator");
var _events_mixin = require("../core/events_mixin");
var _events_mixin2 = _interopRequireDefault(_events_mixin);
var _errors = require("../core/errors");
var _errors2 = _interopRequireDefault(_errors);
var _common = require("../core/utils/common");
var _type = require("../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _number = require("../localization/number");
var _number2 = _interopRequireDefault(_number);
var _message = require("../localization/message");
var _message2 = _interopRequireDefault(_message);
var _promise = require("../core/polyfills/promise");
var _promise2 = _interopRequireDefault(_promise);
var _deferred = require("../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var STATUS = {
    valid: "valid",
    invalid: "invalid",
    pending: "pending"
};
var BaseRuleValidator = function() {
    function BaseRuleValidator() {
        _classCallCheck(this, BaseRuleValidator);
        this.NAME = "base"
    }
    _createClass(BaseRuleValidator, [{
        key: "defaultMessage",
        value: function(value) {
            return _message2.default.getFormatter("validation-" + this.NAME)(value)
        }
    }, {
        key: "defaultFormattedMessage",
        value: function(value) {
            return _message2.default.getFormatter("validation-" + this.NAME + "-formatted")(value)
        }
    }, {
        key: "_isValueEmpty",
        value: function(value) {
            return !rulesValidators.required.validate(value, {})
        }
    }, {
        key: "validate",
        value: function(value, rule) {
            var _this = this;
            var valueArray = Array.isArray(value) ? value : [value];
            var result = true;
            if (valueArray.length) {
                valueArray.every(function(itemValue) {
                    result = _this._validate(itemValue, rule);
                    return result
                })
            } else {
                result = this._validate(null, rule)
            }
            return result
        }
    }]);
    return BaseRuleValidator
}();
var RequiredRuleValidator = function(_BaseRuleValidator) {
    _inherits(RequiredRuleValidator, _BaseRuleValidator);

    function RequiredRuleValidator() {
        _classCallCheck(this, RequiredRuleValidator);
        var _this2 = _possibleConstructorReturn(this, (RequiredRuleValidator.__proto__ || Object.getPrototypeOf(RequiredRuleValidator)).call(this));
        _this2.NAME = "required";
        return _this2
    }
    _createClass(RequiredRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            if (!_type2.default.isDefined(value)) {
                return false
            }
            if (false === value) {
                return false
            }
            value = String(value);
            if (rule.trim || !_type2.default.isDefined(rule.trim)) {
                value = value.trim()
            }
            return "" !== value
        }
    }]);
    return RequiredRuleValidator
}(BaseRuleValidator);
var NumericRuleValidator = function(_BaseRuleValidator2) {
    _inherits(NumericRuleValidator, _BaseRuleValidator2);

    function NumericRuleValidator() {
        _classCallCheck(this, NumericRuleValidator);
        var _this3 = _possibleConstructorReturn(this, (NumericRuleValidator.__proto__ || Object.getPrototypeOf(NumericRuleValidator)).call(this));
        _this3.NAME = "numeric";
        return _this3
    }
    _createClass(NumericRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            if (false !== rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            if (rule.useCultureSettings && _type2.default.isString(value)) {
                return !isNaN(_number2.default.parse(value))
            } else {
                return _type2.default.isNumeric(value)
            }
        }
    }]);
    return NumericRuleValidator
}(BaseRuleValidator);
var RangeRuleValidator = function(_BaseRuleValidator3) {
    _inherits(RangeRuleValidator, _BaseRuleValidator3);

    function RangeRuleValidator() {
        _classCallCheck(this, RangeRuleValidator);
        var _this4 = _possibleConstructorReturn(this, (RangeRuleValidator.__proto__ || Object.getPrototypeOf(RangeRuleValidator)).call(this));
        _this4.NAME = "range";
        return _this4
    }
    _createClass(RangeRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            if (false !== rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            var validNumber = rulesValidators.numeric.validate(value, rule),
                validValue = _type2.default.isDefined(value) && "" !== value,
                number = validNumber ? parseFloat(value) : validValue && value.valueOf(),
                min = rule.min,
                max = rule.max;
            if (!(validNumber || _type2.default.isDate(value)) && !validValue) {
                return false
            }
            if (_type2.default.isDefined(min)) {
                if (_type2.default.isDefined(max)) {
                    return number >= min && number <= max
                }
                return number >= min
            } else {
                if (_type2.default.isDefined(max)) {
                    return number <= max
                } else {
                    throw _errors2.default.Error("E0101")
                }
            }
        }
    }]);
    return RangeRuleValidator
}(BaseRuleValidator);
var StringLengthRuleValidator = function(_BaseRuleValidator4) {
    _inherits(StringLengthRuleValidator, _BaseRuleValidator4);

    function StringLengthRuleValidator() {
        _classCallCheck(this, StringLengthRuleValidator);
        var _this5 = _possibleConstructorReturn(this, (StringLengthRuleValidator.__proto__ || Object.getPrototypeOf(StringLengthRuleValidator)).call(this));
        _this5.NAME = "stringLength";
        return _this5
    }
    _createClass(StringLengthRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            value = _type2.default.isDefined(value) ? String(value) : "";
            if (rule.trim || !_type2.default.isDefined(rule.trim)) {
                value = value.trim()
            }
            if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            return rulesValidators.range.validate(value.length, (0, _extend.extend)({}, rule))
        }
    }]);
    return StringLengthRuleValidator
}(BaseRuleValidator);
var CustomRuleValidator = function(_BaseRuleValidator5) {
    _inherits(CustomRuleValidator, _BaseRuleValidator5);

    function CustomRuleValidator() {
        _classCallCheck(this, CustomRuleValidator);
        var _this6 = _possibleConstructorReturn(this, (CustomRuleValidator.__proto__ || Object.getPrototypeOf(CustomRuleValidator)).call(this));
        _this6.NAME = "custom";
        return _this6
    }
    _createClass(CustomRuleValidator, [{
        key: "validate",
        value: function(value, rule) {
            if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            var validator = rule.validator,
                dataGetter = validator && _type2.default.isFunction(validator.option) && validator.option("dataGetter"),
                extraParams = _type2.default.isFunction(dataGetter) && dataGetter(),
                params = {
                    value: value,
                    validator: validator,
                    rule: rule
                };
            if (extraParams) {
                (0, _extend.extend)(params, extraParams)
            }
            return rule.validationCallback(params)
        }
    }]);
    return CustomRuleValidator
}(BaseRuleValidator);
var AsyncRuleValidator = function(_CustomRuleValidator) {
    _inherits(AsyncRuleValidator, _CustomRuleValidator);

    function AsyncRuleValidator() {
        _classCallCheck(this, AsyncRuleValidator);
        var _this7 = _possibleConstructorReturn(this, (AsyncRuleValidator.__proto__ || Object.getPrototypeOf(AsyncRuleValidator)).call(this));
        _this7.NAME = "async";
        return _this7
    }
    _createClass(AsyncRuleValidator, [{
        key: "validate",
        value: function(value, rule) {
            if (!_type2.default.isDefined(rule.reevaluate)) {
                (0, _extend.extend)(rule, {
                    reevaluate: true
                })
            }
            if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            var validator = rule.validator,
                dataGetter = validator && _type2.default.isFunction(validator.option) && validator.option("dataGetter"),
                extraParams = _type2.default.isFunction(dataGetter) && dataGetter(),
                params = {
                    value: value,
                    validator: validator,
                    rule: rule
                };
            if (extraParams) {
                (0, _extend.extend)(params, extraParams)
            }
            var callbackResult = rule.validationCallback(params);
            if (!_type2.default.isPromise(callbackResult)) {
                throw _errors2.default.Error("E0103")
            }
            return this._getWrappedPromise((0, _deferred.fromPromise)(callbackResult).promise())
        }
    }, {
        key: "_getWrappedPromise",
        value: function(promise) {
            var deferred = new _deferred.Deferred;
            promise.then(function(res) {
                deferred.resolve(res)
            }, function(err) {
                deferred.resolve(_type2.default.isDefined(err) ? err : false)
            });
            return deferred.promise()
        }
    }]);
    return AsyncRuleValidator
}(CustomRuleValidator);
var CompareRuleValidator = function(_BaseRuleValidator6) {
    _inherits(CompareRuleValidator, _BaseRuleValidator6);

    function CompareRuleValidator() {
        _classCallCheck(this, CompareRuleValidator);
        var _this8 = _possibleConstructorReturn(this, (CompareRuleValidator.__proto__ || Object.getPrototypeOf(CompareRuleValidator)).call(this));
        _this8.NAME = "compare";
        return _this8
    }
    _createClass(CompareRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            if (!rule.comparisonTarget) {
                throw _errors2.default.Error("E0102")
            }
            if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }(0, _extend.extend)(rule, {
                reevaluate: true
            });
            var otherValue = rule.comparisonTarget(),
                type = rule.comparisonType || "==";
            switch (type) {
                case "==":
                    return value == otherValue;
                case "!=":
                    return value != otherValue;
                case "===":
                    return value === otherValue;
                case "!==":
                    return value !== otherValue;
                case ">":
                    return value > otherValue;
                case ">=":
                    return value >= otherValue;
                case "<":
                    return value < otherValue;
                case "<=":
                    return value <= otherValue
            }
        }
    }]);
    return CompareRuleValidator
}(BaseRuleValidator);
var PatternRuleValidator = function(_BaseRuleValidator7) {
    _inherits(PatternRuleValidator, _BaseRuleValidator7);

    function PatternRuleValidator() {
        _classCallCheck(this, PatternRuleValidator);
        var _this9 = _possibleConstructorReturn(this, (PatternRuleValidator.__proto__ || Object.getPrototypeOf(PatternRuleValidator)).call(this));
        _this9.NAME = "pattern";
        return _this9
    }
    _createClass(PatternRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            if (false !== rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            var pattern = rule.pattern;
            if (_type2.default.isString(pattern)) {
                pattern = new RegExp(pattern)
            }
            return pattern.test(value)
        }
    }]);
    return PatternRuleValidator
}(BaseRuleValidator);
var EmailRuleValidator = function(_BaseRuleValidator8) {
    _inherits(EmailRuleValidator, _BaseRuleValidator8);

    function EmailRuleValidator() {
        _classCallCheck(this, EmailRuleValidator);
        var _this10 = _possibleConstructorReturn(this, (EmailRuleValidator.__proto__ || Object.getPrototypeOf(EmailRuleValidator)).call(this));
        _this10.NAME = "email";
        return _this10
    }
    _createClass(EmailRuleValidator, [{
        key: "_validate",
        value: function(value, rule) {
            if (false !== rule.ignoreEmptyValue && this._isValueEmpty(value)) {
                return true
            }
            return rulesValidators.pattern.validate(value, (0, _extend.extend)({}, rule, {
                pattern: /^[\d\w._-]+@([\d\w._-]+\.)+[\w]+$/i
            }))
        }
    }]);
    return EmailRuleValidator
}(BaseRuleValidator);
var rulesValidators = {
    required: new RequiredRuleValidator,
    numeric: new NumericRuleValidator,
    range: new RangeRuleValidator,
    stringLength: new StringLengthRuleValidator,
    custom: new CustomRuleValidator,
    async: new AsyncRuleValidator,
    compare: new CompareRuleValidator,
    pattern: new PatternRuleValidator,
    email: new EmailRuleValidator
};
var GroupConfig = _class2.default.inherit({
    ctor: function(group) {
        this.group = group;
        this.validators = [];
        this._pendingValidators = [];
        this._onValidatorStatusChanged = this._onValidatorStatusChanged.bind(this);
        this._resetValidationInfo()
    },
    validate: function() {
        var _this11 = this;
        var result = {
            isValid: true,
            brokenRules: [],
            validators: [],
            status: STATUS.valid,
            complete: null
        };
        this._unsubscribeFromAllChangeEvents();
        this._pendingValidators = [];
        this._resetValidationInfo();
        (0, _iterator.each)(this.validators, function(_, validator) {
            var validatorResult = validator.validate();
            result.isValid = result.isValid && validatorResult.isValid;
            if (validatorResult.brokenRules) {
                result.brokenRules = result.brokenRules.concat(validatorResult.brokenRules)
            }
            result.validators.push(validator);
            if (validatorResult.status === STATUS.pending) {
                _this11._addPendingValidator(validator)
            }
            _this11._subscribeToChangeEvents(validator)
        });
        if (this._pendingValidators.length) {
            result.status = STATUS.pending
        } else {
            result.status = result.isValid ? STATUS.valid : STATUS.invalid;
            this._unsubscribeFromAllChangeEvents();
            this._raiseValidatedEvent(result)
        }
        this._updateValidationInfo(result);
        return (0, _extend.extend)({}, this._validationInfo.result)
    },
    _subscribeToChangeEvents: function(validator) {
        validator.on("validating", this._onValidatorStatusChanged);
        validator.on("validated", this._onValidatorStatusChanged)
    },
    _unsubscribeFromChangeEvents: function(validator) {
        validator.off("validating", this._onValidatorStatusChanged);
        validator.off("validated", this._onValidatorStatusChanged)
    },
    _unsubscribeFromAllChangeEvents: function() {
        var _this12 = this;
        (0, _iterator.each)(this.validators, function(_, validator) {
            _this12._unsubscribeFromChangeEvents(validator)
        })
    },
    _updateValidationInfo: function(result) {
        this._validationInfo.result = result;
        if (result.status !== STATUS.pending) {
            return
        }
        if (!this._validationInfo.deferred) {
            this._validationInfo.deferred = new _deferred.Deferred;
            this._validationInfo.result.complete = this._validationInfo.deferred.promise()
        }
    },
    _addPendingValidator: function(validator) {
        var foundValidator = (0, _common.grep)(this._pendingValidators, function(val) {
            return val === validator
        })[0];
        if (!foundValidator) {
            this._pendingValidators.push(validator)
        }
    },
    _removePendingValidator: function(validator) {
        var index = (0, _array.inArray)(validator, this._pendingValidators);
        if (index >= 0) {
            this._pendingValidators.splice(index, 1)
        }
    },
    _orderBrokenRules: function(brokenRules) {
        var orderedRules = [];
        (0, _iterator.each)(this.validators, function(_, validator) {
            var foundRules = (0, _common.grep)(brokenRules, function(rule) {
                return rule.validator === validator
            });
            if (foundRules.length) {
                orderedRules = orderedRules.concat(foundRules)
            }
        });
        return orderedRules
    },
    _updateBrokenRules: function(result) {
        if (!this._validationInfo.result) {
            return
        }
        var brokenRules = this._validationInfo.result.brokenRules;
        var rules = (0, _common.grep)(brokenRules, function(rule) {
            return rule.validator !== result.validator
        });
        if (result.brokenRules) {
            brokenRules = rules.concat(result.brokenRules)
        }
        this._validationInfo.result.brokenRules = this._orderBrokenRules(brokenRules)
    },
    _onValidatorStatusChanged: function(result) {
        if (result.status === STATUS.pending) {
            this._addPendingValidator(result.validator);
            return
        }
        this._resolveIfComplete(result)
    },
    _resolveIfComplete: function(result) {
        this._removePendingValidator(result.validator);
        this._updateBrokenRules(result);
        if (!this._pendingValidators.length) {
            this._unsubscribeFromAllChangeEvents();
            if (!this._validationInfo.result) {
                return
            }
            this._validationInfo.result.status = 0 === this._validationInfo.result.brokenRules.length ? STATUS.valid : STATUS.invalid;
            this._validationInfo.result.isValid = this._validationInfo.result.status === STATUS.valid;
            var res = (0, _extend.extend)({}, this._validationInfo.result, {
                    complete: null
                }),
                deferred = this._validationInfo.deferred;
            this._resetValidationInfo();
            this._raiseValidatedEvent(res);
            deferred && setTimeout(function() {
                deferred.resolve(res)
            })
        }
    },
    _raiseValidatedEvent: function(result) {
        this.fireEvent("validated", [result])
    },
    _resetValidationInfo: function() {
        this._validationInfo = {
            result: null,
            deferred: null
        }
    },
    _synchronizeValidationInfo: function() {
        if (this._validationInfo.result) {
            this._validationInfo.result.validators = this.validators
        }
    },
    removeRegisteredValidator: function(validator) {
        var index = (0, _array.inArray)(validator, this.validators);
        if (index > -1) {
            this.validators.splice(index, 1);
            this._synchronizeValidationInfo();
            this._resolveIfComplete({
                validator: validator
            })
        }
    },
    registerValidator: function(validator) {
        if ((0, _array.inArray)(validator, this.validators) < 0) {
            this.validators.push(validator);
            this._synchronizeValidationInfo()
        }
    },
    reset: function() {
        (0, _iterator.each)(this.validators, function(_, validator) {
            validator.reset()
        });
        this._pendingValidators = [];
        this._resetValidationInfo()
    }
}).include(_events_mixin2.default);
var ValidationEngine = {
    groups: [],
    getGroupConfig: function(group) {
        var result = (0, _common.grep)(this.groups, function(config) {
            return config.group === group
        });
        if (result.length) {
            return result[0]
        }
    },
    findGroup: function($element, model) {
        var $dxGroup = $element.parents(".dx-validationgroup").first();
        if ($dxGroup.length) {
            return $dxGroup.dxValidationGroup("instance")
        }
        return model
    },
    initGroups: function() {
        this.groups = [];
        this.addGroup()
    },
    addGroup: function(group) {
        var config = this.getGroupConfig(group);
        if (!config) {
            config = new GroupConfig(group);
            this.groups.push(config)
        }
        return config
    },
    removeGroup: function(group) {
        var config = this.getGroupConfig(group),
            index = (0, _array.inArray)(config, this.groups);
        if (index > -1) {
            this.groups.splice(index, 1)
        }
        return config
    },
    _setDefaultMessage: function(info) {
        var rule = info.rule,
            validator = info.validator,
            name = info.name;
        if (!_type2.default.isDefined(rule.message)) {
            if (validator.defaultFormattedMessage && _type2.default.isDefined(name)) {
                rule.message = validator.defaultFormattedMessage(name)
            } else {
                rule.message = validator.defaultMessage()
            }
        }
    },
    _addBrokenRule: function(info) {
        var result = info.result,
            rule = info.rule;
        if (!result.brokenRule) {
            result.brokenRule = rule
        }
        if (!result.brokenRules) {
            result.brokenRules = []
        }
        result.brokenRules.push(rule)
    },
    validate: function(value, rules, name) {
        var _this13 = this;
        var result = {
            name: name,
            value: value,
            brokenRule: null,
            brokenRules: null,
            isValid: true,
            validationRules: rules,
            pendingRules: null,
            status: STATUS.valid,
            complete: null
        };
        var asyncRuleItems = [];
        (0, _iterator.each)(rules || [], function(_, rule) {
            var ruleValidator = rulesValidators[rule.type];
            var ruleValidationResult = void 0;
            if (ruleValidator) {
                if (_type2.default.isDefined(rule.isValid) && rule.value === value && !rule.reevaluate) {
                    if (!rule.isValid) {
                        result.isValid = false;
                        _this13._addBrokenRule({
                            result: result,
                            rule: rule
                        });
                        return false
                    }
                    return true
                }
                rule.value = value;
                if ("async" === rule.type) {
                    asyncRuleItems.push({
                        rule: rule,
                        ruleValidator: ruleValidator
                    });
                    return true
                }
                ruleValidationResult = ruleValidator.validate(value, rule);
                rule.isValid = ruleValidationResult;
                if (!ruleValidationResult) {
                    result.isValid = false;
                    _this13._setDefaultMessage({
                        rule: rule,
                        validator: ruleValidator,
                        name: name
                    });
                    _this13._addBrokenRule({
                        result: result,
                        rule: rule
                    })
                }
                if (!rule.isValid) {
                    return false
                }
            } else {
                throw _errors2.default.Error("E0100")
            }
        });
        if (result.isValid && !result.brokenRules && asyncRuleItems.length) {
            result = this._validateAsyncRules({
                value: value,
                items: asyncRuleItems,
                result: result,
                name: name
            })
        }
        result.status = result.pendingRules ? STATUS.pending : result.isValid ? STATUS.valid : STATUS.invalid;
        return result
    },
    _validateAsyncRules: function(_ref) {
        var _this14 = this;
        var result = _ref.result,
            value = _ref.value,
            items = _ref.items,
            name = _ref.name;
        var asyncResults = [];
        (0, _iterator.each)(items, function(_, item) {
            var validateResult = item.ruleValidator.validate(value, item.rule);
            if (!_type2.default.isPromise(validateResult)) {
                _this14._updateRuleConfig({
                    rule: item.rule,
                    ruleResult: _this14._getPatchedRuleResult(validateResult),
                    validator: item.ruleValidator,
                    name: name
                })
            } else {
                if (!result.pendingRules) {
                    result.pendingRules = []
                }
                result.pendingRules.push(item.rule);
                var asyncResult = validateResult.then(function(res) {
                    var ruleResult = _this14._getPatchedRuleResult(res);
                    _this14._updateRuleConfig({
                        rule: item.rule,
                        ruleResult: ruleResult,
                        validator: item.ruleValidator,
                        name: name
                    });
                    return ruleResult
                });
                asyncResults.push(asyncResult)
            }
        });
        if (asyncResults.length) {
            result.complete = _promise2.default.all(asyncResults).then(function(values) {
                return _this14._getAsyncRulesResult({
                    result: result,
                    values: values
                })
            })
        }
        return result
    },
    _updateRuleConfig: function(_ref2) {
        var rule = _ref2.rule,
            ruleResult = _ref2.ruleResult,
            validator = _ref2.validator,
            name = _ref2.name;
        rule.isValid = ruleResult.isValid;
        if (!ruleResult.isValid) {
            if (_type2.default.isDefined(ruleResult.message) && _type2.default.isString(ruleResult.message) && ruleResult.message.length) {
                rule.message = ruleResult.message
            } else {
                this._setDefaultMessage({
                    rule: rule,
                    validator: validator,
                    name: name
                })
            }
        }
    },
    _getPatchedRuleResult: function(ruleResult) {
        var result = void 0;
        var isValid = true;
        if (_type2.default.isObject(ruleResult)) {
            result = (0, _extend.extend)({}, ruleResult);
            if (!_type2.default.isDefined(result.isValid)) {
                result.isValid = isValid
            }
        } else {
            result = {
                isValid: _type2.default.isBoolean(ruleResult) ? ruleResult : isValid
            }
        }
        return result
    },
    _getAsyncRulesResult: function(_ref3) {
        var _this15 = this;
        var values = _ref3.values,
            result = _ref3.result;
        (0, _iterator.each)(values, function(index, val) {
            if (false === val.isValid) {
                result.isValid = val.isValid;
                var rule = result.pendingRules[index];
                _this15._addBrokenRule({
                    result: result,
                    rule: rule
                })
            }
        });
        result.pendingRules = null;
        result.complete = null;
        result.status = result.isValid ? STATUS.valid : STATUS.invalid;
        return result
    },
    registerValidatorInGroup: function(group, validator) {
        var groupConfig = ValidationEngine.addGroup(group);
        groupConfig.registerValidator.call(groupConfig, validator)
    },
    _shouldRemoveGroup: function(group, validatorsInGroup) {
        var isDefaultGroup = void 0 === group,
            isValidationGroupInstance = group && "dxValidationGroup" === group.NAME;
        return !isDefaultGroup && !isValidationGroupInstance && !validatorsInGroup.length
    },
    removeRegisteredValidator: function(group, validator) {
        var config = ValidationEngine.getGroupConfig(group);
        if (config) {
            config.removeRegisteredValidator.call(config, validator);
            var validatorsInGroup = config.validators;
            if (this._shouldRemoveGroup(group, validatorsInGroup)) {
                this.removeGroup(group)
            }
        }
    },
    initValidationOptions: function(options) {
        var _this16 = this;
        var initedOptions = {};
        if (options) {
            var syncOptions = ["isValid", "validationStatus", "validationError", "validationErrors"];
            syncOptions.forEach(function(prop) {
                if (prop in options) {
                    (0, _extend.extend)(initedOptions, _this16.synchronizeValidationOptions({
                        name: prop,
                        value: options[prop]
                    }, options))
                }
            })
        }
        return initedOptions
    },
    synchronizeValidationOptions: function(_ref4, options) {
        var name = _ref4.name,
            value = _ref4.value;
        switch (name) {
            case "validationStatus":
                var isValid = value === STATUS.valid || value === STATUS.pending;
                return options.isValid !== isValid ? {
                    isValid: isValid
                } : {};
            case "isValid":
                var validationStatus = options.validationStatus;
                var newStatus = validationStatus;
                if (value && validationStatus === STATUS.invalid) {
                    newStatus = STATUS.valid
                } else {
                    if (!value && validationStatus !== STATUS.invalid) {
                        newStatus = STATUS.invalid
                    }
                }
                return newStatus !== validationStatus ? {
                    validationStatus: newStatus
                } : {};
            case "validationErrors":
                var validationError = !value || !value.length ? null : value[0];
                return options.validationError !== validationError ? {
                    validationError: validationError
                } : {};
            case "validationError":
                var validationErrors = options.validationErrors;
                if (!value && validationErrors) {
                    return {
                        validationErrors: null
                    }
                } else {
                    if (value && !validationErrors) {
                        return {
                            validationErrors: [value]
                        }
                    } else {
                        if (value && validationErrors && value !== validationErrors[0]) {
                            validationErrors[0] = value;
                            return {
                                validationErrors: validationErrors.slice()
                            }
                        }
                    }
                }
        }
        return {}
    },
    validateGroup: function(group) {
        var groupConfig = ValidationEngine.getGroupConfig(group);
        if (!groupConfig) {
            throw _errors2.default.Error("E0110")
        }
        return groupConfig.validate()
    },
    resetGroup: function(group) {
        var groupConfig = ValidationEngine.getGroupConfig(group);
        if (!groupConfig) {
            throw _errors2.default.Error("E0110")
        }
        return groupConfig.reset()
    }
};
ValidationEngine.initGroups();
module.exports = ValidationEngine;
module.exports.default = module.exports;
