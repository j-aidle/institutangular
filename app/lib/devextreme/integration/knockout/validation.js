/**
 * DevExtreme (integration/knockout/validation.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _class = require("../../core/class");
var _class2 = _interopRequireDefault(_class);
var _events_mixin = require("../../core/events_mixin");
var _events_mixin2 = _interopRequireDefault(_events_mixin);
var _validation_engine = require("../../ui/validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _deferred = require("../../core/utils/deferred");
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _knockout = require("knockout");
var _knockout2 = _interopRequireDefault(_knockout);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var VALIDATION_STATUS_VALID = "valid",
    VALIDATION_STATUS_PENDING = "pending";
var koDxValidator = _class2.default.inherit({
    ctor: function(target, _ref) {
        var _this = this;
        var name = _ref.name,
            validationRules = _ref.validationRules;
        this.target = target;
        this.name = name;
        this.isValid = _knockout2.default.observable(true);
        this.validationError = _knockout2.default.observable();
        this.validationErrors = _knockout2.default.observable();
        this.validationStatus = _knockout2.default.observable(VALIDATION_STATUS_VALID);
        this.validationRules = (0, _iterator.map)(validationRules, function(rule, index) {
            return (0, _extend.extend)({}, rule, {
                validator: _this,
                index: index
            })
        });
        this._validationInfo = {
            result: null,
            deferred: null
        }
    },
    _updateValidationResult: function(result) {
        if (!this._validationInfo.result || this._validationInfo.result.id !== result.id) {
            var complete = this._validationInfo.deferred && this._validationInfo.result.complete;
            this._validationInfo.result = (0, _extend.extend)({}, result, {
                complete: complete
            })
        } else {
            for (var prop in result) {
                if ("id" !== prop && "complete" !== prop) {
                    this._validationInfo.result[prop] = result[prop]
                }
            }
        }
    },
    validate: function() {
        var _this2 = this;
        var currentResult = this._validationInfo && this._validationInfo.result,
            value = this.target();
        if (currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
            return (0, _extend.extend)({}, currentResult)
        }
        var result = _validation_engine2.default.validate(value, this.validationRules, this.name);
        result.id = (new _guid2.default).toString();
        this._applyValidationResult(result);
        result.complete && result.complete.then(function(res) {
            if (res.id === _this2._validationInfo.result.id) {
                _this2._applyValidationResult(res)
            }
        });
        return (0, _extend.extend)({}, this._validationInfo.result)
    },
    reset: function() {
        this.target(null);
        var result = {
            id: null,
            isValid: true,
            brokenRule: null,
            pendingRules: null,
            status: VALIDATION_STATUS_VALID,
            complete: null
        };
        this._applyValidationResult(result);
        return result
    },
    _applyValidationResult: function(result) {
        result.validator = this;
        this._updateValidationResult(result);
        this.target.dxValidator.isValid(this._validationInfo.result.isValid);
        this.target.dxValidator.validationError(this._validationInfo.result.brokenRule);
        this.target.dxValidator.validationErrors(this._validationInfo.result.brokenRules);
        this.target.dxValidator.validationStatus(this._validationInfo.result.status);
        if (result.status === VALIDATION_STATUS_PENDING) {
            if (!this._validationInfo.deferred) {
                this._validationInfo.deferred = new _deferred.Deferred;
                this._validationInfo.result.complete = this._validationInfo.deferred.promise()
            }
            this.fireEvent("validating", [this._validationInfo.result]);
            return
        }
        if (result.status !== VALIDATION_STATUS_PENDING) {
            this.fireEvent("validated", [result]);
            if (this._validationInfo.deferred) {
                this._validationInfo.deferred.resolve(result);
                this._validationInfo.deferred = null
            }
        }
    }
}).include(_events_mixin2.default);
_knockout2.default.extenders.dxValidator = function(target, option) {
    target.dxValidator = new koDxValidator(target, option);
    target.subscribe(target.dxValidator.validate.bind(target.dxValidator));
    return target
};
_validation_engine2.default.registerModelForValidation = function(model) {
    (0, _iterator.each)(model, function(name, member) {
        if (_knockout2.default.isObservable(member) && member.dxValidator) {
            _validation_engine2.default.registerValidatorInGroup(model, member.dxValidator)
        }
    })
};
_validation_engine2.default.unregisterModelForValidation = function(model) {
    (0, _iterator.each)(model, function(name, member) {
        if (_knockout2.default.isObservable(member) && member.dxValidator) {
            _validation_engine2.default.removeRegisteredValidator(model, member.dxValidator)
        }
    })
};
_validation_engine2.default.validateModel = _validation_engine2.default.validateGroup;
