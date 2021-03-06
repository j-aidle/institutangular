/**
 * DevExtreme (ui/file_manager/ui.file_manager.breadcrumbs.js)
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
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("../../events/utils");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _ui3 = require("../menu/ui.menu");
var _ui4 = _interopRequireDefault(_ui3);

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
var FILE_MANAGER_BREADCRUMBS_CLASS = "dx-filemanager-breadcrumbs";
var FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-parent-folder-item";
var FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-separator-item";
var FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-path-separator-item";
var MENU_ITEMS_CONTAINER_CLASS = "dx-menu-items-container";
var FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE = "dxFileManager_breadcrubms";
var FileManagerBreadcrumbs = function(_Widget) {
    _inherits(FileManagerBreadcrumbs, _Widget);

    function FileManagerBreadcrumbs() {
        _classCallCheck(this, FileManagerBreadcrumbs);
        return _possibleConstructorReturn(this, (FileManagerBreadcrumbs.__proto__ || Object.getPrototypeOf(FileManagerBreadcrumbs)).apply(this, arguments))
    }
    _createClass(FileManagerBreadcrumbs, [{
        key: "_init",
        value: function() {
            _get(FileManagerBreadcrumbs.prototype.__proto__ || Object.getPrototypeOf(FileManagerBreadcrumbs.prototype), "_init", this).call(this);
            this._currentDirectory = null
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(FileManagerBreadcrumbs.prototype.__proto__ || Object.getPrototypeOf(FileManagerBreadcrumbs.prototype), "_initMarkup", this).call(this);
            this._initActions();
            if (this._currentDirectory) {
                this._renderMenu()
            }
            this.$element().addClass(FILE_MANAGER_BREADCRUMBS_CLASS)
        }
    }, {
        key: "setCurrentDirectory",
        value: function(directory) {
            if (!this._areDirsEqual(this._currentDirectory, directory)) {
                this._currentDirectory = directory;
                this.repaint()
            }
        }
    }, {
        key: "_renderMenu",
        value: function() {
            var $menu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._menu = this._createComponent($menu, _ui4.default, {
                dataSource: this._getMenuItems(),
                onItemClick: this._onItemClick.bind(this),
                onItemRendered: this._onItemRendered.bind(this)
            });
            var clickEvent = (0, _utils.addNamespace)("click", FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE);
            _events_engine2.default.on($menu, clickEvent, this._onClick.bind(this))
        }
    }, {
        key: "_getMenuItems",
        value: function() {
            var dirLine = this._getParentDirsLine();
            var result = [{
                icon: "arrowup",
                directory: this._currentDirectory.parentDirectory,
                isPathItem: true,
                cssClass: FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS
            }, {
                cssClass: FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS
            }];
            dirLine.forEach(function(dir, index) {
                result.push({
                    text: dir.fileItem.name,
                    directory: dir,
                    isPathItem: true
                });
                if (index !== dirLine.length - 1) {
                    result.push({
                        icon: "spinnext",
                        cssClass: FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS
                    })
                }
            });
            return result
        }
    }, {
        key: "_onItemClick",
        value: function(_ref) {
            var itemData = _ref.itemData;
            if (!itemData.isPathItem) {
                return
            }
            var newDir = itemData.directory;
            if (!this._areDirsEqual(newDir, this._currentDirectory)) {
                this._raiseCurrentDirectoryChanged(newDir)
            }
        }
    }, {
        key: "_onClick",
        value: function(_ref2) {
            var target = _ref2.target;
            var $item = (0, _renderer2.default)(target).closest("." + MENU_ITEMS_CONTAINER_CLASS);
            if (0 === $item.length) {
                this._raiseOutsideClick()
            }
        }
    }, {
        key: "_onItemRendered",
        value: function(_ref3) {
            var itemElement = _ref3.itemElement,
                itemData = _ref3.itemData;
            if (itemData.cssClass) {
                (0, _renderer2.default)(itemElement).addClass(itemData.cssClass)
            }
        }
    }, {
        key: "_getParentDirsLine",
        value: function() {
            var currentDirectory = this._currentDirectory;
            var result = [];
            while (currentDirectory) {
                result.unshift(currentDirectory);
                currentDirectory = currentDirectory.parentDirectory
            }
            return result
        }
    }, {
        key: "_areDirsEqual",
        value: function(dir1, dir2) {
            return dir1 && dir2 && dir1 === dir2 && dir1.fileItem.key === dir2.fileItem.key
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onCurrentDirectoryChanging: this._createActionByOption("onCurrentDirectoryChanging"),
                onOutsideClick: this._createActionByOption("onOutsideClick")
            }
        }
    }, {
        key: "_raiseCurrentDirectoryChanged",
        value: function(currentDirectory) {
            this._actions.onCurrentDirectoryChanging({
                currentDirectory: currentDirectory
            })
        }
    }, {
        key: "_raiseOutsideClick",
        value: function() {
            this._actions.onOutsideClick()
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerBreadcrumbs.prototype.__proto__ || Object.getPrototypeOf(FileManagerBreadcrumbs.prototype), "_getDefaultOptions", this).call(this), {
                rootFolderDisplayName: "Files",
                onCurrentDirectoryChanging: null,
                onOutsideClick: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "rootFolderDisplayName":
                    this.repaint();
                    break;
                case "onCurrentDirectoryChanging":
                case "onOutsideClick":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerBreadcrumbs.prototype.__proto__ || Object.getPrototypeOf(FileManagerBreadcrumbs.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return FileManagerBreadcrumbs
}(_ui2.default);
module.exports = FileManagerBreadcrumbs;
