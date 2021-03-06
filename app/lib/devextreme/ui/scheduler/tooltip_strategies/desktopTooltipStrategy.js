/**
 * DevExtreme (ui/scheduler/tooltip_strategies/desktopTooltipStrategy.js)
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
exports.DesktopTooltipStrategy = void 0;
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
var _renderer = require("../../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _tooltipStrategyBase = require("./tooltipStrategyBase");
var _tooltip = require("../../tooltip");
var _tooltip2 = _interopRequireDefault(_tooltip);
var _translator = require("../../../animation/translator");
var _translator2 = _interopRequireDefault(_translator);
var _function_template = require("../../../core/templates/function_template");
var _support = require("../../../core/utils/support");

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
var APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
var MAX_TOOLTIP_HEIGHT = 200;
var LIST_ITEM_DATA_KEY = "dxListItemData";
var FIXED_CONTAINER_CLASS = "dx-scheduler-fixed-appointments";
var LIST_ITEM_CLASS = "dx-list-item";
var TooltipBehaviorBase = function() {
    function TooltipBehaviorBase(scheduler) {
        _classCallCheck(this, TooltipBehaviorBase);
        this.scheduler = scheduler
    }
    _createClass(TooltipBehaviorBase, [{
        key: "onListRendered",
        value: function(e) {}
    }, {
        key: "onListItemClick",
        value: function(e) {}
    }, {
        key: "getItemListTemplateName",
        value: function() {
            return "appointmentTooltipTemplate"
        }
    }, {
        key: "getItemListDefaultTemplateName",
        value: function() {
            return "appointmentTooltip"
        }
    }, {
        key: "createFunctionTemplate",
        value: function(template, data, targetData, index) {
            return (0, _tooltipStrategyBase.createDefaultTooltipTemplate)(template, data, targetData, index)
        }
    }]);
    return TooltipBehaviorBase
}();
var TooltipSingleAppointmentBehavior = function(_TooltipBehaviorBase) {
    _inherits(TooltipSingleAppointmentBehavior, _TooltipBehaviorBase);

    function TooltipSingleAppointmentBehavior() {
        _classCallCheck(this, TooltipSingleAppointmentBehavior);
        return _possibleConstructorReturn(this, (TooltipSingleAppointmentBehavior.__proto__ || Object.getPrototypeOf(TooltipSingleAppointmentBehavior)).apply(this, arguments))
    }
    _createClass(TooltipSingleAppointmentBehavior, [{
        key: "onListItemClick",
        value: function(e) {
            this.scheduler.showAppointmentPopup(e.itemData.data, false, e.itemData.currentData)
        }
    }, {
        key: "canRaiseClickEvent",
        value: function() {
            return false
        }
    }]);
    return TooltipSingleAppointmentBehavior
}(TooltipBehaviorBase);
var TooltipManyAppointmentsBehavior = function(_TooltipBehaviorBase2) {
    _inherits(TooltipManyAppointmentsBehavior, _TooltipBehaviorBase2);

    function TooltipManyAppointmentsBehavior(scheduler, isAllDay) {
        _classCallCheck(this, TooltipManyAppointmentsBehavior);
        var _this2 = _possibleConstructorReturn(this, (TooltipManyAppointmentsBehavior.__proto__ || Object.getPrototypeOf(TooltipManyAppointmentsBehavior)).call(this, scheduler));
        _this2.state = {
            isAllDay: isAllDay,
            appointment: null,
            initPosition: {}
        };
        return _this2
    }
    _createClass(TooltipManyAppointmentsBehavior, [{
        key: "onListRendered",
        value: function(e) {
            var _this3 = this;
            var dragElement = void 0,
                $element = (0, _renderer2.default)(e.element);
            if (this.scheduler._allowDragging()) {
                var dragBehavior = this._getWorkspaceInstance().dragBehavior;
                dragBehavior && dragBehavior.addTo($element, {
                    filter: "." + LIST_ITEM_CLASS,
                    container: this.scheduler.$element().find("." + FIXED_CONTAINER_CLASS),
                    cursorOffset: function() {
                        var $dragElement = (0, _renderer2.default)(dragElement);
                        return {
                            x: $dragElement.width() / 2,
                            y: $dragElement.height() / 2
                        }
                    },
                    dragTemplate: function() {
                        return dragElement
                    },
                    onDragStart: function(e) {
                        var event = e.event,
                            itemData = (0, _renderer2.default)(e.itemElement).data(LIST_ITEM_DATA_KEY);
                        if (itemData) {
                            event.data = event.data || {};
                            event.data.itemElement = dragElement = _this3._createDragAppointment(itemData.data, itemData.data.settings);
                            dragBehavior.initialPosition = _translator2.default.locate((0, _renderer2.default)(dragElement));
                            _translator2.default.resetPosition((0, _renderer2.default)(dragElement));
                            _this3.scheduler.hideAppointmentTooltip()
                        }
                    }
                })
            }
        }
    }, {
        key: "canRaiseClickEvent",
        value: function() {
            return true
        }
    }, {
        key: "createFunctionTemplate",
        value: function(template, data, targetData, index) {
            if (this._isEmptyDropDownAppointmentTemplate()) {
                return _get(TooltipManyAppointmentsBehavior.prototype.__proto__ || Object.getPrototypeOf(TooltipManyAppointmentsBehavior.prototype), "createFunctionTemplate", this).call(this, template, data, targetData, index)
            }
            return new _function_template.FunctionTemplate(function(options) {
                return template.render({
                    model: data,
                    index: index,
                    container: options.container
                })
            })
        }
    }, {
        key: "getItemListTemplateName",
        value: function() {
            return this._isEmptyDropDownAppointmentTemplate() ? "appointmentTooltipTemplate" : "dropDownAppointmentTemplate"
        }
    }, {
        key: "getItemListDefaultTemplateName",
        value: function() {
            return this._isEmptyDropDownAppointmentTemplate() ? "appointmentTooltip" : "dropDownAppointment"
        }
    }, {
        key: "_isEmptyDropDownAppointmentTemplate",
        value: function() {
            return "dropDownAppointment" === this.scheduler.option().dropDownAppointmentTemplate
        }
    }, {
        key: "_getAppointmentsInstance",
        value: function() {
            return this.scheduler.getAppointmentsInstance()
        }
    }, {
        key: "_getWorkspaceInstance",
        value: function() {
            return this.scheduler.getWorkSpace()
        }
    }, {
        key: "_createDragAppointment",
        value: function(itemData, settings) {
            var appointments = this._getAppointmentsInstance();
            var appointmentIndex = appointments.option("items").length;
            settings[0].isCompact = false;
            settings[0].virtual = false;
            appointments._currentAppointmentSettings = settings;
            appointments._renderItem(appointmentIndex, {
                itemData: itemData,
                settings: settings
            });
            var appointmentList = appointments._findItemElementByItem(itemData);
            return appointmentList.length > 1 ? this._getRecurrencePart(appointmentList, settings[0].startDate) : appointmentList[0]
        }
    }, {
        key: "_getRecurrencePart",
        value: function(appointments, startDate) {
            return appointments.some(function(appointment) {
                var appointmentStartDate = appointment.data("dxAppointmentStartDate");
                return appointmentStartDate.getTime() === startDate.getTime()
            })
        }
    }, {
        key: "_createInitPosition",
        value: function(appointment, mousePosition) {
            var dragAndDropContainer = appointment.parent().get(0);
            var dragAndDropContainerRect = dragAndDropContainer.getBoundingClientRect();
            return {
                top: mousePosition.top - dragAndDropContainerRect.top - appointment.height() / 2,
                left: mousePosition.left - dragAndDropContainerRect.left - appointment.width() / 2
            }
        }
    }]);
    return TooltipManyAppointmentsBehavior
}(TooltipBehaviorBase);
var DesktopTooltipStrategy = exports.DesktopTooltipStrategy = function(_TooltipStrategyBase) {
    _inherits(DesktopTooltipStrategy, _TooltipStrategyBase);

    function DesktopTooltipStrategy(scheduler) {
        _classCallCheck(this, DesktopTooltipStrategy);
        var _this4 = _possibleConstructorReturn(this, (DesktopTooltipStrategy.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy)).call(this, scheduler));
        _this4.skipHidingOnScroll = false;
        _this4.isSingleBehavior = false;
        return _this4
    }
    _createClass(DesktopTooltipStrategy, [{
        key: "_showCore",
        value: function(target, dataList, isSingleBehavior) {
            this.isSingleBehavior = isSingleBehavior;
            this.behavior = this._createBehavior(isSingleBehavior);
            _get(DesktopTooltipStrategy.prototype.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy.prototype), "_showCore", this).call(this, target, dataList, isSingleBehavior);
            this.tooltip.option("position", this._getTooltipPosition(dataList))
        }
    }, {
        key: "_onShown",
        value: function() {
            _get(DesktopTooltipStrategy.prototype.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy.prototype), "_onShown", this).call(this);
            if (!this.isSingleBehavior) {
                this.list.focus();
                this.list.option("focusedElement", null)
            }
        }
    }, {
        key: "_createBehavior",
        value: function(isSingleBehavior) {
            return isSingleBehavior ? new TooltipSingleAppointmentBehavior(this.scheduler) : new TooltipManyAppointmentsBehavior(this.scheduler)
        }
    }, {
        key: "_getTooltipPosition",
        value: function(dataList) {
            return {
                my: "bottom",
                at: "top",
                of: this.target,
                collision: "fit flipfit",
                boundary: this._getBoundary(dataList),
                offset: this.scheduler.option("_appointmentTooltipOffset")
            }
        }
    }, {
        key: "_getBoundary",
        value: function(dataList) {
            return this._isAppointmentInAllDayPanel(dataList[0].data) ? this.scheduler.$element() : this.scheduler.getWorkSpaceScrollableContainer()
        }
    }, {
        key: "_isAppointmentInAllDayPanel",
        value: function(appointmentData) {
            var workSpace = this.scheduler._workSpace,
                itTakesAllDay = this.scheduler.appointmentTakesAllDay(appointmentData);
            return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option("showAllDayPanel")
        }
    }, {
        key: "_createFunctionTemplate",
        value: function(template, data, targetData, index) {
            return this.behavior.createFunctionTemplate(template, data, targetData, index)
        }
    }, {
        key: "_getItemListTemplateName",
        value: function() {
            return this.behavior.getItemListTemplateName()
        }
    }, {
        key: "_getItemListDefaultTemplateName",
        value: function() {
            return this.behavior.getItemListDefaultTemplateName()
        }
    }, {
        key: "_createListOption",
        value: function(target, dataList) {
            var result = _get(DesktopTooltipStrategy.prototype.__proto__ || Object.getPrototypeOf(DesktopTooltipStrategy.prototype), "_createListOption", this).call(this, target, dataList);
            result.showScrollbar = _support.touch ? "always" : "onHover";
            return result
        }
    }, {
        key: "_createTooltip",
        value: function(target) {
            var _this5 = this;
            this.$tooltip = this._createTooltipElement();
            return this.scheduler._createComponent(this.$tooltip, _tooltip2.default, {
                target: target,
                onShowing: this._onTooltipShowing.bind(this),
                closeOnTargetScroll: function() {
                    return _this5.skipHidingOnScroll
                },
                maxHeight: MAX_TOOLTIP_HEIGHT,
                rtlEnabled: this.scheduler.option("rtlEnabled")
            })
        }
    }, {
        key: "dispose",
        value: function() {
            clearTimeout(this.skipHidingOnScrollTimeId)
        }
    }, {
        key: "_onTooltipShowing",
        value: function() {
            var _this6 = this;
            clearTimeout(this.skipHidingOnScrollTimeId);
            this.skipHidingOnScroll = true;
            this.skipHidingOnScrollTimeId = setTimeout(function() {
                _this6.skipHidingOnScroll = false;
                clearTimeout(_this6.skipHidingOnScrollTimeId)
            }, 0)
        }
    }, {
        key: "_createTooltipElement",
        value: function() {
            return (0, _renderer2.default)("<div>").appendTo(this.scheduler.$element()).addClass(APPOINTMENT_TOOLTIP_WRAPPER_CLASS)
        }
    }, {
        key: "_onListRendered",
        value: function(e) {
            this.behavior.onListRendered(e)
        }
    }, {
        key: "_canRaiseClickEvent",
        value: function() {
            return this.behavior.canRaiseClickEvent()
        }
    }]);
    return DesktopTooltipStrategy
}(_tooltipStrategyBase.TooltipStrategyBase);
