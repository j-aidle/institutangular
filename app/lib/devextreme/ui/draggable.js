/**
 * DevExtreme (ui/draggable.js)
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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    eventsEngine = require("../events/core/events_engine"),
    stringUtils = require("../core/utils/string"),
    registerComponent = require("../core/component_registrator"),
    translator = require("../animation/translator"),
    Animator = require("./scroll_view/animator"),
    browser = require("../core/utils/browser"),
    dasherize = require("../core/utils/inflector").dasherize,
    extend = require("../core/utils/extend").extend,
    DOMComponentWithTemplate = require("../core/dom_component_with_template"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    dragEvents = require("../events/drag"),
    positionUtils = require("../animation/position"),
    typeUtils = require("../core/utils/type"),
    noop = require("../core/utils/common").noop,
    viewPortUtils = require("../core/utils/view_port"),
    commonUtils = require("../core/utils/common"),
    EmptyTemplate = require("../core/templates/empty_template").EmptyTemplate;
var DRAGGABLE = "dxDraggable",
    DRAGSTART_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, DRAGGABLE),
    DRAG_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, DRAGGABLE),
    DRAGEND_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, DRAGGABLE),
    DRAG_ENTER_EVENT_NAME = eventUtils.addNamespace(dragEvents.enter, DRAGGABLE),
    DRAGEND_LEAVE_EVENT_NAME = eventUtils.addNamespace(dragEvents.leave, DRAGGABLE),
    POINTERDOWN_EVENT_NAME = eventUtils.addNamespace(pointerEvents.down, DRAGGABLE),
    CLONE_CLASS = "clone";
var targetDraggable, sourceDraggable;
var ScrollHelper = function() {
    function ScrollHelper(orientation, component) {
        _classCallCheck(this, ScrollHelper);
        this._preventScroll = true;
        this._component = component;
        if ("vertical" === orientation) {
            this._scrollValue = "scrollTop";
            this._overFlowAttr = "overflowY";
            this._sizeAttr = "height";
            this._scrollSizeProp = "scrollHeight";
            this._limitProps = {
                start: "top",
                end: "bottom"
            }
        } else {
            this._scrollValue = "scrollLeft";
            this._overFlowAttr = "overflowX";
            this._sizeAttr = "width";
            this._scrollSizeProp = "scrollWidth";
            this._limitProps = {
                start: "left",
                end: "right"
            }
        }
    }
    _createClass(ScrollHelper, [{
        key: "updateScrollable",
        value: function(elements, mousePosition) {
            var that = this;
            if (!elements.some(function(element) {
                    return that._trySetScrollable(element, mousePosition)
                })) {
                that._$scrollable = null;
                that._scrollSpeed = 0
            }
        }
    }, {
        key: "isScrolling",
        value: function() {
            return !!this._scrollSpeed
        }
    }, {
        key: "_trySetScrollable",
        value: function(element, mousePosition) {
            var distanceToBorders, that = this,
                $element = $(element),
                sensitivity = that._component.option("scrollSensitivity"),
                isScrollable = ("auto" === $element.css(that._overFlowAttr) || $element.hasClass("dx-scrollable-container")) && $element.prop(that._scrollSizeProp) > $element[that._sizeAttr]();
            if (isScrollable) {
                distanceToBorders = that._calculateDistanceToBorders($element, mousePosition);
                if (sensitivity > distanceToBorders[that._limitProps.start]) {
                    if (!that._preventScroll) {
                        that._scrollSpeed = -that._calculateScrollSpeed(distanceToBorders[that._limitProps.start]);
                        that._$scrollable = $element
                    }
                } else {
                    if (sensitivity > distanceToBorders[that._limitProps.end]) {
                        if (!that._preventScroll) {
                            that._scrollSpeed = that._calculateScrollSpeed(distanceToBorders[that._limitProps.end]);
                            that._$scrollable = $element
                        }
                    } else {
                        isScrollable = false;
                        that._preventScroll = false
                    }
                }
            }
            return isScrollable
        }
    }, {
        key: "_calculateDistanceToBorders",
        value: function($area, mousePosition) {
            var areaBoundingRect, area = $area.get(0);
            if (area) {
                areaBoundingRect = area.getBoundingClientRect();
                return {
                    left: mousePosition.x - areaBoundingRect.left,
                    top: mousePosition.y - areaBoundingRect.top,
                    right: areaBoundingRect.right - mousePosition.x,
                    bottom: areaBoundingRect.bottom - mousePosition.y
                }
            } else {
                return {}
            }
        }
    }, {
        key: "_calculateScrollSpeed",
        value: function(distance) {
            var component = this._component,
                sensitivity = component.option("scrollSensitivity"),
                maxSpeed = component.option("scrollSpeed");
            return Math.ceil(Math.pow((sensitivity - distance) / sensitivity, 2) * maxSpeed)
        }
    }, {
        key: "scrollByStep",
        value: function() {
            var nextScrollPosition, that = this;
            if (that._$scrollable && that._scrollSpeed) {
                if (that._$scrollable.hasClass("dx-scrollable-container")) {
                    var $scrollable = that._$scrollable.closest(".dx-scrollable"),
                        scrollableInstance = $scrollable.data("dxScrollable") || $scrollable.data("dxScrollView");
                    if (scrollableInstance) {
                        nextScrollPosition = scrollableInstance.scrollOffset();
                        nextScrollPosition[that._limitProps.start] += that._scrollSpeed;
                        scrollableInstance.scrollTo(nextScrollPosition)
                    }
                } else {
                    nextScrollPosition = that._$scrollable[that._scrollValue]() + that._scrollSpeed;
                    that._$scrollable[that._scrollValue](nextScrollPosition)
                }
                var dragMoveArgs = that._component._dragMoveArgs;
                if (dragMoveArgs) {
                    that._component._dragMoveHandler(dragMoveArgs)
                }
            }
        }
    }, {
        key: "reset",
        value: function() {
            this._$scrollable = null;
            this._scrollSpeed = 0;
            this._preventScroll = true
        }
    }]);
    return ScrollHelper
}();
var ScrollAnimator = Animator.inherit({
    ctor: function(strategy) {
        this.callBase();
        this._strategy = strategy
    },
    _step: function() {
        var horizontalScrollHelper = this._strategy.horizontalScrollHelper,
            verticalScrollHelper = this._strategy.verticalScrollHelper;
        horizontalScrollHelper && horizontalScrollHelper.scrollByStep();
        verticalScrollHelper && verticalScrollHelper.scrollByStep()
    }
});
var Draggable = DOMComponentWithTemplate.inherit({
    reset: noop,
    dragMove: noop,
    dragEnter: noop,
    dragLeave: noop,
    dragEnd: noop,
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onDragStart: null,
            onDragMove: null,
            onDragEnd: null,
            onDrop: null,
            immediate: true,
            dragDirection: "both",
            boundary: void 0,
            boundOffset: 0,
            allowMoveByClick: false,
            itemData: null,
            container: void 0,
            dragTemplate: void 0,
            contentTemplate: "content",
            handle: "",
            filter: "",
            clone: false,
            autoScroll: true,
            scrollSpeed: 30,
            scrollSensitivity: 60,
            group: void 0,
            data: void 0
        })
    },
    _setOptionsByReference: function() {
        this.callBase.apply(this, arguments);
        extend(this._optionsByReference, {
            component: true,
            group: true,
            itemData: true,
            data: true
        })
    },
    _init: function() {
        this.callBase();
        this._attachEventHandlers();
        this._scrollAnimator = new ScrollAnimator(this);
        this.horizontalScrollHelper = new ScrollHelper("horizontal", this);
        this.verticalScrollHelper = new ScrollHelper("vertical", this)
    },
    _normalizeCursorOffset: function(offset) {
        if (typeUtils.isObject(offset)) {
            offset = {
                h: offset.x,
                v: offset.y
            }
        }
        offset = commonUtils.splitPair(offset).map(function(value) {
            return parseFloat(value)
        });
        return {
            left: offset[0],
            top: 1 === offset.length ? offset[0] : offset[1]
        }
    },
    _getNormalizedCursorOffset: function(offset, options) {
        if (typeUtils.isFunction(offset)) {
            offset = offset.call(this, options)
        }
        return this._normalizeCursorOffset(offset)
    },
    _calculateElementOffset: function(options) {
        var elementOffset = void 0,
            dragElementOffset = void 0,
            event = options.event,
            $element = $(options.itemElement),
            $dragElement = $(options.dragElement),
            isCloned = this._dragElementIsCloned(),
            cursorOffset = this.option("cursorOffset"),
            normalizedCursorOffset = {
                left: 0,
                top: 0
            },
            currentLocate = this._initialLocate = translator.locate($dragElement);
        if (isCloned || options.initialOffset || cursorOffset) {
            elementOffset = options.initialOffset || $element.offset();
            if (cursorOffset) {
                normalizedCursorOffset = this._getNormalizedCursorOffset(cursorOffset, options);
                if (isFinite(normalizedCursorOffset.left)) {
                    elementOffset.left = event.pageX
                }
                if (isFinite(normalizedCursorOffset.top)) {
                    elementOffset.top = event.pageY
                }
            }
            dragElementOffset = $dragElement.offset();
            elementOffset.top -= dragElementOffset.top + (normalizedCursorOffset.top || 0) - currentLocate.top;
            elementOffset.left -= dragElementOffset.left + (normalizedCursorOffset.left || 0) - currentLocate.left
        }
        return elementOffset
    },
    _initPosition: function(options) {
        var $dragElement = $(options.dragElement),
            elementOffset = this._calculateElementOffset(options);
        if (elementOffset) {
            this._move(elementOffset, $dragElement)
        }
        this._startPosition = translator.locate($dragElement)
    },
    _startAnimator: function() {
        if (!this._scrollAnimator.inProgress()) {
            this._scrollAnimator.start()
        }
    },
    _stopAnimator: function() {
        this._scrollAnimator.stop()
    },
    _addWidgetPrefix: function(className) {
        var componentName = this.NAME;
        return dasherize(componentName) + (className ? "-" + className : "")
    },
    _getItemsSelector: function() {
        return this.option("filter") || ""
    },
    _$content: function() {
        var $element = this.$element(),
            $wrapper = $element.children(".dx-template-wrapper");
        return $wrapper.length ? $wrapper : $element
    },
    _attachEventHandlers: function() {
        var _this = this;
        if (this.option("disabled")) {
            return
        }
        var $element = this._$content(),
            itemsSelector = this._getItemsSelector(),
            allowMoveByClick = this.option("allowMoveByClick"),
            data = {
                direction: this.option("dragDirection"),
                immediate: this.option("immediate"),
                checkDropTarget: function() {
                    var targetGroup = _this.option("group"),
                        sourceGroup = _this._getSourceDraggable().option("group");
                    return sourceGroup && sourceGroup === targetGroup
                }
            };
        if (allowMoveByClick) {
            $element = this._getArea();
            eventsEngine.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this))
        }
        if (">" === itemsSelector[0]) {
            itemsSelector = itemsSelector.slice(1)
        }
        eventsEngine.on($element, DRAGSTART_EVENT_NAME, itemsSelector, data, this._dragStartHandler.bind(this));
        eventsEngine.on($element, DRAG_EVENT_NAME, data, this._dragMoveHandler.bind(this));
        eventsEngine.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));
        eventsEngine.on($element, DRAG_ENTER_EVENT_NAME, data, this._dragEnterHandler.bind(this));
        eventsEngine.on($element, DRAGEND_LEAVE_EVENT_NAME, data, this._dragLeaveHandler.bind(this))
    },
    _dragElementIsCloned: function() {
        return this._$dragElement && this._$dragElement.hasClass(this._addWidgetPrefix(CLONE_CLASS))
    },
    _getDragTemplateArgs: function($element, $container) {
        return {
            container: getPublicElement($container),
            model: {
                itemData: this.option("itemData"),
                itemElement: getPublicElement($element)
            }
        }
    },
    _createDragElement: function($element) {
        var result = $element,
            clone = this.option("clone"),
            $container = this._getContainer(),
            template = this.option("dragTemplate");
        if (template) {
            template = this._getTemplate(template);
            result = $("<div>").appendTo($container);
            template.render(this._getDragTemplateArgs($element, result))
        } else {
            if (clone) {
                result = $("<div>").appendTo($container);
                $element.clone().css({
                    width: $element.css("width"),
                    height: $element.css("height")
                }).appendTo(result)
            }
        }
        return result.toggleClass(this._addWidgetPrefix(CLONE_CLASS), result.get(0) !== $element.get(0))
    },
    _resetDragElement: function() {
        if (this._dragElementIsCloned()) {
            this._$dragElement.remove()
        } else {
            this._toggleDraggingClass(false)
        }
        this._$dragElement = null
    },
    _resetSourceElement: function() {
        this._toggleDragSourceClass(false);
        this._$sourceElement = null
    },
    _detachEventHandlers: function() {
        eventsEngine.off(this._$content(), "." + DRAGGABLE);
        eventsEngine.off(this._getArea(), "." + DRAGGABLE)
    },
    _move: function(position, $element) {
        translator.move($element || this._$dragElement, position)
    },
    _getDraggableElement: function(e) {
        var $sourceElement = this._getSourceElement();
        if ($sourceElement) {
            return $sourceElement
        }
        var allowMoveByClick = this.option("allowMoveByClick");
        if (allowMoveByClick) {
            return this.$element()
        }
        var $target = $(e && e.target),
            itemsSelector = this._getItemsSelector();
        if (">" === itemsSelector[0]) {
            var $items = this._$content().find(itemsSelector);
            if (!$items.is($target)) {
                $target = $target.closest($items)
            }
        }
        return $target
    },
    _getSourceElement: function() {
        var draggable = this._getSourceDraggable();
        return draggable._$sourceElement
    },
    _pointerDownHandler: function(e) {
        if (eventUtils.needSkipEvent(e)) {
            return
        }
        var position = {},
            $element = this.$element(),
            dragDirection = this.option("dragDirection");
        if ("horizontal" === dragDirection || "both" === dragDirection) {
            position.left = e.pageX - $element.offset().left + translator.locate($element).left - $element.width() / 2
        }
        if ("vertical" === dragDirection || "both" === dragDirection) {
            position.top = e.pageY - $element.offset().top + translator.locate($element).top - $element.height() / 2
        }
        this._move(position, $element);
        this._getAction("onDragMove")(this._getEventArgs(e))
    },
    _isValidElement: function(event, $element) {
        var handle = this.option("handle"),
            $target = $(event.originalEvent && event.originalEvent.target);
        if (handle && !$target.closest(handle).length) {
            return false
        }
        if (!$element.length) {
            return false
        }
        return !$element.is(".dx-state-disabled, .dx-state-disabled *")
    },
    _dragStartHandler: function(e) {
        var $dragElement = void 0,
            initialOffset = void 0,
            isFixedPosition = void 0,
            $element = this._getDraggableElement(e);
        if (this._$sourceElement) {
            return
        }
        if (!this._isValidElement(e, $element)) {
            e.cancel = true;
            return
        }
        var dragStartArgs = this._getDragStartArgs(e, $element);
        this._getAction("onDragStart")(dragStartArgs);
        if (dragStartArgs.cancel) {
            e.cancel = true;
            return
        }
        this.option("itemData", dragStartArgs.itemData);
        this._setSourceDraggable();
        this._$sourceElement = $element;
        initialOffset = $element.offset();
        $dragElement = this._$dragElement = this._createDragElement($element);
        this._toggleDraggingClass(true);
        this._toggleDragSourceClass(true);
        isFixedPosition = "fixed" === $dragElement.css("position");
        this._initPosition(extend({}, dragStartArgs, {
            dragElement: $dragElement.get(0),
            initialOffset: isFixedPosition && initialOffset
        }));
        var $area = this._getArea(),
            areaOffset = this._getAreaOffset($area),
            boundOffset = this._getBoundOffset(),
            areaWidth = $area.outerWidth(),
            areaHeight = $area.outerHeight(),
            elementWidth = $dragElement.width(),
            elementHeight = $dragElement.height();
        var startOffset = {
            left: $dragElement.offset().left - areaOffset.left,
            top: $dragElement.offset().top - areaOffset.top
        };
        if ($area.length) {
            e.maxLeftOffset = startOffset.left - boundOffset.left;
            e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
            e.maxTopOffset = startOffset.top - boundOffset.top;
            e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom
        }
        if (this.option("autoScroll")) {
            this._startAnimator()
        }
    },
    _getAreaOffset: function($area) {
        var offset = $area && positionUtils.offset($area);
        return offset ? offset : {
            left: 0,
            top: 0
        }
    },
    _toggleDraggingClass: function(value) {
        this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix("dragging"), value)
    },
    _toggleDragSourceClass: function(value, $element) {
        var $sourceElement = $element || this._$sourceElement;
        $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix("source"), value)
    },
    _getBoundOffset: function() {
        var boundOffset = this.option("boundOffset");
        if (typeUtils.isFunction(boundOffset)) {
            boundOffset = boundOffset.call(this)
        }
        return stringUtils.quadToObject(boundOffset)
    },
    _getArea: function() {
        var area = this.option("boundary");
        if (typeUtils.isFunction(area)) {
            area = area.call(this)
        }
        return $(area)
    },
    _getContainer: function() {
        var container = this.option("container");
        if (void 0 === container) {
            container = viewPortUtils.value()
        }
        return $(container)
    },
    _dragMoveHandler: function(e) {
        this._dragMoveArgs = e;
        if (!this._$dragElement) {
            e.cancel = true;
            return
        }
        var offset = e.offset,
            startPosition = this._startPosition;
        this._move({
            left: startPosition.left + offset.x,
            top: startPosition.top + offset.y
        });
        if (this.option("autoScroll")) {
            this._updateScrollable(e)
        }
        var eventArgs = this._getEventArgs(e);
        this._getAction("onDragMove")(eventArgs);
        if (true === eventArgs.cancel) {
            return
        }
        var targetDraggable = this._getTargetDraggable();
        targetDraggable.dragMove(e)
    },
    _updateScrollable: function(e) {
        var allObjects, that = this,
            $dragElement = that._$dragElement,
            ownerDocument = $dragElement.get(0).ownerDocument,
            $window = $(window),
            mousePosition = {
                x: e.pageX - $window.scrollLeft(),
                y: e.pageY - $window.scrollTop()
            };
        if (browser.msie) {
            var msElements = ownerDocument.msElementsFromPoint(mousePosition.x, mousePosition.y);
            if (msElements) {
                allObjects = Array.prototype.slice.call(msElements)
            } else {
                allObjects = []
            }
        } else {
            allObjects = ownerDocument.elementsFromPoint(mousePosition.x, mousePosition.y)
        }
        that.verticalScrollHelper && that.verticalScrollHelper.updateScrollable(allObjects, mousePosition);
        that.horizontalScrollHelper && that.horizontalScrollHelper.updateScrollable(allObjects, mousePosition)
    },
    _defaultActionArgs: function() {
        var args = this.callBase.apply(this, arguments),
            component = this.option("component");
        if (component) {
            args.component = component;
            args.element = component.element()
        }
        return args
    },
    _getEventArgs: function(e) {
        var sourceDraggable = this._getSourceDraggable(),
            targetDraggable = this._getTargetDraggable();
        return {
            event: e,
            itemData: sourceDraggable.option("itemData"),
            itemElement: getPublicElement(sourceDraggable._$sourceElement),
            fromComponent: sourceDraggable.option("component") || sourceDraggable,
            toComponent: targetDraggable.option("component") || targetDraggable,
            fromData: sourceDraggable.option("data"),
            toData: targetDraggable.option("data")
        }
    },
    _getDragStartArgs: function(e, $itemElement) {
        var args = this._getEventArgs(e);
        return {
            event: args.event,
            itemData: args.itemData,
            itemElement: $itemElement,
            fromData: args.fromData
        }
    },
    _revertItemToInitialPosition: function() {
        !this._dragElementIsCloned() && this._move(this._initialLocate, this._$sourceElement)
    },
    _dragEndHandler: function(e) {
        var dragEndEventArgs = this._getEventArgs(e),
            dropEventArgs = this._getEventArgs(e),
            targetDraggable = this._getTargetDraggable(),
            needRevertPosition = true;
        try {
            this._getAction("onDragEnd")(dragEndEventArgs)
        } finally {
            if (!dragEndEventArgs.cancel) {
                if (targetDraggable !== this) {
                    targetDraggable._getAction("onDrop")(dropEventArgs)
                }
                if (!dropEventArgs.cancel) {
                    targetDraggable.dragEnd(dragEndEventArgs);
                    needRevertPosition = false
                }
            }
            if (needRevertPosition) {
                this._revertItemToInitialPosition()
            }
            this.reset();
            targetDraggable.reset();
            this._stopAnimator();
            this.horizontalScrollHelper.reset();
            this.verticalScrollHelper.reset();
            this._resetDragElement();
            this._resetSourceElement();
            this._resetTargetDraggable();
            this._resetSourceDraggable()
        }
    },
    _dragEnterHandler: function(e) {
        this._setTargetDraggable();
        var sourceDraggable = this._getSourceDraggable();
        sourceDraggable.dragEnter(e)
    },
    _dragLeaveHandler: function(e) {
        this._resetTargetDraggable();
        if (this !== this._getSourceDraggable()) {
            this.reset()
        }
        var sourceDraggable = this._getSourceDraggable();
        sourceDraggable.dragLeave(e)
    },
    _getAction: function(name) {
        return this["_" + name + "Action"] || this._createActionByOption(name)
    },
    _getAnonymousTemplateName: function() {
        return "content"
    },
    _initTemplates: function() {
        if (!this.option("contentTemplate")) {
            return
        }
        this.callBase.apply(this, arguments);
        this._defaultTemplates.content = new EmptyTemplate
    },
    _render: function() {
        this.callBase();
        this.$element().addClass(this._addWidgetPrefix());
        var transclude = this._getAnonymousTemplateName() === this.option("contentTemplate"),
            template = this._getTemplateByOption("contentTemplate");
        if (template) {
            $(template.render({
                container: this.element(),
                transclude: transclude
            }))
        }
    },
    _optionChanged: function(args) {
        var name = args.name;
        switch (name) {
            case "onDragStart":
            case "onDragMove":
            case "onDragEnd":
            case "onDrop":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "dragTemplate":
            case "contentTemplate":
            case "container":
            case "clone":
                this._resetDragElement();
                break;
            case "allowMoveByClick":
            case "dragDirection":
            case "disabled":
            case "boundary":
            case "filter":
            case "immediate":
                this._resetDragElement();
                this._detachEventHandlers();
                this._attachEventHandlers();
                break;
            case "autoScroll":
                this.verticalScrollHelper.reset();
                this.horizontalScrollHelper.reset();
                break;
            case "scrollSensitivity":
            case "scrollSpeed":
            case "boundOffset":
            case "handle":
            case "group":
            case "data":
            case "itemData":
                break;
            default:
                this.callBase(args)
        }
    },
    _getTargetDraggable: function() {
        return targetDraggable || this
    },
    _getSourceDraggable: function() {
        return sourceDraggable || this
    },
    _setTargetDraggable: function() {
        var currentGroup = this.option("group"),
            sourceDraggable = this._getSourceDraggable();
        if (currentGroup && currentGroup === sourceDraggable.option("group")) {
            targetDraggable = this
        }
    },
    _setSourceDraggable: function() {
        sourceDraggable = this
    },
    _resetSourceDraggable: function() {
        sourceDraggable = null
    },
    _resetTargetDraggable: function() {
        targetDraggable = null
    },
    _dispose: function() {
        this.callBase();
        this._detachEventHandlers();
        this._resetDragElement();
        this._resetTargetDraggable();
        this._resetSourceDraggable();
        this._$sourceElement = null;
        this._stopAnimator()
    }
});
registerComponent(DRAGGABLE, Draggable);
module.exports = Draggable;
module.exports.default = module.exports;
