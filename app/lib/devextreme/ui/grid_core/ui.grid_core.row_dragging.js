/**
 * DevExtreme (ui/grid_core/ui.grid_core.row_dragging.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _sortable = require("../sortable");
var _sortable2 = _interopRequireDefault(_sortable);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var COMMAND_HANDLE_CLASS = "dx-command-drag",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    HANDLE_ICON_CLASS = "drag-icon",
    ROWS_VIEW = "rowsview";
var RowDraggingExtender = {
    init: function() {
        this.callBase.apply(this, arguments);
        this._updateHandleColumn()
    },
    _allowReordering: function() {
        var rowDragging = this.option("rowDragging");
        return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group))
    },
    _updateHandleColumn: function() {
        var rowDragging = this.option("rowDragging"),
            allowReordering = this._allowReordering(),
            columnsController = this._columnsController,
            isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;
        columnsController && columnsController.addCommandColumn({
            type: "drag",
            command: "drag",
            visibleIndex: -2,
            alignment: "center",
            cssClass: COMMAND_HANDLE_CLASS,
            width: "auto",
            cellTemplate: this._getHandleTemplate(),
            visible: isHandleColumnVisible
        });
        columnsController.columnOption("type:drag", "visible", isHandleColumnVisible)
    },
    _renderContent: function() {
        var that = this,
            rowDragging = this.option("rowDragging"),
            allowReordering = this._allowReordering(),
            $content = that.callBase.apply(that, arguments);
        if (allowReordering && $content.length) {
            that._sortable = that._createComponent($content, _sortable2.default, (0, _extend.extend)({
                component: that.component,
                contentTemplate: null,
                filter: "> table > tbody > .dx-row:not(.dx-freespace-row):not(.dx-virtual-row)",
                dragTemplate: that._getDraggableRowTemplate(),
                handle: rowDragging.showDragIcons && "." + COMMAND_HANDLE_CLASS,
                dropFeedbackMode: "indicate"
            }, rowDragging, {
                onDragStart: function onDragStart(e) {
                    var row = e.component.getVisibleRows()[e.fromIndex];
                    e.itemData = row && row.data;
                    var isDataRow = row && "data" === row.rowType;
                    e.cancel = !isDataRow;
                    var onDragStart = rowDragging.onDragStart;
                    onDragStart && onDragStart(e)
                }
            }))
        }
        return $content
    },
    _getDraggableGridOptions: function(options) {
        var gridOptions = this.option(),
            columns = this.getColumns(),
            $rowElement = (0, _renderer2.default)(this.getRowElement(options.rowIndex));
        return {
            dataSource: [{
                id: 1,
                parentId: 0
            }],
            showBorders: true,
            showColumnHeaders: false,
            scrolling: {
                useNative: false,
                showScrollbar: false
            },
            pager: {
                visible: false
            },
            loadingTimeout: void 0,
            columnFixing: gridOptions.columnFixing,
            columnAutoWidth: gridOptions.columnAutoWidth,
            showColumnLines: gridOptions.showColumnLines,
            columns: columns.map(function(column) {
                return {
                    width: column.width || column.visibleWidth,
                    fixed: column.fixed,
                    fixedPosition: column.fixedPosition
                }
            }),
            onRowPrepared: function(e) {
                var rowsView = e.component.getView("rowsView");
                (0, _renderer2.default)(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone())
            }
        }
    },
    _getDraggableRowTemplate: function() {
        var _this = this;
        return function(options) {
            var $rootElement = _this.component.$element(),
                $dataGridContainer = (0, _renderer2.default)("<div>").width($rootElement.width()),
                items = _this._dataController.items(),
                row = items && items[options.fromIndex],
                gridOptions = _this._getDraggableGridOptions(row);
            _this._createComponent($dataGridContainer, _this.component.NAME, gridOptions);
            $dataGridContainer.find(".dx-gridbase-container").children(":not(." + _this.addWidgetPrefix(ROWS_VIEW) + ")").hide();
            return $dataGridContainer
        }
    },
    _getHandleTemplate: function() {
        var _this2 = this;
        return function(container, options) {
            (0, _renderer2.default)(container).addClass(CELL_FOCUS_DISABLED_CLASS);
            return (0, _renderer2.default)("<span>").addClass(_this2.addWidgetPrefix(HANDLE_ICON_CLASS))
        }
    },
    optionChanged: function(args) {
        if ("rowDragging" === args.name) {
            this._updateHandleColumn();
            this._invalidate(true, true);
            args.handled = true
        }
        this.callBase.apply(this, arguments)
    }
};
module.exports = {
    defaultOptions: function() {
        return {
            rowDragging: {
                showDragIcons: true,
                dropFeedbackMode: "indicate",
                allowReordering: false,
                allowDropInsideItem: false
            }
        }
    },
    extenders: {
        views: {
            rowsView: RowDraggingExtender
        }
    }
};
