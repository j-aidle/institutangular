/**
 * DevExtreme (ui/sortable.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../core/utils/extend");
var _draggable = require("./draggable");
var _draggable2 = _interopRequireDefault(_draggable);
var _dom = require("../core/utils/dom");
var _translator = require("../animation/translator");
var _translator2 = _interopRequireDefault(_translator);
var _fx = require("../animation/fx");
var _fx2 = _interopRequireDefault(_fx);

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
var SORTABLE = "dxSortable",
    PLACEHOLDER_CLASS = "placeholder",
    CLONE_CLASS = "clone";
var Sortable = _draggable2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            clone: true,
            filter: "> *",
            itemOrientation: "vertical",
            dropFeedbackMode: "push",
            allowDropInsideItem: false,
            allowReordering: true,
            moveItemOnDrop: false,
            onDragChange: null,
            onAdd: null,
            onRemove: null,
            onReorder: null,
            onPlaceholderPrepared: null,
            animation: {
                type: "slide",
                duration: 300
            },
            fromIndex: null,
            toIndex: null,
            dropInsideItem: false,
            itemPoints: null
        })
    },
    reset: function() {
        this.option({
            dropInsideItem: false,
            toIndex: null,
            fromIndex: null
        });
        if (this._$placeholderElement) {
            this._$placeholderElement.remove()
        }
        this._$placeholderElement = null;
        if (!this._isIndicateMode() && this._$modifiedItem) {
            this._$modifiedItem.css("marginBottom", this._modifiedItemMargin);
            this._$modifiedItem = null
        }
    },
    _dragStartHandler: function(e) {
        this.callBase.apply(this, arguments);
        if (true === e.cancel) {
            return
        }
        var $sourceElement = this._getSourceElement();
        this._updateItemPoints();
        this.option("fromIndex", this._getElementIndex($sourceElement))
    },
    _dragEnterHandler: function() {
        this.callBase.apply(this, arguments);
        if (this === this._getSourceDraggable()) {
            return
        }
        this._updateItemPoints();
        this.option("fromIndex", -1);
        if (!this._isIndicateMode()) {
            var itemPoints = this.option("itemPoints"),
                lastItemPoint = itemPoints[itemPoints.length - 1];
            if (lastItemPoint) {
                var $element = this.$element(),
                    $sourceElement = this._getSourceElement(),
                    isVertical = this._isVerticalOrientation(),
                    sourceElementSize = isVertical ? $sourceElement.outerHeight(true) : $sourceElement.outerWidth(true),
                    scrollSize = $element.get(0)[isVertical ? "scrollHeight" : "scrollWidth"],
                    scrollPosition = $element.get(0)[isVertical ? "scrollTop" : "scrollLeft"],
                    positionProp = isVertical ? "top" : "left",
                    lastPointPosition = lastItemPoint[positionProp],
                    elementPosition = $element.offset()[positionProp],
                    freeSize = elementPosition + scrollSize - scrollPosition - lastPointPosition;
                if (freeSize < sourceElementSize) {
                    if (isVertical) {
                        var $lastItem = (0, _renderer2.default)(this._getItems()).last();
                        this._$modifiedItem = $lastItem;
                        this._modifiedItemMargin = $lastItem.get(0).style.marginBottom;
                        $lastItem.css("marginBottom", sourceElementSize - freeSize);
                        var $sortable = $lastItem.closest(".dx-sortable"),
                            sortable = $sortable.data("dxScrollable") || $sortable.data("dxScrollView");
                        sortable && sortable.update()
                    }
                }
            }
        }
    },
    dragEnter: function() {
        if (this === this._getTargetDraggable()) {
            this.option("toIndex", this.option("fromIndex"))
        } else {
            this.option("toIndex", -1)
        }
    },
    dragLeave: function() {
        if (this === this._getTargetDraggable()) {
            this.option("toIndex", -1)
        } else {
            this.option("toIndex", this.option("fromIndex"))
        }
    },
    dragEnd: function(sourceEvent) {
        var $sourceElement = this._getSourceElement(),
            sourceDraggable = this._getSourceDraggable(),
            isSourceDraggable = sourceDraggable.NAME !== this.NAME,
            toIndex = this.option("toIndex");
        if (null !== toIndex && toIndex >= 0) {
            var cancelAdd = void 0,
                cancelRemove = void 0;
            if (sourceDraggable !== this) {
                cancelAdd = this._fireAddEvent(sourceEvent);
                if (!cancelAdd) {
                    cancelRemove = this._fireRemoveEvent(sourceEvent)
                }
            }
            if (isSourceDraggable) {
                _translator2.default.resetPosition($sourceElement)
            }
            if (this.option("moveItemOnDrop")) {
                !cancelAdd && this._moveItem($sourceElement, toIndex, cancelRemove)
            }
            if (sourceDraggable === this) {
                this._fireReorderEvent(sourceEvent)
            }
        }
    },
    dragMove: function(e) {
        var itemPoints = this.option("itemPoints");
        if (!itemPoints) {
            return
        }
        var isVertical = this._isVerticalOrientation(),
            axisName = isVertical ? "top" : "left",
            cursorPosition = isVertical ? e.pageY : e.pageX,
            itemPoint = void 0;
        for (var i = itemPoints.length - 1; i >= 0; i--) {
            var centerPosition = itemPoints[i + 1] && (itemPoints[i][axisName] + itemPoints[i + 1][axisName]) / 2;
            if (centerPosition > cursorPosition || void 0 === centerPosition) {
                itemPoint = itemPoints[i]
            } else {
                break
            }
        }
        if (itemPoint) {
            this._updatePlaceholderPosition(e, itemPoint);
            if (this.verticalScrollHelper.isScrolling() && this._isIndicateMode()) {
                this._movePlaceholder()
            }
        }
    },
    _isIndicateMode: function() {
        return "indicate" === this.option("dropFeedbackMode") || this.option("allowDropInsideItem")
    },
    _createPlaceholder: function() {
        var $placeholderContainer = void 0;
        if (this._isIndicateMode()) {
            $placeholderContainer = (0, _renderer2.default)("<div>").addClass(this._addWidgetPrefix(PLACEHOLDER_CLASS)).insertBefore(this._getSourceDraggable()._$dragElement)
        }
        this._$placeholderElement = $placeholderContainer;
        return $placeholderContainer
    },
    _getItems: function() {
        var itemsSelector = this._getItemsSelector();
        return this._$content().find(itemsSelector).not("." + this._addWidgetPrefix(PLACEHOLDER_CLASS)).not("." + this._addWidgetPrefix(CLONE_CLASS)).toArray()
    },
    _allowReordering: function() {
        var sourceDraggable = this._getSourceDraggable(),
            targetDraggable = this._getTargetDraggable();
        return sourceDraggable !== targetDraggable || this.option("allowReordering")
    },
    _isValidPoint: function($items, itemPointIndex, dropInsideItem) {
        var allowReordering = dropInsideItem || this._allowReordering();
        if (!allowReordering && 0 !== itemPointIndex) {
            return false
        }
        if (!this._isIndicateMode()) {
            return true
        }
        var $draggableItem = this._getDraggableElement(),
            draggableItemIndex = $items.indexOf($draggableItem.get(0));
        return draggableItemIndex === -1 || itemPointIndex !== draggableItemIndex && (dropInsideItem || itemPointIndex !== draggableItemIndex + 1)
    },
    _getItemPoints: function() {
        var _this = this;
        var result = void 0,
            isVertical = this._isVerticalOrientation(),
            $items = this._getItems();
        result = $items.map(function(item, index) {
            var offset = (0, _renderer2.default)(item).offset();
            return {
                dropInsideItem: false,
                left: offset.left,
                top: offset.top,
                index: index,
                $item: (0, _renderer2.default)(item),
                width: (0, _renderer2.default)(item).outerWidth(),
                height: (0, _renderer2.default)(item).outerHeight(),
                isValid: _this._isValidPoint($items, index)
            }
        });
        if (result.length) {
            var lastItem = result[result.length - 1];
            result.push({
                dropInsideItem: false,
                index: result.length,
                top: isVertical ? lastItem.top + lastItem.height : lastItem.top,
                left: !isVertical ? lastItem.left + lastItem.width : lastItem.left,
                isValid: this._isValidPoint($items, result.length)
            });
            if (this.option("allowDropInsideItem")) {
                var points = result;
                result = [];
                for (var i = 0; i < points.length; i++) {
                    result.push(points[i]);
                    if (points[i + 1]) {
                        result.push((0, _extend.extend)({}, points[i], {
                            dropInsideItem: true,
                            top: Math.floor((points[i].top + points[i + 1].top) / 2),
                            left: Math.floor((points[i].left + points[i + 1].left) / 2),
                            isValid: this._isValidPoint($items, i, true)
                        }))
                    }
                }
            }
        } else {
            result.push({
                dropInsideItem: false,
                index: 0,
                isValid: true
            })
        }
        return result
    },
    _updateItemPoints: function() {
        this.option("itemPoints", this._getItemPoints())
    },
    _getElementIndex: function($itemElement) {
        return this._getItems().indexOf($itemElement.get(0))
    },
    _getDragTemplateArgs: function($element) {
        var args = this.callBase.apply(this, arguments);
        args.model.fromIndex = this._getElementIndex($element);
        return args
    },
    _togglePlaceholder: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggle(value)
    },
    _isVerticalOrientation: function() {
        return "vertical" === this.option("itemOrientation")
    },
    _normalizeToIndex: function(toIndex, dropInsideItem) {
        var isAnotherDraggable = this._getSourceDraggable() !== this._getTargetDraggable(),
            fromIndex = this.option("fromIndex");
        if (null === toIndex) {
            return fromIndex
        }
        return Math.max(isAnotherDraggable || fromIndex >= toIndex || dropInsideItem ? toIndex : toIndex - 1, 0)
    },
    _updatePlaceholderPosition: function(e, itemPoint) {
        var sourceDraggable = this._getSourceDraggable(),
            toIndex = this._normalizeToIndex(itemPoint.index, itemPoint.dropInsideItem);
        var eventArgs = (0, _extend.extend)(this._getEventArgs(e), {
            toIndex: toIndex,
            dropInsideItem: itemPoint.dropInsideItem
        });
        itemPoint.isValid && this._getAction("onDragChange")(eventArgs);
        if (eventArgs.cancel || !itemPoint.isValid) {
            if (!itemPoint.isValid) {
                this.option({
                    dropInsideItem: false,
                    toIndex: null
                })
            }
            return
        }
        this.option({
            dropInsideItem: itemPoint.dropInsideItem,
            toIndex: itemPoint.index
        });
        this._getAction("onPlaceholderPrepared")((0, _extend.extend)(this._getEventArgs(e), {
            placeholderElement: (0, _dom.getPublicElement)(this._$placeholderElement),
            dragElement: (0, _dom.getPublicElement)(sourceDraggable._$dragElement)
        }));
        this._updateItemPoints()
    },
    _updatePlaceholderSizes: function($placeholderElement, itemElement) {
        var dropInsideItem = this.option("dropInsideItem"),
            $item = itemElement ? (0, _renderer2.default)(itemElement) : this._getSourceElement(),
            isVertical = this._isVerticalOrientation(),
            width = "",
            height = "";
        $placeholderElement.toggleClass(this._addWidgetPrefix("placeholder-inside"), dropInsideItem);
        if (isVertical || dropInsideItem) {
            width = $item.outerWidth()
        }
        if (!isVertical || dropInsideItem) {
            height = $item.outerHeight()
        }
        $placeholderElement.css({
            width: width,
            height: height
        })
    },
    _moveItem: function($itemElement, index, cancelRemove) {
        var $prevTargetItemElement = void 0,
            $itemElements = this._getItems(),
            $targetItemElement = $itemElements[index],
            sourceDraggable = this._getSourceDraggable();
        if (cancelRemove) {
            $itemElement = $itemElement.clone();
            sourceDraggable._toggleDragSourceClass(false, $itemElement)
        }
        if (!$targetItemElement) {
            $prevTargetItemElement = $itemElements[index - 1]
        }
        this._moveItemCore($itemElement, $targetItemElement, $prevTargetItemElement)
    },
    _moveItemCore: function($targetItem, item, prevItem) {
        if (!item && !prevItem) {
            $targetItem.appendTo(this.$element())
        } else {
            if (prevItem) {
                $targetItem.insertAfter((0, _renderer2.default)(prevItem))
            } else {
                $targetItem.insertBefore((0, _renderer2.default)(item))
            }
        }
    },
    _getDragStartArgs: function(e, $itemElement) {
        return (0, _extend.extend)(this.callBase.apply(this, arguments), {
            fromIndex: this._getElementIndex($itemElement)
        })
    },
    _getEventArgs: function(e) {
        var sourceDraggable = this._getSourceDraggable(),
            targetDraggable = this._getTargetDraggable(),
            dropInsideItem = targetDraggable.option("dropInsideItem");
        return (0, _extend.extend)(this.callBase.apply(this, arguments), {
            fromIndex: sourceDraggable.option("fromIndex"),
            toIndex: this._normalizeToIndex(targetDraggable.option("toIndex"), dropInsideItem),
            dropInsideItem: dropInsideItem
        })
    },
    _optionChanged: function(args) {
        var name = args.name;
        switch (name) {
            case "onDragChange":
            case "onPlaceholderPrepared":
            case "onAdd":
            case "onRemove":
            case "onReorder":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "itemOrientation":
            case "allowDropInsideItem":
            case "moveItemOnDrop":
            case "dropFeedbackMode":
            case "itemPoints":
            case "fromIndex":
            case "animation":
            case "allowReordering":
                break;
            case "dropInsideItem":
                this._optionChangedDropInsideItem(args);
                break;
            case "toIndex":
                this._optionChangedToIndex(args);
                break;
            default:
                this.callBase(args)
        }
    },
    _optionChangedDropInsideItem: function(args) {
        if (this._isIndicateMode() && this._$placeholderElement) {
            var toIndex = this.option("toIndex"),
                itemElement = this._getItems()[toIndex];
            this._updatePlaceholderSizes(this._$placeholderElement, itemElement)
        }
    },
    _isPositionVisible: function(position) {
        var scrollContainer, $element = this.$element();
        if ("hidden" !== $element.css("overflow")) {
            scrollContainer = $element.get(0)
        } else {
            $element.parents().each(function() {
                if ("visible" !== (0, _renderer2.default)(this).css("overflow")) {
                    scrollContainer = this;
                    return false
                }
            })
        }
        if (scrollContainer) {
            var clientRect = scrollContainer.getBoundingClientRect(),
                isVerticalOrientation = this._isVerticalOrientation(),
                start = isVerticalOrientation ? "top" : "left",
                end = isVerticalOrientation ? "bottom" : "right";
            if (position[start] < clientRect[start] || position[start] > clientRect[end]) {
                return false
            }
        }
        return true
    },
    _optionChangedToIndex: function(args) {
        var toIndex = args.value;
        if (this._isIndicateMode()) {
            var showPlaceholder = null !== toIndex && toIndex >= 0;
            this._togglePlaceholder(showPlaceholder);
            if (showPlaceholder) {
                this._movePlaceholder()
            }
        } else {
            this._moveItems(args.previousValue, args.value)
        }
    },
    _movePlaceholder: function() {
        var $placeholderElement = this._$placeholderElement || this._createPlaceholder(),
            items = this._getItems(),
            toIndex = this.option("toIndex"),
            itemElement = items[toIndex],
            prevItemElement = items[toIndex - 1],
            isVerticalOrientation = this._isVerticalOrientation(),
            position = null;
        this._updatePlaceholderSizes($placeholderElement, itemElement);
        if (itemElement) {
            position = (0, _renderer2.default)(itemElement).offset()
        } else {
            if (prevItemElement) {
                position = (0, _renderer2.default)(prevItemElement).offset();
                position.top += isVerticalOrientation ? (0, _renderer2.default)(prevItemElement).outerHeight(true) : (0, _renderer2.default)(prevItemElement).outerWidth(true)
            }
        }
        if (position && !this._isPositionVisible(position)) {
            position = null
        }
        if (position) {
            this._move(position, $placeholderElement)
        }
        $placeholderElement.toggle(!!position)
    },
    _getPositions: function(items, elementSize, fromIndex, toIndex) {
        var positions = [];
        for (var i = 0; i < items.length; i++) {
            var position = 0;
            if (null === toIndex || null === fromIndex) {
                positions.push(position);
                continue
            }
            if (fromIndex === -1) {
                if (i >= toIndex) {
                    position = elementSize
                }
            } else {
                if (toIndex === -1) {
                    if (i > fromIndex) {
                        position = -elementSize
                    }
                } else {
                    if (fromIndex < toIndex) {
                        if (i > fromIndex && i < toIndex) {
                            position = -elementSize
                        }
                    } else {
                        if (fromIndex > toIndex) {
                            if (i >= toIndex && i < fromIndex) {
                                position = elementSize
                            }
                        }
                    }
                }
            }
            positions.push(position)
        }
        return positions
    },
    _moveItems: function(prevToIndex, toIndex) {
        var fromIndex = this.option("fromIndex"),
            isVerticalOrientation = this._isVerticalOrientation(),
            positionPropName = isVerticalOrientation ? "top" : "left",
            $draggableItem = this._getDraggableElement(),
            elementSize = isVerticalOrientation ? ($draggableItem.outerHeight() + $draggableItem.outerHeight(true)) / 2 : ($draggableItem.outerWidth() + $draggableItem.outerWidth(true)) / 2,
            items = this._getItems(),
            prevPositions = this._getPositions(items, elementSize, fromIndex, prevToIndex),
            positions = this._getPositions(items, elementSize, fromIndex, toIndex),
            animationConfig = this.option("animation");
        for (var i = 0; i < items.length; i++) {
            var $item = (0, _renderer2.default)(items[i]),
                prevPosition = prevPositions[i],
                position = positions[i];
            if (null === toIndex || null === fromIndex) {
                _fx2.default.stop($item);
                _translator2.default.resetPosition($item)
            } else {
                if (prevPosition !== position) {
                    _fx2.default.stop($item);
                    _fx2.default.animate($item, (0, _extend.extend)({}, animationConfig, {
                        to: _defineProperty({}, positionPropName, position)
                    }))
                }
            }
        }
    },
    _toggleDragSourceClass: function(value, $element) {
        var $sourceElement = $element || this._$sourceElement;
        this.callBase.apply(this, arguments);
        if (!this._isIndicateMode()) {
            $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix("source-hidden"), value)
        }
    },
    _dispose: function() {
        this.reset();
        this.callBase()
    },
    _fireAddEvent: function(sourceEvent) {
        var args = this._getEventArgs(sourceEvent);
        this._getAction("onAdd")(args);
        return args.cancel
    },
    _fireRemoveEvent: function(sourceEvent) {
        var sourceDraggable = this._getSourceDraggable(),
            args = this._getEventArgs(sourceEvent);
        sourceDraggable._getAction("onRemove")(args);
        return args.cancel
    },
    _fireReorderEvent: function(sourceEvent) {
        var args = this._getEventArgs(sourceEvent);
        this._getAction("onReorder")(args)
    }
});
(0, _component_registrator2.default)(SORTABLE, Sortable);
module.exports = Sortable;
module.exports.default = module.exports;
