/**
 * DevExtreme (ui/file_manager/ui.file_manager.files_tree_view.js)
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
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _extend = require("../../core/utils/extend");
var _icon = require("../../core/utils/icon");
var _common = require("../../core/utils/common");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _uiTree_view = require("../tree_view/ui.tree_view.search");
var _uiTree_view2 = _interopRequireDefault(_uiTree_view);
var _uiFile_manager = require("./ui.file_manager.file_actions_button");
var _uiFile_manager2 = _interopRequireDefault(_uiFile_manager);

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
var FILE_MANAGER_DIRS_TREE_CLASS = "dx-filemanager-dirs-tree";
var FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS = "dx-filemanager-focused-item";
var FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS = "dx-filemanager-dirs-tree-item-text";
var TREE_VIEW_ITEM_CLASS = "dx-treeview-item";
var FileManagerFilesTreeView = function(_Widget) {
    _inherits(FileManagerFilesTreeView, _Widget);

    function FileManagerFilesTreeView() {
        _classCallCheck(this, FileManagerFilesTreeView);
        return _possibleConstructorReturn(this, (FileManagerFilesTreeView.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView)).apply(this, arguments))
    }
    _createClass(FileManagerFilesTreeView, [{
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            this._getCurrentDirectory = this.option("getCurrentDirectory");
            this._createFileActionsButton = _common.noop;
            this._storeExpandedState = this.option("storeExpandedState") || false;
            var $treeView = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_DIRS_TREE_CLASS).appendTo(this.$element());
            var treeViewOptions = {
                dataStructure: "plain",
                rootValue: "",
                createChildren: this._onFilesTreeViewCreateSubDirectories.bind(this),
                itemTemplate: this._createFilesTreeViewItemTemplate.bind(this),
                keyExpr: "fileItem.key",
                parentIdExpr: "parentDirectory.fileItem.key",
                displayExpr: "fileItem.name",
                hasItemsExpr: "fileItem.hasSubDirs",
                onItemClick: this._createActionByOption("onDirectoryClick"),
                onItemExpanded: function(e) {
                    return _this2._onFilesTreeViewItemExpanded(e)
                },
                onItemCollapsed: function(e) {
                    return _this2._onFilesTreeViewItemCollapsed(e)
                },
                onItemRendered: function(e) {
                    return _this2._onFilesTreeViewItemRendered(e)
                }
            };
            if (this._contextMenu) {
                this._contextMenu.option("onContextMenuHidden", function() {
                    return _this2._onContextMenuHidden()
                });
                treeViewOptions.onItemContextMenu = function(e) {
                    return _this2._onFilesTreeViewItemContextMenu(e)
                };
                this._createFileActionsButton = function(element, options) {
                    return _this2._createComponent(element, _uiFile_manager2.default, options)
                }
            }
            this._filesTreeView = this._createComponent($treeView, _uiTree_view2.default, treeViewOptions);
            _events_engine2.default.on($treeView, "click", treeViewOptions.onItemClick)
        }
    }, {
        key: "_render",
        value: function() {
            _get(FileManagerFilesTreeView.prototype.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView.prototype), "_render", this).call(this);
            var that = this;
            setTimeout(function() {
                that._updateFocusedElement()
            })
        }
    }, {
        key: "_onFilesTreeViewCreateSubDirectories",
        value: function(rootItem) {
            var getDirectories = this.option("getDirectories");
            var directoryInfo = rootItem && rootItem.itemData || null;
            return getDirectories && getDirectories(directoryInfo)
        }
    }, {
        key: "_onFilesTreeViewItemRendered",
        value: function(_ref) {
            var itemData = _ref.itemData;
            var currentDirectory = this._getCurrentDirectory();
            if (currentDirectory && currentDirectory.fileItem.equals(itemData.fileItem)) {
                this._updateFocusedElement()
            }
        }
    }, {
        key: "_onFilesTreeViewItemExpanded",
        value: function(_ref2) {
            var itemData = _ref2.itemData;
            if (this._storeExpandedState) {
                itemData.expanded = true
            }
        }
    }, {
        key: "_onFilesTreeViewItemCollapsed",
        value: function(_ref3) {
            var itemData = _ref3.itemData;
            if (this._storeExpandedState) {
                itemData.expanded = false
            }
        }
    }, {
        key: "_createFilesTreeViewItemTemplate",
        value: function(itemData, itemIndex, itemElement) {
            var _this3 = this;
            var $itemElement = (0, _renderer2.default)(itemElement);
            var $itemWrapper = $itemElement.closest(this._filesTreeViewItemSelector);
            $itemWrapper.data("item", itemData);
            var $image = (0, _icon.getImageContainer)(itemData.icon);
            var $text = (0, _renderer2.default)("<span>").text(itemData.fileItem.name).addClass(FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS);
            var $button = (0, _renderer2.default)("<div>");
            $itemElement.append($image, $text, $button);
            this._createFileActionsButton($button, {
                onClick: function(e) {
                    return _this3._onFileItemActionButtonClick(e)
                }
            })
        }
    }, {
        key: "_onFilesTreeViewItemContextMenu",
        value: function(_ref4) {
            var itemElement = _ref4.itemElement,
                event = _ref4.event;
            event.preventDefault();
            var itemData = (0, _renderer2.default)(itemElement).data("item");
            this._contextMenu.showAt([itemData], itemElement, event)
        }
    }, {
        key: "_onFileItemActionButtonClick",
        value: function(_ref5) {
            var component = _ref5.component,
                element = _ref5.element,
                event = _ref5.event;
            event.stopPropagation();
            var $item = component.$element().closest(this._filesTreeViewItemSelector);
            var item = $item.data("item");
            this._contextMenu.showAt([item], element);
            this._activeFileActionsButton = component;
            this._activeFileActionsButton.setActive(true)
        }
    }, {
        key: "_onContextMenuHidden",
        value: function() {
            if (this._activeFileActionsButton) {
                this._activeFileActionsButton.setActive(false)
            }
        }
    }, {
        key: "_updateFocusedElement",
        value: function() {
            var directoryInfo = this._getCurrentDirectory();
            var $element = this._getItemElementByKey(directoryInfo.fileItem.key);
            if (this._$focusedElement) {
                this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, false)
            }
            this._$focusedElement = $element || (0, _renderer2.default)();
            this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, true)
        }
    }, {
        key: "_getItemElementByKey",
        value: function(key) {
            var node = this._filesTreeView && this._filesTreeView._dataAdapter.getNodeByKey(key);
            if (node) {
                var $node = this._filesTreeView._getNodeElement(node);
                if ($node) {
                    return $node.children(this._filesTreeViewItemSelector)
                }
            }
            return null
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerFilesTreeView.prototype.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView.prototype), "_getDefaultOptions", this).call(this), {
                storeExpandedState: false,
                initialFolder: null,
                contextMenu: null,
                getItems: null,
                getCurrentDirectory: null,
                onDirectoryClick: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "storeExpandedState":
                    this._storeExpandedState = this.option(name);
                    break;
                case "getItems":
                case "rootFolderDisplayName":
                case "initialFolder":
                case "contextMenu":
                    this.repaint();
                    break;
                case "getCurrentDirectory":
                    this.getCurrentDirectory = this.option(name);
                    break;
                case "onDirectoryClick":
                    this._filesTreeView.option("onItemClick", this._createActionByOption("onDirectoryClick"));
                    break;
                default:
                    _get(FileManagerFilesTreeView.prototype.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "expandDirectory",
        value: function(directoryInfo) {
            directoryInfo && this._filesTreeView.expandItem(directoryInfo.fileItem.key)
        }
    }, {
        key: "refresh",
        value: function() {
            this._$focusedElement = null;
            this._filesTreeView.option("dataSource", [])
        }
    }, {
        key: "updateCurrentDirectory",
        value: function() {
            this._updateFocusedElement();
            this._updateExpandedStateToCurrentDirectory()
        }
    }, {
        key: "_updateExpandedStateToCurrentDirectory",
        value: function() {
            var dirLine = [];
            for (var dirInfo = this._getCurrentDirectory(); dirInfo; dirInfo = dirInfo.parentDirectory) {
                dirLine.unshift(dirInfo)
            }
            for (var i = 0; i < dirLine.length; i++) {
                if (dirLine[i].items.length > 0) {
                    this.expandDirectory(dirLine[i])
                }
            }
        }
    }, {
        key: "_filesTreeViewItemSelector",
        get: function() {
            return "." + TREE_VIEW_ITEM_CLASS
        }
    }, {
        key: "_contextMenu",
        get: function() {
            return this.option("contextMenu")
        }
    }]);
    return FileManagerFilesTreeView
}(_ui2.default);
module.exports = FileManagerFilesTreeView;
