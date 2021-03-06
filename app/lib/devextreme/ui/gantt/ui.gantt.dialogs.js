/**
 * DevExtreme (ui/gantt/ui.gantt.dialogs.js)
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
exports.GanttDialog = void 0;
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
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);
var _form = require("../form");
var _form2 = _interopRequireDefault(_form);
require("../tag_box");

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
var GanttDialog = exports.GanttDialog = function() {
    function GanttDialog(owner, $element) {
        _classCallCheck(this, GanttDialog);
        this._popupInstance = owner._createComponent($element, _popup2.default);
        this.infoMap = {
            TaskEdit: TaskEditDialogInfo,
            Resources: ResourcesEditDialogInfo
        }
    }
    _createClass(GanttDialog, [{
        key: "_apply",
        value: function() {
            var result = this._dialogInfo.getResult();
            this._callback(result);
            this.hide()
        }
    }, {
        key: "show",
        value: function(name, parameters, callback, editingOptions) {
            this._callback = callback;
            if (!this.infoMap[name]) {
                return
            }
            this._dialogInfo = new this.infoMap[name](parameters, this._apply.bind(this), this.hide.bind(this), editingOptions);
            this._popupInstance.option({
                title: this._dialogInfo.getTitle(),
                toolbarItems: this._dialogInfo.getToolbarItems(),
                maxWidth: this._dialogInfo.getMaxWidth(),
                height: this._dialogInfo.getHeight(),
                contentTemplate: this._dialogInfo.getContentTemplate()
            });
            this._popupInstance.show()
        }
    }, {
        key: "hide",
        value: function() {
            this._popupInstance.hide();
            delete this._dialogInfo
        }
    }]);
    return GanttDialog
}();
var DialogInfoBase = function() {
    function DialogInfoBase(parameters, applyAction, hideAction, editingOptions) {
        _classCallCheck(this, DialogInfoBase);
        this._parameters = parameters;
        this._applyAction = applyAction;
        this._hideAction = hideAction;
        this._editingOptions = editingOptions
    }
    _createClass(DialogInfoBase, [{
        key: "_getFormItems",
        value: function() {
            return {}
        }
    }, {
        key: "_updateParameters",
        value: function() {}
    }, {
        key: "_getOkToolbarItem",
        value: function() {
            return {
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: "Ok",
                    onClick: this._applyAction
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
                    text: "Cancel",
                    onClick: this._hideAction
                }
            }
        }
    }, {
        key: "getTitle",
        value: function() {
            return ""
        }
    }, {
        key: "getToolbarItems",
        value: function() {
            return this._editingOptions.enabled ? [this._getOkToolbarItem(), this._getCancelToolbarItem()] : [this._getCancelToolbarItem()]
        }
    }, {
        key: "getMaxWidth",
        value: function() {
            return 400
        }
    }, {
        key: "getHeight",
        value: function() {
            return "auto"
        }
    }, {
        key: "getContentTemplate",
        value: function() {
            var _this = this;
            return function(content) {
                _this._form = new _form2.default(content, {
                    formData: _this._parameters,
                    items: _this._getFormItems()
                });
                return content
            }
        }
    }, {
        key: "getResult",
        value: function() {
            var formData = this._form.option("formData");
            this._updateParameters(formData);
            return this._parameters
        }
    }]);
    return DialogInfoBase
}();
var TaskEditDialogInfo = function(_DialogInfoBase) {
    _inherits(TaskEditDialogInfo, _DialogInfoBase);

    function TaskEditDialogInfo() {
        _classCallCheck(this, TaskEditDialogInfo);
        return _possibleConstructorReturn(this, (TaskEditDialogInfo.__proto__ || Object.getPrototypeOf(TaskEditDialogInfo)).apply(this, arguments))
    }
    _createClass(TaskEditDialogInfo, [{
        key: "getTitle",
        value: function() {
            return "Task Details"
        }
    }, {
        key: "_getFormItems",
        value: function() {
            var _this3 = this;
            var readOnly = !this._editingOptions.enabled || !this._editingOptions.allowTaskUpdating;
            return [{
                dataField: "title",
                editorType: "dxTextBox",
                label: {
                    text: "Title"
                },
                editorOptions: {
                    readOnly: readOnly
                }
            }, {
                dataField: "start",
                editorType: "dxDateBox",
                label: {
                    text: "Start"
                },
                editorOptions: {
                    type: "datetime",
                    width: "100%",
                    readOnly: readOnly
                }
            }, {
                dataField: "end",
                editorType: "dxDateBox",
                label: {
                    text: "End"
                },
                editorOptions: {
                    type: "datetime",
                    width: "100%",
                    readOnly: readOnly
                }
            }, {
                dataField: "progress",
                editorType: "dxNumberBox",
                label: {
                    text: "Progress"
                },
                editorOptions: {
                    value: this._parameters.progress / 100,
                    showSpinButtons: true,
                    min: 0,
                    max: 1,
                    format: "#0%",
                    step: .01,
                    readOnly: readOnly
                }
            }, {
                dataField: "assigned.items",
                editorType: "dxTagBox",
                label: {
                    text: "Resources"
                },
                editorOptions: {
                    readOnly: readOnly,
                    dataSource: this._parameters.resources.items,
                    displayExpr: "text",
                    buttons: [{
                        name: "editResources",
                        location: "after",
                        options: {
                            text: "...",
                            hint: "Edit Resource List",
                            onClick: function() {
                                _this3._parameters.showResourcesDialogCommand.execute()
                            }
                        }
                    }]
                }
            }]
        }
    }, {
        key: "_updateParameters",
        value: function(formData) {
            this._parameters.title = formData.title;
            this._parameters.start = formData.start;
            this._parameters.end = formData.end;
            this._parameters.progress = 100 * formData.progress;
            this._parameters.assigned = formData.assigned
        }
    }]);
    return TaskEditDialogInfo
}(DialogInfoBase);
var ResourcesEditDialogInfo = function(_DialogInfoBase2) {
    _inherits(ResourcesEditDialogInfo, _DialogInfoBase2);

    function ResourcesEditDialogInfo() {
        _classCallCheck(this, ResourcesEditDialogInfo);
        return _possibleConstructorReturn(this, (ResourcesEditDialogInfo.__proto__ || Object.getPrototypeOf(ResourcesEditDialogInfo)).apply(this, arguments))
    }
    _createClass(ResourcesEditDialogInfo, [{
        key: "getTitle",
        value: function() {
            return "Resources"
        }
    }, {
        key: "_getFormItems",
        value: function() {
            var _this5 = this;
            return [{
                label: {
                    visible: false
                },
                dataField: "resources.items",
                editorType: "dxList",
                editorOptions: {
                    allowItemDeleting: this._editingOptions.enabled && this._editingOptions.allowResourceDeleting,
                    itemDeleteMode: "static",
                    selectionMode: "none",
                    items: this._parameters.resources.items,
                    height: 250,
                    noDataText: "No resources",
                    onInitialized: function(e) {
                        _this5.list = e.component
                    },
                    onItemDeleted: function(e) {
                        _this5._parameters.resources.remove(e.itemData)
                    }
                }
            }, {
                label: {
                    visible: false
                },
                editorType: "dxTextBox",
                editorOptions: {
                    readOnly: !this._editingOptions.enabled || !this._editingOptions.allowResourceAdding,
                    onInitialized: function(e) {
                        _this5.textBox = e.component
                    },
                    onInput: function(e) {
                        var addButton = e.component.getButton("addResource");
                        var resourceName = e.component.option("text");
                        addButton.option("disabled", 0 === resourceName.length)
                    },
                    buttons: [{
                        name: "addResource",
                        location: "after",
                        options: {
                            text: "Add",
                            disabled: true,
                            onClick: function(e) {
                                var newItem = _this5._parameters.resources.createItem();
                                newItem.text = _this5.textBox.option("text");
                                _this5._parameters.resources.add(newItem);
                                _this5.list.option("items", _this5._parameters.resources.items);
                                _this5.list.scrollToItem(newItem);
                                _this5.textBox.reset();
                                e.component.option("disabled", true)
                            }
                        }
                    }]
                }
            }]
        }
    }]);
    return ResourcesEditDialogInfo
}(DialogInfoBase);
