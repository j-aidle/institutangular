/**
 * DevExtreme (ui/scheduler/appointmentPopup.js)
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);
var _window = require("../../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _uiScheduler = require("./ui.scheduler.appointment_form");
var _uiScheduler2 = _interopRequireDefault(_uiScheduler);
var _devices = require("../../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _dom = require("../../core/utils/dom");
var _dom2 = _interopRequireDefault(_dom);
var _object = require("../../core/utils/object");
var _object2 = _interopRequireDefault(_object);
var _date = require("../../core/utils/date");
var _date2 = _interopRequireDefault(_date);
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _deferred = require("../../core/utils/deferred");

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
var toMs = _date2.default.dateToMilliseconds;
var WIDGET_CLASS = "dx-scheduler";
var APPOINTMENT_POPUP_CLASS = WIDGET_CLASS + "-appointment-popup";
var APPOINTMENT_POPUP_WIDTH = 610;
var APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH = 768;
var TOOLBAR_ITEM_AFTER_LOCATION = "after";
var TOOLBAR_ITEM_BEFORE_LOCATION = "before";
var AppointmentPopup = function() {
    function AppointmentPopup(scheduler) {
        _classCallCheck(this, AppointmentPopup);
        this.scheduler = scheduler;
        this._popup = null;
        this._appointmentForm = null;
        this.state = {
            lastEditData: null,
            appointment: {
                data: null,
                processTimeZone: false,
                isEmptyText: false,
                isEmptyDescription: false
            }
        }
    }
    _createClass(AppointmentPopup, [{
        key: "show",
        value: function(data, showButtons, processTimeZone) {
            var _this = this;
            this.state.appointment = {
                data: data,
                processTimeZone: processTimeZone
            };
            if (!this._popup) {
                this._popup = this._createPopup()
            }
            this._popup.option({
                toolbarItems: showButtons ? this._getPopupToolbarItems() : [],
                showCloseButton: showButtons ? this._popup.initialOption("showCloseButton") : true
            });
            this._popup.option("onShowing", function(e) {
                _this._updateForm(data, processTimeZone);
                var arg = {
                    form: _this._appointmentForm,
                    appointmentData: data,
                    cancel: false
                };
                _this.scheduler._actions.onAppointmentFormOpening(arg);
                _this.scheduler._processActionResult(arg, function(canceled) {
                    if (canceled) {
                        e.cancel = true
                    } else {
                        _this.updatePopupFullScreenMode()
                    }
                })
            });
            this._popup.show()
        }
    }, {
        key: "hide",
        value: function() {
            this._popup.hide()
        }
    }, {
        key: "isVisible",
        value: function() {
            return this._popup ? this._popup.option("visible") : false
        }
    }, {
        key: "getPopup",
        value: function() {
            return this._popup
        }
    }, {
        key: "dispose",
        value: function() {
            if (this._$popup) {
                this._popup.$element().remove();
                this._$popup = null
            }
        }
    }, {
        key: "_createPopup",
        value: function() {
            var popupElement = (0, _renderer2.default)("<div>").addClass(APPOINTMENT_POPUP_CLASS).appendTo(this.scheduler.$element());
            return this.scheduler._createComponent(popupElement, _popup2.default, this._createPopupConfig())
        }
    }, {
        key: "_createPopupConfig",
        value: function() {
            var _this2 = this;
            return {
                height: "auto",
                maxHeight: "100%",
                onHiding: function() {
                    return _this2.scheduler.focus()
                },
                contentTemplate: function() {
                    return _this2._createPopupContent()
                },
                defaultOptionsRules: [{
                    device: function() {
                        return _devices2.default.current().android
                    },
                    options: {
                        showTitle: false
                    }
                }]
            }
        }
    }, {
        key: "_createPopupContent",
        value: function() {
            var formElement = (0, _renderer2.default)("<div>");
            this._appointmentForm = this._createForm(formElement);
            return formElement
        }
    }, {
        key: "_createAppointmentFormData",
        value: function(appointmentData) {
            var result = (0, _extend.extend)(true, {}, appointmentData);
            (0, _iterator.each)(this.scheduler._resourcesManager.getResourcesFromItem(result, true) || {}, function(name, value) {
                return result[name] = value
            });
            return result
        }
    }, {
        key: "_createForm",
        value: function(element) {
            var expr = this.scheduler._dataAccessors.expr;
            var resources = this.scheduler.option("resources");
            _uiScheduler2.default.prepareAppointmentFormEditors({
                textExpr: expr.textExpr,
                allDayExpr: expr.allDayExpr,
                startDateExpr: expr.startDateExpr,
                endDateExpr: expr.endDateExpr,
                descriptionExpr: expr.descriptionExpr,
                recurrenceRuleExpr: expr.recurrenceRuleExpr,
                startDateTimeZoneExpr: expr.startDateTimeZoneExpr,
                endDateTimeZoneExpr: expr.endDateTimeZoneExpr
            }, this.scheduler);
            if (resources && resources.length) {
                this.scheduler._resourcesManager.setResources(this.scheduler.option("resources"));
                _uiScheduler2.default.concatResources(this.scheduler._resourcesManager.getEditors())
            }
            var isReadOnly = this.scheduler._editAppointmentData ? !this.scheduler._editing.allowUpdating : false;
            return _uiScheduler2.default.create(this.scheduler._createComponent.bind(this.scheduler), element, isReadOnly, this._createAppointmentFormData(this.state.appointment.data))
        }
    }, {
        key: "_updateForm",
        value: function(appointmentData, isProcessTimeZone) {
            var allDay = this.scheduler.fire("getField", "allDay", appointmentData),
                startDate = this.scheduler.fire("getField", "startDate", appointmentData),
                endDate = this.scheduler.fire("getField", "endDate", appointmentData);
            var formData = this._createAppointmentFormData(appointmentData);
            this.state.appointment.isEmptyText = void 0 === appointmentData || void 0 === appointmentData.text;
            this.state.appointment.isEmptyDescription = void 0 === appointmentData || void 0 === appointmentData.description;
            if (this.state.appointment.isEmptyText) {
                formData.text = ""
            }
            if (this.state.appointment.isEmptyDescription) {
                formData.description = ""
            }
            if (isProcessTimeZone) {
                startDate = this.scheduler.fire("convertDateByTimezone", startDate);
                endDate = this.scheduler.fire("convertDateByTimezone", endDate);
                this.scheduler.fire("setField", "startDate", formData, startDate);
                this.scheduler.fire("setField", "endDate", formData, endDate)
            }
            var startDateExpr = this.scheduler._dataAccessors.expr.startDateExpr,
                endDateExpr = this.scheduler._dataAccessors.expr.endDateExpr;
            formData.recurrenceRule = formData.recurrenceRule || "";
            _uiScheduler2.default.updateFormData(this._appointmentForm, formData);
            this._appointmentForm.option("readOnly", this.scheduler._editAppointmentData ? !this.scheduler._editing.allowUpdating : false);
            _uiScheduler2.default.checkEditorsType(this._appointmentForm, startDateExpr, endDateExpr, allDay);
            var recurrenceRuleExpr = this.scheduler._dataAccessors.expr.recurrenceRuleExpr,
                recurrentEditorItem = recurrenceRuleExpr ? this._appointmentForm.itemOption(recurrenceRuleExpr) : null;
            if (recurrentEditorItem) {
                var options = recurrentEditorItem.editorOptions || {};
                options.startDate = startDate;
                this._appointmentForm.itemOption(recurrenceRuleExpr, "editorOptions", options)
            }
        }
    }, {
        key: "_isPopupFullScreenNeeded",
        value: function() {
            if (_window2.default.hasWindow()) {
                var window = _window2.default.getWindow();
                return (0, _renderer2.default)(window).width() < APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH
            }
            return false
        }
    }, {
        key: "triggerResize",
        value: function() {
            this._popup && _dom2.default.triggerResizeEvent(this._popup.$element())
        }
    }, {
        key: "updatePopupFullScreenMode",
        value: function() {
            if (this.isVisible()) {
                var isFullScreen = this._isPopupFullScreenNeeded();
                this._popup.option({
                    maxWidth: isFullScreen ? "100%" : APPOINTMENT_POPUP_WIDTH,
                    fullScreen: isFullScreen
                })
            }
        }
    }, {
        key: "_getPopupToolbarItems",
        value: function() {
            var _this3 = this;
            var isIOs = "ios" === _devices2.default.current().platform;
            return [{
                shortcut: "done",
                location: TOOLBAR_ITEM_AFTER_LOCATION,
                onClick: function(e) {
                    return _this3._doneButtonClickHandler(e)
                }
            }, {
                shortcut: "cancel",
                location: isIOs ? TOOLBAR_ITEM_BEFORE_LOCATION : TOOLBAR_ITEM_AFTER_LOCATION
            }]
        }
    }, {
        key: "saveChanges",
        value: function(disableButton) {
            var _this4 = this;
            var deferred = new _deferred.Deferred;
            var validation = this._appointmentForm.validate();
            var state = this.state.appointment;
            var convert = function(obj, dateFieldName) {
                var date = new Date(_this4.scheduler.fire("getField", dateFieldName, obj));
                var tzDiff = _this4.scheduler._getTimezoneOffsetByOption() * toMs("hour") + _this4.scheduler.fire("getClientTimezoneOffset", date);
                return new Date(date.getTime() + tzDiff)
            };
            disableButton && this._disableDoneButton();
            (0, _deferred.when)(validation && validation.complete || validation).done(function(validation) {
                if (validation && !validation.isValid) {
                    _this4._enableDoneButton();
                    deferred.resolve(false);
                    return
                }
                var formData = _object2.default.deepExtendArraySafe({}, _this4._getFormData(), true),
                    oldData = _this4.scheduler._editAppointmentData,
                    recData = _this4.scheduler._updatedRecAppointment;
                if (state.isEmptyText && "" === formData.text) {
                    delete formData.text
                }
                if (state.isEmptyDescription && "" === formData.description) {
                    delete formData.description
                }
                if (void 0 === state.data.recurrenceRule && "" === formData.recurrenceRule) {
                    delete formData.recurrenceRule
                }
                if (oldData) {
                    _this4.scheduler._convertDatesByTimezoneBack(false, formData)
                }
                if (oldData && !recData) {
                    _this4.scheduler.updateAppointment(oldData, formData)
                } else {
                    if (recData) {
                        _this4.scheduler.updateAppointment(oldData, recData);
                        delete _this4.scheduler._updatedRecAppointment;
                        if ("number" === typeof _this4.scheduler._getTimezoneOffsetByOption()) {
                            _this4.scheduler.fire("setField", "startDate", formData, convert.call(_this4, formData, "startDate"));
                            _this4.scheduler.fire("setField", "endDate", formData, convert.call(_this4, formData, "endDate"))
                        }
                    }
                    _this4.scheduler.addAppointment(formData)
                }
                _this4._enableDoneButton();
                _this4.state.lastEditData = formData;
                deferred.resolve(true)
            });
            return deferred.promise()
        }
    }, {
        key: "_getFormData",
        value: function() {
            var formData = this._appointmentForm.option("formData"),
                startDate = this.scheduler.fire("getField", "startDate", formData),
                endDate = this.scheduler.fire("getField", "endDate", formData);
            this.scheduler.fire("setField", "startDate", formData, startDate);
            this.scheduler.fire("setField", "endDate", formData, endDate);
            return formData
        }
    }, {
        key: "_doneButtonClickHandler",
        value: function(e) {
            e.cancel = true;
            this.saveEditData()
        }
    }, {
        key: "saveEditData",
        value: function() {
            var _this5 = this;
            var deferred = new _deferred.Deferred;
            (0, _deferred.when)(this.saveChanges(true)).done(function() {
                if (_this5.state.lastEditData) {
                    var startDate = _this5.scheduler.fire("getField", "startDate", _this5.state.lastEditData);
                    _this5.scheduler._workSpace.updateScrollPosition(startDate);
                    _this5.state.lastEditData = null
                }
                deferred.resolve()
            });
            return deferred.promise()
        }
    }, {
        key: "_enableDoneButton",
        value: function() {
            var toolbarItems = this._popup.option("toolbarItems");
            toolbarItems[0].options = (0, _extend.extend)(toolbarItems[0].options, {
                disabled: false
            });
            this._popup.option("toolbarItems", toolbarItems)
        }
    }, {
        key: "_disableDoneButton",
        value: function() {
            var toolbarItems = this._popup.option("toolbarItems");
            toolbarItems[0].options = (0, _extend.extend)(toolbarItems[0].options, {
                disabled: true
            });
            this._popup.option("toolbarItems", toolbarItems)
        }
    }]);
    return AppointmentPopup
}();
exports.default = AppointmentPopup;
