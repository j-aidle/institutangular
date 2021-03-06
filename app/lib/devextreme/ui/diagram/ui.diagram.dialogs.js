/**
 * DevExtreme (ui/diagram/ui.diagram.dialogs.js)
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
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);

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
var Popup = require("../popup"),
    extend = require("../../core/utils/extend").extend;
var DiagramDialog = function(_Widget) {
    _inherits(DiagramDialog, _Widget);

    function DiagramDialog() {
        _classCallCheck(this, DiagramDialog);
        return _possibleConstructorReturn(this, (DiagramDialog.__proto__ || Object.getPrototypeOf(DiagramDialog)).apply(this, arguments))
    }
    _createClass(DiagramDialog, [{
        key: "_init",
        value: function() {
            _get(DiagramDialog.prototype.__proto__ || Object.getPrototypeOf(DiagramDialog.prototype), "_init", this).call(this);
            this._command = void 0;
            this._isShown = false;
            this._createOnGetContentOption();
            this._createOnHiddenOption()
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(DiagramDialog.prototype.__proto__ || Object.getPrototypeOf(DiagramDialog.prototype), "_initMarkup", this).call(this);
            this._command = this.option("command");
            this._$popupElement = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._popupInstance = this._createComponent(this._$popupElement, Popup, {
                title: this.option("title"),
                maxWidth: this.option("maxWidth"),
                height: this.option("height"),
                toolbarItems: this.option("toolbarItems"),
                onHidden: this._onHiddenAction
            })
        }
    }, {
        key: "_clean",
        value: function() {
            delete this._popupInstance;
            this._$popupElement && this._$popupElement.remove()
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return extend(_get(DiagramDialog.prototype.__proto__ || Object.getPrototypeOf(DiagramDialog.prototype), "_getDefaultOptions", this).call(this), {
                title: "",
                maxWidth: 500,
                height: "auto",
                toolbarItems: this._getToolbarItems()
            })
        }
    }, {
        key: "_getToolbarItems",
        value: function() {
            return [this._getOkToolbarItem(), this._getCancelToolbarItem()]
        }
    }, {
        key: "_getOkToolbarItem",
        value: function() {
            return {
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: _message2.default.format("dxDiagram-dialogButtonOK"),
                    onClick: function() {
                        this._command.execute(this._commandParameter);
                        this._hide()
                    }.bind(this)
                }
            }
        }
    }, {
        key: "_getCancelToolbarItem",
        value: function() {
            return {
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: _message2.default.format("dxDiagram-dialogButtonCancel"),
                    onClick: this._hide.bind(this)
                }
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "title":
                case "maxWidth":
                case "height":
                case "toolbarItems":
                    this._popupInstance.option(args.name, args.value);
                    break;
                case "command":
                    this._command = args.value;
                    break;
                case "onGetContent":
                    this._createOnGetContentOption();
                    break;
                case "onHidden":
                    this._createOnHiddenOption();
                    break;
                default:
                    _get(DiagramDialog.prototype.__proto__ || Object.getPrototypeOf(DiagramDialog.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_createOnGetContentOption",
        value: function() {
            this._onGetContentAction = this._createActionByOption("onGetContent")
        }
    }, {
        key: "_createOnHiddenOption",
        value: function() {
            this._onHiddenAction = this._createActionByOption("onHidden")
        }
    }, {
        key: "_hide",
        value: function() {
            this._popupInstance.hide();
            this._isShown = false
        }
    }, {
        key: "_show",
        value: function() {
            this._popupInstance.content().empty().append(this._onGetContentAction());
            this._popupInstance.show();
            this._isShown = true
        }
    }, {
        key: "isVisible",
        value: function() {
            return this._isShown
        }
    }]);
    return DiagramDialog
}(_ui2.default);
module.exports = DiagramDialog;
