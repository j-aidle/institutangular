/**
 * DevExtreme (ui/gantt/ui.gantt.js)
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
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _data = require("../../core/utils/data");
var _data2 = _interopRequireDefault(_data);
var _uiGantt = require("./ui.gantt.view");
var _uiGantt2 = require("./ui.gantt.contextmenu");
var _uiGantt3 = _interopRequireDefault(_uiGantt2);
var _tree_list = require("../tree_list");
var _tree_list2 = _interopRequireDefault(_tree_list);
var _extend = require("../../core/utils/extend");
var _window = require("../../core/utils/window");
var _uiGanttData = require("./ui.gantt.data.option");
var _uiGanttData2 = _interopRequireDefault(_uiGanttData);
var _splitter = require("../splitter");
var _splitter2 = _interopRequireDefault(_splitter);
var _uiGantt4 = require("./ui.gantt.dialogs");
var _load_panel = require("../load_panel");
var _load_panel2 = _interopRequireDefault(_load_panel);

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
var GANTT_CLASS = "dx-gantt";
var GANTT_VIEW_CLASS = "dx-gantt-view";
var GANTT_COLLAPSABLE_ROW = "dx-gantt-collapsable-row";
var GANTT_TREE_LIST_WRAPPER = "dx-gantt-treelist-wrapper";
var GANTT_TASKS = "tasks";
var GANTT_DEPENDENCIES = "dependencies";
var GANTT_RESOURCES = "resources";
var GANTT_RESOURCE_ASSIGNMENTS = "resourceAssignments";
var GANTT_DEFAULT_ROW_HEIGHT = 34;
var Gantt = function(_Widget) {
    _inherits(Gantt, _Widget);

    function Gantt() {
        _classCallCheck(this, Gantt);
        return _possibleConstructorReturn(this, (Gantt.__proto__ || Object.getPrototypeOf(Gantt)).apply(this, arguments))
    }
    _createClass(Gantt, [{
        key: "_initMarkup",
        value: function() {
            _get(Gantt.prototype.__proto__ || Object.getPrototypeOf(Gantt.prototype), "_initMarkup", this).call(this);
            this.$element().addClass(GANTT_CLASS);
            this._$treeListWrapper = (0, _renderer2.default)("<div>").addClass(GANTT_TREE_LIST_WRAPPER).appendTo(this.$element());
            this._$treeList = (0, _renderer2.default)("<div>").appendTo(this._$treeListWrapper);
            this._$splitter = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._$ganttView = (0, _renderer2.default)("<div>").addClass(GANTT_VIEW_CLASS).appendTo(this.$element());
            this._$dialog = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._$loadPanel = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._$contextMenu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._refreshDataSource(GANTT_TASKS);
            this._refreshDataSource(GANTT_DEPENDENCIES);
            this._refreshDataSource(GANTT_RESOURCES);
            this._refreshDataSource(GANTT_RESOURCE_ASSIGNMENTS)
        }
    }, {
        key: "_render",
        value: function() {
            this._renderTreeList();
            this._renderSplitter();
            this._renderBars()
        }
    }, {
        key: "_renderTreeList",
        value: function() {
            var _this2 = this;
            var _option = this.option(GANTT_TASKS),
                keyExpr = _option.keyExpr,
                parentIdExpr = _option.parentIdExpr;
            this._treeList = this._createComponent(this._$treeList, _tree_list2.default, {
                dataSource: this._tasksRaw,
                keyExpr: keyExpr,
                parentIdExpr: parentIdExpr,
                columns: this.option("columns"),
                columnResizingMode: "nextColumn",
                height: "100%",
                width: this.option("taskListWidth"),
                selection: {
                    mode: this._getSelectionMode(this.option("allowSelection"))
                },
                selectedRowKeys: this._getArrayFromOneElement(this.option("selectedRowKey")),
                sorting: {
                    mode: "none"
                },
                scrolling: {
                    showScrollbar: "onHover",
                    mode: "virtual"
                },
                allowColumnResizing: true,
                autoExpandAll: true,
                showRowLines: this.option("showRowLines"),
                onContentReady: function(e) {
                    _this2._onTreeListContentReady(e)
                },
                onSelectionChanged: function(e) {
                    _this2._onTreeListSelectionChanged(e)
                },
                onRowCollapsed: function(e) {
                    return _this2._ganttView.changeTaskExpanded(e.key, false)
                },
                onRowExpanded: function(e) {
                    return _this2._ganttView.changeTaskExpanded(e.key, true)
                },
                onRowPrepared: function(e) {
                    _this2._onTreeListRowPrepared(e)
                },
                onContextMenuPreparing: function(e) {
                    _this2._onTreeListContextMenuPreparing(e)
                },
                onRowDblClick: function() {
                    _this2._onTreeListRowDblClick()
                }
            })
        }
    }, {
        key: "_renderSplitter",
        value: function() {
            this._splitter = this._createComponent(this._$splitter, _splitter2.default, {
                container: this.$element(),
                leftElement: this._$treeListWrapper,
                rightElement: this._$ganttView,
                onApplyPanelSize: this._onApplyPanelSize.bind(this)
            });
            this._setInnerElementsWidth();
            this._splitter.option("initialLeftPanelWidth", this.option("taskListWidth"))
        }
    }, {
        key: "_renderBars",
        value: function() {
            this._contextMenuBar = new _uiGantt3.default(this._$contextMenu, this);
            this._bars = [this._contextMenuBar]
        }
    }, {
        key: "_initGanttView",
        value: function() {
            if (this._ganttView) {
                return
            }
            this._ganttView = this._createComponent(this._$ganttView, _uiGantt.GanttView, {
                width: "100%",
                height: this._treeList._$element.get(0).offsetHeight,
                rowHeight: this._getTreeListRowHeight(),
                tasks: this._tasks,
                dependencies: this._dependencies,
                resources: this._resources,
                resourceAssignments: this._resourceAssignments,
                allowSelection: this.option("allowSelection"),
                selectedRowKey: this.option("selectedRowKey"),
                showResources: this.option("showResources"),
                taskTitlePosition: this.option("taskTitlePosition"),
                showRowLines: this.option("showRowLines"),
                scaleType: this.option("scaleType"),
                editing: this.option("editing"),
                bars: this._bars,
                onSelectionChanged: this._onGanttViewSelectionChanged.bind(this),
                onScroll: this._onGanttViewScroll.bind(this),
                onDialogShowing: this._showDialog.bind(this),
                onPopupMenuShowing: this._showPopupMenu.bind(this),
                modelChangesListener: this._createModelChangesListener()
            })
        }
    }, {
        key: "_onApplyPanelSize",
        value: function(e) {
            this._setInnerElementsWidth(e)
        }
    }, {
        key: "_onTreeListContentReady",
        value: function(e) {
            if (e.component.getDataSource()) {
                this._initGanttView();
                this._initScrollSync(e.component)
            }
        }
    }, {
        key: "_onTreeListRowPrepared",
        value: function(e) {
            if ("data" === e.rowType && e.node.children.length > 0) {
                (0, _renderer2.default)(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW)
            }
        }
    }, {
        key: "_onTreeListContextMenuPreparing",
        value: function(e) {
            if ("data" === e.row.rowType) {
                this._setTreeListOption("selectedRowKeys", [e.row.data.id]);
                e.items = [];
                this._showPopupMenu({
                    position: {
                        x: e.event.clientX,
                        y: e.event.clientY
                    }
                })
            }
        }
    }, {
        key: "_onTreeListRowDblClick",
        value: function() {
            this._ganttView._ganttViewCore.commandManager.showTaskEditDialog.execute()
        }
    }, {
        key: "_onTreeListSelectionChanged",
        value: function(e) {
            var selectedRowKey = e.currentSelectedRowKeys[0];
            this._setGanttViewOption("selectedRowKey", selectedRowKey);
            this.option("selectedRowKey", selectedRowKey);
            this._raiseSelectionChangedAction(selectedRowKey)
        }
    }, {
        key: "_onGanttViewSelectionChanged",
        value: function(e) {
            this._setTreeListOption("selectedRowKeys", this._getArrayFromOneElement(e.id))
        }
    }, {
        key: "_onGanttViewScroll",
        value: function(e) {
            var treeListScrollable = this._treeList.getScrollable();
            if (treeListScrollable) {
                var diff = e.scrollTop - treeListScrollable.scrollTop();
                if (0 !== diff) {
                    treeListScrollable.scrollBy({
                        left: 0,
                        top: diff
                    })
                }
            }
        }
    }, {
        key: "_onTreeListScroll",
        value: function(treeListScrollView) {
            var ganttViewTaskAreaContainer = this._ganttView.getTaskAreaContainer();
            if (ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
                ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop()
            }
        }
    }, {
        key: "_initScrollSync",
        value: function(treeList) {
            var _this3 = this;
            var treeListScrollable = treeList.getScrollable();
            if (treeListScrollable) {
                treeListScrollable.off("scroll");
                treeListScrollable.on("scroll", function(e) {
                    _this3._onTreeListScroll(e)
                })
            }
        }
    }, {
        key: "_getTreeListRowHeight",
        value: function() {
            var $row = this._treeList._$element.find(".dx-data-row");
            return $row.length ? $row.last().get(0).getBoundingClientRect().height : GANTT_DEFAULT_ROW_HEIGHT
        }
    }, {
        key: "_setInnerElementsWidth",
        value: function(widths) {
            if (!(0, _window.hasWindow)()) {
                return
            }
            if (!widths) {
                widths = this._getPanelsWidthByOption()
            }
            var leftPanelWidth = widths.leftPanelWidth;
            var rightPanelWidth = widths.rightPanelWidth;
            this._$treeListWrapper.width(leftPanelWidth);
            var isPercentage = _type2.default.isString(leftPanelWidth) && "%" === leftPanelWidth.slice(-1);
            this._$treeList.width(isPercentage ? "100%" : leftPanelWidth);
            this._splitter.setSplitterPositionLeft(leftPanelWidth);
            this._$ganttView.width(rightPanelWidth);
            this._setGanttViewOption("width", this._$ganttView.width())
        }
    }, {
        key: "_getPanelsWidthByOption",
        value: function() {
            return {
                leftPanelWidth: this.option("taskListWidth"),
                rightPanelWidth: this._$element.width() - this.option("taskListWidth")
            }
        }
    }, {
        key: "_setGanttViewOption",
        value: function(optionName, value) {
            this._ganttView && this._ganttView.option(optionName, value)
        }
    }, {
        key: "_setTreeListOption",
        value: function(optionName, value) {
            this._treeList && this._treeList.option(optionName, value)
        }
    }, {
        key: "_refreshDataSource",
        value: function(name) {
            var _this4 = this;
            var dataOption = this["_" + name + "Option"];
            if (dataOption) {
                dataOption._disposeDataSource();
                delete this["_" + name + "Option"];
                delete this["_" + name]
            }
            if (this.option(name + ".dataSource")) {
                dataOption = new _uiGanttData2.default(name, this._getLoadPanel(), function(name, data) {
                    _this4._dataSourceChanged(name, data)
                });
                dataOption.option("dataSource", this._getSpecificDataSourceOption(name));
                dataOption._refreshDataSource();
                this["_" + name + "Option"] = dataOption
            }
        }
    }, {
        key: "_getSpecificDataSourceOption",
        value: function(name) {
            var dataSource = this.option(name + ".dataSource");
            if (Array.isArray(dataSource)) {
                return {
                    store: {
                        type: "array",
                        data: dataSource,
                        key: this.option(name + ".keyExpr")
                    }
                }
            }
            return dataSource
        }
    }, {
        key: "_compileGettersByOption",
        value: function(optionName) {
            var getters = {};
            var optionValue = this.option(optionName);
            for (var field in optionValue) {
                var exprMatches = field.match(/(\w*)Expr/);
                if (exprMatches) {
                    getters[exprMatches[1]] = _data2.default.compileGetter(optionValue[exprMatches[0]])
                }
            }
            return getters
        }
    }, {
        key: "_compileSettersByOption",
        value: function(optionName) {
            var setters = {};
            var optionValue = this.option(optionName);
            for (var field in optionValue) {
                var exprMatches = field.match(/(\w*)Expr/);
                if (exprMatches) {
                    setters[exprMatches[1]] = _data2.default.compileSetter(optionValue[exprMatches[0]])
                }
            }
            return setters
        }
    }, {
        key: "_getStoreObject",
        value: function(optionName, modelObject) {
            var setters = this._compileSettersByOption(optionName);
            return Object.keys(setters).reduce(function(previous, key) {
                if ("key" !== key) {
                    setters[key](previous, modelObject[key])
                }
                return previous
            }, {})
        }
    }, {
        key: "_prepareMapHandler",
        value: function(getters) {
            return function(data) {
                return Object.keys(getters).reduce(function(previous, key) {
                    var resultKey = "key" === key ? "id" : key;
                    previous[resultKey] = getters[key](data);
                    return previous
                }, {})
            }
        }
    }, {
        key: "_dataSourceChanged",
        value: function(dataSourceName, data) {
            var getters = this._compileGettersByOption(dataSourceName);
            var mappedData = data.map(this._prepareMapHandler(getters));
            this["_" + dataSourceName] = mappedData;
            this._setGanttViewOption(dataSourceName, mappedData);
            if (dataSourceName === GANTT_TASKS) {
                this._tasksRaw = data;
                this._setTreeListOption("dataSource", data)
            }
        }
    }, {
        key: "_createModelChangesListener",
        value: function() {
            var _this5 = this;
            return {
                NotifyTaskCreated: function(task, callback) {
                    _this5._onRecordInserted(GANTT_TASKS, task, callback)
                },
                NotifyTaskRemoved: function(taskId) {
                    _this5._onRecordRemoved(GANTT_TASKS, taskId)
                },
                NotifyTaskTitleChanged: function(taskId, newValue) {
                    _this5._onRecordUpdated(GANTT_TASKS, taskId, "title", newValue)
                },
                NotifyTaskDescriptionChanged: function(taskId, newValue) {
                    _this5._onRecordUpdated(GANTT_TASKS, taskId, "description", newValue)
                },
                NotifyTaskStartChanged: function(taskId, newValue) {
                    _this5._onRecordUpdated(GANTT_TASKS, taskId, "start", newValue)
                },
                NotifyTaskEndChanged: function(taskId, newValue) {
                    _this5._onRecordUpdated(GANTT_TASKS, taskId, "end", newValue)
                },
                NotifyTaskProgressChanged: function(taskId, newValue) {
                    _this5._onRecordUpdated(GANTT_TASKS, taskId, "progress", newValue)
                },
                NotifyDependencyInserted: function(dependency, callback) {
                    _this5._onRecordInserted(GANTT_DEPENDENCIES, dependency, callback)
                },
                NotifyDependencyRemoved: function(dependencyId) {
                    _this5._onRecordRemoved(GANTT_DEPENDENCIES, dependencyId)
                },
                NotifyResourceCreated: function(resource, callback) {
                    _this5._onRecordInserted(GANTT_RESOURCES, resource, callback)
                },
                NotifyResourceRemoved: function(resource) {
                    _this5._onRecordRemoved(GANTT_RESOURCES, resource)
                },
                NotifyResourceAssigned: function(assignment, callback) {
                    _this5._onRecordInserted(GANTT_RESOURCE_ASSIGNMENTS, assignment, callback)
                },
                NotifyResourceUnassigned: function(assignmentId) {
                    _this5._onRecordRemoved(GANTT_RESOURCE_ASSIGNMENTS, assignmentId)
                }
            }
        }
    }, {
        key: "_onRecordInserted",
        value: function(optionName, record, callback) {
            var _this6 = this;
            var dataOption = this["_" + optionName + "Option"];
            if (dataOption) {
                var data = this._getStoreObject(optionName, record);
                dataOption.insert(data, function(response) {
                    var keyGetter = _data2.default.compileGetter(_this6.option(optionName + ".keyExpr"));
                    var insertedId = keyGetter(response);
                    callback(insertedId);
                    if (optionName === GANTT_TASKS) {
                        _this6._updateTreeListDataSource();
                        var parentId = record.parentId;
                        if (void 0 !== parentId) {
                            var expandedRowKeys = _this6._treeList.option("expandedRowKeys");
                            expandedRowKeys.push(parentId);
                            _this6._treeList.option("expandedRowKeys", expandedRowKeys)
                        }
                    }
                })
            }
        }
    }, {
        key: "_onRecordRemoved",
        value: function(optionName, key) {
            var _this7 = this;
            var dataOption = this["_" + optionName + "Option"];
            if (dataOption) {
                dataOption.remove(key, function() {
                    if (optionName === GANTT_TASKS) {
                        _this7._updateTreeListDataSource()
                    }
                })
            }
        }
    }, {
        key: "_onRecordUpdated",
        value: function(optionName, key, fieldName, value) {
            var _this8 = this;
            var dataOption = this["_" + optionName + "Option"];
            if (dataOption) {
                var setter = _data2.default.compileSetter(this.option(optionName + "." + fieldName + "Expr"));
                var data = {};
                setter(data, value);
                dataOption.update(key, data, function() {
                    if (optionName === GANTT_TASKS) {
                        _this8._updateTreeListDataSource()
                    }
                })
            }
        }
    }, {
        key: "_updateTreeListDataSource",
        value: function() {
            var storeArray = this._tasksOption._getStore()._array;
            this._setTreeListOption("dataSource", storeArray ? storeArray : this.option("tasks.dataSource"))
        }
    }, {
        key: "_getLoadPanel",
        value: function() {
            if (!this._loadPanel) {
                this._loadPanel = this._createComponent(this._$loadPanel, _load_panel2.default, {
                    position: {
                        of: this.$element()
                    }
                })
            }
            return this._loadPanel
        }
    }, {
        key: "_createSelectionChangedAction",
        value: function() {
            this._selectionChangedAction = this._createActionByOption("onSelectionChanged")
        }
    }, {
        key: "_raiseSelectionChangedAction",
        value: function(selectedRowKey) {
            if (!this._selectionChangedAction) {
                this._createSelectionChangedAction()
            }
            this._selectionChangedAction({
                selectedRowKey: selectedRowKey
            })
        }
    }, {
        key: "_getSelectionMode",
        value: function(allowSelection) {
            return allowSelection ? "single" : "none"
        }
    }, {
        key: "_getArrayFromOneElement",
        value: function(element) {
            return void 0 === element || null === element ? [] : [element]
        }
    }, {
        key: "_showDialog",
        value: function(e) {
            if (!this._dialogInstance) {
                this._dialogInstance = new _uiGantt4.GanttDialog(this, this._$dialog)
            }
            this._dialogInstance.show(e.name, e.parameters, e.callback, this.option("editing"))
        }
    }, {
        key: "_showPopupMenu",
        value: function(e) {
            this._ganttView.getBarManager().updateContextMenu();
            this._contextMenuBar.show(e.position)
        }
    }, {
        key: "_executeCoreCommand",
        value: function(id) {
            this._ganttView.executeCoreCommand(id)
        }
    }, {
        key: "_clean",
        value: function() {
            delete this._ganttView;
            delete this._dialogInstance;
            _get(Gantt.prototype.__proto__ || Object.getPrototypeOf(Gantt.prototype), "_clean", this).call(this)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Gantt.prototype.__proto__ || Object.getPrototypeOf(Gantt.prototype), "_getDefaultOptions", this).call(this), {
                tasks: {
                    dataSource: null,
                    keyExpr: "id",
                    parentIdExpr: "parentId",
                    startExpr: "start",
                    endExpr: "end",
                    progressExpr: "progress",
                    titleExpr: "title"
                },
                dependencies: {
                    dataSource: null,
                    keyExpr: "id",
                    predecessorIdExpr: "predecessorId",
                    successorIdExpr: "successorId",
                    typeExpr: "type"
                },
                resources: {
                    dataSource: null,
                    keyExpr: "id",
                    textExpr: "text"
                },
                resourceAssignments: {
                    dataSource: null,
                    keyExpr: "id",
                    taskIdExpr: "taskId",
                    resourceIdExpr: "resourceId"
                },
                columns: void 0,
                taskListWidth: 300,
                showResources: true,
                taskTitlePosition: "inside",
                selectedRowKey: void 0,
                onSelectionChanged: null,
                allowSelection: true,
                showRowLines: true,
                scaleType: "auto",
                editing: {
                    enabled: false,
                    allowTaskAdding: true,
                    allowTaskDeleting: true,
                    allowTaskUpdating: true,
                    allowDependencyAdding: true,
                    allowDependencyDeleting: true,
                    allowDependencyUpdating: true,
                    allowResourceAdding: true,
                    allowResourceDeleting: true,
                    allowResourceUpdating: true
                }
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "tasks":
                    this._refreshDataSource(GANTT_TASKS);
                    break;
                case "dependencies":
                    this._refreshDataSource(GANTT_DEPENDENCIES);
                    break;
                case "resources":
                    this._refreshDataSource(GANTT_RESOURCES);
                    break;
                case "resourceAssignments":
                    this._refreshDataSource(GANTT_RESOURCE_ASSIGNMENTS);
                    break;
                case "columns":
                    this._setTreeListOption("columns", this.option(args.name));
                    break;
                case "taskListWidth":
                    this._setInnerElementsWidth();
                    break;
                case "showResources":
                    this._setGanttViewOption("showResources", args.value);
                    break;
                case "taskTitlePosition":
                    this._setGanttViewOption("taskTitlePosition", args.value);
                    break;
                case "selectedRowKey":
                    this._setTreeListOption("selectedRowKeys", this._getArrayFromOneElement(args.value));
                    break;
                case "onSelectionChanged":
                    this._createSelectionChangedAction();
                    break;
                case "allowSelection":
                    this._setTreeListOption("selection.mode", this._getSelectionMode(args.value));
                    this._setGanttViewOption("allowSelection", args.value);
                    break;
                case "showRowLines":
                    this._setTreeListOption("showRowLines", args.value);
                    this._setGanttViewOption("showRowLines", args.value);
                    break;
                case "scaleType":
                    this._setGanttViewOption("scaleType", args.value);
                    break;
                case "editing":
                    this._setGanttViewOption("editing", this.option(args.name));
                    break;
                default:
                    _get(Gantt.prototype.__proto__ || Object.getPrototypeOf(Gantt.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return Gantt
}(_ui2.default);
(0, _component_registrator2.default)("dxGantt", Gantt);
module.exports = Gantt;
