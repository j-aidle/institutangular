/**
 * DevExtreme (ui/list/ui.list.edit.decorator.reorder.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    extend = require("../../core/utils/extend").extend,
    eventUtils = require("../../events/utils"),
    registerDecorator = require("./ui.list.edit.decorator_registry").register,
    EditDecorator = require("./ui.list.edit.decorator"),
    Sortable = require("../sortable");
var REORDER_HANDLE_CONTAINER_CLASS = "dx-list-reorder-handle-container",
    REORDER_HANDLE_CLASS = "dx-list-reorder-handle",
    REOREDERING_ITEM_GHOST_CLASS = "dx-list-item-ghost-reordering",
    STATE_HOVER_CLASS = "dx-state-hover";
registerDecorator("reorder", "default", EditDecorator.inherit({
    _init: function() {
        var list = this._list;
        this._groupedEnabled = this._list.option("grouped");
        this._lockedDrag = false;
        this._sortable = list._createComponent(list._scrollView.$content(), Sortable, extend({
            component: list,
            contentTemplate: null,
            allowReordering: false,
            filter: ".dx-list-item",
            container: list.$element(),
            dragDirection: list.option("itemDragging.group") ? "both" : "vertical",
            handle: "." + REORDER_HANDLE_CLASS,
            dragTemplate: this._dragTemplate,
            onDragStart: this._dragStartHandler.bind(this),
            onDragChange: this._dragChangeHandler.bind(this),
            onReorder: this._reorderHandler.bind(this)
        }, list.option("itemDragging")))
    },
    _dragTemplate: function(e) {
        return $(e.itemElement).clone().width($(e.itemElement).width()).addClass(REOREDERING_ITEM_GHOST_CLASS).addClass(STATE_HOVER_CLASS)
    },
    _dragStartHandler: function(e) {
        if (this._lockedDrag) {
            e.cancel = true;
            return
        }
    },
    _dragChangeHandler: function(e) {
        if (this._groupedEnabled && !this._sameParent(e.fromIndex, e.toIndex)) {
            e.cancel = true;
            return
        }
    },
    _sameParent: function(fromIndex, toIndex) {
        var $dragging = this._list.getItemElementByFlatIndex(fromIndex),
            $over = this._list.getItemElementByFlatIndex(toIndex);
        return $over.parent().get(0) === $dragging.parent().get(0)
    },
    _reorderHandler: function(e) {
        var $targetElement = this._list.getItemElementByFlatIndex(e.toIndex);
        this._list.reorderItem($(e.itemElement), $targetElement)
    },
    afterBag: function(config) {
        var _this = this;
        var $container = config.$container;
        var $handle = $("<div>").addClass(REORDER_HANDLE_CLASS);
        eventsEngine.on($handle, "dxpointerdown", function(e) {
            _this._lockedDrag = !eventUtils.isMouseEvent(e)
        });
        eventsEngine.on($handle, "dxhold", {
            timeout: 30
        }, function(e) {
            e.cancel = true;
            _this._lockedDrag = false
        });
        $container.addClass(REORDER_HANDLE_CONTAINER_CLASS);
        $container.append($handle)
    }
}));
