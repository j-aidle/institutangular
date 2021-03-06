/**
 * DevExtreme (ui/diagram/ui.diagram.contextmenu.js)
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
var _context_menu = require("../context_menu");
var _context_menu2 = _interopRequireDefault(_context_menu);
var _uiDiagram = require("./ui.diagram.commands");
var _uiDiagram2 = _interopRequireDefault(_uiDiagram);
var _diagram_bar = require("./diagram_bar");
var _diagram_bar2 = _interopRequireDefault(_diagram_bar);
var _diagram_importer = require("./diagram_importer");

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
var DIAGRAM_TOUCHBAR_CLASS = "dx-diagram-touchbar";
var DIAGRAM_TOUCHBAR_TARGET_CLASS = "dx-diagram-touchbar-target";
var DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH = 800;
var DIAGRAM_TOUCHBAR_Y_OFFSET = 32;
var DiagramContextMenu = function(_Widget) {
    _inherits(DiagramContextMenu, _Widget);

    function DiagramContextMenu() {
        _classCallCheck(this, DiagramContextMenu);
        return _possibleConstructorReturn(this, (DiagramContextMenu.__proto__ || Object.getPrototypeOf(DiagramContextMenu)).apply(this, arguments))
    }
    _createClass(DiagramContextMenu, [{
        key: "_init",
        value: function() {
            _get(DiagramContextMenu.prototype.__proto__ || Object.getPrototypeOf(DiagramContextMenu.prototype), "_init", this).call(this);
            this._createOnVisibleChangedAction();
            this._createOnItemClickAction();
            this.bar = new ContextMenuBar(this);
            this._tempState = void 0;
            this._commands = [];
            this._commandToIndexMap = {}
        }
    }, {
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            _get(DiagramContextMenu.prototype.__proto__ || Object.getPrototypeOf(DiagramContextMenu.prototype), "_initMarkup", this).call(this);
            this._commands = _uiDiagram2.default.getContextMenuCommands(this.option("commands"));
            this._commandToIndexMap = {};
            this._commands.forEach(function(item, index) {
                return _this2._commandToIndexMap[item.command] = index
            });
            this._$contextMenuTargetElement = (0, _renderer2.default)("<div>").addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS).appendTo(this.$element());
            var $contextMenu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            var _getDiagram = (0, _diagram_importer.getDiagram)(),
                Browser = _getDiagram.Browser;
            this._contextMenuInstance = this._createComponent($contextMenu, _context_menu2.default, {
                cssClass: Browser.TouchUI ? DIAGRAM_TOUCHBAR_CLASS : "",
                items: this._getItems(this._commands),
                focusStateEnabled: false,
                position: Browser.TouchUI ? {
                    my: {
                        x: "center",
                        y: "bottom"
                    },
                    at: {
                        x: "center",
                        y: "top"
                    },
                    of: this._$contextMenuTargetElement
                } : {},
                onItemClick: function(_ref) {
                    var itemData = _ref.itemData;
                    return _this2._onItemClick(itemData)
                },
                onShowing: function(e) {
                    if (true === _this2._tempState) {
                        return
                    }
                    _this2._tempState = true;
                    _this2._onVisibleChangedAction({
                        visible: true,
                        component: _this2
                    });
                    _this2._contextMenuInstance.option("items", _this2._getItems(_this2._commands, true));
                    delete _this2._tempState
                },
                onHiding: function(e) {
                    _this2._tempState = false;
                    _this2._onVisibleChangedAction({
                        visible: false,
                        component: _this2
                    });
                    delete _this2._tempState
                }
            })
        }
    }, {
        key: "_getItems",
        value: function(commands, onlyVisible) {
            var items = [];
            var beginGroup = false;
            commands.forEach(function(command) {
                if ("separator" === command.widget) {
                    beginGroup = true
                } else {
                    if (command.visible || !onlyVisible) {
                        items.push({
                            command: command.command,
                            text: command.text,
                            icon: command.icon,
                            getParameter: command.getParameter,
                            beginGroup: beginGroup
                        });
                        beginGroup = false
                    }
                }
            });
            return items
        }
    }, {
        key: "_show",
        value: function(x, y, selection) {
            this.clickPosition = {
                x: x,
                y: y
            };
            var _getDiagram2 = (0, _diagram_importer.getDiagram)(),
                Browser = _getDiagram2.Browser;
            if (Browser.TouchUI) {
                this._contextMenuInstance.hide();
                this._$contextMenuTargetElement.show();
                if (!selection) {
                    selection = {
                        x: x,
                        y: y,
                        width: 0,
                        height: 0
                    }
                }
                var widthCorrection = selection.width > DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH ? 0 : (DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH - selection.width) / 2;
                this._$contextMenuTargetElement.css({
                    left: selection.x - widthCorrection,
                    top: selection.y - DIAGRAM_TOUCHBAR_Y_OFFSET,
                    width: selection.width + 2 * widthCorrection,
                    height: selection.height + 2 * DIAGRAM_TOUCHBAR_Y_OFFSET
                });
                this._contextMenuInstance.show()
            } else {
                this._contextMenuInstance.hide();
                this._contextMenuInstance.option("position", {
                    offset: x + " " + y
                });
                this._contextMenuInstance.show()
            }
        }
    }, {
        key: "_hide",
        value: function() {
            this._$contextMenuTargetElement.hide();
            this._contextMenuInstance.hide()
        }
    }, {
        key: "_onItemClick",
        value: function(itemData) {
            var processed = false;
            if (this._onItemClickAction) {
                processed = this._onItemClickAction(itemData)
            }
            if (!processed) {
                var parameter = this._getExecCommandParameter(itemData);
                this.bar.raiseBarCommandExecuted(itemData.command, parameter);
                this._contextMenuInstance.hide()
            }
        }
    }, {
        key: "_getExecCommandParameter",
        value: function(itemData) {
            if (itemData.getParameter) {
                return itemData.getParameter(this)
            }
        }
    }, {
        key: "_setItemEnabled",
        value: function(key, enabled) {
            this._setItemVisible(key, enabled)
        }
    }, {
        key: "_setItemVisible",
        value: function(key, visible) {
            if (key in this._commandToIndexMap) {
                var command = this._commands[this._commandToIndexMap[key]];
                if (command) {
                    command.visible = visible
                }
            }
        }
    }, {
        key: "_setEnabled",
        value: function(enabled) {
            this._contextMenuInstance.option("disabled", !enabled)
        }
    }, {
        key: "isVisible",
        value: function() {
            if (void 0 !== this._tempState) {
                return this._tempState
            }
            return !!this._contextMenuInstance.option("visible")
        }
    }, {
        key: "_createOnVisibleChangedAction",
        value: function() {
            this._onVisibleChangedAction = this._createActionByOption("onVisibleChanged")
        }
    }, {
        key: "_createOnItemClickAction",
        value: function() {
            this._onItemClickAction = this._createActionByOption("onItemClick")
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "onVisibleChanged":
                    this._createOnVisibleChangedAction();
                    break;
                case "onItemClick":
                    this._createOnItemClickAction();
                    break;
                case "commands":
                    this._invalidate();
                    break;
                default:
                    _get(DiagramContextMenu.prototype.__proto__ || Object.getPrototypeOf(DiagramContextMenu.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return DiagramContextMenu
}(_ui2.default);
var ContextMenuBar = function(_DiagramBar) {
    _inherits(ContextMenuBar, _DiagramBar);

    function ContextMenuBar() {
        _classCallCheck(this, ContextMenuBar);
        return _possibleConstructorReturn(this, (ContextMenuBar.__proto__ || Object.getPrototypeOf(ContextMenuBar)).apply(this, arguments))
    }
    _createClass(ContextMenuBar, [{
        key: "getCommandKeys",
        value: function() {
            return _uiDiagram2.default.getContextMenuCommands().map(function(c) {
                return c.command
            })
        }
    }, {
        key: "setItemEnabled",
        value: function(key, enabled) {
            this._owner._setItemEnabled(key, enabled)
        }
    }, {
        key: "setItemVisible",
        value: function(key, visible) {
            this._owner._setItemVisible(key, visible)
        }
    }, {
        key: "setEnabled",
        value: function(enabled) {
            this._owner._setEnabled(enabled)
        }
    }, {
        key: "isVisible",
        value: function() {
            return this._owner.isVisible()
        }
    }]);
    return ContextMenuBar
}(_diagram_bar2.default);
module.exports = DiagramContextMenu;
