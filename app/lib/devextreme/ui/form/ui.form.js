/**
 * DevExtreme (ui/form/ui.form.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _iterator = require("../../core/utils/iterator");
var _array = require("../../core/utils/array");
var _extend = require("../../core/utils/extend");
var _string = require("../../core/utils/string");
var _browser = require("../../core/utils/browser");
var _browser2 = _interopRequireDefault(_browser);
var _dom = require("../../core/utils/dom");
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _window = require("../../core/utils/window");
var _validation_engine = require("../validation_engine");
var _validation_engine2 = _interopRequireDefault(_validation_engine);
var _uiForm = require("./ui.form.layout_manager");
var _uiForm2 = _interopRequireDefault(_uiForm);
var _uiForm3 = require("./ui.form.items_runtime_info");
var _uiForm4 = _interopRequireDefault(_uiForm3);
var _tab_panel = require("../tab_panel");
var _tab_panel2 = _interopRequireDefault(_tab_panel);
var _ui3 = require("../scroll_view/ui.scrollable");
var _ui4 = _interopRequireDefault(_ui3);
var _deferred = require("../../core/utils/deferred");
var _themes = require("../themes");
var _themes2 = _interopRequireDefault(_themes);
var _uiForm5 = require("./ui.form.item_options_actions");
var _uiForm6 = _interopRequireDefault(_uiForm5);
var _uiForm7 = require("./ui.form.utils");
require("../validation_summary");
require("../validation_group");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var FORM_CLASS = "dx-form";
var FIELD_ITEM_CLASS = "dx-field-item";
var FIELD_ITEM_LABEL_TEXT_CLASS = "dx-field-item-label-text";
var FORM_GROUP_CLASS = "dx-form-group";
var FORM_GROUP_CONTENT_CLASS = "dx-form-group-content";
var FORM_GROUP_WITH_CAPTION_CLASS = "dx-form-group-with-caption";
var FORM_GROUP_CAPTION_CLASS = "dx-form-group-caption";
var HIDDEN_LABEL_CLASS = "dx-layout-manager-hidden-label";
var FIELD_ITEM_LABEL_CLASS = "dx-field-item-label";
var FIELD_ITEM_LABEL_CONTENT_CLASS = "dx-field-item-label-content";
var FIELD_ITEM_TAB_CLASS = "dx-field-item-tab";
var FORM_FIELD_ITEM_COL_CLASS = "dx-col-";
var GROUP_COL_COUNT_CLASS = "dx-group-colcount-";
var FIELD_ITEM_CONTENT_CLASS = "dx-field-item-content";
var FORM_VALIDATION_SUMMARY = "dx-form-validation-summary";
var WIDGET_CLASS = "dx-widget";
var FOCUSED_STATE_CLASS = "dx-state-focused";
var ITEM_OPTIONS_FOR_VALIDATION_UPDATING = ["items", "isRequired", "validationRules", "visible"];
var Form = _ui2.default.inherit({
    _init: function() {
        this.callBase();
        this._cachedColCountOptions = [];
        this._itemsRunTimeInfo = new _uiForm4.default;
        this._groupsColCount = [];
        this._attachSyncSubscriptions()
    },
    _initOptions: function(options) {
        if (!("screenByWidth" in options)) {
            options.screenByWidth = _window.defaultScreenFactorFunc
        }
        this.callBase(options)
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            formID: "dx-" + new _guid2.default,
            formData: {},
            colCount: 1,
            screenByWidth: null,
            colCountByScreen: void 0,
            labelLocation: "left",
            readOnly: false,
            onFieldDataChanged: null,
            customizeItem: null,
            onEditorEnterKey: null,
            minColWidth: 200,
            alignItemLabels: true,
            alignItemLabelsInAllGroups: true,
            showColonAfterLabel: true,
            showRequiredMark: true,
            showOptionalMark: false,
            requiredMark: "*",
            optionalMark: _message2.default.format("dxForm-optionalMark"),
            requiredMessage: _message2.default.getFormatter("dxForm-requiredMessage"),
            showValidationSummary: false,
            items: void 0,
            scrollingEnabled: false,
            validationGroup: void 0,
            stylingMode: void 0
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return _themes2.default.isMaterial()
            },
            options: {
                showColonAfterLabel: false,
                labelLocation: "top"
            }
        }])
    },
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            formData: true,
            validationGroup: true
        })
    },
    _getColCount: function($element) {
        var $cols, index = 0,
            isColsExist = true;
        while (isColsExist) {
            $cols = $element.find("." + FORM_FIELD_ITEM_COL_CLASS + index);
            if (!$cols.length) {
                isColsExist = false
            } else {
                index++
            }
        }
        return index
    },
    _createHiddenElement: function(rootLayoutManager) {
        this._$hiddenElement = (0, _renderer2.default)("<div>").addClass(WIDGET_CLASS).addClass(HIDDEN_LABEL_CLASS).appendTo("body");
        var $hiddenLabel = rootLayoutManager._renderLabel({
            text: " ",
            location: this._labelLocation()
        }).appendTo(this._$hiddenElement);
        this._hiddenLabelText = $hiddenLabel.find("." + FIELD_ITEM_LABEL_TEXT_CLASS)[0]
    },
    _removeHiddenElement: function() {
        this._$hiddenElement.remove();
        this._hiddenLabelText = null
    },
    _getLabelWidthByText: function(text) {
        this._hiddenLabelText.innerHTML = text;
        return this._hiddenLabelText.offsetWidth
    },
    _getLabelsSelectorByCol: function(index, options) {
        options = options || {};
        var fieldItemClass = options.inOneColumn ? FIELD_ITEM_CLASS : FORM_FIELD_ITEM_COL_CLASS + index,
            cssExcludeTabbedSelector = options.excludeTabbed ? ":not(." + FIELD_ITEM_TAB_CLASS + ")" : "",
            childLabelContentSelector = "> ." + FIELD_ITEM_LABEL_CLASS + " > ." + FIELD_ITEM_LABEL_CONTENT_CLASS;
        return "." + fieldItemClass + cssExcludeTabbedSelector + childLabelContentSelector
    },
    _getLabelText: function(labelText) {
        var child, i, length = labelText.children.length,
            result = "";
        for (i = 0; i < length; i++) {
            child = labelText.children[i];
            result += !(0, _string.isEmpty)(child.innerText) ? child.innerText : child.innerHTML
        }
        return result
    },
    _applyLabelsWidthByCol: function($container, index, options) {
        var labelWidth, i, $labelTexts = $container.find(this._getLabelsSelectorByCol(index, options)),
            $labelTextsLength = $labelTexts.length,
            maxWidth = 0;
        for (i = 0; i < $labelTextsLength; i++) {
            labelWidth = this._getLabelWidthByText(this._getLabelText($labelTexts[i]));
            if (labelWidth > maxWidth) {
                maxWidth = labelWidth
            }
        }
        for (i = 0; i < $labelTextsLength; i++) {
            $labelTexts[i].style.width = maxWidth + "px"
        }
    },
    _applyLabelsWidth: function($container, excludeTabbed, inOneColumn, colCount) {
        colCount = inOneColumn ? 1 : colCount || this._getColCount($container);
        var i, applyLabelsOptions = {
            excludeTabbed: excludeTabbed,
            inOneColumn: inOneColumn
        };
        for (i = 0; i < colCount; i++) {
            this._applyLabelsWidthByCol($container, i, applyLabelsOptions)
        }
    },
    _getGroupElementsInColumn: function($container, columnIndex, colCount) {
        var cssColCountSelector = (0, _type.isDefined)(colCount) ? "." + GROUP_COL_COUNT_CLASS + colCount : "",
            groupSelector = "." + FORM_FIELD_ITEM_COL_CLASS + columnIndex + " > ." + FIELD_ITEM_CONTENT_CLASS + " > ." + FORM_GROUP_CLASS + cssColCountSelector;
        return $container.find(groupSelector)
    },
    _applyLabelsWidthWithGroups: function($container, colCount, excludeTabbed) {
        var alignItemLabelsInAllGroups = this.option("alignItemLabelsInAllGroups");
        if (alignItemLabelsInAllGroups) {
            this._applyLabelsWidthWithNestedGroups($container, colCount, excludeTabbed)
        } else {
            var i, $groups = this.$element().find("." + FORM_GROUP_CLASS);
            for (i = 0; i < $groups.length; i++) {
                this._applyLabelsWidth($groups.eq(i), excludeTabbed)
            }
        }
    },
    _applyLabelsWidthWithNestedGroups: function($container, colCount, excludeTabbed) {
        var colIndex, groupsColIndex, groupColIndex, $groupsByCol, applyLabelsOptions = {
            excludeTabbed: excludeTabbed
        };
        for (colIndex = 0; colIndex < colCount; colIndex++) {
            $groupsByCol = this._getGroupElementsInColumn($container, colIndex);
            this._applyLabelsWidthByCol($groupsByCol, 0, applyLabelsOptions);
            for (groupsColIndex = 0; groupsColIndex < this._groupsColCount.length; groupsColIndex++) {
                $groupsByCol = this._getGroupElementsInColumn($container, colIndex, this._groupsColCount[groupsColIndex]);
                var groupColCount = this._getColCount($groupsByCol);
                for (groupColIndex = 1; groupColIndex < groupColCount; groupColIndex++) {
                    this._applyLabelsWidthByCol($groupsByCol, groupColIndex, applyLabelsOptions)
                }
            }
        }
    },
    _labelLocation: function() {
        return this.option("labelLocation")
    },
    _alignLabelsInColumn: function(_ref) {
        var layoutManager = _ref.layoutManager,
            inOneColumn = _ref.inOneColumn,
            $container = _ref.$container,
            excludeTabbed = _ref.excludeTabbed,
            items = _ref.items;
        if (!(0, _window.hasWindow)() || "top" === this._labelLocation()) {
            return
        }
        this._createHiddenElement(layoutManager);
        if (inOneColumn) {
            this._applyLabelsWidth($container, excludeTabbed, true)
        } else {
            if (this._checkGrouping(items)) {
                this._applyLabelsWidthWithGroups($container, layoutManager._getColCount(), excludeTabbed)
            } else {
                this._applyLabelsWidth($container, excludeTabbed, false, layoutManager._getColCount())
            }
        }
        this._removeHiddenElement()
    },
    _prepareFormData: function() {
        if (!(0, _type.isDefined)(this.option("formData"))) {
            this.option("formData", {})
        }
    },
    _initMarkup: function() {
        _validation_engine2.default.addGroup(this._getValidationGroup());
        this._clearCachedInstances();
        this._prepareFormData();
        this.$element().addClass(FORM_CLASS);
        this.callBase();
        this.setAria("role", "form", this.$element());
        if (this.option("scrollingEnabled")) {
            this._renderScrollable()
        }
        this._renderLayout();
        this._renderValidationSummary();
        this._lastMarkupScreenFactor = this._targetScreenFactor || this._getCurrentScreenFactor()
    },
    _getCurrentScreenFactor: function() {
        return (0, _window.hasWindow)() ? (0, _window.getCurrentScreenFactor)(this.option("screenByWidth")) : "lg"
    },
    _clearCachedInstances: function() {
        this._itemsRunTimeInfo.clear();
        this._cachedLayoutManagers = []
    },
    _alignLabels: function(layoutManager, inOneColumn) {
        this._alignLabelsInColumn({
            $container: this.$element(),
            layoutManager: layoutManager,
            excludeTabbed: true,
            items: this.option("items"),
            inOneColumn: inOneColumn
        })
    },
    _clean: function() {
        this.callBase();
        this._groupsColCount = [];
        this._cachedColCountOptions = [];
        this._lastMarkupScreenFactor = void 0
    },
    _renderScrollable: function() {
        var useNativeScrolling = this.option("useNativeScrolling");
        this._scrollable = new _ui4.default(this.$element(), {
            useNative: !!useNativeScrolling,
            useSimulatedScrollbar: !useNativeScrolling,
            useKeyboard: false,
            direction: "both",
            bounceEnabled: false
        })
    },
    _getContent: function() {
        return this.option("scrollingEnabled") ? this._scrollable.$content() : this.$element()
    },
    _renderValidationSummary: function() {
        var $validationSummary = this.$element().find("." + FORM_VALIDATION_SUMMARY);
        if ($validationSummary.length > 0) {
            $validationSummary.remove()
        }
        if (this.option("showValidationSummary")) {
            var _$validationSummary = (0, _renderer2.default)("<div>").addClass(FORM_VALIDATION_SUMMARY).appendTo(this._getContent());
            this._validationSummary = _$validationSummary.dxValidationSummary({
                validationGroup: this._getValidationGroup()
            }).dxValidationSummary("instance")
        }
    },
    _prepareItems: function(items, parentIsTabbedItem, currentPath, isTabs) {
        if (items) {
            var result = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var path = (0, _uiForm7.concatPaths)(currentPath, (0, _uiForm7.createItemPathByIndex)(i, isTabs));
                var guid = this._itemsRunTimeInfo.add({
                    item: item,
                    itemIndex: i,
                    path: path
                });
                if ((0, _type.isObject)(item)) {
                    var itemCopy = (0, _extend.extend)({}, item);
                    itemCopy.guid = guid;
                    this._tryPrepareGroupItem(itemCopy);
                    this._tryPrepareTabbedItem(itemCopy, path);
                    this._tryPrepareItemTemplate(itemCopy);
                    if (parentIsTabbedItem) {
                        itemCopy.cssItemClass = FIELD_ITEM_TAB_CLASS
                    }
                    if (itemCopy.items) {
                        itemCopy.items = this._prepareItems(itemCopy.items, parentIsTabbedItem, path)
                    }
                    result.push(itemCopy)
                } else {
                    result.push(item)
                }
            }
            return result
        }
    },
    _tryPrepareGroupItem: function(item) {
        if ("group" === item.itemType) {
            item.alignItemLabels = (0, _common.ensureDefined)(item.alignItemLabels, true);
            if (item.template) {
                item.groupContentTemplate = this._getTemplate(item.template)
            }
            item.template = this._itemGroupTemplate.bind(this, item)
        }
    },
    _tryPrepareTabbedItem: function(item, path) {
        if ("tabbed" === item.itemType) {
            item.template = this._itemTabbedTemplate.bind(this, item);
            item.tabs = this._prepareItems(item.tabs, true, path, true)
        }
    },
    _tryPrepareItemTemplate: function(item) {
        if (item.template) {
            item.template = this._getTemplate(item.template)
        }
    },
    _checkGrouping: function(items) {
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if ("group" === item.itemType) {
                    return true
                }
            }
        }
    },
    _renderLayout: function() {
        var that = this,
            items = that.option("items"),
            $content = that._getContent();
        items = that._prepareItems(items);
        that._rootLayoutManager = that._renderLayoutManager(items, $content, {
            colCount: that.option("colCount"),
            alignItemLabels: that.option("alignItemLabels"),
            screenByWidth: this.option("screenByWidth"),
            colCountByScreen: this.option("colCountByScreen"),
            onLayoutChanged: function(inOneColumn) {
                that._alignLabels.bind(that)(that._rootLayoutManager, inOneColumn)
            },
            onContentReady: function(e) {
                that._alignLabels(e.component, e.component.isSingleColumnMode())
            }
        })
    },
    _tryGetItemsForTemplate: function(item) {
        return item.items || []
    },
    _itemTabbedTemplate: function(item, e, $container) {
        var _this = this;
        var $tabPanel = (0, _renderer2.default)("<div>").appendTo($container);
        var tabPanelOptions = (0, _extend.extend)({}, item.tabPanelOptions, {
            dataSource: item.tabs,
            onItemRendered: function(args) {
                return (0, _dom.triggerShownEvent)(args.itemElement)
            },
            itemTemplate: function(itemData, e, container) {
                var $container = (0, _renderer2.default)(container);
                var alignItemLabels = (0, _common.ensureDefined)(itemData.alignItemLabels, true);
                var layoutManager = _this._renderLayoutManager(_this._tryGetItemsForTemplate(itemData), $container, {
                    colCount: itemData.colCount,
                    alignItemLabels: alignItemLabels,
                    screenByWidth: _this.option("screenByWidth"),
                    colCountByScreen: itemData.colCountByScreen,
                    cssItemClass: itemData.cssItemClass,
                    onLayoutChanged: function(inOneColumn) {
                        _this._alignLabelsInColumn({
                            $container: $container,
                            layoutManager: layoutManager,
                            items: itemData.items,
                            inOneColumn: inOneColumn
                        })
                    }
                });
                if (_this._itemsRunTimeInfo) {
                    _this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(itemData.guid, {
                        layoutManager: layoutManager
                    })
                }
                if (alignItemLabels) {
                    _this._alignLabelsInColumn({
                        $container: $container,
                        layoutManager: layoutManager,
                        items: itemData.items,
                        inOneColumn: layoutManager.isSingleColumnMode()
                    })
                }
            }
        });
        var tabPanel = this._createComponent($tabPanel, _tab_panel2.default, tabPanelOptions);
        if (item.tabs) {
            item.tabs.forEach(function(tab) {
                return _this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(tab.guid, {
                    widgetInstance: tabPanel
                })
            })
        }
    },
    _itemGroupTemplate: function(item, e, $container) {
        var $groupContent, colCount, layoutManager, $group = (0, _renderer2.default)("<div>").toggleClass(FORM_GROUP_WITH_CAPTION_CLASS, (0, _type.isDefined)(item.caption) && item.caption.length).addClass(FORM_GROUP_CLASS).appendTo($container);
        if (item.caption) {
            (0, _renderer2.default)("<span>").addClass(FORM_GROUP_CAPTION_CLASS).text(item.caption).appendTo($group)
        }
        $groupContent = (0, _renderer2.default)("<div>").addClass(FORM_GROUP_CONTENT_CLASS).appendTo($group);
        if (item.groupContentTemplate) {
            var data = {
                formData: this.option("formData"),
                component: this
            };
            item.groupContentTemplate.render({
                model: data,
                container: (0, _dom.getPublicElement)($groupContent)
            })
        } else {
            layoutManager = this._renderLayoutManager(this._tryGetItemsForTemplate(item), $groupContent, {
                colCount: item.colCount,
                colCountByScreen: item.colCountByScreen,
                alignItemLabels: item.alignItemLabels,
                cssItemClass: item.cssItemClass
            });
            this._itemsRunTimeInfo && this._itemsRunTimeInfo.extendRunTimeItemInfoByKey(item.guid, {
                layoutManager: layoutManager
            });
            colCount = layoutManager._getColCount();
            if ((0, _array.inArray)(colCount, this._groupsColCount) === -1) {
                this._groupsColCount.push(colCount)
            }
            $group.addClass(GROUP_COL_COUNT_CLASS + colCount)
        }
    },
    _renderLayoutManager: function(items, $rootElement, options) {
        var instance, $element = (0, _renderer2.default)("<div>"),
            that = this,
            config = that._getLayoutManagerConfig(items, options),
            baseColCountByScreen = {
                lg: options.colCount,
                md: options.colCount,
                sm: options.colCount,
                xs: 1
            };
        that._cachedColCountOptions.push({
            colCountByScreen: (0, _extend.extend)(baseColCountByScreen, options.colCountByScreen)
        });
        $element.appendTo($rootElement);
        instance = that._createComponent($element, "dxLayoutManager", config);
        instance.on("autoColCountChanged", function() {
            that._refresh()
        });
        that._cachedLayoutManagers.push(instance);
        return instance
    },
    _getValidationGroup: function() {
        return this.option("validationGroup") || this
    },
    _getLayoutManagerConfig: function(items, options) {
        var that = this,
            baseConfig = {
                form: that,
                validationGroup: that._getValidationGroup(),
                showRequiredMark: that.option("showRequiredMark"),
                showOptionalMark: that.option("showOptionalMark"),
                requiredMark: that.option("requiredMark"),
                optionalMark: that.option("optionalMark"),
                requiredMessage: that.option("requiredMessage"),
                screenByWidth: that.option("screenByWidth"),
                layoutData: that.option("formData"),
                labelLocation: that.option("labelLocation"),
                customizeItem: that.option("customizeItem"),
                minColWidth: that.option("minColWidth"),
                showColonAfterLabel: that.option("showColonAfterLabel"),
                onEditorEnterKey: that.option("onEditorEnterKey"),
                onFieldDataChanged: function(args) {
                    if (!that._isDataUpdating) {
                        that._triggerOnFieldDataChanged(args)
                    }
                },
                validationBoundary: that.option("scrollingEnabled") ? that.$element() : void 0
            };
        return (0, _extend.extend)(baseConfig, {
            items: items,
            onContentReady: function(args) {
                that._itemsRunTimeInfo.addItemsOrExtendFrom(args.component._itemsRunTimeInfo);
                options.onContentReady && options.onContentReady(args)
            },
            colCount: options.colCount,
            alignItemLabels: options.alignItemLabels,
            cssItemClass: options.cssItemClass,
            colCountByScreen: options.colCountByScreen,
            onLayoutChanged: options.onLayoutChanged,
            width: options.width
        })
    },
    _createComponent: function($element, type, config) {
        var that = this;
        config = config || {};
        that._extendConfig(config, {
            readOnly: that.option("readOnly")
        });
        return that.callBase($element, type, config)
    },
    _attachSyncSubscriptions: function() {
        var that = this;
        that.on("optionChanged", function(args) {
            var optionFullName = args.fullName;
            if ("formData" === optionFullName) {
                if (!(0, _type.isDefined)(args.value)) {
                    that._options.formData = args.value = {}
                }
                that._triggerOnFieldDataChangedByDataSet(args.value)
            }
            if (that._cachedLayoutManagers.length) {
                (0, _iterator.each)(that._cachedLayoutManagers, function(index, layoutManager) {
                    if ("formData" === optionFullName) {
                        that._isDataUpdating = true;
                        layoutManager.option("layoutData", args.value);
                        that._isDataUpdating = false
                    }
                    if ("readOnly" === args.name || "disabled" === args.name) {
                        layoutManager.option(optionFullName, args.value)
                    }
                })
            }
        })
    },
    _optionChanged: function(args) {
        var rootNameOfComplexOption = this._getRootLevelOfExpectedComplexOption(args.fullName, ["formData", "items"]);
        if (rootNameOfComplexOption) {
            this._customHandlerOfComplexOption(args, rootNameOfComplexOption);
            return
        }
        switch (args.name) {
            case "formData":
                if (!this.option("items")) {
                    this._invalidate()
                } else {
                    if ((0, _type.isEmptyObject)(args.value)) {
                        this._resetValues()
                    }
                }
                break;
            case "items":
            case "colCount":
            case "onFieldDataChanged":
            case "onEditorEnterKey":
            case "labelLocation":
            case "alignItemLabels":
            case "showColonAfterLabel":
            case "customizeItem":
            case "alignItemLabelsInAllGroups":
            case "showRequiredMark":
            case "showOptionalMark":
            case "requiredMark":
            case "optionalMark":
            case "requiredMessage":
            case "scrollingEnabled":
            case "formID":
            case "colCountByScreen":
            case "screenByWidth":
            case "stylingMode":
                this._invalidate();
                break;
            case "showValidationSummary":
                this._renderValidationSummary();
                break;
            case "minColWidth":
                if ("auto" === this.option("colCount")) {
                    this._invalidate()
                }
                break;
            case "readOnly":
                break;
            case "width":
                this.callBase(args);
                this._rootLayoutManager.option(args.name, args.value);
                this._alignLabels(this._rootLayoutManager, this._rootLayoutManager.isSingleColumnMode());
                break;
            case "visible":
                this.callBase(args);
                if (args.value) {
                    (0, _dom.triggerShownEvent)(this.$element())
                }
                break;
            case "validationGroup":
                _validation_engine2.default.removeGroup(args.previousValue || this);
                this._invalidate();
                break;
            default:
                this.callBase(args)
        }
    },
    _getRootLevelOfExpectedComplexOption: function(fullOptionName, expectedRootNames) {
        var result, splitFullName = fullOptionName.split(".");
        if (splitFullName.length > 1) {
            var i, rootOptionName = splitFullName[0];
            for (i = 0; i < expectedRootNames.length; i++) {
                if (rootOptionName.search(expectedRootNames[i]) !== -1) {
                    result = expectedRootNames[i]
                }
            }
        }
        return result
    },
    _tryCreateItemOptionAction: function(optionName, item, value, previousValue) {
        return (0, _uiForm6.default)(optionName, {
            item: item,
            value: value,
            previousValue: previousValue,
            itemsRunTimeInfo: this._itemsRunTimeInfo
        })
    },
    _tryExecuteItemOptionAction: function(action) {
        return action && action.tryExecute()
    },
    _updateValidationGroupAndSummaryIfNeeded: function(fullName) {
        var optionName = (0, _uiForm7.getOptionNameFromFullName)(fullName);
        if (ITEM_OPTIONS_FOR_VALIDATION_UPDATING.indexOf(optionName) > -1) {
            _validation_engine2.default.addGroup(this._getValidationGroup());
            if (this.option("showValidationSummary")) {
                this._validationSummary && this._validationSummary._initGroupRegistration()
            }
        }
    },
    _setLayoutManagerItemOption: function(layoutManager, optionName, value, path) {
        var _this2 = this;
        if (this._updateLockCount > 0) {
            !layoutManager._updateLockCount && layoutManager.beginUpdate();
            var key = this._itemsRunTimeInfo.getKeyByPath(path);
            this.postponedOperations.add(key, function() {
                layoutManager.endUpdate();
                return (new _deferred.Deferred).resolve()
            })
        }
        var contentReadyHandler = function contentReadyHandler(e) {
            e.component.off("contentReady", contentReadyHandler);
            if ((0, _uiForm7.isFullPathContainsTabs)(path)) {
                var tabPath = (0, _uiForm7.tryGetTabPath)(path);
                var tabLayoutManager = _this2._itemsRunTimeInfo.getGroupOrTabLayoutManagerByPath(tabPath);
                _this2._alignLabelsInColumn({
                    items: tabLayoutManager.option("items"),
                    layoutManager: tabLayoutManager,
                    $container: tabLayoutManager.$element(),
                    inOneColumn: tabLayoutManager.isSingleColumnMode()
                })
            } else {
                _this2._alignLabels(_this2._rootLayoutManager, _this2._rootLayoutManager.isSingleColumnMode())
            }
        };
        layoutManager.on("contentReady", contentReadyHandler);
        layoutManager.option(optionName, value);
        this._updateValidationGroupAndSummaryIfNeeded(optionName)
    },
    _tryChangeLayoutManagerItemOption: function(fullName, value) {
        var nameParts = fullName.split(".");
        var optionName = (0, _uiForm7.getOptionNameFromFullName)(fullName);
        if ("items" === optionName && nameParts.length > 1) {
            var itemPath = this._getItemPath(nameParts);
            var layoutManager = this._itemsRunTimeInfo.getGroupOrTabLayoutManagerByPath(itemPath);
            if (layoutManager) {
                this._itemsRunTimeInfo.removeItemsByItems(layoutManager.getItemsRunTimeInfo());
                var items = this._prepareItems(value, false, itemPath);
                this._setLayoutManagerItemOption(layoutManager, optionName, items, itemPath);
                return true
            }
        } else {
            if (nameParts.length > 2) {
                var endPartIndex = nameParts.length - 2;
                var _itemPath = this._getItemPath(nameParts.slice(0, endPartIndex));
                var _layoutManager = this._itemsRunTimeInfo.getGroupOrTabLayoutManagerByPath(_itemPath);
                if (_layoutManager) {
                    var fullOptionName = (0, _uiForm7.getFullOptionName)(nameParts[endPartIndex], optionName);
                    this._setLayoutManagerItemOption(_layoutManager, fullOptionName, value, _itemPath);
                    return true
                }
            }
        }
        return false
    },
    _tryChangeLayoutManagerItemOptions: function(itemPath, options) {
        var _this3 = this;
        var result = void 0;
        this.beginUpdate();
        (0, _iterator.each)(options, function(optionName, optionValue) {
            result = _this3._tryChangeLayoutManagerItemOption((0, _uiForm7.getFullOptionName)(itemPath, optionName), optionValue);
            if (!result) {
                return false
            }
        });
        this.endUpdate();
        return result
    },
    _customHandlerOfComplexOption: function(args, rootOptionName) {
        var nameParts = args.fullName.split(".");
        var value = args.value;
        if ("items" === rootOptionName) {
            var itemPath = this._getItemPath(nameParts);
            var item = this.option(itemPath);
            var optionNameWithoutPath = args.fullName.replace(itemPath + ".", "");
            var simpleOptionName = optionNameWithoutPath.split(".")[0].replace(/\[\d+]/, "");
            var itemAction = this._tryCreateItemOptionAction(simpleOptionName, item, item[simpleOptionName], args.previousValue);
            if (!this._tryExecuteItemOptionAction(itemAction) && !this._tryChangeLayoutManagerItemOption(args.fullName, value)) {
                if (item) {
                    this._changeItemOption(item, optionNameWithoutPath, value);
                    var items = this._generateItemsFromData(this.option("items"));
                    this.option("items", items)
                }
            }
        }
        if ("formData" === rootOptionName) {
            var dataField = nameParts.slice(1).join(".");
            var editor = this.getEditor(dataField);
            if (editor) {
                editor.option("value", value)
            } else {
                this._triggerOnFieldDataChanged({
                    dataField: dataField,
                    value: value
                })
            }
        }
    },
    _getItemPath: function(nameParts) {
        var i, itemPath = nameParts[0];
        for (i = 1; i < nameParts.length; i++) {
            if (nameParts[i].search(/items\[\d+]|tabs\[\d+]/) !== -1) {
                itemPath += "." + nameParts[i]
            } else {
                break
            }
        }
        return itemPath
    },
    _triggerOnFieldDataChanged: function(args) {
        this._createActionByOption("onFieldDataChanged")(args)
    },
    _triggerOnFieldDataChangedByDataSet: function(data) {
        var that = this;
        if (data && (0, _type.isObject)(data)) {
            (0, _iterator.each)(data, function(dataField, value) {
                that._triggerOnFieldDataChanged({
                    dataField: dataField,
                    value: value
                })
            })
        }
    },
    _updateFieldValue: function(dataField, value) {
        if ((0, _type.isDefined)(this.option("formData"))) {
            var editor = this.getEditor(dataField);
            this.option("formData." + dataField, value);
            if (editor) {
                var editorValue = editor.option("value");
                if (editorValue !== value) {
                    editor.option("value", value)
                }
            }
        }
    },
    _generateItemsFromData: function(items) {
        var formData = this.option("formData"),
            result = [];
        if (!items && (0, _type.isDefined)(formData)) {
            (0, _iterator.each)(formData, function(dataField) {
                result.push({
                    dataField: dataField
                })
            })
        }
        if (items) {
            (0, _iterator.each)(items, function(index, item) {
                if ((0, _type.isObject)(item)) {
                    result.push(item)
                } else {
                    result.push({
                        dataField: item
                    })
                }
            })
        }
        return result
    },
    _getItemByField: function(field, items) {
        var resultItem, that = this,
            fieldParts = (0, _type.isObject)(field) ? field : that._getFieldParts(field),
            fieldName = fieldParts.fieldName,
            fieldPath = fieldParts.fieldPath;
        if (items.length) {
            (0, _iterator.each)(items, function(index, item) {
                var itemType = item.itemType;
                if (fieldPath.length) {
                    var path = fieldPath.slice();
                    item = that._getItemByFieldPath(path, fieldName, item)
                } else {
                    if ("group" === itemType && !(item.caption || item.name) || "tabbed" === itemType && !item.name) {
                        var subItemsField = that._getSubItemField(itemType);
                        item.items = that._generateItemsFromData(item.items);
                        item = that._getItemByField({
                            fieldName: fieldName,
                            fieldPath: fieldPath
                        }, item[subItemsField])
                    }
                }
                if ((0, _uiForm7.isExpectedItem)(item, fieldName)) {
                    resultItem = item;
                    return false
                }
            })
        }
        return resultItem
    },
    _getFieldParts: function(field) {
        var fieldSeparator = ".",
            fieldName = field,
            separatorIndex = fieldName.indexOf(fieldSeparator),
            resultPath = [];
        while (separatorIndex !== -1) {
            resultPath.push(fieldName.substr(0, separatorIndex));
            fieldName = fieldName.substr(separatorIndex + 1);
            separatorIndex = fieldName.indexOf(fieldSeparator)
        }
        return {
            fieldName: fieldName,
            fieldPath: resultPath.reverse()
        }
    },
    _getItemByFieldPath: function(path, fieldName, item) {
        var result, that = this,
            itemType = item.itemType,
            subItemsField = that._getSubItemField(itemType),
            isItemWithSubItems = "group" === itemType || "tabbed" === itemType || item.title;
        do {
            if (isItemWithSubItems) {
                var pathNode, name = item.name || item.caption || item.title,
                    isGroupWithName = (0, _type.isDefined)(name),
                    nameWithoutSpaces = (0, _uiForm7.getTextWithoutSpaces)(name);
                item[subItemsField] = that._generateItemsFromData(item[subItemsField]);
                if (isGroupWithName) {
                    pathNode = path.pop()
                }
                if (!path.length) {
                    result = that._getItemByField(fieldName, item[subItemsField]);
                    if (result) {
                        break
                    }
                }
                if (!isGroupWithName || isGroupWithName && nameWithoutSpaces === pathNode) {
                    if (path.length) {
                        result = that._searchItemInEverySubItem(path, fieldName, item[subItemsField])
                    }
                }
            } else {
                break
            }
        } while (path.length && !(0, _type.isDefined)(result));
        return result
    },
    _getSubItemField: function(itemType) {
        return "tabbed" === itemType ? "tabs" : "items"
    },
    _searchItemInEverySubItem: function(path, fieldName, items) {
        var result, that = this;
        (0, _iterator.each)(items, function(index, groupItem) {
            result = that._getItemByFieldPath(path.slice(), fieldName, groupItem);
            if (result) {
                return false
            }
        });
        if (!result) {
            result = false
        }
        return result
    },
    _changeItemOption: function(item, option, value) {
        if ((0, _type.isObject)(item)) {
            item[option] = value
        }
    },
    _dimensionChanged: function() {
        var currentScreenFactor = this._getCurrentScreenFactor();
        if (this._lastMarkupScreenFactor !== currentScreenFactor) {
            if (this._isColCountChanged(this._lastMarkupScreenFactor, currentScreenFactor)) {
                this._targetScreenFactor = currentScreenFactor;
                this._refresh();
                this._targetScreenFactor = void 0
            }
            this._lastMarkupScreenFactor = currentScreenFactor
        }
    },
    _isColCountChanged: function(oldScreenSize, newScreenSize) {
        var isChanged = false;
        (0, _iterator.each)(this._cachedColCountOptions, function(index, item) {
            if (item.colCountByScreen[oldScreenSize] !== item.colCountByScreen[newScreenSize]) {
                isChanged = true;
                return false
            }
        });
        return isChanged
    },
    _refresh: function() {
        var editorSelector = "." + FOCUSED_STATE_CLASS + " input, ." + FOCUSED_STATE_CLASS + " textarea";
        _events_engine2.default.trigger(this.$element().find(editorSelector), "change");
        this.callBase()
    },
    _resetValues: function() {
        this._itemsRunTimeInfo.each(function(_, itemRunTimeInfo) {
            if ((0, _type.isDefined)(itemRunTimeInfo.widgetInstance) && (0, _type.isDefined)(itemRunTimeInfo.item) && "button" !== itemRunTimeInfo.item.itemType) {
                itemRunTimeInfo.widgetInstance.reset();
                itemRunTimeInfo.widgetInstance.option("isValid", true)
            }
        });
        _validation_engine2.default.resetGroup(this._getValidationGroup())
    },
    _updateData: function(data, value, isComplexData) {
        var that = this,
            _data = isComplexData ? value : data;
        if ((0, _type.isObject)(_data)) {
            (0, _iterator.each)(_data, function(dataField, fieldValue) {
                that._updateData(isComplexData ? data + "." + dataField : dataField, fieldValue, (0, _type.isObject)(fieldValue))
            })
        } else {
            if ((0, _type.isString)(data)) {
                that._updateFieldValue(data, value)
            }
        }
    },
    registerKeyHandler: function(key, handler) {
        this.callBase(key, handler);
        this._itemsRunTimeInfo.each(function(_, itemRunTimeInfo) {
            if ((0, _type.isDefined)(itemRunTimeInfo.widgetInstance)) {
                itemRunTimeInfo.widgetInstance.registerKeyHandler(key, handler)
            }
        })
    },
    _focusTarget: function() {
        return this.$element().find("." + FIELD_ITEM_CONTENT_CLASS + " [tabindex]").first()
    },
    _visibilityChanged: function(visible) {
        if (visible && _browser2.default.msie) {
            this._refresh()
        }
    },
    _dispose: function() {
        _validation_engine2.default.removeGroup(this._getValidationGroup());
        this.callBase()
    },
    resetValues: function() {
        this._resetValues()
    },
    updateData: function(data, value) {
        this._updateData(data, value)
    },
    getEditor: function(dataField) {
        return this._itemsRunTimeInfo.findWidgetInstanceByDataField(dataField) || this._itemsRunTimeInfo.findWidgetInstanceByName(dataField)
    },
    getButton: function(name) {
        return this._itemsRunTimeInfo.findWidgetInstanceByName(name)
    },
    updateDimensions: function() {
        var that = this,
            deferred = new _deferred.Deferred;
        if (that._scrollable) {
            that._scrollable.update().done(function() {
                deferred.resolveWith(that)
            })
        } else {
            deferred.resolveWith(that)
        }
        return deferred.promise()
    },
    itemOption: function(id, option, value) {
        var _this4 = this;
        var items = this._generateItemsFromData(this.option("items"));
        var item = this._getItemByField(id, items);
        var path = this._itemsRunTimeInfo.getPathFromItem(item);
        if (!item) {
            return
        }
        switch (arguments.length) {
            case 1:
                return item;
            case 3:
                var itemAction = this._tryCreateItemOptionAction(option, item, value, item[option]);
                this._changeItemOption(item, option, value);
                var fullName = (0, _uiForm7.getFullOptionName)(path, option);
                if (!this._tryExecuteItemOptionAction(itemAction) && !this._tryChangeLayoutManagerItemOption(fullName, value)) {
                    this.option("items", items)
                }
                break;
            default:
                if ((0, _type.isObject)(option)) {
                    if (!this._tryChangeLayoutManagerItemOptions(path, option)) {
                        var allowUpdateItems = void 0;
                        (0, _iterator.each)(option, function(optionName, optionValue) {
                            var itemAction = _this4._tryCreateItemOptionAction(optionName, item, optionValue, item[optionName]);
                            _this4._changeItemOption(item, optionName, optionValue);
                            if (!allowUpdateItems && !_this4._tryExecuteItemOptionAction(itemAction)) {
                                allowUpdateItems = true
                            }
                        });
                        allowUpdateItems && this.option("items", items)
                    }
                }
        }
    },
    validate: function() {
        return _validation_engine2.default.validateGroup(this._getValidationGroup())
    },
    getItemID: function(name) {
        return "dx_" + this.option("formID") + "_" + (name || new _guid2.default)
    },
    getTargetScreenFactor: function() {
        return this._targetScreenFactor
    }
});
(0, _component_registrator2.default)("dxForm", Form);
module.exports = Form;
