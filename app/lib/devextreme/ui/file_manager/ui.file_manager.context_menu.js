/**
 * DevExtreme (ui/file_manager/ui.file_manager.context_menu.js)
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
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _common = require("../../core/utils/common");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _ui3 = require("../context_menu/ui.context_menu");
var _ui4 = _interopRequireDefault(_ui3);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
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
var FILEMANAGER_CONTEXT_MEMU_CLASS = "dx-filemanager-context-menu";
var DEFAULT_CONTEXT_MENU_ITEMS = {
    create: {},
    upload: {},
    download: {},
    rename: {},
    move: {},
    copy: {},
    "delete": {},
    refresh: {
        beginGroup: true
    }
};
var FileManagerContextMenu = function(_Widget) {
    _inherits(FileManagerContextMenu, _Widget);

    function FileManagerContextMenu() {
        _classCallCheck(this, FileManagerContextMenu);
        return _possibleConstructorReturn(this, (FileManagerContextMenu.__proto__ || Object.getPrototypeOf(FileManagerContextMenu)).apply(this, arguments))
    }
    _createClass(FileManagerContextMenu, [{
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            this._createContextMenuHiddenAction();
            this._isVisible = false;
            var $menu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._contextMenu = this._createComponent($menu, _ui4.default, {
                cssClass: FILEMANAGER_CONTEXT_MEMU_CLASS,
                showEvent: "",
                onItemClick: function(_ref) {
                    var name = _ref.itemData.name;
                    return _this2._onContextMenuItemClick(name)
                },
                onHidden: function() {
                    return _this2._onContextMenuHidden()
                }
            });
            _get(FileManagerContextMenu.prototype.__proto__ || Object.getPrototypeOf(FileManagerContextMenu.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "showAt",
        value: function(fileItems, element, offset) {
            if (this._isVisible) {
                this._raiseContextMenuHidden()
            }
            this._isVisible = true;
            var items = this.createContextMenuItems(fileItems);
            var position = {
                of: element,
                at: "top left",
                my: "top left",
                offset: ""
            };
            if (offset) {
                position.offset = offset.offsetX + " " + offset.offsetY
            } else {
                position.my = "left top";
                position.at = "left bottom"
            }
            this._contextMenu.option({
                dataSource: items,
                target: element,
                position: position
            });
            this._contextMenu.show()
        }
    }, {
        key: "createContextMenuItems",
        value: function(fileItems, contextMenuItems) {
            var _this3 = this;
            this._targetFileItems = fileItems;
            var result = [];
            var itemArray = contextMenuItems || this.option("items");
            itemArray.forEach(function(srcItem) {
                var commandName = (0, _type.isString)(srcItem) ? srcItem : srcItem.name;
                var item = _this3._configureItemByCommandName(commandName, srcItem, fileItems);
                if (_this3._isContextMenuItemAvailable(item, fileItems)) {
                    result.push(item)
                }
            });
            return result
        }
    }, {
        key: "_isContextMenuItemAvailable",
        value: function(menuItem, fileItems) {
            if (!this._isDefaultItem(menuItem.name) || !menuItem._autoHide) {
                return (0, _common.ensureDefined)(menuItem.visible, true)
            }
            return this._commandManager.isCommandAvailable(menuItem.name, fileItems)
        }
    }, {
        key: "_isDefaultItem",
        value: function(commandName) {
            return !!DEFAULT_CONTEXT_MENU_ITEMS[commandName]
        }
    }, {
        key: "_extendAttributes",
        value: function(targetObject, sourceObject, objectKeysArray) {
            objectKeysArray.forEach(function(objectKey) {
                (0, _extend.extend)(targetObject, sourceObject[objectKey] ? _defineProperty({}, objectKey, sourceObject[objectKey]) : {})
            })
        }
    }, {
        key: "_configureItemByCommandName",
        value: function(commandName, item, fileItems) {
            if (!this._isDefaultItem(commandName)) {
                var res = (0, _extend.extend)(true, {}, item);
                if (Array.isArray(item.items)) {
                    res.items = this.createContextMenuItems(fileItems, item.items)
                }
                return res
            }
            var result = this._createMenuItemByCommandName(commandName);
            var defaultConfig = DEFAULT_CONTEXT_MENU_ITEMS[commandName];
            (0, _extend.extend)(result, defaultConfig);
            this._extendAttributes(result, item, ["visible", "beginGroup", "text", "icon"]);
            if (!(0, _type.isDefined)(result.visible)) {
                result._autoHide = true
            } else {
                this._extendAttributes(result, item, ["visible", "disabled"])
            }
            if (commandName && !result.name) {
                (0, _extend.extend)(result, {
                    name: commandName
                })
            }
            return result
        }
    }, {
        key: "_createMenuItemByCommandName",
        value: function(commandName) {
            var _this4 = this;
            var _commandManager$getCo = this._commandManager.getCommandByName(commandName),
                text = _commandManager$getCo.text,
                icon = _commandManager$getCo.icon;
            return {
                name: commandName,
                text: text,
                icon: icon,
                onItemClick: function() {
                    return _this4._onContextMenuItemClick(commandName)
                }
            }
        }
    }, {
        key: "_onContextMenuItemClick",
        value: function(commandName) {
            this._commandManager.executeCommand(commandName, this._targetFileItems)
        }
    }, {
        key: "_createContextMenuHiddenAction",
        value: function() {
            this._contextMenuHiddenAction = this._createActionByOption("onContextMenuHidden")
        }
    }, {
        key: "_onContextMenuHidden",
        value: function() {
            this._isVisible = false;
            this._raiseContextMenuHidden()
        }
    }, {
        key: "_raiseContextMenuHidden",
        value: function() {
            this._contextMenuHiddenAction()
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerContextMenu.prototype.__proto__ || Object.getPrototypeOf(FileManagerContextMenu.prototype), "_getDefaultOptions", this).call(this), {
                commandManager: null,
                onContextMenuHidden: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "commandManager":
                    this.repaint();
                    break;
                case "onContextMenuHidden":
                    this._createContextMenuHiddenAction();
                    break;
                default:
                    _get(FileManagerContextMenu.prototype.__proto__ || Object.getPrototypeOf(FileManagerContextMenu.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_commandManager",
        get: function() {
            return this.option("commandManager")
        }
    }]);
    return FileManagerContextMenu
}(_ui2.default);
module.exports = FileManagerContextMenu;
