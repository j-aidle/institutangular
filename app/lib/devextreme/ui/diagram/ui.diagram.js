/**
 * DevExtreme (ui/diagram/ui.diagram.js)
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
var _drawer = require("../drawer");
var _drawer2 = _interopRequireDefault(_drawer);
var _load_indicator = require("../load_indicator");
var _load_indicator2 = _interopRequireDefault(_load_indicator);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _data = require("../../core/utils/data");
var _data2 = _interopRequireDefault(_data);
var _uiDiagram = require("./ui.diagram.toolbar");
var _uiDiagram2 = _interopRequireDefault(_uiDiagram);
var _uiDiagram3 = require("./ui.diagram.leftpanel");
var _uiDiagram4 = _interopRequireDefault(_uiDiagram3);
var _uiDiagram5 = require("./ui.diagram.rightpanel");
var _uiDiagram6 = _interopRequireDefault(_uiDiagram5);
var _uiDiagram7 = require("./ui.diagram.contextmenu");
var _uiDiagram8 = _interopRequireDefault(_uiDiagram7);
var _uiDiagram9 = require("./ui.diagram.dialogs");
var _uiDiagram10 = _interopRequireDefault(_uiDiagram9);
var _uiDiagram11 = require("./ui.diagram.toolbox");
var _uiDiagram12 = _interopRequireDefault(_uiDiagram11);
var _uiDiagram13 = require("./ui.diagram.optionsupdate");
var _uiDiagram14 = _interopRequireDefault(_uiDiagram13);
var _uiDiagram15 = require("./ui.diagram.nodes");
var _uiDiagram16 = _interopRequireDefault(_uiDiagram15);
var _uiDiagram17 = require("./ui.diagram.edges");
var _uiDiagram18 = _interopRequireDefault(_uiDiagram17);
var _tooltip = require("../tooltip");
var _tooltip2 = _interopRequireDefault(_tooltip);
var _diagram_importer = require("./diagram_importer");
var _window = require("../../core/utils/window");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("../../events/utils");
var _utils2 = _interopRequireDefault(_utils);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _number = require("../../localization/number");
var _number2 = _interopRequireDefault(_number);
var _uiDiagram19 = require("./ui.diagram.dialogmanager");
var _uiDiagram20 = _interopRequireDefault(_uiDiagram19);

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
var DIAGRAM_CLASS = "dx-diagram";
var DIAGRAM_FULLSCREEN_CLASS = "dx-diagram-fullscreen";
var DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + "-toolbar-wrapper";
var DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + "-content-wrapper";
var DIAGRAM_DRAWER_WRAPPER_CLASS = DIAGRAM_CLASS + "-drawer-wrapper";
var DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + "-content";
var DIAGRAM_LOADING_INDICATOR_CLASS = DIAGRAM_CLASS + "-loading-indicator";
var DIAGRAM_DEFAULT_UNIT = "in";
var DIAGRAM_DEFAULT_ZOOMLEVEL = 1;
var DIAGRAM_DEFAULT_AUTOZOOM = "disabled";
var DIAGRAM_DEFAULT_PAGE_ORIENTATION = "portrait";
var DIAGRAM_DEFAULT_PAGE_COLOR = "white";
var DIAGRAM_NAMESPACE = "dxDiagramEvent";
var FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("fullscreenchange", DIAGRAM_NAMESPACE);
var IE_FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("msfullscreenchange", DIAGRAM_NAMESPACE);
var WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("webkitfullscreenchange", DIAGRAM_NAMESPACE);
var MOZ_FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("mozfullscreenchange", DIAGRAM_NAMESPACE);
var Diagram = function(_Widget) {
    _inherits(Diagram, _Widget);

    function Diagram() {
        _classCallCheck(this, Diagram);
        return _possibleConstructorReturn(this, (Diagram.__proto__ || Object.getPrototypeOf(Diagram)).apply(this, arguments))
    }
    _createClass(Diagram, [{
        key: "_init",
        value: function() {
            this._updateDiagramLockCount = 0;
            _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_init", this).call(this);
            this._initDiagram();
            this.optionsUpdateBar = new _uiDiagram14.default(this)
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_initMarkup", this).call(this);
            var isServerSide = !(0, _window.hasWindow)();
            this.$element().addClass(DIAGRAM_CLASS);
            this._toolbarInstance = void 0;
            if (this.option("toolbar.visible")) {
                this._renderToolbar()
            }
            var $contentWrapper = (0, _renderer2.default)("<div>").addClass(DIAGRAM_CONTENT_WRAPPER_CLASS).appendTo(this.$element());
            this._leftPanel = void 0;
            if (this.option("toolbox.visible")) {
                this._renderLeftPanel($contentWrapper)
            }
            var $drawerWrapper = (0, _renderer2.default)("<div>").addClass(DIAGRAM_DRAWER_WRAPPER_CLASS).appendTo($contentWrapper);
            if (this.option("propertiesPanel.enabled")) {
                var $drawer = (0, _renderer2.default)("<div>").appendTo($drawerWrapper);
                this._content = (0, _renderer2.default)("<div>").addClass(DIAGRAM_CONTENT_CLASS).appendTo($drawer);
                this._renderRightPanel($drawer)
            } else {
                this._content = (0, _renderer2.default)("<div>").addClass(DIAGRAM_CONTENT_CLASS).appendTo($drawerWrapper)
            }
            this._contextMenu = void 0;
            if (this.option("contextMenu.enabled")) {
                this._renderContextMenu(this._content)
            }
            this._renderDialog(this._content);
            !isServerSide && this._diagramInstance.createDocument(this._content[0]);
            if (this.option("zoomLevel") !== DIAGRAM_DEFAULT_ZOOMLEVEL) {
                this._updateZoomLevelState()
            }
            if (this.option("autoZoom") !== DIAGRAM_DEFAULT_AUTOZOOM) {
                this._updateAutoZoomState()
            }
            if (this.option("simpleView")) {
                this._updateSimpleViewState()
            }
            if (this.option("readOnly") || this.option("disabled")) {
                this._updateReadOnlyState()
            }
            if (this.option("fullScreen")) {
                this._updateFullscreenState()
            }
            this._diagramInstance.barManager.registerBar(this.optionsUpdateBar)
        }
    }, {
        key: "notifyBarCommandExecuted",
        value: function() {
            this._diagramInstance.captureFocus()
        }
    }, {
        key: "_registerBar",
        value: function(component) {
            component.bar.onChanged.add(this);
            this._diagramInstance.barManager.registerBar(component.bar)
        }
    }, {
        key: "_renderToolbar",
        value: function() {
            var _this2 = this;
            var $toolbarWrapper = (0, _renderer2.default)("<div>").addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS).appendTo(this.$element());
            var toolbarWidgetCommandNames = [];
            if (this.option("propertiesPanel.enabled") && this.option("propertiesPanel.collapsible")) {
                toolbarWidgetCommandNames.push("options")
            }
            this._toolbarInstance = this._createComponent($toolbarWrapper, _uiDiagram2.default, {
                commands: this.option("toolbar.commands"),
                onContentReady: function(e) {
                    return _this2._registerBar(e.component)
                },
                onPointerUp: this._onPanelPointerUp.bind(this),
                "export": this.option("export"),
                widgetCommandNames: toolbarWidgetCommandNames
            })
        }
    }, {
        key: "_renderLeftPanel",
        value: function($parent) {
            var _this3 = this;
            var isServerSide = !(0, _window.hasWindow)();
            var $leftPanel = (0, _renderer2.default)("<div>").appendTo($parent);
            this._leftPanel = this._createComponent($leftPanel, _uiDiagram4.default, {
                toolboxGroups: this._getToolboxGroups(),
                disabled: this.option("readOnly"),
                onShapeCategoryRendered: function(e) {
                    if (isServerSide) {
                        return
                    }
                    var $toolboxContainer = (0, _renderer2.default)(e.$element);
                    _this3._diagramInstance.createToolbox($toolboxContainer[0], 40, 8, {
                        "data-toggle": "shape-toolbox-tooltip"
                    }, e.shapes || e.category, "texts" === e.displayMode);
                    _this3._createTooltips($parent, $toolboxContainer.find('[data-toggle="shape-toolbox-tooltip"]'))
                },
                onPointerUp: this._onPanelPointerUp.bind(this)
            })
        }
    }, {
        key: "_createTooltips",
        value: function($container, targets) {
            var _this4 = this;
            targets.each(function(index, element) {
                var $target = (0, _renderer2.default)(element);
                var $tooltip = (0, _renderer2.default)("<div>").html($target.attr("title")).appendTo($container);
                _this4._createComponent($tooltip, _tooltip2.default, {
                    target: $target.get(0),
                    showEvent: "mouseenter",
                    hideEvent: "mouseleave",
                    position: "top",
                    animation: {
                        show: {
                            type: "fade",
                            from: 0,
                            to: 1,
                            delay: 500
                        },
                        hide: {
                            type: "fade",
                            from: 1,
                            to: 0,
                            delay: 100
                        }
                    }
                })
            })
        }
    }, {
        key: "_invalidateContextMenuCommands",
        value: function() {
            if (this._contextMenu) {
                this._contextMenu.option({
                    commands: this.option("contextMenu.commands")
                })
            }
        }
    }, {
        key: "_invalidatePropertiesPanelGroups",
        value: function() {
            if (this._rightPanel) {
                this._rightPanel.option({
                    propertyGroups: this.option("propertiesPanel.groups")
                })
            }
        }
    }, {
        key: "_invalidateToolbarCommands",
        value: function() {
            if (this._toolbarInstance) {
                this._toolbarInstance.option({
                    commands: this.option("toolbar.commands")
                })
            }
        }
    }, {
        key: "_invalidateToolboxGroups",
        value: function() {
            if (this._leftPanel) {
                this._leftPanel.option({
                    toolboxGroups: this._getToolboxGroups()
                })
            }
        }
    }, {
        key: "_setLeftPanelEnabled",
        value: function(enabled) {
            if (this._leftPanel) {
                this._leftPanel.option({
                    disabled: !enabled
                })
            }
        }
    }, {
        key: "_renderRightPanel",
        value: function($parent) {
            var _this5 = this;
            var isCollapsible = this.option("propertiesPanel.collapsible");
            var drawer = this._createComponent($parent, _drawer2.default, {
                closeOnOutsideClick: isCollapsible,
                opened: !isCollapsible,
                openedStateMode: isCollapsible ? "overlap" : "shrink",
                position: "right",
                template: function($options) {
                    _this5._rightPanel = _this5._createComponent($options, _uiDiagram6.default, {
                        propertyGroups: _this5.option("propertiesPanel.groups"),
                        onContentReady: function(e) {
                            return _this5._registerBar(e.component)
                        },
                        onPointerUp: _this5._onPanelPointerUp.bind(_this5)
                    })
                }
            });
            if (this._toolbarInstance) {
                this._toolbarInstance.option("onWidgetCommand", function(e) {
                    if ("options" === e.name) {
                        drawer.toggle()
                    }
                })
            }
        }
    }, {
        key: "_onPanelPointerUp",
        value: function() {
            this._diagramInstance.captureFocus()
        }
    }, {
        key: "_renderContextMenu",
        value: function($mainElement) {
            var _this6 = this;
            var $contextMenu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._contextMenu = this._createComponent($contextMenu, _uiDiagram8.default, {
                commands: this.option("contextMenu.commands"),
                container: $mainElement,
                onContentReady: function(_ref) {
                    var component = _ref.component;
                    return _this6._registerBar(component)
                },
                onVisibleChanged: function(_ref2) {
                    var component = _ref2.component;
                    return _this6._diagramInstance.barManager.updateBarItemsState(component.bar)
                },
                onItemClick: function(itemData) {
                    return _this6._onBeforeCommandExecuted(itemData.command)
                }
            })
        }
    }, {
        key: "_onBeforeCommandExecuted",
        value: function(command) {
            var dialogParameters = _uiDiagram20.default.getDialogParameters(command);
            if (dialogParameters) {
                this._showDialog(dialogParameters)
            }
            return !!dialogParameters
        }
    }, {
        key: "_renderDialog",
        value: function($mainElement) {
            var $dialogElement = (0, _renderer2.default)("<div>").appendTo($mainElement);
            this._dialogInstance = this._createComponent($dialogElement, _uiDiagram10.default, {})
        }
    }, {
        key: "_showDialog",
        value: function(dialogParameters) {
            if (this._dialogInstance) {
                this._dialogInstance.option("onGetContent", dialogParameters.onGetContent);
                this._dialogInstance.option("onHidden", function() {
                    this._diagramInstance.captureFocus()
                }.bind(this));
                this._dialogInstance.option("command", this._diagramInstance.commandManager.getCommand(dialogParameters.command));
                this._dialogInstance.option("title", dialogParameters.title);
                this._dialogInstance._show()
            }
        }
    }, {
        key: "_showLoadingIndicator",
        value: function() {
            this._loadingIndicator = (0, _renderer2.default)("<div>").addClass(DIAGRAM_LOADING_INDICATOR_CLASS);
            this._createComponent(this._loadingIndicator, _load_indicator2.default, {});
            var $parent = this._content || this.$element();
            $parent.append(this._loadingIndicator)
        }
    }, {
        key: "_hideLoadingIndicator",
        value: function() {
            if (!this._loadingIndicator) {
                return
            }
            this._loadingIndicator.remove();
            this._loadingIndicator = null
        }
    }, {
        key: "_initDiagram",
        value: function() {
            var _getDiagram = (0, _diagram_importer.getDiagram)(),
                DiagramControl = _getDiagram.DiagramControl;
            this._diagramInstance = new DiagramControl;
            this._diagramInstance.onChanged = this._raiseDataChangeAction.bind(this);
            this._diagramInstance.onEdgeInserted = this._raiseEdgeInsertedAction.bind(this);
            this._diagramInstance.onEdgeUpdated = this._raiseEdgeUpdatedAction.bind(this);
            this._diagramInstance.onEdgeRemoved = this._raiseEdgeRemovedAction.bind(this);
            this._diagramInstance.onNodeInserted = this._raiseNodeInsertedAction.bind(this);
            this._diagramInstance.onNodeUpdated = this._raiseNodeUpdatedAction.bind(this);
            this._diagramInstance.onNodeRemoved = this._raiseNodeRemovedAction.bind(this);
            this._diagramInstance.onToolboxDragStart = this._raiseToolboxDragStart.bind(this);
            this._diagramInstance.onToolboxDragEnd = this._raiseToolboxDragEnd.bind(this);
            this._diagramInstance.onToggleFullscreen = this._onToggleFullScreen.bind(this);
            this._diagramInstance.onShowContextMenu = this._onShowContextMenu.bind(this);
            this._diagramInstance.onHideContextMenu = this._onHideContextMenu.bind(this);
            this._diagramInstance.onNativeAction.add({
                notifyItemClick: this._raiseItemClickAction.bind(this),
                notifyItemDblClick: this._raiseItemDblClickAction.bind(this),
                notifySelectionChanged: this._raiseSelectionChanged.bind(this)
            });
            this._updateUnitItems();
            this._updateFormatUnitsMethod();
            if (this.option("units") !== DIAGRAM_DEFAULT_UNIT) {
                this._updateUnitsState()
            }
            if (this.option("pageSize")) {
                if (this.option("pageSize.items")) {
                    this._updatePageSizeItemsState()
                }
                if (this.option("pageSize.width") && this.option("pageSize.height")) {
                    this._updatePageSizeState()
                }
            }
            if (this.option("pageOrientation") !== DIAGRAM_DEFAULT_PAGE_ORIENTATION) {
                this._updatePageOrientationState()
            }
            if (this.option("pageColor") !== DIAGRAM_DEFAULT_PAGE_COLOR) {
                this._updatePageColorState()
            }
            if (this.option("viewUnits") !== DIAGRAM_DEFAULT_UNIT) {
                this._updateViewUnitsState()
            }
            if (!this.option("showGrid")) {
                this._updateShowGridState()
            }
            if (!this.option("snapToGrid")) {
                this._updateSnapToGridState()
            }
            if (this.option("gridSize")) {
                if (this.option("gridSize.items")) {
                    this._updateGridSizeItemsState()
                }
                this._updateGridSizeState()
            }
            if (this.option("zoomLevel.items")) {
                this._updateZoomLevelItemsState()
            }
            this._updateCustomShapes(this._getCustomShapes());
            this._refreshDataSources()
        }
    }, {
        key: "_dispose",
        value: function() {
            if (this._diagramInstance) {
                this._diagramInstance.dispose();
                this._diagramInstance = void 0
            }
            _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_dispose", this).call(this)
        }
    }, {
        key: "_executeDiagramCommand",
        value: function(command, parameter) {
            this._diagramInstance.commandManager.getCommand(command).execute(parameter)
        }
    }, {
        key: "_refreshDataSources",
        value: function() {
            this._beginUpdateDiagram();
            this._refreshNodesDataSource();
            this._refreshEdgesDataSource();
            this._endUpdateDiagram()
        }
    }, {
        key: "_refreshNodesDataSource",
        value: function() {
            if (this._nodesOption) {
                this._nodesOption._disposeDataSource();
                delete this._nodesOption
            }
            if (this.option("nodes.dataSource")) {
                this._nodesOption = new _uiDiagram16.default(this);
                this._nodesOption.option("dataSource", this.option("nodes.dataSource"));
                this._nodesOption._refreshDataSource()
            }
        }
    }, {
        key: "_refreshEdgesDataSource",
        value: function() {
            if (this._edgesOption) {
                this._edgesOption._disposeDataSource();
                delete this._edgesOption
            }
            if (this.option("edges.dataSource")) {
                this._edgesOption = new _uiDiagram18.default(this);
                this._edgesOption.option("dataSource", this.option("edges.dataSource"));
                this._edgesOption._refreshDataSource()
            }
        }
    }, {
        key: "_getDiagramData",
        value: function() {
            var value = void 0;
            var _getDiagram2 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram2.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.Export, function(data) {
                value = data
            });
            return value
        }
    }, {
        key: "_setDiagramData",
        value: function(data, keepExistingItems) {
            var _getDiagram3 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram3.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.Import, {
                data: data,
                keepExistingItems: keepExistingItems
            })
        }
    }, {
        key: "_onDataSourceChanged",
        value: function() {
            this._bindDiagramData()
        }
    }, {
        key: "_createOptionGetter",
        value: function(optionName) {
            var expr = this.option(optionName);
            return expr && _data2.default.compileGetter(expr)
        }
    }, {
        key: "_createOptionSetter",
        value: function(optionName) {
            var expr = this.option(optionName);
            if (_type2.default.isFunction(expr)) {
                return expr
            }
            return expr && _data2.default.compileSetter(expr)
        }
    }, {
        key: "_bindDiagramData",
        value: function() {
            if (this._updateDiagramLockCount || !this._isBindingMode()) {
                return
            }
            var _getDiagram4 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram4.DiagramCommand,
                ConnectorLineOption = _getDiagram4.ConnectorLineOption,
                ConnectorLineEnding = _getDiagram4.ConnectorLineEnding;
            var lineOptionGetter = void 0,
                lineOptionSetter = void 0,
                startLineEndingGetter = void 0,
                startLineEndingSetter = void 0,
                endLineEndingGetter = void 0,
                endLineEndingSetter = void 0;
            var data = {
                nodeDataSource: this._nodesOption && this._nodesOption.getItems(),
                edgeDataSource: this._edgesOption && this._edgesOption.getItems(),
                nodeDataImporter: {
                    getKey: this._createOptionGetter("nodes.keyExpr"),
                    setKey: this._createOptionSetter("nodes.keyExpr"),
                    getLocked: this._createOptionGetter("nodes.lockedExpr"),
                    setLocked: this._createOptionSetter("nodes.lockedExpr"),
                    getStyle: this._createOptionGetter("nodes.styleExpr"),
                    setStyle: this._createOptionSetter("nodes.styleExpr"),
                    getStyleText: this._createOptionGetter("nodes.textStyleExpr"),
                    setStyleText: this._createOptionSetter("nodes.textStyleExpr"),
                    getZIndex: this._createOptionGetter("nodes.zIndexExpr"),
                    setZIndex: this._createOptionSetter("nodes.zIndexExpr"),
                    getType: this._createOptionGetter("nodes.typeExpr"),
                    setType: this._createOptionSetter("nodes.typeExpr"),
                    getText: this._createOptionGetter("nodes.textExpr"),
                    setText: this._createOptionSetter("nodes.textExpr"),
                    getImage: this._createOptionGetter("nodes.imageUrlExpr"),
                    setImage: this._createOptionSetter("nodes.imageUrlExpr"),
                    getLeft: this._createOptionGetter("nodes.leftExpr"),
                    setLeft: this._createOptionSetter("nodes.leftExpr"),
                    getTop: this._createOptionGetter("nodes.topExpr"),
                    setTop: this._createOptionSetter("nodes.topExpr"),
                    getWidth: this._createOptionGetter("nodes.widthExpr"),
                    setWidth: this._createOptionSetter("nodes.widthExpr"),
                    getHeight: this._createOptionGetter("nodes.heightExpr"),
                    setHeight: this._createOptionSetter("nodes.heightExpr"),
                    getParentKey: this._createOptionGetter("nodes.parentKeyExpr"),
                    setParentKey: this._createOptionSetter("nodes.parentKeyExpr"),
                    getItems: this._createOptionGetter("nodes.itemsExpr"),
                    setItems: this._createOptionSetter("nodes.itemsExpr"),
                    getContainerKey: this._createOptionGetter("nodes.containerKeyExpr"),
                    setContainerKey: this._createOptionSetter("nodes.containerKeyExpr"),
                    getChildren: this._createOptionGetter("nodes.childrenExpr"),
                    setChildren: this._createOptionSetter("nodes.childrenExpr")
                },
                edgeDataImporter: {
                    getKey: this._createOptionGetter("edges.keyExpr"),
                    setKey: this._createOptionSetter("edges.keyExpr"),
                    getLocked: this._createOptionGetter("edges.lockedExpr"),
                    setLocked: this._createOptionSetter("edges.lockedExpr"),
                    getStyle: this._createOptionGetter("edges.styleExpr"),
                    setStyle: this._createOptionSetter("edges.styleExpr"),
                    getStyleText: this._createOptionGetter("edges.textStyleExpr"),
                    setStyleText: this._createOptionSetter("edges.textStyleExpr"),
                    getZIndex: this._createOptionGetter("edges.zIndexExpr"),
                    setZIndex: this._createOptionSetter("edges.zIndexExpr"),
                    getFrom: this._createOptionGetter("edges.fromExpr"),
                    setFrom: this._createOptionSetter("edges.fromExpr"),
                    getFromPointIndex: this._createOptionGetter("edges.fromPointIndexExpr"),
                    setFromPointIndex: this._createOptionSetter("edges.fromPointIndexExpr"),
                    getTo: this._createOptionGetter("edges.toExpr"),
                    setTo: this._createOptionSetter("edges.toExpr"),
                    getToPointIndex: this._createOptionGetter("edges.toPointIndexExpr"),
                    setToPointIndex: this._createOptionSetter("edges.toPointIndexExpr"),
                    getPoints: this._createOptionGetter("edges.pointsExpr"),
                    setPoints: this._createOptionSetter("edges.pointsExpr"),
                    getText: this._createOptionGetter("edges.textExpr"),
                    setText: this._createOptionSetter("edges.textExpr"),
                    getLineOption: (lineOptionGetter = this._createOptionGetter("edges.lineTypeExpr")) && function(obj) {
                        var lineType = lineOptionGetter(obj);
                        switch (lineType) {
                            case "straight":
                                return ConnectorLineOption.Straight;
                            default:
                                return ConnectorLineOption.Orthogonal
                        }
                    }.bind(this),
                    setLineOption: (lineOptionSetter = this._createOptionSetter("edges.lineTypeExpr")) && function(obj, value) {
                        switch (value) {
                            case ConnectorLineOption.Straight:
                                value = "straight";
                                break;
                            case ConnectorLineOption.Orthogonal:
                                value = "orthogonal"
                        }
                        lineOptionSetter(obj, value)
                    }.bind(this),
                    getStartLineEnding: (startLineEndingGetter = this._createOptionGetter("edges.fromLineEndExpr")) && function(obj) {
                        var lineType = startLineEndingGetter(obj);
                        switch (lineType) {
                            case "arrow":
                                return ConnectorLineEnding.Arrow;
                            default:
                                return ConnectorLineEnding.None
                        }
                    }.bind(this),
                    setStartLineEnding: (startLineEndingSetter = this._createOptionSetter("edges.fromLineEndExpr")) && function(obj, value) {
                        switch (value) {
                            case ConnectorLineEnding.Arrow:
                                value = "arrow";
                                break;
                            case ConnectorLineEnding.None:
                                value = "none"
                        }
                        startLineEndingSetter(obj, value)
                    }.bind(this),
                    getEndLineEnding: (endLineEndingGetter = this._createOptionGetter("edges.toLineEndExpr")) && function(obj) {
                        var lineType = endLineEndingGetter(obj);
                        switch (lineType) {
                            case "none":
                                return ConnectorLineEnding.None;
                            default:
                                return ConnectorLineEnding.Arrow
                        }
                    }.bind(this),
                    setEndLineEnding: (endLineEndingSetter = this._createOptionSetter("edges.toLineEndExpr")) && function(obj, value) {
                        switch (value) {
                            case ConnectorLineEnding.Arrow:
                                value = "arrow";
                                break;
                            case ConnectorLineEnding.None:
                                value = "none"
                        }
                        endLineEndingSetter(obj, value)
                    }.bind(this)
                },
                layoutParameters: this._getDataBindingLayoutParameters()
            };
            this._executeDiagramCommand(DiagramCommand.BindDocument, data)
        }
    }, {
        key: "_getDataBindingLayoutParameters",
        value: function() {
            var _getDiagram5 = (0, _diagram_importer.getDiagram)(),
                DataLayoutType = _getDiagram5.DataLayoutType,
                DataLayoutOrientation = _getDiagram5.DataLayoutOrientation;
            var layoutParametersOption = this.option("nodes.autoLayout");
            if (!layoutParametersOption) {
                return
            }
            var parameters = layoutParametersOption ? {} : void 0;
            if (layoutParametersOption) {
                var layoutType = layoutParametersOption.type || layoutParametersOption;
                if ("tree" === layoutType) {
                    parameters.type = DataLayoutType.Tree
                } else {
                    if ("layered" === layoutType) {
                        parameters.type = DataLayoutType.Sugiyama
                    }
                }
                if ("vertical" === layoutParametersOption.orientation) {
                    parameters.orientation = DataLayoutOrientation.Vertical
                } else {
                    if ("horizontal" === layoutParametersOption.orientation) {
                        parameters.orientation = DataLayoutOrientation.Horizontal
                    }
                }
            }
            return parameters
        }
    }, {
        key: "_getAutoZoomValue",
        value: function(option) {
            var _getDiagram6 = (0, _diagram_importer.getDiagram)(),
                AutoZoomMode = _getDiagram6.AutoZoomMode;
            switch (option) {
                case "fitContent":
                    return AutoZoomMode.FitContent;
                case "fitWidth":
                    return AutoZoomMode.FitToWidth;
                default:
                    return AutoZoomMode.Disabled
            }
        }
    }, {
        key: "_isBindingMode",
        value: function() {
            return this._nodesOption && this._nodesOption.hasItems() || this._edgesOption && this._nodesOption.hasItems()
        }
    }, {
        key: "_beginUpdateDiagram",
        value: function() {
            this._updateDiagramLockCount++
        }
    }, {
        key: "_endUpdateDiagram",
        value: function() {
            this._updateDiagramLockCount = Math.max(this._updateDiagramLockCount - 1, 0);
            if (!this._updateDiagramLockCount) {
                this._bindDiagramData()
            }
        }
    }, {
        key: "_getCustomShapes",
        value: function() {
            return this.option("customShapes") || []
        }
    }, {
        key: "_getToolboxGroups",
        value: function() {
            return _uiDiagram12.default.getGroups(this.option("toolbox.groups"))
        }
    }, {
        key: "_updateCustomShapes",
        value: function(customShapes, prevCustomShapes) {
            if (Array.isArray(prevCustomShapes)) {
                this._diagramInstance.removeCustomShapes(prevCustomShapes.map(function(s) {
                    return s.type
                }))
            }
            if (Array.isArray(customShapes)) {
                this._diagramInstance.addCustomShapes(customShapes.map(function(s) {
                    return {
                        category: s.category,
                        type: s.type,
                        baseType: s.baseType,
                        title: s.title,
                        svgUrl: s.backgroundImageUrl,
                        svgLeft: s.backgroundImageLeft,
                        svgTop: s.backgroundImageTop,
                        svgWidth: s.backgroundImageWidth,
                        svgHeight: s.backgroundImageHeight,
                        defaultWidth: s.defaultWidth,
                        defaultHeight: s.defaultHeight,
                        defaultText: s.defaultText,
                        allowEditText: s.allowEditText,
                        textLeft: s.textLeft,
                        textTop: s.textTop,
                        textWidth: s.textWidth,
                        textHeight: s.textHeight,
                        defaultImageUrl: s.defaultImageUrl,
                        allowEditImage: s.allowEditImage,
                        imageLeft: s.imageLeft,
                        imageTop: s.imageTop,
                        imageWidth: s.imageWidth,
                        imageHeight: s.imageHeight,
                        connectionPoints: s.connectionPoints && s.connectionPoints.map(function(pt) {
                            return {
                                x: pt.x,
                                y: pt.y
                            }
                        })
                    }
                }))
            }
        }
    }, {
        key: "_onToggleFullScreen",
        value: function(fullScreen) {
            this._changeNativeFullscreen(fullScreen);
            this.$element().toggleClass(DIAGRAM_FULLSCREEN_CLASS, fullScreen);
            this._diagramInstance.updateLayout()
        }
    }, {
        key: "_changeNativeFullscreen",
        value: function(setModeOn) {
            var window = (0, _window.getWindow)();
            if (window.self === window.top || setModeOn === this._inNativeFullscreen()) {
                return
            }
            if (setModeOn) {
                this._subscribeFullscreenNativeChanged()
            } else {
                this._unsubscribeFullscreenNativeChanged()
            }
            this._setNativeFullscreen(setModeOn)
        }
    }, {
        key: "_setNativeFullscreen",
        value: function(on) {
            var window = (0, _window.getWindow)(),
                document = window.self.document,
                body = window.self.document.body;
            if (on) {
                if (body.requestFullscreen) {
                    body.requestFullscreen()
                } else {
                    if (body.mozRequestFullscreen) {
                        body.mozRequestFullscreen()
                    } else {
                        if (body.webkitRequestFullscreen) {
                            body.webkitRequestFullscreen()
                        } else {
                            if (body.msRequestFullscreen) {
                                body.msRequestFullscreen()
                            }
                        }
                    }
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else {
                    if (document.mozCancelFullscreen) {
                        document.mozCancelFullscreen()
                    } else {
                        if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen()
                        } else {
                            if (document.msExitFullscreen) {
                                document.msExitFullscreen()
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: "_inNativeFullscreen",
        value: function() {
            var document = (0, _window.getWindow)().document,
                fullscreenElement = document.fullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement,
                isInFullscreen = fullscreenElement === document.body || document.webkitIsFullscreen;
            return !!isInFullscreen
        }
    }, {
        key: "_subscribeFullscreenNativeChanged",
        value: function() {
            var document = (0, _window.getWindow)().document,
                handler = this._onNativeFullscreenChangeHandler.bind(this);
            _events_engine2.default.on(document, FULLSCREEN_CHANGE_EVENT_NAME, handler);
            _events_engine2.default.on(document, IE_FULLSCREEN_CHANGE_EVENT_NAME, handler);
            _events_engine2.default.on(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME, handler);
            _events_engine2.default.on(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME, handler)
        }
    }, {
        key: "_unsubscribeFullscreenNativeChanged",
        value: function() {
            var document = (0, _window.getWindow)().document;
            _events_engine2.default.off(document, FULLSCREEN_CHANGE_EVENT_NAME);
            _events_engine2.default.off(document, IE_FULLSCREEN_CHANGE_EVENT_NAME);
            _events_engine2.default.off(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME);
            _events_engine2.default.off(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME)
        }
    }, {
        key: "_onNativeFullscreenChangeHandler",
        value: function() {
            if (!this._inNativeFullscreen()) {
                this._unsubscribeFullscreenNativeChanged();
                this._onToggleFullScreen(false)
            }
        }
    }, {
        key: "_onShowContextMenu",
        value: function(x, y, selection) {
            this._contextMenu._show(x, y, selection)
        }
    }, {
        key: "_onHideContextMenu",
        value: function() {
            this._contextMenu._hide()
        }
    }, {
        key: "_getDiagramUnitValue",
        value: function(value) {
            var _getDiagram7 = (0, _diagram_importer.getDiagram)(),
                DiagramUnit = _getDiagram7.DiagramUnit;
            switch (value) {
                case "in":
                    return DiagramUnit.In;
                case "cm":
                    return DiagramUnit.Cm;
                case "px":
                    return DiagramUnit.Px;
                default:
                    return DiagramUnit.In
            }
        }
    }, {
        key: "_updateReadOnlyState",
        value: function() {
            var _getDiagram8 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram8.DiagramCommand;
            var readOnly = this.option("readOnly") || this.option("disabled");
            this._executeDiagramCommand(DiagramCommand.ToggleReadOnly, readOnly);
            this._setLeftPanelEnabled(!readOnly)
        }
    }, {
        key: "_updateZoomLevelState",
        value: function() {
            var zoomLevel = this.option("zoomLevel.value");
            if (!zoomLevel) {
                zoomLevel = this.option("zoomLevel")
            }
            var _getDiagram9 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram9.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.ZoomLevel, zoomLevel)
        }
    }, {
        key: "_updateZoomLevelItemsState",
        value: function() {
            var zoomLevelItems = this.option("zoomLevel.items");
            if (!Array.isArray(zoomLevelItems)) {
                return
            }
            var _getDiagram10 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram10.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.ZoomLevelItems, zoomLevelItems)
        }
    }, {
        key: "_updateAutoZoomState",
        value: function() {
            var _getDiagram11 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram11.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.SwitchAutoZoom, this._getAutoZoomValue(this.option("autoZoom")))
        }
    }, {
        key: "_updateSimpleViewState",
        value: function() {
            var _getDiagram12 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram12.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.ToggleSimpleView, this.option("simpleView"))
        }
    }, {
        key: "_updateFullscreenState",
        value: function() {
            var _getDiagram13 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram13.DiagramCommand;
            var fullScreen = this.option("fullScreen");
            this._executeDiagramCommand(DiagramCommand.Fullscreen, fullScreen);
            this._onToggleFullScreen(fullScreen)
        }
    }, {
        key: "_updateShowGridState",
        value: function() {
            var _getDiagram14 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram14.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.ShowGrid, this.option("showGrid"))
        }
    }, {
        key: "_updateSnapToGridState",
        value: function() {
            var _getDiagram15 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram15.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.SnapToGrid, this.option("snapToGrid"))
        }
    }, {
        key: "_updateGridSizeState",
        value: function() {
            var gridSize = this.option("gridSize.value");
            if (!gridSize) {
                gridSize = this.option("gridSize")
            }
            var _getDiagram16 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram16.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.GridSize, gridSize)
        }
    }, {
        key: "_updateGridSizeItemsState",
        value: function() {
            var gridSizeItems = this.option("gridSize.items");
            if (!Array.isArray(gridSizeItems)) {
                return
            }
            var _getDiagram17 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram17.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.GridSizeItems, gridSizeItems)
        }
    }, {
        key: "_updateUnitItems",
        value: function() {
            var _getDiagram18 = (0, _diagram_importer.getDiagram)(),
                DiagramUnit = _getDiagram18.DiagramUnit;
            var items = {};
            items[DiagramUnit.In] = _message2.default.format("dxDiagram-unitIn");
            items[DiagramUnit.Cm] = _message2.default.format("dxDiagram-unitCm");
            items[DiagramUnit.Px] = _message2.default.format("dxDiagram-unitPx");
            this._diagramInstance.settings.unitItems = items
        }
    }, {
        key: "_updateFormatUnitsMethod",
        value: function() {
            this._diagramInstance.settings.formatUnit = function(value) {
                return _number2.default.format(value)
            }
        }
    }, {
        key: "_updateViewUnitsState",
        value: function() {
            var _getDiagram19 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram19.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.ViewUnits, this._getDiagramUnitValue(this.option("viewUnits")))
        }
    }, {
        key: "_updateUnitsState",
        value: function() {
            var _getDiagram20 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram20.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.Units, this._getDiagramUnitValue(this.option("units")))
        }
    }, {
        key: "_updatePageSizeState",
        value: function() {
            var pageSize = this.option("pageSize");
            if (!pageSize || !pageSize.width || !pageSize.height) {
                return
            }
            var _getDiagram21 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram21.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.PageSize, pageSize)
        }
    }, {
        key: "_updatePageSizeItemsState",
        value: function() {
            var pageSizeItems = this.option("pageSize.items");
            if (!Array.isArray(pageSizeItems)) {
                return
            }
            var _getDiagram22 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram22.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.PageSizeItems, pageSizeItems)
        }
    }, {
        key: "_updatePageOrientationState",
        value: function() {
            var _getDiagram23 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram23.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.PageLandscape, "landscape" === this.option("pageOrientation"))
        }
    }, {
        key: "_updatePageColorState",
        value: function() {
            var _getDiagram24 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram24.DiagramCommand;
            this._executeDiagramCommand(DiagramCommand.PageColor, this.option("pageColor"))
        }
    }, {
        key: "export",
        value: function() {
            return this._getDiagramData()
        }
    }, {
        key: "exportTo",
        value: function(format, callback) {
            var command = this._getDiagramExportToCommand(format);
            this._executeDiagramCommand(command, callback)
        }
    }, {
        key: "_getDiagramExportToCommand",
        value: function(format) {
            var _getDiagram25 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram25.DiagramCommand;
            switch (format) {
                case "png":
                    return DiagramCommand.ExportPng;
                case "jpg":
                    return DiagramCommand.ExportJpg;
                default:
                    return DiagramCommand.ExportSvg
            }
        }
    }, {
        key: "import",
        value: function(data, updateExistingItemsOnly) {
            this._setDiagramData(data, updateExistingItemsOnly);
            this._raiseDataChangeAction()
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_getDefaultOptions", this).call(this), {
                readOnly: false,
                zoomLevel: DIAGRAM_DEFAULT_ZOOMLEVEL,
                simpleView: false,
                autoZoom: DIAGRAM_DEFAULT_AUTOZOOM,
                fullScreen: false,
                showGrid: true,
                snapToGrid: true,
                units: DIAGRAM_DEFAULT_UNIT,
                viewUnits: DIAGRAM_DEFAULT_UNIT,
                pageOrientation: DIAGRAM_DEFAULT_PAGE_ORIENTATION,
                pageColor: DIAGRAM_DEFAULT_PAGE_COLOR,
                onDataChanged: null,
                nodes: {
                    dataSource: null,
                    keyExpr: "id",
                    lockedExpr: void 0,
                    styleExpr: void 0,
                    textStyleExpr: void 0,
                    zIndexExpr: void 0,
                    typeExpr: "type",
                    textExpr: "text",
                    imageUrlExpr: void 0,
                    parentKeyExpr: void 0,
                    itemsExpr: void 0,
                    leftExpr: void 0,
                    topExpr: void 0,
                    widthExpr: void 0,
                    heightExpr: void 0,
                    containerKeyExpr: void 0,
                    childrenExpr: "children",
                    autoLayout: "tree"
                },
                edges: {
                    dataSource: null,
                    keyExpr: "id",
                    lockedExpr: void 0,
                    styleExpr: void 0,
                    textStyleExpr: void 0,
                    zIndexExpr: void 0,
                    fromExpr: "from",
                    fromPointIndexExpr: void 0,
                    toExpr: "to",
                    toPointIndexExpr: void 0,
                    pointsExpr: void 0,
                    textExpr: void 0,
                    lineTypeExpr: void 0,
                    fromLineEndExpr: void 0,
                    toLineEndExpr: void 0
                },
                customShapes: [],
                toolbox: {
                    visible: true
                },
                toolbar: {
                    visible: true
                },
                contextMenu: {
                    enabled: true
                },
                propertiesPanel: {
                    enabled: true,
                    collapsible: true
                },
                "export": {
                    fileName: "Diagram",
                    proxyUrl: void 0
                },
                onItemClick: null,
                onItemDblClick: null,
                onSelectionChanged: null
            })
        }
    }, {
        key: "_createDataChangeAction",
        value: function() {
            this._dataChangeAction = this._createActionByOption("onDataChanged")
        }
    }, {
        key: "_raiseDataChangeAction",
        value: function() {
            if (!this._dataChangeAction) {
                this._createDataChangeAction()
            }
            this._dataChangeAction()
        }
    }, {
        key: "_raiseEdgeInsertedAction",
        value: function(data, callback, errorCallback) {
            if (this._edgesOption) {
                this._edgesOption.insert(data, callback, errorCallback)
            }
        }
    }, {
        key: "_raiseEdgeUpdatedAction",
        value: function(key, data, callback, errorCallback) {
            if (this._edgesOption) {
                this._edgesOption.update(key, data, callback, errorCallback)
            }
        }
    }, {
        key: "_raiseEdgeRemovedAction",
        value: function(key, data, callback, errorCallback) {
            if (this._edgesOption) {
                this._edgesOption.remove(key, data, callback, errorCallback)
            }
        }
    }, {
        key: "_raiseNodeInsertedAction",
        value: function(data, callback, errorCallback) {
            if (this._nodesOption) {
                this._nodesOption.insert(data, callback, errorCallback)
            }
        }
    }, {
        key: "_raiseNodeUpdatedAction",
        value: function(key, data, callback, errorCallback) {
            if (this._nodesOption) {
                this._nodesOption.update(key, data, callback, errorCallback)
            }
        }
    }, {
        key: "_raiseNodeRemovedAction",
        value: function(key, data, callback, errorCallback) {
            if (this._nodesOption) {
                this._nodesOption.remove(key, data, callback, errorCallback)
            }
        }
    }, {
        key: "_raiseToolboxDragStart",
        value: function() {
            if (this._leftPanel) {
                this._leftPanel.$element().addClass("dx-skip-gesture-event")
            }
        }
    }, {
        key: "_raiseToolboxDragEnd",
        value: function() {
            if (this._leftPanel) {
                this._leftPanel.$element().removeClass("dx-skip-gesture-event")
            }
        }
    }, {
        key: "_createItemClickAction",
        value: function() {
            this._itemClickAction = this._createActionByOption("onItemClick")
        }
    }, {
        key: "_createItemDblClickAction",
        value: function() {
            this._itemDblClickAction = this._createActionByOption("onItemDblClick")
        }
    }, {
        key: "_createSelectionChangedAction",
        value: function() {
            this._selectionChangedAction = this._createActionByOption("onSelectionChanged")
        }
    }, {
        key: "_raiseItemClickAction",
        value: function(nativeItem) {
            if (!this._itemClickAction) {
                this._createItemClickAction()
            }
            this._itemClickAction({
                item: this._nativeItemToDiagramItem(nativeItem)
            })
        }
    }, {
        key: "_raiseItemDblClickAction",
        value: function(nativeItem) {
            if (!this._itemDblClickAction) {
                this._createItemDblClickAction()
            }
            this._itemDblClickAction({
                item: this._nativeItemToDiagramItem(nativeItem)
            })
        }
    }, {
        key: "_raiseSelectionChanged",
        value: function(nativeItems) {
            if (!this._selectionChangedAction) {
                this._createSelectionChangedAction()
            }
            this._selectionChangedAction({
                items: nativeItems.map(this._nativeItemToDiagramItem.bind(this))
            })
        }
    }, {
        key: "_nativeItemToDiagramItem",
        value: function(nativeItem) {
            var _getDiagram26 = (0, _diagram_importer.getDiagram)(),
                NativeShape = _getDiagram26.NativeShape;
            var createMethod = nativeItem instanceof NativeShape ? this._nativeShapeToDiagramShape.bind(this) : this._nativeConnectorToDiagramConnector.bind(this);
            return (0, _extend.extend)({
                id: nativeItem.id
            }, createMethod(nativeItem))
        }
    }, {
        key: "_nativeShapeToDiagramShape",
        value: function(nativeShape) {
            return {
                dataItem: this._nodesOption && this._nodesOption.findItem(nativeShape.key),
                text: nativeShape.text,
                type: nativeShape.type
            }
        }
    }, {
        key: "_nativeConnectorToDiagramConnector",
        value: function(nativeConnector) {
            return {
                dataItem: this._edgesOption && this._edgesOption.findItem(nativeConnector.key),
                texts: nativeConnector.texts,
                fromKey: nativeConnector.fromKey,
                toKey: nativeConnector.toKey
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            if (this.optionsUpdateBar.isUpdateLocked()) {
                return
            }
            this.optionsUpdateBar.beginUpdate();
            try {
                this._optionChangedCore(args)
            } finally {
                this.optionsUpdateBar.endUpdate()
            }
        }
    }, {
        key: "_optionChangedCore",
        value: function(args) {
            switch (args.name) {
                case "readOnly":
                case "disabled":
                    this._updateReadOnlyState();
                    break;
                case "zoomLevel":
                    if ("zoomLevel" === args.fullName || "zoomLevel.items" === args.fullName) {
                        this._updateZoomLevelItemsState()
                    }
                    if ("zoomLevel" === args.fullName || "zoomLevel.value" === args.fullName) {
                        this._updateZoomLevelState()
                    }
                    break;
                case "autoZoom":
                    this._updateAutoZoomState();
                    break;
                case "simpleView":
                    this._updateSimpleViewState();
                    break;
                case "fullScreen":
                    this._updateFullscreenState();
                    break;
                case "showGrid":
                    this._updateShowGridState();
                    break;
                case "snapToGrid":
                    this._updateSnapToGridState();
                    break;
                case "gridSize":
                    if ("gridSize" === args.fullName || "gridSize.items" === args.fullName) {
                        this._updateGridSizeItemsState()
                    }
                    if ("gridSize" === args.fullName || "gridSize.value" === args.fullName) {
                        this._updateGridSizeState()
                    }
                    break;
                case "viewUnits":
                    this._updateViewUnitsState();
                    break;
                case "units":
                    this._updateUnitsState();
                    break;
                case "pageSize":
                    if ("pageSize" === args.fullName || "pageSize.items" === args.fullName) {
                        this._updatePageSizeItemsState()
                    }
                    if ("pageSize" === args.fullName || "pageSize.width" === args.fullName || "pageSize.height" === args.fullName) {
                        this._updatePageSizeState()
                    }
                    break;
                case "pageOrientation":
                    this._updatePageOrientationState();
                    break;
                case "pageColor":
                    this._updatePageColorState();
                    break;
                case "nodes":
                    if ("nodes.autoLayout" === args.fullName) {
                        this._refreshDataSources()
                    } else {
                        this._refreshNodesDataSource()
                    }
                    break;
                case "edges":
                    this._refreshEdgesDataSource();
                    break;
                case "customShapes":
                    this._updateCustomShapes(args.value, args.previousValue);
                    this._invalidate();
                    break;
                case "contextMenu":
                    if ("contextMenu.commands" === args.fullName) {
                        this._invalidateContextMenuCommands()
                    } else {
                        this._invalidate()
                    }
                    break;
                case "propertiesPanel":
                    if ("propertiesPanel.groups" === args.name) {
                        this._invalidatePropertiesPanelGroups()
                    } else {
                        this._invalidate()
                    }
                    break;
                case "toolbox":
                    if ("toolbox.groups" === args.fullName) {
                        this._invalidateToolboxGroups()
                    } else {
                        this._invalidate()
                    }
                    break;
                case "toolbar":
                    if ("toolbar.commands" === args.fullName) {
                        this._invalidateToolbarCommands()
                    } else {
                        this._invalidate()
                    }
                    break;
                case "onDataChanged":
                    this._createDataChangeAction();
                    break;
                case "onItemClick":
                    this._createItemClickAction();
                    break;
                case "onItemDblClick":
                    this._createItemDblClickAction();
                    break;
                case "onSelectionChanged":
                    this._createSelectionChangedAction();
                    break;
                case "export":
                    if (this._toolbarInstance) {
                        this._toolbarInstance.option("export", args.value)
                    }
                    break;
                default:
                    _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return Diagram
}(_ui2.default);
(0, _component_registrator2.default)("dxDiagram", Diagram);
module.exports = Diagram;
