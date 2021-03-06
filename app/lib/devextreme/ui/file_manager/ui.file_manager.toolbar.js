/**
 * DevExtreme (ui/file_manager/ui.file_manager.toolbar.js)
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
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _toolbar = require("../toolbar");
var _toolbar2 = _interopRequireDefault(_toolbar);

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
var FILE_MANAGER_TOOLBAR_CLASS = "dx-filemanager-toolbar";
var FILE_MANAGER_GENERAL_TOOLBAR_CLASS = "dx-filemanager-general-toolbar";
var FILE_MANAGER_FILE_TOOLBAR_CLASS = "dx-filemanager-file-toolbar";
var FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-separator-item";
var FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-viewmode-item";
var FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-has-large-icon";
var DEFAULT_ITEM_CONFIGS = {
    showNavPane: {
        location: "before"
    },
    create: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    upload: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    refresh: {
        location: "after",
        showText: "inMenu",
        cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    viewSwitcher: {
        location: "after"
    },
    download: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    move: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    copy: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    rename: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    "delete": {
        location: "before",
        compactMode: {
            showText: "inMenu"
        }
    },
    clear: {
        location: "after",
        locateInMenu: "never",
        compactMode: {
            showText: "inMenu"
        }
    },
    separator: {
        location: "before"
    }
};
var ALWAYS_VISIBLE_TOOLBAR_ITEMS = ["separator", "viewSwitcher"];
var REFRESH_ICON_MAP = {
    "default": "dx-filemanager-i dx-filemanager-i-refresh",
    progress: "dx-filemanager-i dx-filemanager-i-progress",
    success: "dx-filemanager-i dx-filemanager-i-done",
    error: "dx-filemanager-i dx-filemanager-i-danger"
};
var FileManagerToolbar = function(_Widget) {
    _inherits(FileManagerToolbar, _Widget);

    function FileManagerToolbar() {
        _classCallCheck(this, FileManagerToolbar);
        return _possibleConstructorReturn(this, (FileManagerToolbar.__proto__ || Object.getPrototypeOf(FileManagerToolbar)).apply(this, arguments))
    }
    _createClass(FileManagerToolbar, [{
        key: "_initMarkup",
        value: function() {
            this._commandManager = this.option("commandManager");
            this._generalToolbarVisible = true;
            this._generalToolbar = this._createToolbar(this.option("generalItems"));
            this._fileToolbar = this._createToolbar(this.option("fileItems"), true);
            this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + " " + FILE_MANAGER_GENERAL_TOOLBAR_CLASS)
        }
    }, {
        key: "_render",
        value: function() {
            _get(FileManagerToolbar.prototype.__proto__ || Object.getPrototypeOf(FileManagerToolbar.prototype), "_render", this).call(this);
            var toolbar = this._getVisibleToolbar();
            this._checkCompactMode(toolbar)
        }
    }, {
        key: "_dimensionChanged",
        value: function(dimension) {
            if (!dimension || "height" !== dimension) {
                var toolbar = this._getVisibleToolbar();
                this._checkCompactMode(toolbar)
            }
        }
    }, {
        key: "_getVisibleToolbar",
        value: function() {
            return this._generalToolbarVisible ? this._generalToolbar : this._fileToolbar
        }
    }, {
        key: "_createToolbar",
        value: function(items, hidden) {
            var toolbarItems = this._getPreparedItems(items);
            var $toolbar = (0, _renderer2.default)("<div>").appendTo(this.$element());
            var result = this._createComponent($toolbar, _toolbar2.default, {
                items: toolbarItems,
                visible: !hidden
            });
            result.compactMode = false;
            return result
        }
    }, {
        key: "_getPreparedItems",
        value: function(items) {
            var _this2 = this;
            var groupHasItems = false;
            return items.map(function(item) {
                var commandName = (0, _type.isString)(item) ? item : item.name;
                var preparedItem = _this2._configureItemByCommandName(commandName, item);
                if ("separator" === commandName) {
                    preparedItem.visible = groupHasItems;
                    groupHasItems = false
                } else {
                    preparedItem.available = _this2._isToolbarItemAvailable(preparedItem);
                    var itemVisible = preparedItem.available;
                    preparedItem.visible = itemVisible;
                    groupHasItems = groupHasItems || itemVisible
                }
                return preparedItem
            })
        }
    }, {
        key: "_configureItemByCommandName",
        value: function(commandName, item) {
            var result = {};
            var command = this._commandManager.getCommandByName(commandName);
            if (command) {
                result = this._createCommandItem(command)
            }
            switch (commandName) {
                case "separator":
                    result = this._createSeparatorItem();
                    break;
                case "viewSwitcher":
                    result = this._createViewModeItem()
            }
            if (this._isDefaultItem(commandName)) {
                var defaultConfig = DEFAULT_ITEM_CONFIGS[commandName];
                (0, _extend.extend)(result, defaultConfig);
                this._extendAttributes(result, item, ["visible", "location", "locateInMenu"]);
                if (!(0, _type.isDefined)(item.visible)) {
                    result._autoHide = true
                } else {
                    this._extendAttributes(result, item, ["disabled"])
                }
                this._extendAttributes(result.options, item, ["text", "icon"])
            } else {
                (0, _extend.extend)(result, item);
                if (!result.widget) {
                    result.widget = "dxButton"
                }
            }
            if (commandName && !result.name) {
                (0, _extend.extend)(result, {
                    name: commandName
                })
            }
            if ("dxButton" === result.widget) {
                (0, _extend.extend)(true, result, {
                    options: {
                        stylingMode: "text"
                    }
                })
            }
            if ("dxSelectBox" === result.widget) {
                (0, _extend.extend)(true, result, {
                    options: {
                        stylingMode: "filled"
                    }
                })
            }
            return result
        }
    }, {
        key: "_extendAttributes",
        value: function(targetObject, sourceObject, objectKeysArray) {
            objectKeysArray.forEach(function(objectKey) {
                (0, _extend.extend)(targetObject, sourceObject[objectKey] ? _defineProperty({}, objectKey, sourceObject[objectKey]) : {})
            })
        }
    }, {
        key: "_isDefaultItem",
        value: function(commandName) {
            return !!DEFAULT_ITEM_CONFIGS[commandName]
        }
    }, {
        key: "_createCommandItem",
        value: function(command) {
            var _this3 = this;
            return {
                widget: "dxButton",
                options: {
                    text: command.text,
                    commandText: command.text,
                    icon: command.icon,
                    stylingMode: "text",
                    onClick: function(e) {
                        return _this3._executeCommand(command)
                    }
                }
            }
        }
    }, {
        key: "_createSeparatorItem",
        value: function() {
            return {
                template: function(data, index, element) {
                    (0, _renderer2.default)(element).addClass(FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS)
                }
            }
        }
    }, {
        key: "_createViewModeItem",
        value: function() {
            var _this4 = this;
            var commandItems = ["thumbnails", "details"].map(function(name) {
                var _commandManager$getCo = _this4._commandManager.getCommandByName(name),
                    text = _commandManager$getCo.text;
                return {
                    name: name,
                    text: text
                }
            });
            var selectedIndex = "thumbnails" === this.option("itemViewMode") ? 0 : 1;
            return {
                cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
                widget: "dxSelectBox",
                options: {
                    items: commandItems,
                    value: commandItems[selectedIndex],
                    displayExpr: "text",
                    stylingMode: "filled",
                    onValueChanged: function(e) {
                        return _this4._executeCommand(e.value.name)
                    }
                }
            }
        }
    }, {
        key: "_checkCompactMode",
        value: function(toolbar) {
            if (toolbar.compactMode) {
                this._toggleCompactMode(toolbar, false)
            }
            var toolbarWidth = toolbar.$element().width();
            var itemsWidth = toolbar._getItemsWidth();
            var useCompactMode = toolbarWidth < itemsWidth;
            if (toolbar.compactMode !== useCompactMode) {
                if (!toolbar.compactMode) {
                    this._toggleCompactMode(toolbar, useCompactMode)
                }
                toolbar.compactMode = useCompactMode
            } else {
                if (toolbar.compactMode) {
                    this._toggleCompactMode(toolbar, true)
                }
            }
        }
    }, {
        key: "_toggleCompactMode",
        value: function(toolbar, useCompactMode) {
            var _this5 = this;
            toolbar.beginUpdate();
            var items = toolbar.option("items");
            items.forEach(function(item, index) {
                if (item.compactMode) {
                    var optionsSource = null;
                    if (useCompactMode) {
                        item.saved = _this5._getCompactModeOptions(item, item.available);
                        optionsSource = item.compactMode
                    } else {
                        optionsSource = item.saved
                    }
                    var options = _this5._getCompactModeOptions(optionsSource, item.available);
                    toolbar.option("items[" + index + "]", options)
                }
            });
            toolbar.endUpdate()
        }
    }, {
        key: "_getCompactModeOptions",
        value: function(_ref2, available) {
            var showText = _ref2.showText,
                locateInMenu = _ref2.locateInMenu;
            return {
                visible: available,
                showText: (0, _common.ensureDefined)(showText, "always"),
                locateInMenu: (0, _common.ensureDefined)(locateInMenu, "never")
            }
        }
    }, {
        key: "_ensureAvailableCommandsVisible",
        value: function(toolbar, fileItems) {
            var _this6 = this;
            toolbar.beginUpdate();
            var groupHasItems = false;
            var items = toolbar.option("items");
            items.forEach(function(item, index) {
                var itemVisible = item.available;
                var showItem = false;
                if ("separator" === item.name) {
                    showItem = groupHasItems;
                    groupHasItems = false
                } else {
                    item.available = _this6._isToolbarItemAvailable(item, fileItems);
                    showItem = item.available;
                    groupHasItems = groupHasItems || showItem
                }
                if (showItem !== itemVisible) {
                    var optionName = "items[" + index + "].visible";
                    toolbar.option(optionName, showItem)
                }
            });
            toolbar.endUpdate()
        }
    }, {
        key: "_fileToolbarHasEffectiveItems",
        value: function(fileItems) {
            var _this7 = this;
            var items = this._fileToolbar.option("items");
            return items.some(function(_ref3) {
                var name = _ref3.name;
                return "clear" !== name && "refresh" !== name && _this7._commandManager.isCommandAvailable(name, fileItems)
            })
        }
    }, {
        key: "_executeCommand",
        value: function(command) {
            this._commandManager.executeCommand(command)
        }
    }, {
        key: "_isToolbarItemAvailable",
        value: function(toolbarItem, fileItems) {
            if (!this._isDefaultItem(toolbarItem.name) || !toolbarItem._autoHide) {
                return (0, _common.ensureDefined)(toolbarItem.visible, true)
            }
            if ("refresh" === toolbarItem.name) {
                return this._generalToolbarVisible || !!this._isRefreshVisibleInFileToolbar
            }
            if (ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(toolbarItem.name) > -1) {
                return true
            }
            return this._commandManager.isCommandAvailable(toolbarItem.name, fileItems)
        }
    }, {
        key: "_updateItemInToolbar",
        value: function(toolbar, commandName, options) {
            toolbar.beginUpdate();
            var items = toolbar.option("items");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.name === commandName) {
                    toolbar.option("items[" + i + "]", options);
                    break
                }
            }
            toolbar.endUpdate()
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerToolbar.prototype.__proto__ || Object.getPrototypeOf(FileManagerToolbar.prototype), "_getDefaultOptions", this).call(this), {
                commandManager: null,
                generalItems: [],
                fileItems: [],
                itemViewMode: "details"
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "commandManager":
                case "itemViewMode":
                case "generalItems":
                case "fileItems":
                    this.repaint();
                    break;
                default:
                    _get(FileManagerToolbar.prototype.__proto__ || Object.getPrototypeOf(FileManagerToolbar.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "updateRefreshItem",
        value: function(message, status) {
            var generalToolbarOptions = null;
            this._isRefreshVisibleInFileToolbar = false;
            if ("default" === status) {
                generalToolbarOptions = {
                    showText: "inMenu",
                    options: {
                        text: _message2.default.format("dxFileManager-commandRefresh"),
                        icon: REFRESH_ICON_MAP.default
                    }
                }
            } else {
                generalToolbarOptions = {
                    showText: "always",
                    options: {
                        text: message,
                        icon: REFRESH_ICON_MAP[status]
                    }
                };
                this._isRefreshVisibleInFileToolbar = true
            }
            var fileToolbarOptions = (0, _extend.extend)({}, generalToolbarOptions, {
                visible: this._isRefreshVisibleInFileToolbar
            });
            this._updateItemInToolbar(this._generalToolbar, "refresh", generalToolbarOptions);
            this._updateItemInToolbar(this._fileToolbar, "refresh", fileToolbarOptions)
        }
    }, {
        key: "update",
        value: function(fileItems) {
            fileItems = (0, _common.ensureDefined)(fileItems, []);
            var showGeneralToolbar = 0 === fileItems.length || !this._fileToolbarHasEffectiveItems(fileItems);
            if (this._generalToolbarVisible !== showGeneralToolbar) {
                this._generalToolbar.option("visible", showGeneralToolbar);
                this._fileToolbar.option("visible", !showGeneralToolbar);
                this._generalToolbarVisible = showGeneralToolbar;
                this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
                this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar)
            }
            var toolbar = this._getVisibleToolbar();
            this._ensureAvailableCommandsVisible(toolbar, fileItems);
            this._checkCompactMode(toolbar)
        }
    }]);
    return FileManagerToolbar
}(_ui2.default);
module.exports = FileManagerToolbar;
