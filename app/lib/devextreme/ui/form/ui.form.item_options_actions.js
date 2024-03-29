/**
 * DevExtreme (ui/form/ui.form.item_options_actions.js)
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
var _uiForm = require("./ui.form.item_option_action");
var _uiForm2 = _interopRequireDefault(_uiForm);
var _element_data = require("../../core/element_data");
var _extend = require("../../core/utils/extend");
var _uiForm3 = require("./ui.form.utils");

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
var WidgetOptionItemOptionAction = function(_ItemOptionAction) {
    _inherits(WidgetOptionItemOptionAction, _ItemOptionAction);

    function WidgetOptionItemOptionAction() {
        _classCallCheck(this, WidgetOptionItemOptionAction);
        return _possibleConstructorReturn(this, (WidgetOptionItemOptionAction.__proto__ || Object.getPrototypeOf(WidgetOptionItemOptionAction)).apply(this, arguments))
    }
    _createClass(WidgetOptionItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var value = this._options.value;
            var instance = this.findInstance();
            if (instance) {
                instance.option(value);
                return true
            }
            return false
        }
    }]);
    return WidgetOptionItemOptionAction
}(_uiForm2.default);
var TabOptionItemOptionAction = function(_ItemOptionAction2) {
    _inherits(TabOptionItemOptionAction, _ItemOptionAction2);

    function TabOptionItemOptionAction() {
        _classCallCheck(this, TabOptionItemOptionAction);
        return _possibleConstructorReturn(this, (TabOptionItemOptionAction.__proto__ || Object.getPrototypeOf(TabOptionItemOptionAction)).apply(this, arguments))
    }
    _createClass(TabOptionItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var tabPanel = this.findInstance();
            if (tabPanel) {
                var _options = this._options,
                    optionName = _options.optionName,
                    item = _options.item,
                    value = _options.value;
                var itemIndex = this._itemsRunTimeInfo.findItemIndexByItem(item);
                if (itemIndex >= 0) {
                    tabPanel.option((0, _uiForm3.getFullOptionName)("items[" + itemIndex + "]", optionName), value);
                    return true
                }
            }
            return false
        }
    }]);
    return TabOptionItemOptionAction
}(_uiForm2.default);
var ValidationRulesItemOptionAction = function(_ItemOptionAction3) {
    _inherits(ValidationRulesItemOptionAction, _ItemOptionAction3);

    function ValidationRulesItemOptionAction() {
        _classCallCheck(this, ValidationRulesItemOptionAction);
        return _possibleConstructorReturn(this, (ValidationRulesItemOptionAction.__proto__ || Object.getPrototypeOf(ValidationRulesItemOptionAction)).apply(this, arguments))
    }
    _createClass(ValidationRulesItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var item = this._options.item;
            var instance = this.findInstance();
            var validator = instance && (0, _element_data.data)(instance.$element()[0], "dxValidator");
            if (validator && item) {
                var filterRequired = function(item) {
                    return "required" === item.type
                };
                var oldContainsRequired = (validator.option("validationRules") || []).some(filterRequired);
                var newContainsRequired = (item.validationRules || []).some(filterRequired);
                if (!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
                    validator.option("validationRules", item.validationRules);
                    return true
                }
            }
            return false
        }
    }]);
    return ValidationRulesItemOptionAction
}(_uiForm2.default);
var CssClassItemOptionAction = function(_ItemOptionAction4) {
    _inherits(CssClassItemOptionAction, _ItemOptionAction4);

    function CssClassItemOptionAction() {
        _classCallCheck(this, CssClassItemOptionAction);
        return _possibleConstructorReturn(this, (CssClassItemOptionAction.__proto__ || Object.getPrototypeOf(CssClassItemOptionAction)).apply(this, arguments))
    }
    _createClass(CssClassItemOptionAction, [{
        key: "tryExecute",
        value: function() {
            var $itemContainer = this.findItemContainer();
            var _options2 = this._options,
                previousValue = _options2.previousValue,
                value = _options2.value;
            if ($itemContainer) {
                $itemContainer.removeClass(previousValue).addClass(value);
                return true
            }
            return false
        }
    }]);
    return CssClassItemOptionAction
}(_uiForm2.default);
var tryCreateItemOptionAction = function(optionName, itemActionOptions) {
    switch (optionName) {
        case "editorOptions":
        case "buttonOptions":
            return new WidgetOptionItemOptionAction(itemActionOptions);
        case "validationRules":
            return new ValidationRulesItemOptionAction(itemActionOptions);
        case "cssClass":
            return new CssClassItemOptionAction(itemActionOptions);
        case "badge":
        case "disabled":
        case "icon":
        case "template":
        case "tabTemplate":
        case "title":
            return new TabOptionItemOptionAction((0, _extend.extend)(itemActionOptions, {
                optionName: optionName
            }));
        default:
            return null
    }
};
exports.default = tryCreateItemOptionAction;
