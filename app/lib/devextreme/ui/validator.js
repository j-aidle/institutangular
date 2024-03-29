/**
 * DevExtreme (ui/validator.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _element_data = require("../core/element_data");
var _element_data2 = _interopRequireDefault(_element_data);
var _callbacks = require("../core/utils/callbacks");
var _callbacks2 = _interopRequireDefault(_callbacks);
var _ui = require("./widget/ui.errors");
var _ui2 = _interopRequireDefault(_ui);
var _dom_component = require("../core/dom_component");
var _dom_component2 = _interopRequireDefault(_dom_component);
var _extend = require("../core/utils/extend");
var _iterator = require("../core/utils/iterator");
var _validation_engine = require("./validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _default_adapter = require("./validation/default_adapter");
var _default_adapter2 = _interopRequireDefault(_default_adapter);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _deferred = require("../core/utils/deferred");
var _guid = require("../core/guid");
var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var VALIDATOR_CLASS = "dx-validator",
    VALIDATION_STATUS_VALID = "valid",
    VALIDATION_STATUS_INVALID = "invalid",
    VALIDATION_STATUS_PENDING = "pending";
var Validator = _dom_component2.default.inherit({
    _initOptions: function(options) {
        this.callBase.apply(this, arguments);
        this.option(_validation_engine2.default.initValidationOptions(options))
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            validationRules: []
        })
    },
    _init: function() {
        this.callBase();
        this._initGroupRegistration();
        this.focused = (0, _callbacks2.default)();
        this._initAdapter();
        this._validationInfo = {
            result: null,
            deferred: null,
            skipValidation: false
        }
    },
    _initGroupRegistration: function() {
        var group = this._findGroup();
        if (!this._groupWasInit) {
            this.on("disposing", function(args) {
                _validation_engine2.default.removeRegisteredValidator(args.component._validationGroup, args.component)
            })
        }
        if (!this._groupWasInit || this._validationGroup !== group) {
            _validation_engine2.default.removeRegisteredValidator(this._validationGroup, this);
            this._groupWasInit = true;
            this._validationGroup = group;
            _validation_engine2.default.registerValidatorInGroup(group, this)
        }
    },
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            validationGroup: true
        })
    },
    _initAdapter: function() {
        var _this = this;
        var element = this.$element()[0],
            dxStandardEditor = _element_data2.default.data(element, "dx-validation-target");
        var adapter = this.option("adapter");
        if (!adapter) {
            if (dxStandardEditor) {
                adapter = new _default_adapter2.default(dxStandardEditor, this);
                adapter.validationRequestsCallbacks.add(function(args) {
                    if (_this._validationInfo.skipValidation) {
                        return
                    }
                    _this.validate(args)
                });
                this.option("adapter", adapter);
                return
            }
            throw _ui2.default.Error("E0120")
        }
        var callbacks = adapter.validationRequestsCallbacks;
        if (callbacks) {
            if (Array.isArray(callbacks)) {
                callbacks.push(function(args) {
                    _this.validate(args)
                })
            } else {
                _ui2.default.log("W0014", "validationRequestsCallbacks", "jQuery.Callbacks", "17.2", "Use the array instead");
                callbacks.add(function(args) {
                    _this.validate(args)
                })
            }
        }
    },
    _initMarkup: function() {
        this.$element().addClass(VALIDATOR_CLASS);
        this.callBase()
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            this._initGroupRegistration()
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "validationGroup":
                this._initGroupRegistration();
                return;
            case "validationRules":
                this._resetValidationRules();
                void 0 !== this.option("isValid") && this.validate();
                return;
            case "adapter":
                this._initAdapter();
                break;
            case "isValid":
            case "validationStatus":
                this.option(_validation_engine2.default.synchronizeValidationOptions(args, this.option()));
                break;
            default:
                this.callBase(args)
        }
    },
    _getValidationRules: function() {
        var _this2 = this;
        if (!this._validationRules) {
            this._validationRules = (0, _iterator.map)(this.option("validationRules"), function(rule, index) {
                return (0, _extend.extend)({}, rule, {
                    validator: _this2,
                    index: index
                })
            })
        }
        return this._validationRules
    },
    _findGroup: function() {
        var $element = this.$element();
        return this.option("validationGroup") || _validation_engine2.default.findGroup($element, this._modelByElement($element))
    },
    _resetValidationRules: function() {
        delete this._validationRules
    },
    validate: function(args) {
        var _this3 = this;
        var adapter = this.option("adapter"),
            name = this.option("name"),
            bypass = adapter.bypass && adapter.bypass(),
            value = args && void 0 !== args.value ? args.value : adapter.getValue(),
            currentError = adapter.getCurrentValidationError && adapter.getCurrentValidationError(),
            rules = this._getValidationRules();
        var currentResult = this._validationInfo && this._validationInfo.result;
        if (currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
            return (0, _extend.extend)({}, currentResult)
        }
        var result = void 0;
        if (bypass) {
            result = {
                isValid: true,
                status: VALIDATION_STATUS_VALID
            }
        } else {
            if (currentError && currentError.editorSpecific) {
                currentError.validator = this;
                result = {
                    isValid: false,
                    status: VALIDATION_STATUS_INVALID,
                    brokenRule: currentError,
                    brokenRules: [currentError]
                }
            } else {
                result = _validation_engine2.default.validate(value, rules, name)
            }
        }
        result.id = (new _guid2.default).toString();
        this._applyValidationResult(result, adapter);
        result.complete && result.complete.then(function(res) {
            if (res.id === _this3._validationInfo.result.id) {
                _this3._applyValidationResult(res, adapter)
            }
        });
        return (0, _extend.extend)({}, this._validationInfo.result)
    },
    reset: function() {
        var adapter = this.option("adapter"),
            result = {
                id: null,
                isValid: true,
                brokenRule: null,
                brokenRules: null,
                pendingRules: null,
                status: VALIDATION_STATUS_VALID,
                complete: null
            };
        this._validationInfo.skipValidation = true;
        adapter.reset();
        this._validationInfo.skipValidation = false;
        this._resetValidationRules();
        this._applyValidationResult(result, adapter)
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
    _applyValidationResult: function(result, adapter) {
        var validatedAction = this._createActionByOption("onValidated");
        result.validator = this;
        this._updateValidationResult(result);
        adapter.applyValidationResults && adapter.applyValidationResults(this._validationInfo.result);
        this.option({
            validationStatus: this._validationInfo.result.status
        });
        if (this._validationInfo.result.status === VALIDATION_STATUS_PENDING) {
            if (!this._validationInfo.deferred) {
                this._validationInfo.deferred = new _deferred.Deferred;
                this._validationInfo.result.complete = this._validationInfo.deferred.promise()
            }
            this.fireEvent("validating", [this._validationInfo.result]);
            return
        }
        if (this._validationInfo.result.status !== VALIDATION_STATUS_PENDING) {
            validatedAction(result);
            if (this._validationInfo.deferred) {
                this._validationInfo.deferred.resolve(result);
                this._validationInfo.deferred = null
            }
        }
    },
    focus: function() {
        var adapter = this.option("adapter");
        adapter && adapter.focus && adapter.focus()
    }
});
(0, _component_registrator2.default)("dxValidator", Validator);
module.exports = Validator;
module.exports.default = module.exports;
