/**
 * DevExtreme (ui/splitter.js)
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
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _ui = require("./widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _dom_adapter = require("../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _pointer = require("../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);
var _utils = require("../events/utils");
var _type = require("../core/utils/type");

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
var SPLITTER_CLASS = "dx-splitter";
var SPLITTER_WRAPPER_CLASS = SPLITTER_CLASS + "-wrapper";
var SPLITTER_TRANSPARENT_CLASS = SPLITTER_CLASS + "-transparent";
var SPLITTER_BORDER_CLASS = SPLITTER_CLASS + "-border";
var SPLITTER_INITIAL_STATE_CLASS = SPLITTER_CLASS + "-initial";
var STATE_DISABLED_CLASS = "dx-state-disabled";
var SPLITTER_MODULE_NAMESPACE = "dxSplitterResizing";
var SPLITTER_POINTER_DOWN_EVENT_NAME = (0, _utils.addNamespace)(_pointer2.default.down, SPLITTER_MODULE_NAMESPACE);
var SPLITTER_POINTER_MOVE_EVENT_NAME = (0, _utils.addNamespace)(_pointer2.default.move, SPLITTER_MODULE_NAMESPACE);
var SPLITTER_POINTER_UP_EVENT_NAME = (0, _utils.addNamespace)(_pointer2.default.up, SPLITTER_MODULE_NAMESPACE);
var SplitterControl = function(_Widget) {
    _inherits(SplitterControl, _Widget);

    function SplitterControl() {
        _classCallCheck(this, SplitterControl);
        return _possibleConstructorReturn(this, (SplitterControl.__proto__ || Object.getPrototypeOf(SplitterControl)).apply(this, arguments))
    }
    _createClass(SplitterControl, [{
        key: "_initMarkup",
        value: function() {
            this._$container = this.option("container");
            this._$leftElement = this.option("leftElement");
            this._$rightElement = this.option("rightElement");
            this._onApplyPanelSize = this._createActionByOption("onApplyPanelSize");
            this.$element().addClass(SPLITTER_WRAPPER_CLASS).addClass(SPLITTER_INITIAL_STATE_CLASS);
            this._$splitterBorder = (0, _renderer2.default)("<div>").addClass(SPLITTER_BORDER_CLASS).appendTo(this.$element());
            this._$splitter = (0, _renderer2.default)("<div>").addClass(SPLITTER_CLASS).addClass(SPLITTER_TRANSPARENT_CLASS).appendTo(this._$splitterBorder)
        }
    }, {
        key: "_render",
        value: function() {
            _get(SplitterControl.prototype.__proto__ || Object.getPrototypeOf(SplitterControl.prototype), "_render", this).call(this);
            this._detachEventHandlers();
            this._attachEventHandlers()
        }
    }, {
        key: "_clean",
        value: function() {
            this._detachEventHandlers();
            _get(SplitterControl.prototype.__proto__ || Object.getPrototypeOf(SplitterControl.prototype), "_clean", this).call(this)
        }
    }, {
        key: "_attachEventHandlers",
        value: function() {
            var document = _dom_adapter2.default.getDocument();
            _events_engine2.default.on(this._$splitter, SPLITTER_POINTER_DOWN_EVENT_NAME, this._onMouseDownHandler.bind(this));
            _events_engine2.default.on(document, SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));
            _events_engine2.default.on(document, SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this))
        }
    }, {
        key: "_detachEventHandlers",
        value: function() {
            var document = _dom_adapter2.default.getDocument();
            _events_engine2.default.off(this._$splitter, SPLITTER_POINTER_DOWN_EVENT_NAME);
            _events_engine2.default.off(document, SPLITTER_POINTER_MOVE_EVENT_NAME);
            _events_engine2.default.off(document, SPLITTER_POINTER_UP_EVENT_NAME)
        }
    }, {
        key: "_dimensionChanged",
        value: function() {
            if (void 0 === this._leftPanelPercentageWidth) {
                var leftElementWidth = this._$leftElement.get(0).clientWidth;
                this._leftPanelPercentageWidth = this._convertLeftPanelWidthToPercentage(leftElementWidth)
            }
            var rightPanelWidth = 100 - this._leftPanelPercentageWidth;
            this._onApplyPanelSize({
                leftPanelWidth: this._leftPanelPercentageWidth + "%",
                rightPanelWidth: rightPanelWidth + "%"
            });
            this.setSplitterPositionLeft(this._$leftElement.get(0).clientWidth)
        }
    }, {
        key: "_onMouseDownHandler",
        value: function(e) {
            e.preventDefault();
            this.$element().removeClass(SPLITTER_INITIAL_STATE_CLASS);
            this._$splitter.removeClass(SPLITTER_TRANSPARENT_CLASS);
            this._offsetX = e.offsetX <= this._$splitterBorder.get(0).clientWidth ? e.offsetX : 0;
            this._isSplitterActive = true;
            this._containerWidth = this._$container.get(0).clientWidth;
            this.setSplitterPositionLeft(this._getNewSplitterPositionLeft(e))
        }
    }, {
        key: "_onMouseMoveHandler",
        value: function(e) {
            if (!this._isSplitterActive) {
                return
            }
            var splitterPositionLeft = this._getNewSplitterPositionLeft(e);
            var leftPanelWidth = splitterPositionLeft;
            var rightPanelWidth = this._containerWidth - leftPanelWidth;
            this.setSplitterPositionLeft(splitterPositionLeft);
            this._onApplyPanelSize({
                leftPanelWidth: leftPanelWidth,
                rightPanelWidth: rightPanelWidth
            });
            this._leftPanelPercentageWidth = this._convertLeftPanelWidthToPercentage(leftPanelWidth)
        }
    }, {
        key: "_onMouseUpHandler",
        value: function() {
            if (this._isSplitterActive) {
                this._$splitter.addClass(SPLITTER_TRANSPARENT_CLASS);
                this._isSplitterActive = false
            }
        }
    }, {
        key: "_getNewSplitterPositionLeft",
        value: function(e) {
            var newSplitterPositionLeft = e.pageX - this._$container.offset().left - this._offsetX;
            newSplitterPositionLeft = Math.max(0, newSplitterPositionLeft);
            newSplitterPositionLeft = Math.min(this._containerWidth - this._$splitterBorder.get(0).clientWidth, newSplitterPositionLeft);
            return newSplitterPositionLeft
        }
    }, {
        key: "_isDomElement",
        value: function(element) {
            return element && element.nodeType && 1 === element.nodeType
        }
    }, {
        key: "_isPercentValue",
        value: function(value) {
            return (0, _type.isString)(value) && "%" === value.slice(-1)
        }
    }, {
        key: "toggleState",
        value: function(isActive) {
            var classAction = isActive ? "removeClass" : "addClass";
            this.$element()[classAction](STATE_DISABLED_CLASS);
            this._$splitter[classAction](STATE_DISABLED_CLASS)
        }
    }, {
        key: "isSplitterMoved",
        value: function() {
            return !this.$element().hasClass(SPLITTER_INITIAL_STATE_CLASS)
        }
    }, {
        key: "setSplitterPositionLeft",
        value: function(splitterPositionLeft) {
            this.$element().css("left", splitterPositionLeft)
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "initialLeftPanelWidth":
                    this._leftPanelPercentageWidth = this._convertLeftPanelWidthToPercentage(args.value);
                    this._dimensionChanged();
                    break;
                case "leftElement":
                    this.repaint();
                    break;
                default:
                    _get(SplitterControl.prototype.__proto__ || Object.getPrototypeOf(SplitterControl.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_convertLeftPanelWidthToPercentage",
        value: function(leftPanelWidth) {
            return leftPanelWidth / this._$container.get(0).clientWidth * 100
        }
    }]);
    return SplitterControl
}(_ui2.default);
exports.default = SplitterControl;
