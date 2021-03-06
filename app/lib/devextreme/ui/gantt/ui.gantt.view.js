/**
 * DevExtreme (ui/gantt/ui.gantt.view.js)
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
exports.GanttView = void 0;
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
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _gantt_importer = require("./gantt_importer");
var _uiGanttTaskArea = require("./ui.gantt.task.area.container");

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
var GanttView = exports.GanttView = function(_Widget) {
    _inherits(GanttView, _Widget);

    function GanttView() {
        _classCallCheck(this, GanttView);
        return _possibleConstructorReturn(this, (GanttView.__proto__ || Object.getPrototypeOf(GanttView)).apply(this, arguments))
    }
    _createClass(GanttView, [{
        key: "_init",
        value: function() {
            _get(GanttView.prototype.__proto__ || Object.getPrototypeOf(GanttView.prototype), "_init", this).call(this);
            this._onSelectionChanged = this._createActionByOption("onSelectionChanged");
            this._onScroll = this._createActionByOption("onScroll");
            this._onDialogShowing = this._createActionByOption("onDialogShowing");
            this._onPopupMenuShowing = this._createActionByOption("onPopupMenuShowing")
        }
    }, {
        key: "_initMarkup",
        value: function() {
            var _getGanttViewCore = (0, _gantt_importer.getGanttViewCore)(),
                GanttView = _getGanttViewCore.GanttView;
            this._ganttViewCore = new GanttView(this.$element().get(0), this, {
                showResources: this.option("showResources"),
                taskTitlePosition: this._getTaskTitlePosition(this.option("taskTitlePosition")),
                allowSelectTask: this.option("allowSelection"),
                editing: this.option("editing"),
                areHorizontalBordersEnabled: this.option("showRowLines"),
                areAlternateRowsEnabled: false,
                viewType: this._getViewTypeByScaleType(this.option("scaleType"))
            });
            this._selectTask(this.option("selectedRowKey"))
        }
    }, {
        key: "getTaskAreaContainer",
        value: function() {
            return this._ganttViewCore.taskAreaContainer
        }
    }, {
        key: "getBarManager",
        value: function() {
            return this._ganttViewCore.barManager
        }
    }, {
        key: "executeCoreCommand",
        value: function(id) {
            var command = this._ganttViewCore.commandManager.getCommand(id);
            if (command) {
                command.execute()
            }
        }
    }, {
        key: "changeTaskExpanded",
        value: function(id, value) {
            this._ganttViewCore.changeTaskExpanded(id, value)
        }
    }, {
        key: "updateView",
        value: function() {
            this._ganttViewCore.updateView()
        }
    }, {
        key: "setWidth",
        value: function(value) {
            this._ganttViewCore.setWidth(value)
        }
    }, {
        key: "_selectTask",
        value: function(id) {
            this._ganttViewCore.selectTaskById(id)
        }
    }, {
        key: "_update",
        value: function() {
            this._ganttViewCore.loadOptionsFromGanttOwner();
            this._ganttViewCore.resetAndUpdate()
        }
    }, {
        key: "_getTaskTitlePosition",
        value: function(value) {
            switch (value) {
                case "outside":
                    return 1;
                case "none":
                    return 2;
                default:
                    return 0
            }
        }
    }, {
        key: "_getViewTypeByScaleType",
        value: function(scaleType) {
            switch (scaleType) {
                case "minutes":
                    return 0;
                case "hours":
                    return 1;
                case "days":
                    return 3;
                case "weeks":
                    return 4;
                case "months":
                    return 5;
                default:
                    return
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "width":
                    _get(GanttView.prototype.__proto__ || Object.getPrototypeOf(GanttView.prototype), "_optionChanged", this).call(this, args);
                    this._ganttViewCore.setWidth(args.value);
                    break;
                case "tasks":
                case "dependencies":
                case "resources":
                case "resourceAssignments":
                    this._update();
                    break;
                case "showResources":
                    this._ganttViewCore.setShowResources(args.value);
                    break;
                case "taskTitlePosition":
                    this._ganttViewCore.setTaskTitlePosition(this._getTaskTitlePosition(args.value));
                    break;
                case "allowSelection":
                    this._ganttViewCore.setAllowSelection(args.value);
                    break;
                case "selectedRowKey":
                    this._selectTask(args.value);
                    break;
                case "editing":
                    this._ganttViewCore.setEditingSettings(args.value);
                    break;
                case "showRowLines":
                    this._ganttViewCore.setRowLinesVisible(args.value);
                    break;
                case "scaleType":
                    this._ganttViewCore.setViewType(this._getViewTypeByScaleType(args.value));
                    break;
                default:
                    _get(GanttView.prototype.__proto__ || Object.getPrototypeOf(GanttView.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "getRowHeight",
        value: function() {
            return this.option("rowHeight")
        }
    }, {
        key: "getGanttTasksData",
        value: function() {
            return this.option("tasks")
        }
    }, {
        key: "getGanttDependenciesData",
        value: function() {
            return this.option("dependencies")
        }
    }, {
        key: "getGanttResourcesData",
        value: function() {
            return this.option("resources")
        }
    }, {
        key: "getGanttResourceAssignmentsData",
        value: function() {
            return this.option("resourceAssignments")
        }
    }, {
        key: "getGanttWorkTimeRules",
        value: function() {
            return {}
        }
    }, {
        key: "getExternalTaskAreaContainer",
        value: function(element) {
            if (!this._taskAreaContainer) {
                this._taskAreaContainer = new _uiGanttTaskArea.TaskAreaContainer(element, this)
            }
            return this._taskAreaContainer
        }
    }, {
        key: "changeGanttTaskSelection",
        value: function(id, selected) {
            this._onSelectionChanged({
                id: id,
                selected: selected
            })
        }
    }, {
        key: "onGanttScroll",
        value: function(scrollTop) {
            this._onScroll({
                scrollTop: scrollTop
            })
        }
    }, {
        key: "showDialog",
        value: function(name, parameters, callback) {
            this._onDialogShowing({
                name: name,
                parameters: parameters,
                callback: callback
            })
        }
    }, {
        key: "getModelChangesListener",
        value: function() {
            return this.option("modelChangesListener")
        }
    }, {
        key: "showPopupMenu",
        value: function(position) {
            this._onPopupMenuShowing({
                position: position
            })
        }
    }, {
        key: "bars",
        get: function() {
            return this.option("bars")
        }
    }]);
    return GanttView
}(_ui2.default);
