/**
 * DevExtreme (ui/grid_core/ui.grid_core.editing.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _window = require("../../core/utils/window");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _uiGrid_core = require("./ui.grid_core.modules");
var _uiGrid_core2 = _interopRequireDefault(_uiGrid_core);
var _click = require("../../events/click");
var _click2 = _interopRequireDefault(_click);
var _double_click = require("../../events/double_click");
var _double_click2 = _interopRequireDefault(_double_click);
var _pointer = require("../../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);
var _uiGrid_core3 = require("./ui.grid_core.utils");
var _utils = require("../../events/utils");
var _dialog = require("../dialog");
var _dialog2 = _interopRequireDefault(_dialog);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);
var _ui = require("../widget/ui.errors");
var _ui2 = _interopRequireDefault(_ui);
var _devices = require("../../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _form = require("../form");
var _form2 = _interopRequireDefault(_form);
var _hold = require("../../events/hold");
var _hold2 = _interopRequireDefault(_hold);
var _deferred = require("../../core/utils/deferred");
var _deferred2 = _interopRequireDefault(_deferred);
var _common = require("../../core/utils/common");
var _common2 = _interopRequireDefault(_common);
var _icon = require("../../core/utils/icon");
var _icon2 = _interopRequireDefault(_icon);
var _ui3 = require("../scroll_view/ui.scrollable");
var _ui4 = _interopRequireDefault(_ui3);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
    }
}
var EDIT_FORM_CLASS = "edit-form",
    EDIT_FORM_ITEM_CLASS = "edit-form-item",
    FOCUS_OVERLAY_CLASS = "focus-overlay",
    READONLY_CLASS = "readonly",
    EDIT_POPUP_CLASS = "edit-popup",
    FORM_BUTTONS_CONTAINER_CLASS = "form-buttons-container",
    ADD_ROW_BUTTON_CLASS = "addrow-button",
    LINK_CLASS = "dx-link",
    EDITOR_CELL_CLASS = "dx-editor-cell",
    ROW_SELECTED = "dx-selection",
    EDIT_ROW = "dx-edit-row",
    EDIT_BUTTON_CLASS = "dx-edit-button",
    COMMAND_EDIT_CLASS = "dx-command-edit",
    COMMAND_EDIT_WITH_ICONS_CLASS = COMMAND_EDIT_CLASS + "-with-icons",
    SCROLLABLE_CONTAINER_CLASS = "dx-scrollable-container",
    BUTTON_CLASS = "dx-button",
    INSERT_INDEX = "__DX_INSERT_INDEX__",
    ROW_CLASS = "dx-row",
    ROW_REMOVED = "dx-row-removed",
    ROW_INSERTED = "dx-row-inserted",
    ROW_MODIFIED = "dx-row-modified",
    CELL_MODIFIED = "dx-cell-modified",
    CELL_HIGHLIGHT_OUTLINE = "dx-highlight-outline",
    EDITING_NAMESPACE = "dxDataGridEditing",
    DATA_ROW_CLASS = "dx-data-row",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    EDITORS_INPUT_SELECTOR = "input:not([type='hidden'])",
    FOCUSABLE_ELEMENT_SELECTOR = "[tabindex], " + EDITORS_INPUT_SELECTOR,
    EDIT_MODE_BATCH = "batch",
    EDIT_MODE_ROW = "row",
    EDIT_MODE_CELL = "cell",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_POPUP = "popup",
    DATA_EDIT_DATA_INSERT_TYPE = "insert",
    DATA_EDIT_DATA_UPDATE_TYPE = "update",
    DATA_EDIT_DATA_REMOVE_TYPE = "remove",
    POINTER_EVENTS_TARGET_CLASS = "dx-pointer-events-target",
    DEFAULT_START_EDIT_ACTION = "click",
    EDIT_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL, EDIT_MODE_FORM, EDIT_MODE_POPUP],
    ROW_BASED_MODES = [EDIT_MODE_ROW, EDIT_MODE_FORM, EDIT_MODE_POPUP],
    CELL_BASED_MODES = [EDIT_MODE_BATCH, EDIT_MODE_CELL],
    FORM_BASED_MODES = [EDIT_MODE_FORM, EDIT_MODE_POPUP],
    MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM],
    TARGET_COMPONENT_NAME = "targetComponent";
var EDIT_LINK_CLASS = {
        save: "dx-link-save",
        cancel: "dx-link-cancel",
        edit: "dx-link-edit",
        undelete: "dx-link-undelete",
        "delete": "dx-link-delete",
        add: "dx-link-add"
    },
    EDIT_ICON_CLASS = {
        save: "save",
        cancel: "revert",
        edit: "edit",
        undelete: "revert",
        "delete": "trash",
        add: "add"
    },
    METHOD_NAMES = {
        edit: "editRow",
        "delete": "deleteRow",
        undelete: "undeleteRow",
        save: "saveEditData",
        cancel: "cancelEditData",
        add: "addRowByRowIndex"
    },
    ACTION_OPTION_NAMES = {
        add: "allowAdding",
        edit: "allowUpdating",
        "delete": "allowDeleting"
    },
    BUTTON_NAMES = ["edit", "save", "cancel", "delete", "undelete"];
var createFailureHandler = function(deferred) {
    return function(arg) {
        var error = arg instanceof Error ? arg : new Error(arg && String(arg) || "Unknown error");
        deferred.reject(error)
    }
};
var _getEditMode = function(that) {
    var editMode = that.option("editing.mode");
    if (EDIT_MODES.indexOf(editMode) !== -1) {
        return editMode
    }
    return EDIT_MODE_ROW
};
var _isRowEditMode = function(that) {
    var editMode = _getEditMode(that);
    return ROW_BASED_MODES.indexOf(editMode) !== -1
};
var getDocumentClickEventName = function() {
    return "desktop" === _devices2.default.real().deviceType ? _pointer2.default.down : _click2.default.name
};
var EditingController = _uiGrid_core2.default.ViewController.inherit(function() {
    var getDefaultEditorTemplate = function(that) {
        return function(container, options) {
            var $editor = (0, _renderer2.default)("<div>").appendTo(container);
            that.getController("editorFactory").createEditor($editor, (0, _extend.extend)({}, options.column, {
                value: options.value,
                setValue: options.setValue,
                row: options.row,
                parentType: "dataRow",
                width: null,
                readOnly: !options.setValue,
                isOnForm: options.isOnForm,
                id: options.id
            }))
        }
    };
    var getEditingTexts = function(options) {
        var editingTexts = options.component.option("editing.texts") || {};
        return {
            save: editingTexts.saveRowChanges,
            cancel: editingTexts.cancelRowChanges,
            edit: editingTexts.editRow,
            undelete: editingTexts.undeleteRow,
            "delete": editingTexts.deleteRow,
            add: editingTexts.addRowToNode
        }
    };
    var getButtonIndex = function(buttons, name) {
        var result = -1;
        buttons.some(function(button, index) {
            if (getButtonName(button) === name) {
                result = index;
                return true
            }
        });
        return result
    };
    var getButtonName = function(button) {
        return _type2.default.isObject(button) ? button.name : button
    };
    var getEditorType = function(item) {
        var column = item.column;
        return item.isCustomEditorType ? item.editorType : column.formItem && column.formItem.editorType
    };
    var forEachFormItems = function forEachFormItems(items, callBack) {
        items.forEach(function(item) {
            if (item.items || item.tabs) {
                forEachFormItems(item.items || item.tabs, callBack)
            } else {
                callBack(item)
            }
        })
    };
    return {
        init: function() {
            var that = this;
            that._editRowIndex = -1;
            that._editData = [];
            that._editColumnIndex = -1;
            that._columnsController = that.getController("columns");
            that._dataController = that.getController("data");
            that._rowsView = that.getView("rowsView");
            that._editForm = null;
            that._updateEditFormDeferred = null;
            if (that._deferreds) {
                that._deferreds.forEach(function(d) {
                    return d.reject("cancel")
                })
            }
            that._deferreds = [];
            if (!that._dataChangedHandler) {
                that._dataChangedHandler = that._handleDataChanged.bind(that);
                that._dataController.changed.add(that._dataChangedHandler)
            }
            if (!that._saveEditorHandler) {
                that.createAction("onInitNewRow", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onRowInserting", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onRowInserted", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onEditingStart", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onRowUpdating", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onRowUpdated", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onRowRemoving", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that.createAction("onRowRemoved", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                that._saveEditorHandler = that.createAction(function(e) {
                    var isEditorPopup, isDomElement, isFocusOverlay, isAddRowButton, isCellEditMode, $target, isAnotherComponent, event = e.event,
                        targetComponent = event[TARGET_COMPONENT_NAME];
                    if (!_isRowEditMode(that) && !that._editCellInProgress) {
                        $target = (0, _renderer2.default)(event.target);
                        isEditorPopup = $target.closest(".dx-dropdowneditor-overlay").length;
                        isDomElement = $target.closest((0, _window.getWindow)().document).length;
                        isAnotherComponent = targetComponent && targetComponent !== that.component;
                        isAddRowButton = $target.closest("." + that.addWidgetPrefix(ADD_ROW_BUTTON_CLASS)).length;
                        isFocusOverlay = $target.hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
                        isCellEditMode = _getEditMode(that) === EDIT_MODE_CELL;
                        if (!isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && that.isEditing()) && (isDomElement || isAnotherComponent)) {
                            that._closeEditItem.bind(that)($target)
                        }
                    }
                });
                _events_engine2.default.on(_dom_adapter2.default.getDocument(), getDocumentClickEventName(), that._saveEditorHandler)
            }
            that._updateEditColumn();
            that._updateEditButtons()
        },
        getUpdatedData: function(data) {
            var key = this._dataController.keyOf(data),
                editData = this._editData,
                editIndex = (0, _uiGrid_core3.getIndexByKey)(key, editData);
            if (editData[editIndex]) {
                return (0, _uiGrid_core3.createObjectWithChanges)(data, editData[editIndex].data)
            }
            return data
        },
        getInsertedData: function() {
            return this._editData.filter(function(editData) {
                return editData.data && editData.type === DATA_EDIT_DATA_INSERT_TYPE
            }).map(function(editData) {
                return editData.data
            })
        },
        getRemovedData: function() {
            return this._editData.filter(function(editData) {
                return editData.oldData && editData.type === DATA_EDIT_DATA_REMOVE_TYPE
            }).map(function(editData) {
                return editData.oldData
            })
        },
        _fireDataErrorOccurred: function(arg) {
            if ("cancel" === arg) {
                return
            }
            var $popupContent = this.getPopupContent();
            this._dataController.dataErrorOccurred.fire(arg, $popupContent)
        },
        _needToCloseEditableCell: function($targetElement) {
            var $element = this.component.$element(),
                result = this.isEditing(),
                isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;
            if (isCurrentComponentElement) {
                var isDataRow = $targetElement.closest("." + DATA_ROW_CLASS).length;
                if (isDataRow) {
                    var rowsView = this.getView("rowsView"),
                        $targetCell = $targetElement.closest("." + ROW_CLASS + "> td"),
                        rowIndex = rowsView.getRowIndex($targetCell.parent()),
                        columnIndex = rowsView.getCellElements(rowIndex).index($targetCell),
                        visibleColumns = this._columnsController.getVisibleColumns(),
                        allowEditing = visibleColumns[columnIndex] && visibleColumns[columnIndex].allowEditing;
                    result = result && !allowEditing && !this.isEditCell(rowIndex, columnIndex)
                }
            }
            return result
        },
        _closeEditItem: function($targetElement) {
            if (this._needToCloseEditableCell($targetElement)) {
                this.closeEditCell()
            }
        },
        _handleDataChanged: function(args) {
            var that = this,
                editForm = that._editForm;
            if ("standard" === that.option("scrolling.mode")) {
                that.resetRowAndPageIndices()
            }
            if ("prepend" === args.changeType) {
                (0, _iterator.each)(that._editData, function(_, editData) {
                    editData.rowIndex += args.items.length
                })
            }
            if ("refresh" === args.changeType && _getEditMode(that) === EDIT_MODE_POPUP && editForm && editForm.option("visible")) {
                this._repaintEditPopup()
            }
        },
        _isDefaultButtonVisible: function(button, options) {
            var result = true,
                isRowMode = _isRowEditMode(this),
                isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex() && isRowMode;
            switch (button.name) {
                case "edit":
                    result = !isEditRow && this.allowUpdating(options) && isRowMode;
                    break;
                case "save":
                case "cancel":
                    result = isEditRow;
                    break;
                case "delete":
                    result = !isEditRow && this.allowDeleting(options) && !options.row.removed;
                    break;
                case "undelete":
                    result = this.allowDeleting(options) && options.row.removed
            }
            return result
        },
        _isButtonVisible: function(button, options) {
            var visible = button.visible;
            if (!_type2.default.isDefined(visible)) {
                return this._isDefaultButtonVisible(button, options)
            }
            return _type2.default.isFunction(visible) ? visible.call(button, {
                component: options.component,
                row: options.row,
                column: options.column
            }) : visible
        },
        _getButtonConfig: function(button, options) {
            var _this = this;
            var config = _type2.default.isObject(button) ? button : {},
                buttonName = getButtonName(button),
                editingTexts = getEditingTexts(options),
                methodName = METHOD_NAMES[buttonName],
                editingOptions = this.option("editing"),
                actionName = ACTION_OPTION_NAMES[buttonName],
                allowAction = actionName ? editingOptions[actionName] : true;
            return (0, _extend.extend)({
                name: buttonName,
                text: editingTexts[buttonName],
                cssClass: EDIT_LINK_CLASS[buttonName],
                onClick: function(e) {
                    var event = e.event;
                    event.stopPropagation();
                    event.preventDefault();
                    setTimeout(function() {
                        options.row && allowAction && _this[methodName] && _this[methodName](options.row.rowIndex)
                    })
                }
            }, config)
        },
        _getEditingButtons: function(options) {
            var _this2 = this;
            var buttonIndex, haveCustomButtons = !!options.column.buttons,
                buttons = (options.column.buttons || []).slice();
            if (haveCustomButtons) {
                buttonIndex = getButtonIndex(buttons, "edit");
                if (buttonIndex >= 0) {
                    if (getButtonIndex(buttons, "save") < 0) {
                        buttons.splice(buttonIndex + 1, 0, "save")
                    }
                    if (getButtonIndex(buttons, "cancel") < 0) {
                        buttons.splice(getButtonIndex(buttons, "save") + 1, 0, "cancel")
                    }
                }
                buttonIndex = getButtonIndex(buttons, "delete");
                if (buttonIndex >= 0 && getButtonIndex(buttons, "undelete") < 0) {
                    buttons.splice(buttonIndex + 1, 0, "undelete")
                }
            } else {
                buttons = BUTTON_NAMES.slice()
            }
            return buttons.map(function(button) {
                return _this2._getButtonConfig(button, options)
            })
        },
        _renderEditingButtons: function($container, buttons, options) {
            var _this3 = this;
            buttons.forEach(function(button) {
                if (_this3._isButtonVisible(button, options)) {
                    _this3._createButton($container, button, options)
                }
            })
        },
        _getEditCommandCellTemplate: function() {
            var _this4 = this;
            return function(container, options) {
                var buttons, $container = (0, _renderer2.default)(container);
                if ("data" === options.rowType) {
                    options.rtlEnabled = _this4.option("rtlEnabled");
                    buttons = _this4._getEditingButtons(options);
                    _this4._renderEditingButtons($container, buttons, options);
                    options.watch && options.watch(function() {
                        return buttons.map(function(button) {
                            return _this4._isButtonVisible(button, options)
                        })
                    }, function() {
                        $container.empty();
                        _this4._renderEditingButtons($container, buttons, options)
                    })
                } else {
                    (0, _uiGrid_core3.setEmptyText)($container)
                }
            }
        },
        correctEditRowIndexAfterExpand: function(key) {
            if (this._editRowIndex > this._dataController.getRowIndexByKey(key)) {
                this._editRowIndex++
            }
        },
        correctEditRowIndex: function(getRowIndexCorrection) {
            this._editRowIndex += getRowIndexCorrection(this._getVisibleEditRowIndex())
        },
        isRowEditMode: function() {
            return _isRowEditMode(this)
        },
        isFormEditMode: function() {
            var editMode = _getEditMode(this);
            return FORM_BASED_MODES.indexOf(editMode) !== -1
        },
        isCellOrBatchEditMode: function() {
            var editMode = this.getEditMode();
            return editMode === EDIT_MODE_BATCH || editMode === EDIT_MODE_CELL
        },
        getEditMode: function() {
            return _getEditMode(this)
        },
        getFirstEditableColumnIndex: function() {
            var columnIndex, columnsController = this.getController("columns"),
                firstFormItem = this._firstFormItem;
            if (_getEditMode(this) === EDIT_MODE_FORM && firstFormItem) {
                var $editFormElements = this._rowsView.getCellElements(this._editRowIndex);
                columnIndex = this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column)
            } else {
                var visibleColumns = columnsController.getVisibleColumns();
                (0, _iterator.each)(visibleColumns, function(index, column) {
                    if (column.allowEditing) {
                        columnIndex = index;
                        return false
                    }
                })
            }
            return columnIndex
        },
        getFirstEditableCellInRow: function(rowIndex) {
            var rowsView = this.getView("rowsView");
            return rowsView && rowsView._getCellElement(rowIndex ? rowIndex : 0, this.getFirstEditableColumnIndex())
        },
        getFocusedCellInRow: function(rowIndex) {
            return this.getFirstEditableCellInRow(rowIndex)
        },
        getIndexByKey: function(key, items) {
            return (0, _uiGrid_core3.getIndexByKey)(key, items)
        },
        hasChanges: function(rowIndex) {
            var that = this,
                result = false;
            for (var i = 0; i < that._editData.length; i++) {
                if (that._editData[i].type && (!_type2.default.isDefined(rowIndex) || that._dataController.getRowIndexByKey(that._editData[i].key) === rowIndex)) {
                    result = true;
                    break
                }
            }
            return result
        },
        dispose: function() {
            this.callBase();
            clearTimeout(this._inputFocusTimeoutID);
            _events_engine2.default.off(_dom_adapter2.default.getDocument(), getDocumentClickEventName(), this._saveEditorHandler)
        },
        optionChanged: function(args) {
            if ("editing" === args.name) {
                if (this._editPopup && this._editPopup.option("visible") && 0 === args.fullName.indexOf("editing.form")) {
                    this._repaintEditPopup()
                } else {
                    this.init()
                }
                args.handled = true
            } else {
                this.callBase(args)
            }
        },
        publicMethods: function() {
            return ["insertRow", "addRow", "removeRow", "deleteRow", "undeleteRow", "editRow", "editCell", "closeEditCell", "saveEditData", "cancelEditData", "hasEditData"]
        },
        refresh: function() {
            if (_getEditMode(this) === EDIT_MODE_CELL) {
                return
            }
            if (_getEditMode(this) !== EDIT_MODE_BATCH) {
                this.init()
            } else {
                this._editRowIndex = -1;
                this._editColumnIndex = -1
            }
        },
        isEditing: function() {
            return this._editRowIndex > -1
        },
        isEditRow: function(rowIndex) {
            var editMode = _getEditMode(this);
            return this._getVisibleEditRowIndex() === rowIndex && ROW_BASED_MODES.indexOf(editMode) !== -1
        },
        getEditRowKey: function() {
            var items = this._dataController.items(),
                item = items[this._getVisibleEditRowIndex()];
            return item && item.key
        },
        getEditRowIndex: function() {
            return this._getVisibleEditRowIndex()
        },
        getEditFormRowIndex: function() {
            var editMode = _getEditMode(this);
            return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP ? this._getVisibleEditRowIndex() : -1
        },
        isEditCell: function(rowIndex, columnIndex) {
            var hasEditData = !!(Array.isArray(this._editData) && this._editData.length);
            return hasEditData && this._getVisibleEditRowIndex() === rowIndex && this._editColumnIndex === columnIndex
        },
        getPopupContent: function() {
            var editMode = _getEditMode(this),
                popupVisible = this._editPopup && this._editPopup.option("visible");
            if (editMode === EDIT_MODE_POPUP && popupVisible) {
                return this._$popupContent
            }
        },
        getEditForm: function() {
            return this._editForm
        },
        _needInsertItem: function(editData, changeType) {
            var that = this,
                dataSource = that._dataController.dataSource(),
                scrollingMode = that.option("scrolling.mode"),
                pageIndex = dataSource.pageIndex(),
                beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : pageIndex,
                endPageIndex = dataSource.endPageIndex ? dataSource.endPageIndex() : pageIndex;
            if ("standard" !== scrollingMode) {
                switch (changeType) {
                    case "append":
                        return editData.key.pageIndex === endPageIndex;
                    case "prepend":
                        return editData.key.pageIndex === beginPageIndex;
                    case "refresh":
                        editData.key.rowIndex = 0;
                        editData.key.dataRowIndex = 0;
                        editData.key.pageIndex = 0;
                        break;
                    default:
                        return editData.key.pageIndex >= beginPageIndex && editData.key.pageIndex <= endPageIndex
                }
            }
            return editData.key.pageIndex === pageIndex
        },
        _generateNewItem: function(key) {
            var item = {
                key: key
            };
            if (key && key[INSERT_INDEX]) {
                item[INSERT_INDEX] = key[INSERT_INDEX]
            }
            return item
        },
        processItems: function(items, change) {
            var key, item, editData, rowIndexOffset, changeType = change.changeType,
                dataController = this._dataController,
                dataRowIndex = -1;
            this.update(changeType);
            editData = this._editData;
            for (var i = 0; i < editData.length; i++) {
                key = editData[i].key;
                if (key) {
                    rowIndexOffset = dataController.getRowIndexOffset();
                    dataRowIndex = key.dataRowIndex - rowIndexOffset + dataController.getRowIndexDelta();
                    if ("append" === changeType) {
                        dataRowIndex -= dataController.items(true).length;
                        if (change.removeCount) {
                            dataRowIndex += change.removeCount
                        }
                    }
                    item = this._generateNewItem(key);
                    if (dataRowIndex >= 0 && editData[i].type === DATA_EDIT_DATA_INSERT_TYPE && this._needInsertItem(editData[i], changeType, items, item)) {
                        items.splice(key.dataRowIndex ? dataRowIndex : 0, 0, item)
                    }
                }
            }
            return items
        },
        processDataItem: function(item, options, generateDataValues) {
            var data, editMode, editData, editIndex, that = this,
                columns = options.visibleColumns,
                key = item.data[INSERT_INDEX] ? item.data.key : item.key;
            editIndex = (0, _uiGrid_core3.getIndexByKey)(key, that._editData);
            if (editIndex >= 0) {
                editMode = _getEditMode(that);
                editData = that._editData[editIndex];
                data = editData.data;
                item.isEditing = false;
                switch (editData.type) {
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        if (editMode === EDIT_MODE_POPUP) {
                            item.visible = false
                        }
                        item.isNewRow = true;
                        item.key = key;
                        item.data = data;
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        item.modified = true;
                        item.oldData = item.data;
                        item.data = (0, _uiGrid_core3.createObjectWithChanges)(item.data, data);
                        item.modifiedValues = generateDataValues(data, columns, true);
                        break;
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        if (editMode === EDIT_MODE_BATCH) {
                            item.data = (0, _uiGrid_core3.createObjectWithChanges)(item.data, data)
                        }
                        item.removed = true
                }
            }
        },
        insertRow: function() {
            _ui2.default.log("W0002", "dxDataGrid", "insertRow", "15.2", "Use the 'addRow' method instead");
            return this.addRow()
        },
        _initNewRow: function(options) {
            var _this5 = this;
            this.executeAction("onInitNewRow", options);
            if (options.promise) {
                var deferred = new _deferred.Deferred;
                (0, _deferred.when)((0, _deferred.fromPromise)(options.promise)).done(deferred.resolve).fail(createFailureHandler(deferred)).fail(function(arg) {
                    return _this5._fireDataErrorOccurred(arg)
                });
                return deferred
            }
        },
        _getInsertKey: function(parentKey) {
            var insertKey, row, that = this,
                dataController = that._dataController,
                rows = dataController.items(),
                editMode = _getEditMode(that);
            insertKey = {
                parentKey: parentKey,
                pageIndex: dataController.pageIndex(),
                rowIndex: that._getInsertRowIndex(parentKey)
            };
            row = rows[insertKey.rowIndex];
            if (row && (!row.isEditing && "detail" === row.rowType || "detailAdaptive" === row.rowType)) {
                insertKey.rowIndex++
            }
            insertKey.dataRowIndex = dataController.getRowIndexOffset() + rows.filter(function(row, index) {
                return index < insertKey.rowIndex && ("data" === row.rowType || "group" === row.rowType || row.isNewRow)
            }).length;
            if (editMode !== EDIT_MODE_BATCH) {
                that._editRowIndex = insertKey.rowIndex + that._dataController.getRowIndexOffset()
            }
            insertKey[INSERT_INDEX] = that._getInsertIndex();
            return insertKey
        },
        _getInsertRowIndex: function(parentKey) {
            var that = this,
                rowsView = that.getView("rowsView"),
                parentRowIndex = that._dataController.getRowIndexByKey(parentKey);
            if (parentRowIndex >= 0) {
                return parentRowIndex + 1
            }
            if (rowsView) {
                return rowsView.getTopVisibleItemIndex(true)
            }
            return 0
        },
        _getInsertIndex: function() {
            var maxInsertIndex = 0;
            this._editData.forEach(function(editItem) {
                if (editItem.type === DATA_EDIT_DATA_INSERT_TYPE && editItem.key[INSERT_INDEX] > maxInsertIndex) {
                    maxInsertIndex = editItem.key[INSERT_INDEX]
                }
            });
            return maxInsertIndex + 1
        },
        addRow: function(parentKey) {
            var that = this,
                dataController = that._dataController,
                store = dataController.store(),
                key = store && store.key(),
                param = {
                    data: {}
                },
                editMode = _getEditMode(that);
            if (!store) {
                dataController.fireError("E1052", this.component.NAME);
                return
            }
            if (editMode === EDIT_MODE_CELL && that.hasChanges()) {
                that.saveEditData().done(function() {
                    if (!that.hasChanges()) {
                        that.addRow(parentKey)
                    }
                });
                return
            }
            that.refresh();
            if (!that._allowRowAdding()) {
                return
            }
            if (!key) {
                param.data.__KEY__ = String(new _guid2.default)
            }(0, _deferred.when)(that._initNewRow(param, parentKey)).done(function() {
                if (that._allowRowAdding()) {
                    that._addRowCore(param.data, parentKey)
                }
            })
        },
        _allowRowAdding: function() {
            var that = this,
                editMode = _getEditMode(that),
                insertIndex = that._getInsertIndex();
            if (editMode !== EDIT_MODE_BATCH && insertIndex > 1) {
                return false
            }
            return true
        },
        _addRowCore: function(data, parentKey) {
            var that = this,
                insertKey = that._getInsertKey(parentKey),
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                editMode = _getEditMode(that);
            that._addEditData({
                key: insertKey,
                data: data,
                type: DATA_EDIT_DATA_INSERT_TYPE
            });
            that._dataController.updateItems({
                changeType: "update",
                rowIndices: [oldEditRowIndex, insertKey.rowIndex]
            });
            if (editMode === EDIT_MODE_POPUP) {
                that._showEditPopup(insertKey.rowIndex)
            } else {
                that._focusFirstEditableCellInRow(insertKey.rowIndex)
            }
            that._afterInsertRow({
                key: insertKey,
                data: data
            })
        },
        _focusFirstEditableCellInRow: function(rowIndex) {
            var that = this,
                $firstCell = that.getFirstEditableCellInRow(rowIndex);
            that._editCellInProgress = true;
            that._delayedInputFocus($firstCell, function() {
                that._editCellInProgress = false;
                var $cell = that.getFirstEditableCellInRow(rowIndex),
                    eventToTrigger = "dblClick" === that.option("editing.startEditAction") ? _double_click2.default.name : _click2.default.name;
                $cell && _events_engine2.default.trigger($cell, eventToTrigger)
            })
        },
        _isEditingStart: function(options) {
            this.executeAction("onEditingStart", options);
            return options.cancel
        },
        _beforeEditCell: function(rowIndex, columnIndex, item) {
            var that = this;
            if (_getEditMode(that) === EDIT_MODE_CELL && !item.isNewRow && that.hasChanges()) {
                var d = new _deferred.Deferred;
                that.saveEditData().always(function() {
                    d.resolve(that.hasChanges())
                });
                return d
            }
        },
        _beforeUpdateItems: function() {},
        _getVisibleEditRowIndex: function() {
            return this._editRowIndex >= 0 ? this._editRowIndex - this._dataController.getRowIndexOffset() : -1
        },
        editRow: function(rowIndex) {
            var $editingCell, that = this,
                dataController = that._dataController,
                items = dataController.items(),
                item = items[rowIndex],
                params = {
                    data: item && item.data,
                    cancel: false
                },
                oldEditRowIndex = that._getVisibleEditRowIndex();
            if (!item) {
                return
            }
            if (rowIndex === oldEditRowIndex) {
                return true
            }
            if (!item.isNewRow) {
                params.key = item.key
            }
            if (that._isEditingStart(params)) {
                return
            }
            that.init();
            that._pageIndex = dataController.pageIndex();
            that._editRowIndex = (items[0].isNewRow ? rowIndex - 1 : rowIndex) + that._dataController.getRowIndexOffset();
            that._addEditData({
                data: {},
                key: item.key,
                oldData: item.data
            });
            var rowIndices = [oldEditRowIndex, rowIndex],
                editMode = _getEditMode(that);
            that._beforeUpdateItems(rowIndices, rowIndex, oldEditRowIndex);
            if (editMode === EDIT_MODE_POPUP) {
                that._showEditPopup(rowIndex)
            } else {
                dataController.updateItems({
                    changeType: "update",
                    rowIndices: rowIndices
                })
            }
            if (MODES_WITH_DELAYED_FOCUS.indexOf(editMode) !== -1) {
                $editingCell = that.getFocusedCellInRow(that._getVisibleEditRowIndex());
                that._delayedInputFocus($editingCell, function() {
                    $editingCell && that.component.focus($editingCell)
                })
            }
        },
        _showEditPopup: function(rowIndex, repaintForm) {
            var that = this,
                isMobileDevice = "desktop" !== _devices2.default.current().deviceType,
                popupOptions = (0, _extend.extend)({
                    showTitle: false,
                    fullScreen: isMobileDevice,
                    toolbarItems: [{
                        toolbar: "bottom",
                        location: "after",
                        widget: "dxButton",
                        options: that._getSaveButtonConfig()
                    }, {
                        toolbar: "bottom",
                        location: "after",
                        widget: "dxButton",
                        options: that._getCancelButtonConfig()
                    }],
                    contentTemplate: that._getPopupEditFormTemplate(rowIndex)
                }, that.option("editing.popup"));
            if (!that._editPopup) {
                var $popupContainer = (0, _renderer2.default)("<div>").appendTo(that.component.$element()).addClass(that.addWidgetPrefix(EDIT_POPUP_CLASS));
                that._editPopup = that._createComponent($popupContainer, _popup2.default, {});
                that._editPopup.on("hiding", that._getEditPopupHiddenHandler());
                that._editPopup.on("shown", function(e) {
                    _events_engine2.default.trigger(e.component.$content().find(FOCUSABLE_ELEMENT_SELECTOR).not("." + SCROLLABLE_CONTAINER_CLASS).first(), "focus");
                    if (repaintForm) {
                        that._editForm && that._editForm.repaint()
                    }
                })
            }
            that._editPopup.option(popupOptions);
            that._editPopup.show()
        },
        _repaintEditPopup: function() {
            var rowIndex = this._getVisibleEditRowIndex();
            if (this._editPopup && this._editPopup.option("visible") && rowIndex >= 0) {
                var defaultAnimation = this._editPopup.option("animation");
                this._editPopup.option("animation", null);
                this._showEditPopup(rowIndex, true);
                this._editPopup.option("animation", defaultAnimation)
            }
        },
        _getEditPopupHiddenHandler: function() {
            var that = this;
            return function(e) {
                if (that.isEditing()) {
                    that.cancelEditData()
                }
            }
        },
        _getPopupEditFormTemplate: function(rowIndex) {
            var that = this,
                row = that.component.getVisibleRows()[rowIndex],
                templateOptions = {
                    row: row,
                    rowType: row.rowType,
                    key: row.key
                };
            return function(container) {
                var formTemplate = that.getEditFormTemplate(),
                    scrollable = that._createComponent((0, _renderer2.default)("<div>").appendTo(container), _ui4.default);
                that._$popupContent = scrollable.$content();
                formTemplate(that._$popupContent, templateOptions, true)
            }
        },
        _getSaveButtonConfig: function() {
            return {
                text: this.option("editing.texts.saveRowChanges"),
                onClick: this.saveEditData.bind(this)
            }
        },
        _getCancelButtonConfig: function() {
            return {
                text: this.option("editing.texts.cancelRowChanges"),
                onClick: this.cancelEditData.bind(this)
            }
        },
        _removeEditDataItem: function(index) {
            if (index >= 0) {
                this._editData.splice(index, 1)
            }
        },
        editCell: function(rowIndex, columnIndex) {
            var _this6 = this;
            var d = new _deferred.Deferred,
                coreResult = void 0;
            _deferred.when.apply(void 0, _toConsumableArray(this._deferreds)).done(function() {
                coreResult = _this6._editCellCore(rowIndex, columnIndex);
                (0, _deferred.when)(coreResult).done(d.resolve).fail(d.reject)
            });
            return void 0 !== coreResult ? coreResult : d.promise()
        },
        _editCellCore: function(rowIndex, columnIndex) {
            var that = this,
                columnsController = that._columnsController,
                dataController = that._dataController,
                items = dataController.items(),
                item = items[rowIndex],
                params = {
                    data: item && item.data,
                    cancel: false
                },
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                visibleColumns = columnsController.getVisibleColumns(),
                oldColumn = visibleColumns[that._editColumnIndex];
            if (_type2.default.isString(columnIndex)) {
                columnIndex = columnsController.columnOption(columnIndex, "index");
                columnIndex = columnsController.getVisibleIndex(columnIndex)
            }
            var column = params.column = visibleColumns[columnIndex];
            if (column && item && ("data" === item.rowType || "detailAdaptive" === item.rowType) && !item.removed && !_isRowEditMode(that)) {
                if (that.isEditCell(rowIndex, columnIndex)) {
                    return true
                }
                var editRowIndex = rowIndex + dataController.getRowIndexOffset();
                return (0, _deferred.when)(that._beforeEditCell(rowIndex, columnIndex, item)).done(function(cancel) {
                    if (cancel) {
                        return
                    }
                    if (that._prepareEditCell(params, item, columnIndex, editRowIndex)) {
                        _common2.default.deferRender(function() {
                            that._repaintEditCell(column, oldColumn, oldEditRowIndex)
                        })
                    } else {
                        that._processCanceledEditingCell()
                    }
                })
            }
            return false
        },
        _processCanceledEditingCell: function() {},
        _prepareEditCell: function(params, item, editColumnIndex, editRowIndex) {
            var that = this;
            if (!item.isNewRow) {
                params.key = item.key
            }
            if (that._isEditingStart(params)) {
                return false
            }
            that._editRowIndex = editRowIndex;
            that._editColumnIndex = editColumnIndex;
            that._pageIndex = that._dataController.pageIndex();
            that._addEditData({
                data: {},
                key: item.key,
                oldData: item.data
            });
            return true
        },
        _repaintEditCell: function(column, oldColumn, oldEditRowIndex) {
            var that = this,
                rowsView = that._rowsView;
            if (!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
                that._editCellInProgress = true;
                that.getController("editorFactory").loseFocus();
                that._dataController.updateItems({
                    changeType: "update",
                    rowIndices: [oldEditRowIndex, that._getVisibleEditRowIndex()]
                })
            }
            var $cell = rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), that._editColumnIndex);
            if ($cell && !$cell.find(":focus").length) {
                that._focusEditingCell(function() {
                    that._editCellInProgress = false
                }, $cell, true)
            } else {
                that._editCellInProgress = false
            }
        },
        _delayedInputFocus: function($cell, beforeFocusCallback, callBeforeFocusCallbackAlways) {
            var that = this;

            function inputFocus() {
                if (beforeFocusCallback) {
                    beforeFocusCallback()
                }
                if ($cell) {
                    var $focusableElement = $cell.find(FOCUSABLE_ELEMENT_SELECTOR).first();
                    (0, _uiGrid_core3.focusAndSelectElement)(that, $focusableElement)
                }
                that._beforeFocusCallback = null
            }
            if (_devices2.default.real().ios || _devices2.default.real().android) {
                inputFocus()
            } else {
                if (that._beforeFocusCallback) {
                    that._beforeFocusCallback()
                }
                clearTimeout(that._inputFocusTimeoutID);
                if (callBeforeFocusCallbackAlways) {
                    that._beforeFocusCallback = beforeFocusCallback
                }
                that._inputFocusTimeoutID = setTimeout(inputFocus)
            }
        },
        _focusEditingCell: function(beforeFocusCallback, $editCell, callBeforeFocusCallbackAlways) {
            var that = this,
                rowsView = that.getView("rowsView");
            $editCell = $editCell || rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), that._editColumnIndex);
            that._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways)
        },
        removeRow: function(rowIndex) {
            _ui2.default.log("W0002", "dxDataGrid", "removeRow", "15.2", "Use the 'deleteRow' method instead");
            return this.deleteRow(rowIndex)
        },
        deleteRow: function(rowIndex) {
            var removeByKey, showDialogTitle, that = this,
                editingOptions = that.option("editing"),
                editingTexts = editingOptions && editingOptions.texts,
                confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle,
                isBatchMode = editingOptions && editingOptions.mode === EDIT_MODE_BATCH,
                confirmDeleteMessage = editingTexts && editingTexts.confirmDeleteMessage,
                dataController = that._dataController,
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                item = dataController.items()[rowIndex],
                key = item && item.key,
                allowDeleting = isBatchMode || !this.isEditing();
            if (item && allowDeleting) {
                removeByKey = function(key) {
                    that.refresh();
                    var editIndex = (0, _uiGrid_core3.getIndexByKey)(key, that._editData);
                    if (editIndex >= 0) {
                        if (that._editData[editIndex].type === DATA_EDIT_DATA_INSERT_TYPE) {
                            that._removeEditDataItem(editIndex)
                        } else {
                            that._addEditData({
                                key: key,
                                type: DATA_EDIT_DATA_REMOVE_TYPE
                            })
                        }
                    } else {
                        that._addEditData({
                            key: key,
                            oldData: item.data,
                            type: DATA_EDIT_DATA_REMOVE_TYPE
                        })
                    }
                    if (isBatchMode) {
                        dataController.updateItems({
                            changeType: "update",
                            rowIndices: [oldEditRowIndex, rowIndex]
                        })
                    } else {
                        that.saveEditData()
                    }
                };
                if (isBatchMode || !confirmDeleteMessage) {
                    removeByKey(key)
                } else {
                    showDialogTitle = _type2.default.isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
                    _dialog2.default.confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(function(confirmResult) {
                        if (confirmResult) {
                            removeByKey(key)
                        }
                    })
                }
            }
        },
        undeleteRow: function(rowIndex) {
            var that = this,
                dataController = that._dataController,
                item = dataController.items()[rowIndex],
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                key = item && item.key;
            if (item) {
                var editData, editIndex = (0, _uiGrid_core3.getIndexByKey)(key, that._editData);
                if (editIndex >= 0) {
                    editData = that._editData[editIndex];
                    if (_type2.default.isEmptyObject(editData.data)) {
                        that._removeEditDataItem(editIndex)
                    } else {
                        that._addEditData({
                            key: key,
                            type: DATA_EDIT_DATA_UPDATE_TYPE
                        })
                    }
                    dataController.updateItems({
                        changeType: "update",
                        rowIndices: [oldEditRowIndex, rowIndex]
                    })
                }
            }
        },
        _saveEditDataCore: function(deferreds, results, changes) {
            var that = this,
                store = that._dataController.store(),
                isDataSaved = true;

            function executeEditingAction(actionName, params, func) {
                var deferred = new _deferred.Deferred;
                that.executeAction(actionName, params);
                (0, _deferred.when)((0, _deferred.fromPromise)(params.cancel)).done(function(cancel) {
                    if (cancel) {
                        setTimeout(function() {
                            deferred.resolve("cancel")
                        })
                    } else {
                        func(params).done(deferred.resolve).fail(createFailureHandler(deferred))
                    }
                }).fail(createFailureHandler(deferred));
                return deferred
            }(0, _iterator.each)(that._editData, function(index, editData) {
                var deferred, doneDeferred, params, data = editData.data,
                    oldData = editData.oldData,
                    type = editData.type;
                if (that._beforeSaveEditData(editData, index)) {
                    return
                }
                switch (type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        params = {
                            data: oldData,
                            key: editData.key,
                            cancel: false
                        };
                        deferred = executeEditingAction("onRowRemoving", params, function() {
                            return store.remove(editData.key).done(function(key) {
                                changes.push({
                                    type: "remove",
                                    key: key
                                })
                            })
                        });
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        params = {
                            data: data,
                            cancel: false
                        };
                        deferred = executeEditingAction("onRowInserting", params, function() {
                            return store.insert(params.data).done(function(data, key) {
                                if (_type2.default.isDefined(key)) {
                                    editData.key = key
                                }
                                if (data && _type2.default.isObject(data) && data !== params.data) {
                                    editData.data = data
                                }
                                changes.push({
                                    type: "insert",
                                    data: data,
                                    index: 0
                                })
                            })
                        });
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        params = {
                            newData: data,
                            oldData: oldData,
                            key: editData.key,
                            cancel: false
                        };
                        deferred = executeEditingAction("onRowUpdating", params, function() {
                            return store.update(editData.key, params.newData).done(function(data, key) {
                                if (data && _type2.default.isObject(data) && data !== params.newData) {
                                    editData.data = data
                                }
                                changes.push({
                                    type: "update",
                                    key: key,
                                    data: data
                                })
                            })
                        })
                }
                if (deferred) {
                    doneDeferred = new _deferred.Deferred;
                    deferred.always(function(data) {
                        isDataSaved = "cancel" !== data;
                        results.push({
                            key: editData.key,
                            result: data
                        })
                    }).always(doneDeferred.resolve);
                    deferreds.push(doneDeferred.promise())
                }
            });
            return isDataSaved
        },
        _processSaveEditDataResult: function(results) {
            var i, arg, cancel, editData, editIndex, isError, that = this,
                hasSavedData = false,
                editMode = _getEditMode(that);
            for (i = 0; i < results.length; i++) {
                arg = results[i].result;
                cancel = "cancel" === arg;
                editIndex = (0, _uiGrid_core3.getIndexByKey)(results[i].key, that._editData);
                editData = that._editData[editIndex];
                isError = arg && arg instanceof Error;
                if (isError) {
                    if (editData) {
                        editData.error = arg
                    }
                    that._fireDataErrorOccurred(arg);
                    if (editMode !== EDIT_MODE_BATCH) {
                        if (editData && editData.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                            that._removeEditDataItem(editIndex)
                        }
                        break
                    }
                } else {
                    if (!cancel || !editData || editMode !== EDIT_MODE_BATCH && editData.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                        that._removeEditDataItem(editIndex);
                        hasSavedData = !cancel
                    }
                }
            }
            return hasSavedData
        },
        _fireSaveEditDataEvents: function(editData) {
            var that = this;
            (0, _iterator.each)(editData, function(_, itemData) {
                var data = itemData.data,
                    key = itemData.key,
                    type = itemData.type,
                    params = {
                        key: key,
                        data: data
                    };
                if (itemData.error) {
                    params.error = itemData.error
                }
                switch (type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        that.executeAction("onRowRemoved", (0, _extend.extend)({}, params, {
                            data: itemData.oldData
                        }));
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        that.executeAction("onRowInserted", params);
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        that.executeAction("onRowUpdated", params)
                }
            })
        },
        saveEditData: function() {
            var _this7 = this;
            var deferred = new _deferred.Deferred;
            var afterSaveEditData = function() {
                (0, _deferred.when)(_this7._afterSaveEditData()).done(function() {
                    deferred.resolve()
                })
            };
            _deferred.when.apply(void 0, _toConsumableArray(this._deferreds)).done(function() {
                if (_this7._saving) {
                    afterSaveEditData();
                    return
                }(0, _deferred.when)(_this7._beforeSaveEditData()).done(function(cancel) {
                    if (cancel) {
                        afterSaveEditData();
                        return
                    }
                    _this7._saveEditDataInner().done(deferred.resolve).fail(deferred.reject)
                })
            }).fail(deferred.reject);
            return deferred.promise()
        },
        _saveEditDataInner: function() {
            var _this8 = this;
            var results = [],
                deferreds = [],
                changes = [],
                dataController = this._dataController,
                dataSource = dataController.dataSource(),
                editMode = _getEditMode(this),
                result = new _deferred.Deferred;
            var resetEditIndices = function() {
                if (editMode !== EDIT_MODE_CELL) {
                    _this8._editColumnIndex = -1;
                    _this8._editRowIndex = -1
                }
            };
            var afterSaveEditData = function(error) {
                (0, _deferred.when)(_this8._afterSaveEditData()).done(function() {
                    result.resolve(error)
                })
            };
            var editData = this._editData.slice(0);
            if (!this._saveEditDataCore(deferreds, results, changes) && editMode === EDIT_MODE_CELL) {
                this._focusEditingCell()
            }
            if (deferreds.length) {
                this._saving = true;
                dataSource && dataSource.beginLoading();
                _deferred.when.apply(_renderer2.default, deferreds).done(function() {
                    if (_this8._processSaveEditDataResult(results)) {
                        resetEditIndices();
                        if (editMode === EDIT_MODE_POPUP && _this8._editPopup) {
                            _this8._editPopup.hide()
                        }
                        dataSource && dataSource.endLoading();
                        var refreshMode = _this8.option("editing.refreshMode"),
                            isFullRefresh = "reshape" !== refreshMode && "repaint" !== refreshMode;
                        if (!isFullRefresh) {
                            dataController.push(changes)
                        }(0, _deferred.when)(dataController.refresh({
                            selection: isFullRefresh,
                            reload: isFullRefresh,
                            load: "reshape" === refreshMode,
                            changesOnly: _this8.option("repaintChangesOnly")
                        })).always(function() {
                            _this8._fireSaveEditDataEvents(editData)
                        }).done(function() {
                            afterSaveEditData()
                        }).fail(function(error) {
                            afterSaveEditData(error)
                        })
                    } else {
                        dataSource && dataSource.endLoading();
                        result.resolve()
                    }
                }).fail(function(error) {
                    dataSource && dataSource.endLoading();
                    result.resolve(error)
                });
                return result.always(function() {
                    _this8._focusEditingCell();
                    _this8._saving = false
                }).promise()
            }
            if (_isRowEditMode(this)) {
                if (!this.hasChanges()) {
                    this.cancelEditData()
                }
            } else {
                if (CELL_BASED_MODES.indexOf(editMode) !== -1) {
                    resetEditIndices();
                    dataController.updateItems()
                } else {
                    this._focusEditingCell()
                }
            }
            afterSaveEditData();
            return result.promise()
        },
        isSaving: function() {
            return this._saving
        },
        _updateEditColumn: function() {
            var that = this,
                isEditColumnVisible = that._isEditColumnVisible(),
                useIcons = that.option("editing.useIcons"),
                cssClass = COMMAND_EDIT_CLASS + (useIcons ? " " + COMMAND_EDIT_WITH_ICONS_CLASS : "");
            that._columnsController.addCommandColumn({
                type: "buttons",
                command: "edit",
                visible: isEditColumnVisible,
                cssClass: cssClass,
                width: "auto",
                alignment: "center",
                cellTemplate: that._getEditCommandCellTemplate(),
                fixedPosition: "right"
            });
            that._columnsController.columnOption("command:edit", {
                visible: isEditColumnVisible,
                cssClass: cssClass
            })
        },
        _isEditColumnVisible: function() {
            var that = this,
                editingOptions = that.option("editing");
            if (editingOptions) {
                var editMode = _getEditMode(that),
                    isVisibleWithCurrentEditMode = false;
                switch (editMode) {
                    case EDIT_MODE_ROW:
                        isVisibleWithCurrentEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
                        break;
                    case EDIT_MODE_FORM:
                    case EDIT_MODE_POPUP:
                        isVisibleWithCurrentEditMode = editingOptions.allowUpdating
                }
                return editingOptions.allowDeleting || isVisibleWithCurrentEditMode
            }
        },
        _updateEditButtons: function() {
            var that = this,
                headerPanel = that.getView("headerPanel"),
                hasChanges = that.hasChanges();
            if (headerPanel) {
                headerPanel.setToolbarItemDisabled("saveButton", !hasChanges);
                headerPanel.setToolbarItemDisabled("revertButton", !hasChanges)
            }
        },
        _applyModified: function($element) {
            $element && $element.addClass(CELL_MODIFIED)
        },
        _beforeCloseEditCellInBatchMode: function() {},
        cancelEditData: function() {
            var that = this,
                editMode = _getEditMode(that),
                rowIndex = this._getVisibleEditRowIndex(),
                dataController = that._dataController;
            that._beforeCancelEditData();
            that.init();
            if (ROW_BASED_MODES.indexOf(editMode) !== -1 && rowIndex >= 0) {
                dataController.updateItems({
                    changeType: "update",
                    rowIndices: [rowIndex, rowIndex + 1]
                })
            } else {
                dataController.updateItems({
                    repaintChangesOnly: that.option("repaintChangesOnly")
                })
            }
            if (editMode === EDIT_MODE_POPUP) {
                that._hideEditPopup()
            }
        },
        _hideEditPopup: function() {
            this._editPopup && this._editPopup.option("visible", false)
        },
        hasEditData: function() {
            return this.hasChanges()
        },
        closeEditCell: function(isError) {
            var _this9 = this;
            var that = this,
                result = _deferred2.default.when(),
                oldEditRowIndex = that._getVisibleEditRowIndex();
            if (!_isRowEditMode(that)) {
                result = _deferred2.default.Deferred();
                setTimeout(function() {
                    _deferred.when.apply(void 0, _toConsumableArray(_this9._deferreds)).done(function() {
                        _this9._closeEditCellCore(isError, oldEditRowIndex);
                        result.resolve()
                    }).fail(result.reject)
                })
            }
            return result.promise()
        },
        _closeEditCellCore: function(isError, oldEditRowIndex) {
            var that = this,
                editMode = _getEditMode(that),
                dataController = that._dataController;
            if (editMode === EDIT_MODE_CELL && that.hasChanges()) {
                that.saveEditData().done(function(error) {
                    if (!that.hasChanges()) {
                        that.closeEditCell(!!error)
                    }
                })
            } else {
                if (oldEditRowIndex >= 0) {
                    var rowIndices = [oldEditRowIndex];
                    that._editRowIndex = -1;
                    that._editColumnIndex = -1;
                    that._beforeCloseEditCellInBatchMode(rowIndices);
                    if (!isError) {
                        dataController.updateItems({
                            changeType: "update",
                            rowIndices: rowIndices
                        })
                    }
                }
            }
        },
        update: function(changeType) {
            var that = this,
                dataController = that._dataController;
            if (dataController && that._pageIndex !== dataController.pageIndex()) {
                if ("refresh" === changeType) {
                    that.refresh()
                }
                that._pageIndex = dataController.pageIndex()
            }
            that._updateEditButtons()
        },
        _getRowIndicesForCascadeUpdating: function(row, skipCurrentRow) {
            return skipCurrentRow ? [] : [row.rowIndex]
        },
        _prepareEditDataParams: function(options, value, text) {
            var setCellValueResult, that = this,
                newData = {},
                oldData = options.data,
                rowKey = options.key,
                $cellElement = (0, _renderer2.default)(options.cellElement),
                editMode = _getEditMode(that),
                deferred = new _deferred.Deferred;
            if (void 0 !== rowKey) {
                if (editMode === EDIT_MODE_BATCH) {
                    that._applyModified($cellElement, options)
                }
                options.value = value;
                setCellValueResult = (0, _deferred.fromPromise)(options.column.setCellValue(newData, value, (0, _extend.extend)(true, {}, oldData), text));
                setCellValueResult.done(function() {
                    deferred.resolve({
                        data: newData,
                        key: rowKey,
                        oldData: oldData,
                        type: DATA_EDIT_DATA_UPDATE_TYPE
                    })
                }).fail(createFailureHandler(deferred)).fail(function(arg) {
                    return that._fireDataErrorOccurred(arg)
                });
                if (_type2.default.isString(text) && options.column.displayValueMap) {
                    options.column.displayValueMap[value] = text
                }
                if (options.values) {
                    options.values[options.columnIndex] = value
                }
                that._deferreds.push(setCellValueResult);
                setCellValueResult.always(function() {
                    var index = that._deferreds.indexOf(setCellValueResult);
                    if (index >= 0) {
                        that._deferreds.splice(index, 1)
                    }
                })
            }
            return deferred
        },
        updateFieldValue: function(options, value, text, forceUpdateRow) {
            var _this10 = this;
            var that = this,
                rowKey = options.key;
            if (void 0 === rowKey) {
                that._dataController.fireError("E1043")
            }
            if (options.column.setCellValue) {
                this._prepareEditDataParams(options, value, text).done(function(params) {
                    _this10._applyEditDataParams(options, params, forceUpdateRow)
                })
            }
        },
        _focusPreviousEditingCellIfNeed: function(options) {
            var that = this;
            if (that.hasEditData() && !that.isEditCell(options.rowIndex, options.columnIndex)) {
                that._focusEditingCell();
                that._updateEditRow(options.row, true);
                return true
            }
        },
        _applyEditDataParams: function(options, params, forceUpdateRow) {
            var that = this,
                editMode = _getEditMode(that),
                isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue,
                showEditorAlways = options.column.showEditorAlways,
                isUpdateInCellMode = editMode === EDIT_MODE_CELL && options.row && !options.row.isNewRow,
                focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && that.hasEditData() && !that.isEditCell(options.rowIndex, options.columnIndex);
            if (focusPreviousEditingCell) {
                that._focusEditingCell();
                that._updateEditRow(options.row, true, isCustomSetCellValue);
                return
            }
            that._addEditData(params, options.row);
            that._updateEditButtons();
            if (showEditorAlways && !forceUpdateRow) {
                if (isUpdateInCellMode) {
                    that._editRowIndex = options.rowIndex + that._dataController.getRowIndexOffset();
                    that._editColumnIndex = options.columnIndex;
                    return that.saveEditData()
                } else {
                    if (editMode === EDIT_MODE_BATCH) {
                        var columns = that._columnsController.getVisibleColumns();
                        forceUpdateRow = isCustomSetCellValue || columns.some(function(column) {
                            return column.calculateCellValue !== column.defaultCalculateCellValue
                        })
                    }
                }
            }
            if (options.row && (forceUpdateRow || isCustomSetCellValue)) {
                that._updateEditRow(options.row, forceUpdateRow, isCustomSetCellValue)
            }
        },
        _updateEditRowCore: function(row, skipCurrentRow, isCustomSetCellValue) {
            var that = this,
                editForm = that._editForm,
                editMode = _getEditMode(that);
            if (editMode === EDIT_MODE_POPUP) {
                if (that.option("repaintChangesOnly")) {
                    row.update && row.update(row)
                } else {
                    if (editForm) {
                        that._updateEditFormDeferred = (new _deferred.Deferred).done(function() {
                            return editForm.repaint()
                        });
                        if (!that._updateLockCount) {
                            that._updateEditFormDeferred.resolve()
                        }
                    }
                }
            } else {
                that._dataController.updateItems({
                    changeType: "update",
                    rowIndices: that._getRowIndicesForCascadeUpdating(row, skipCurrentRow)
                })
            }
            if (isCustomSetCellValue && that._editForm) {
                that._editForm.validate()
            }
        },
        _endUpdateCore: function() {
            this._updateEditFormDeferred && this._updateEditFormDeferred.resolve()
        },
        _updateEditRow: function(row, forceUpdateRow, isCustomSetCellValue) {
            var that = this;
            if (forceUpdateRow || !_isRowEditMode(that)) {
                that._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);
                if (!forceUpdateRow) {
                    that._focusEditingCell()
                }
            } else {
                setTimeout(function() {
                    var $focusedElement = (0, _renderer2.default)(_dom_adapter2.default.getActiveElement()),
                        columnIndex = that._rowsView.getCellIndex($focusedElement, row.rowIndex),
                        focusedElement = $focusedElement.get(0),
                        selectionRange = (0, _uiGrid_core3.getSelectionRange)(focusedElement);
                    that._updateEditRowCore(row, false, isCustomSetCellValue);
                    if (columnIndex >= 0) {
                        var $focusedItem = that._rowsView._getCellElement(row.rowIndex, columnIndex);
                        that._delayedInputFocus($focusedItem, function() {
                            setTimeout(function() {
                                focusedElement = _dom_adapter2.default.getActiveElement();
                                if (selectionRange.selectionStart >= 0) {
                                    (0, _uiGrid_core3.setSelectionRange)(focusedElement, selectionRange)
                                }
                            })
                        })
                    }
                })
            }
        },
        _addEditData: function(options, row) {
            var that = this,
                editDataIndex = (0, _uiGrid_core3.getIndexByKey)(options.key, that._editData);
            if (editDataIndex < 0) {
                editDataIndex = that._editData.length;
                that._editData.push(options)
            }
            if (that._editData[editDataIndex]) {
                if (options.data) {
                    that._editData[editDataIndex].data = (0, _uiGrid_core3.createObjectWithChanges)(that._editData[editDataIndex].data, options.data)
                }
                if ((!that._editData[editDataIndex].type || !options.data) && options.type) {
                    that._editData[editDataIndex].type = options.type
                }
                if (row) {
                    row.oldData = that._editData[editDataIndex].oldData;
                    row.data = (0, _uiGrid_core3.createObjectWithChanges)(row.data, options.data)
                }
            }
            return editDataIndex
        },
        _getFormEditItemTemplate: function(cellOptions, column) {
            return column.editCellTemplate || getDefaultEditorTemplate(this)
        },
        renderFormEditTemplate: function(detailCellOptions, item, form, container, isReadOnly) {
            var that = this,
                $container = (0, _renderer2.default)(container),
                column = item.column,
                editorType = getEditorType(item),
                rowData = detailCellOptions.row && detailCellOptions.row.data,
                cellOptions = (0, _extend.extend)({}, detailCellOptions, {
                    data: rowData,
                    cellElement: null,
                    isOnForm: true,
                    item: item,
                    column: (0, _extend.extend)({}, column, {
                        editorType: editorType,
                        editorOptions: item.editorOptions
                    }),
                    id: form.getItemID(item.name || item.dataField),
                    columnIndex: column.index,
                    setValue: !isReadOnly && column.allowEditing && function(value) {
                        that.updateFieldValue(cellOptions, value)
                    }
                });
            cellOptions.value = column.calculateCellValue(rowData);
            var template = that._getFormEditItemTemplate.bind(that)(cellOptions, column);
            if (that._rowsView.renderTemplate($container, template, cellOptions, !!$container.closest((0, _window.getWindow)().document).length)) {
                that._rowsView._updateCell($container, cellOptions)
            }
        },
        getFormEditorTemplate: function(cellOptions, item) {
            var that = this,
                column = this.component.columnOption(item.dataField);
            return function(options, container) {
                var templateOptions = (0, _extend.extend)({}, cellOptions),
                    $container = (0, _renderer2.default)(container);
                templateOptions.column = column;
                templateOptions.row.watch && templateOptions.row.watch(function() {
                    return templateOptions.column.selector(templateOptions.row.data)
                }, function(newValue) {
                    templateOptions.value = newValue;
                    $container.contents().remove();
                    that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container)
                });
                that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container)
            }
        },
        getEditFormTemplate: function() {
            var that = this;
            return function($container, detailOptions, renderFormOnly) {
                var editFormOptions = that.option("editing.form"),
                    items = that.option("editing.form.items"),
                    userCustomizeItem = that.option("editing.form.customizeItem"),
                    editData = that._editData[(0, _uiGrid_core3.getIndexByKey)(detailOptions.key, that._editData)],
                    editFormItemClass = that.addWidgetPrefix(EDIT_FORM_ITEM_CLASS),
                    isCustomEditorType = {};
                if (!items) {
                    var columns = that.getController("columns").getColumns();
                    items = [];
                    (0, _iterator.each)(columns, function(_, column) {
                        if (!column.isBand && !column.type) {
                            items.push({
                                column: column,
                                name: column.name,
                                dataField: column.dataField
                            })
                        }
                    })
                } else {
                    forEachFormItems(items, function(item) {
                        var itemId = item && (item.name || item.dataField);
                        if (itemId) {
                            isCustomEditorType[itemId] = !!item.editorType
                        }
                    })
                }
                that._firstFormItem = void 0;
                that._editForm = that._createComponent((0, _renderer2.default)("<div>").appendTo($container), _form2.default, (0, _extend.extend)({}, editFormOptions, {
                    items: items,
                    formID: "dx-" + new _guid2.default,
                    validationGroup: editData,
                    customizeItem: function(item) {
                        var column, itemId = item.name || item.dataField;
                        if (item.column || itemId) {
                            column = item.column || that._columnsController.columnOption(item.name ? "name:" + item.name : "dataField:" + item.dataField)
                        }
                        if (column) {
                            item.label = item.label || {};
                            item.label.text = item.label.text || column.caption;
                            item.template = item.template || that.getFormEditorTemplate(detailOptions, item);
                            item.column = column;
                            item.isCustomEditorType = isCustomEditorType[itemId];
                            if (column.formItem) {
                                (0, _extend.extend)(item, column.formItem)
                            }
                            if (void 0 === item.isRequired && column.validationRules) {
                                item.isRequired = column.validationRules.some(function(rule) {
                                    return "required" === rule.type
                                });
                                item.validationRules = []
                            }
                            var itemVisible = _type2.default.isDefined(item.visible) ? item.visible : true;
                            if (!that._firstFormItem && itemVisible) {
                                that._firstFormItem = item
                            }
                        }
                        userCustomizeItem && userCustomizeItem.call(this, item);
                        item.cssClass = _type2.default.isString(item.cssClass) ? item.cssClass + " " + editFormItemClass : editFormItemClass
                    }
                }));
                if (!renderFormOnly) {
                    var $buttonsContainer = (0, _renderer2.default)("<div>").addClass(that.addWidgetPrefix(FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
                    that._createComponent((0, _renderer2.default)("<div>").appendTo($buttonsContainer), _button2.default, that._getSaveButtonConfig());
                    that._createComponent((0, _renderer2.default)("<div>").appendTo($buttonsContainer), _button2.default, that._getCancelButtonConfig())
                }
                that._editForm.on("contentReady", function() {
                    that._editPopup && that._editPopup.repaint()
                })
            }
        },
        getColumnTemplate: function(options) {
            var template, allowUpdating, editingStartOptions, that = this,
                column = options.column,
                rowIndex = options.row && options.row.rowIndex,
                isRowMode = _isRowEditMode(that),
                isRowEditing = that.isEditRow(rowIndex),
                isCellEditing = that.isEditCell(rowIndex, options.columnIndex);
            if ((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) && ("data" === options.rowType || "detailAdaptive" === options.rowType) && !column.command) {
                allowUpdating = that.allowUpdating(options);
                if (((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowMode && isRowEditing || !isRowMode)) {
                    if (column.showEditorAlways && !isRowMode) {
                        editingStartOptions = {
                            cancel: false,
                            key: options.row.isNewRow ? void 0 : options.row.key,
                            data: options.row.data,
                            column: column
                        };
                        that._isEditingStart(editingStartOptions)
                    }
                    if (!editingStartOptions || !editingStartOptions.cancel) {
                        options.setValue = function(value, text) {
                            that.updateFieldValue(options, value, text)
                        }
                    }
                }
                template = column.editCellTemplate || getDefaultEditorTemplate(that)
            } else {
                if ("detail" === column.command && "detail" === options.rowType && isRowEditing) {
                    template = that.getEditFormTemplate(options)
                }
            }
            return template
        },
        _createButton: function($container, button, options) {
            var iconType, that = this,
                icon = EDIT_ICON_CLASS[button.name],
                useIcons = that.option("editing.useIcons"),
                $button = (0, _renderer2.default)("<a>").attr("href", "#").addClass(LINK_CLASS).addClass(button.cssClass);
            if (button.template) {
                that._rowsView.renderTemplate($container, button.template, options, true)
            } else {
                if (useIcons && icon || button.icon) {
                    icon = button.icon || icon;
                    iconType = _icon2.default.getImageSourceType(icon);
                    if ("image" === iconType || "svg" === iconType) {
                        $button = _icon2.default.getImageContainer(icon).addClass(button.cssClass)
                    } else {
                        $button.addClass("dx-icon" + ("dxIcon" === iconType ? "-" : " ") + icon).attr("title", button.text)
                    }
                    $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);
                    var localizationName = this.getButtonLocalizationNames()[button.name];
                    localizationName && $button.attr("aria-label", _message2.default.format(localizationName))
                } else {
                    $button.text(button.text)
                }
                if (_type2.default.isDefined(button.hint)) {
                    $button.attr("title", button.hint)
                }
                _events_engine2.default.on($button, (0, _utils.addNamespace)("click", EDITING_NAMESPACE), that.createAction(function(e) {
                    button.onClick.call(button, (0, _extend.extend)({}, e, {
                        row: options.row,
                        column: options.column
                    }));
                    e.event.preventDefault()
                }));
                options.rtlEnabled ? $container.prepend($button, "&nbsp;") : $container.append($button, "&nbsp;")
            }
        },
        getButtonLocalizationNames: function() {
            return {
                edit: "dxDataGrid-editingEditRow",
                save: "dxDataGrid-editingSaveRowChanges",
                "delete": "dxDataGrid-editingDeleteRow",
                undelete: "dxDataGrid-editingUndeleteRow",
                cancel: "dxDataGrid-editingCancelRowChanges"
            }
        },
        prepareEditButtons: function(headerPanel) {
            var that = this,
                editingOptions = that.option("editing") || {},
                editingTexts = that.option("editing.texts") || {},
                titleButtonTextByClassNames = {
                    revert: editingTexts.cancelAllChanges,
                    save: editingTexts.saveAllChanges,
                    addRow: editingTexts.addRow
                },
                classNameButtonByNames = {
                    revert: "cancel",
                    save: "save",
                    addRow: "addrow"
                },
                buttonItems = [];
            var prepareButtonItem = function(name, methodName, sortIndex) {
                var className = classNameButtonByNames[name],
                    onInitialized = function(e) {
                        (0, _renderer2.default)(e.element).addClass(headerPanel._getToolbarButtonClass(EDIT_BUTTON_CLASS + " " + that.addWidgetPrefix(className) + "-button"))
                    },
                    hintText = titleButtonTextByClassNames[name],
                    isButtonDisabled = ("save" === className || "cancel" === className) && !that.hasChanges();
                return {
                    widget: "dxButton",
                    options: {
                        onInitialized: onInitialized,
                        icon: "edit-button-" + className,
                        disabled: isButtonDisabled,
                        onClick: function() {
                            setTimeout(function() {
                                that[methodName]()
                            })
                        },
                        text: hintText,
                        hint: hintText
                    },
                    showText: "inMenu",
                    name: name + "Button",
                    location: "after",
                    locateInMenu: "auto",
                    sortIndex: sortIndex
                }
            };
            if (editingOptions.allowAdding) {
                buttonItems.push(prepareButtonItem("addRow", "addRow", 20))
            }
            if ((editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting) && _getEditMode(that) === EDIT_MODE_BATCH) {
                buttonItems.push(prepareButtonItem("save", "saveEditData", 21));
                buttonItems.push(prepareButtonItem("revert", "cancelEditData", 22))
            }
            return buttonItems
        },
        showHighlighting: function($cell) {
            var $highlight = $cell.find("." + CELL_HIGHLIGHT_OUTLINE);
            if ("TD" === $cell.get(0).tagName && !$highlight.length) {
                $cell.wrapInner((0, _renderer2.default)("<div>").addClass(CELL_HIGHLIGHT_OUTLINE + " " + POINTER_EVENTS_TARGET_CLASS))
            }
        },
        resetRowAndPageIndices: function(alwaysRest) {
            var that = this;
            (0, _iterator.each)(that._editData, function(_, editData) {
                if (editData.pageIndex !== that._pageIndex || alwaysRest) {
                    delete editData.pageIndex;
                    delete editData.rowIndex
                }
            })
        },
        _afterInsertRow: function() {},
        _beforeSaveEditData: function(editData) {
            if (editData && !_type2.default.isDefined(editData.key) && _type2.default.isDefined(editData.type)) {
                return true
            }
        },
        _afterSaveEditData: function() {},
        _beforeCancelEditData: function() {},
        _allowEditAction: function(actionName, options) {
            var allowEditAction = this.option("editing." + actionName);
            if (_type2.default.isFunction(allowEditAction)) {
                allowEditAction = allowEditAction({
                    component: this.component,
                    row: options.row
                })
            }
            return allowEditAction
        },
        allowUpdating: function(options, eventName) {
            var startEditAction = this.option("editing.startEditAction") || DEFAULT_START_EDIT_ACTION,
                needCallback = arguments.length > 1 ? startEditAction === eventName || "down" === eventName : true;
            return needCallback && this._allowEditAction("allowUpdating", options)
        },
        allowDeleting: function(options) {
            return this._allowEditAction("allowDeleting", options)
        }
    }
}());
module.exports = {
    defaultOptions: function() {
        return {
            editing: {
                mode: "row",
                refreshMode: "full",
                allowAdding: false,
                allowUpdating: false,
                allowDeleting: false,
                useIcons: false,
                selectTextOnEditStart: false,
                texts: {
                    editRow: _message2.default.format("dxDataGrid-editingEditRow"),
                    saveAllChanges: _message2.default.format("dxDataGrid-editingSaveAllChanges"),
                    saveRowChanges: _message2.default.format("dxDataGrid-editingSaveRowChanges"),
                    cancelAllChanges: _message2.default.format("dxDataGrid-editingCancelAllChanges"),
                    cancelRowChanges: _message2.default.format("dxDataGrid-editingCancelRowChanges"),
                    addRow: _message2.default.format("dxDataGrid-editingAddRow"),
                    deleteRow: _message2.default.format("dxDataGrid-editingDeleteRow"),
                    undeleteRow: _message2.default.format("dxDataGrid-editingUndeleteRow"),
                    confirmDeleteMessage: _message2.default.format("dxDataGrid-editingConfirmDeleteMessage"),
                    confirmDeleteTitle: ""
                },
                form: {
                    colCount: 2
                },
                popup: {},
                startEditAction: "click"
            }
        }
    },
    controllers: {
        editing: EditingController
    },
    extenders: {
        controllers: {
            data: {
                init: function() {
                    this._editingController = this.getController("editing");
                    this.callBase()
                },
                reload: function(full, repaintChangesOnly) {
                    var d, editingController = this.getController("editing");
                    !repaintChangesOnly && this._editingController.refresh();
                    d = this.callBase.apply(this, arguments);
                    return d && d.done(function() {
                        editingController.resetRowAndPageIndices(true)
                    })
                },
                repaintRows: function() {
                    if (this.getController("editing").isSaving()) {
                        return
                    }
                    return this.callBase.apply(this, arguments)
                },
                _updateEditRow: function(items) {
                    var editingController = this._editingController,
                        editRowIndex = editingController.getEditRowIndex(),
                        editItem = items[editRowIndex];
                    if (editItem) {
                        editItem.isEditing = true;
                        if (editingController.getEditMode() === EDIT_MODE_FORM) {
                            editItem.rowType = "detail"
                        }
                    }
                },
                _updateItemsCore: function(change) {
                    this.callBase(change);
                    this._updateEditRow(this.items())
                },
                _applyChangeUpdate: function(change) {
                    this._updateEditRow(change.items);
                    this.callBase(change)
                },
                _applyChangesOnly: function(change) {
                    this._updateEditRow(change.items);
                    this.callBase(change)
                },
                _processItems: function(items, change) {
                    items = this._editingController.processItems(items, change);
                    return this.callBase(items, change)
                },
                _processDataItem: function(dataItem, options) {
                    this._editingController.processDataItem(dataItem, options, this.generateDataValues);
                    return this.callBase(dataItem, options)
                },
                _processItem: function(item, options) {
                    item = this.callBase(item, options);
                    if (item.isNewRow) {
                        options.dataIndex--;
                        delete item.dataIndex
                    }
                    return item
                },
                _correctRowIndices: function(getRowIndexCorrection) {
                    this.callBase.apply(this, arguments);
                    this._editingController.correctEditRowIndex(getRowIndexCorrection)
                },
                _getChangedColumnIndices: function(oldItem, newItem, rowIndex, isLiveUpdate) {
                    var editingController = this.getController("editing"),
                        isRowEditMode = editingController.isRowEditMode();
                    if (oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed || isRowEditMode && oldItem.isEditing !== newItem.isEditing) {
                        return
                    }
                    if (oldItem.rowType === newItem.rowType && isRowEditMode && editingController.isEditRow(rowIndex) && isLiveUpdate) {
                        return []
                    }
                    return this.callBase.apply(this, arguments)
                },
                _isCellChanged: function(oldRow, newRow, rowIndex, columnIndex, isLiveUpdate) {
                    var editingController = this.getController("editing"),
                        cell = oldRow.cells && oldRow.cells[columnIndex],
                        isEditing = editingController && editingController.isEditCell(rowIndex, columnIndex);
                    if (isLiveUpdate && isEditing) {
                        return false
                    }
                    if (cell && cell.isEditing !== isEditing) {
                        return true
                    }
                    return this.callBase.apply(this, arguments)
                }
            }
        },
        views: {
            rowsView: {
                init: function() {
                    this.callBase();
                    this._editingController = this.getController("editing")
                },
                getCellElements: function(rowIndex) {
                    var $cellElements = this.callBase(rowIndex),
                        editingController = this._editingController,
                        editForm = editingController.getEditForm(),
                        editFormRowIndex = editingController.getEditFormRowIndex();
                    if (editFormRowIndex === rowIndex && $cellElements && editForm) {
                        return editForm.$element().find("." + this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS) + ", ." + BUTTON_CLASS)
                    }
                    return $cellElements
                },
                getCellIndex: function($cell, rowIndex) {
                    if (!$cell.is("td") && rowIndex >= 0) {
                        var $cellElements = this.getCellElements(rowIndex),
                            cellIndex = -1;
                        (0, _iterator.each)($cellElements, function(index, cellElement) {
                            if ((0, _renderer2.default)(cellElement).find($cell).length) {
                                cellIndex = index
                            }
                        });
                        return cellIndex
                    }
                    return this.callBase.apply(this, arguments)
                },
                _getVisibleColumnIndex: function($cells, rowIndex, columnIdentifier) {
                    var column, editFormRowIndex = this._editingController.getEditFormRowIndex();
                    if (editFormRowIndex === rowIndex && _type2.default.isString(columnIdentifier)) {
                        column = this._columnsController.columnOption(columnIdentifier);
                        return this._getEditFormEditorVisibleIndex($cells, column)
                    }
                    return this.callBase.apply(this, arguments)
                },
                _getEditFormEditorVisibleIndex: function($cells, column) {
                    var item, visibleIndex = -1;
                    (0, _iterator.each)($cells, function(index, cellElement) {
                        item = (0, _renderer2.default)(cellElement).find(".dx-field-item-content").data("dx-form-item");
                        if (item && item.column && column && item.column.index === column.index) {
                            visibleIndex = index;
                            return false
                        }
                    });
                    return visibleIndex
                },
                publicMethods: function() {
                    return this.callBase().concat(["cellValue"])
                },
                _getCellTemplate: function(options) {
                    var that = this,
                        template = that._editingController.getColumnTemplate(options);
                    return template || that.callBase(options)
                },
                _isNativeClick: function() {
                    return (_devices2.default.real().ios || _devices2.default.real().android) && this.option("editing.allowUpdating")
                },
                _createTable: function() {
                    var that = this,
                        $table = that.callBase.apply(that, arguments);
                    if (!_isRowEditMode(that) && that.option("editing.allowUpdating")) {
                        _events_engine2.default.on($table, (0, _utils.addNamespace)(_hold2.default.name, "dxDataGridRowsView"), "td:not(." + EDITOR_CELL_CLASS + ")", that.createAction(function() {
                            var editingController = that._editingController;
                            if (editingController.isEditing()) {
                                editingController.closeEditCell()
                            }
                        }))
                    }
                    return $table
                },
                _createRow: function(row) {
                    var editingController, isEditRow, isRowRemoved, isRowInserted, isRowModified, $row = this.callBase(row);
                    if (row) {
                        editingController = this._editingController;
                        isEditRow = editingController.isEditRow(row.rowIndex);
                        isRowRemoved = !!row.removed;
                        isRowInserted = !!row.isNewRow;
                        isRowModified = !!row.modified;
                        if (_getEditMode(this) === EDIT_MODE_BATCH) {
                            isRowRemoved && $row.addClass(ROW_REMOVED)
                        } else {
                            isEditRow && $row.addClass(EDIT_ROW)
                        }
                        isRowInserted && $row.addClass(ROW_INSERTED);
                        isRowModified && $row.addClass(ROW_MODIFIED);
                        if (isEditRow || isRowInserted || isRowRemoved) {
                            $row.removeClass(ROW_SELECTED)
                        }
                        if (isEditRow && "detail" === row.rowType) {
                            $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS))
                        }
                    }
                    return $row
                },
                _getColumnIndexByElement: function($element) {
                    var $tableElement = $element.closest("table"),
                        $tableElements = this.getTableElements();
                    while ($tableElement.length && !$tableElements.filter($tableElement).length) {
                        $element = $tableElement.closest("td");
                        $tableElement = $element.closest("table")
                    }
                    return this._getColumnIndexByElementCore($element)
                },
                _getColumnIndexByElementCore: function($element) {
                    var $targetElement = $element.closest("." + ROW_CLASS + "> td:not(.dx-master-detail-cell)");
                    return this.getCellIndex($targetElement)
                },
                _editCellByClick: function(e, eventName) {
                    var that = this,
                        editingController = that._editingController,
                        $targetElement = (0,
                            _renderer2.default)(e.event.target),
                        columnIndex = that._getColumnIndexByElement($targetElement),
                        row = that._dataController.items()[e.rowIndex],
                        allowUpdating = editingController.allowUpdating({
                            row: row
                        }, eventName) || row && row.isNewRow,
                        column = that._columnsController.getVisibleColumns()[columnIndex],
                        allowEditing = allowUpdating && column && (column.allowEditing || editingController.isEditCell(e.rowIndex, columnIndex)),
                        startEditAction = that.option("editing.startEditAction") || "click";
                    if ("down" === eventName) {
                        return column && column.showEditorAlways && allowEditing && editingController.editCell(e.rowIndex, columnIndex)
                    }
                    if ("click" === eventName && "dblClick" === startEditAction && !editingController.isEditCell(e.rowIndex, columnIndex)) {
                        editingController.closeEditCell()
                    }
                    return eventName === startEditAction && allowEditing && editingController.editCell(e.rowIndex, columnIndex) || editingController.isEditRow(e.rowIndex)
                },
                _rowPointerDown: function(e) {
                    var _this11 = this;
                    this._pointerDownTimeout = setTimeout(function() {
                        _this11._editCellByClick(e, "down")
                    })
                },
                _rowClick: function(e) {
                    e.event[TARGET_COMPONENT_NAME] = this.component;
                    if (!this._editCellByClick(e, "click")) {
                        this.callBase.apply(this, arguments)
                    }
                },
                _rowDblClick: function(e) {
                    if (!this._editCellByClick(e, "dblClick")) {
                        this.callBase.apply(this, arguments)
                    }
                },
                _cellPrepared: function($cell, parameters) {
                    var columnIndex = parameters.columnIndex,
                        editingController = this._editingController,
                        isCommandCell = !!parameters.column.command,
                        isEditableCell = parameters.setValue,
                        isEditing = parameters.isEditing || editingController.isEditRow(parameters.rowIndex) && parameters.column.allowEditing;
                    if ("data" === parameters.rowType && !parameters.column.command && (isEditing || parameters.column.showEditorAlways)) {
                        var alignment = parameters.column.alignment;
                        $cell.addClass(EDITOR_CELL_CLASS).toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell).toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);
                        if (alignment) {
                            $cell.find(EDITORS_INPUT_SELECTOR).first().css("textAlign", alignment)
                        }
                    }
                    if (isEditing) {
                        this._editCellPrepared($cell)
                    }
                    var modifiedValues = parameters.row && (parameters.row.isNewRow ? parameters.row.values : parameters.row.modifiedValues);
                    if (modifiedValues && void 0 !== modifiedValues[columnIndex] && parameters.column && !isCommandCell && parameters.column.setCellValue) {
                        editingController.showHighlighting($cell);
                        $cell.addClass(CELL_MODIFIED)
                    } else {
                        if (isEditableCell) {
                            editingController.showHighlighting($cell, true)
                        }
                    }
                    this.callBase.apply(this, arguments)
                },
                _editCellPrepared: function($cell) {},
                _formItemPrepared: function() {},
                _isFormItem: function(parameters) {
                    var isDetailRow = "detail" === parameters.rowType || "detailAdaptive" === parameters.rowType,
                        isPopupEditing = "data" === parameters.rowType && "popup" === _getEditMode(this);
                    return (isDetailRow || isPopupEditing) && parameters.item
                },
                _updateCell: function($cell, parameters) {
                    if (this._isFormItem(parameters)) {
                        this._formItemPrepared(parameters, $cell)
                    } else {
                        this.callBase($cell, parameters)
                    }
                },
                _update: function(change) {
                    this.callBase(change);
                    if ("updateSelection" === change.changeType) {
                        this.getTableElements().children("tbody").children("." + EDIT_ROW).removeClass(ROW_SELECTED)
                    }
                },
                _getCellOptions: function(options) {
                    var cellOptions = this.callBase(options);
                    cellOptions.isEditing = this._editingController.isEditCell(cellOptions.rowIndex, cellOptions.columnIndex);
                    return cellOptions
                },
                _renderCellContent: function($cell, options) {
                    if ("data" === options.rowType && _getEditMode(this) === EDIT_MODE_POPUP && false === options.row.visible) {
                        return
                    }
                    this.callBase.apply(this, arguments)
                },
                cellValue: function(rowIndex, columnIdentifier, value, text) {
                    var cellOptions = this.getCellOptions(rowIndex, columnIdentifier);
                    if (cellOptions) {
                        if (void 0 === value) {
                            return cellOptions.value
                        } else {
                            this._editingController.updateFieldValue(cellOptions, value, text, true)
                        }
                    }
                },
                dispose: function() {
                    this.callBase.apply(this, arguments);
                    clearTimeout(this._pointerDownTimeout)
                }
            },
            headerPanel: {
                _getToolbarItems: function() {
                    var items = this.callBase(),
                        editButtonItems = this.getController("editing").prepareEditButtons(this);
                    return editButtonItems.concat(items)
                },
                optionChanged: function(args) {
                    switch (args.name) {
                        case "editing":
                            if (!(args.fullName && 0 === args.fullName.indexOf("editing.popup"))) {
                                this._invalidate()
                            }
                            this.callBase(args);
                            break;
                        default:
                            this.callBase(args)
                    }
                },
                isVisible: function() {
                    var that = this,
                        editingOptions = that.getController("editing").option("editing");
                    return that.callBase() || editingOptions && (editingOptions.allowAdding || (editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === EDIT_MODE_BATCH)
                }
            }
        }
    }
};
