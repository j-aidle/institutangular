/**
 * DevExtreme (ui/scroll_view/ui.scrollable.js)
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
var _support = require("../../core/utils/support");
var _support2 = _interopRequireDefault(_support);
var _browser = require("../../core/utils/browser");
var _browser2 = _interopRequireDefault(_browser);
var _common = require("../../core/utils/common");
var _common2 = _interopRequireDefault(_common);
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _extend = require("../../core/utils/extend");
var _dom = require("../../core/utils/dom");
var _window = require("../../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _devices = require("../../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _dom_component = require("../../core/dom_component");
var _dom_component2 = _interopRequireDefault(_dom_component);
var _selectors = require("../widget/selectors");
var _selectors2 = _interopRequireDefault(_selectors);
var _utils = require("../../events/utils");
var _utils2 = _interopRequireDefault(_utils);
var _uiEventsEmitterGesture = require("./ui.events.emitter.gesture.scroll");
var _uiEventsEmitterGesture2 = _interopRequireDefault(_uiEventsEmitterGesture);
var _uiScrollable = require("./ui.scrollable.simulated");
var _uiScrollable2 = _interopRequireDefault(_uiScrollable);
var _uiScrollable3 = require("./ui.scrollable.native");
var _uiScrollable4 = _interopRequireDefault(_uiScrollable3);
var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var SCROLLABLE = "dxScrollable";
var SCROLLABLE_STRATEGY = "dxScrollableStrategy";
var SCROLLABLE_CLASS = "dx-scrollable";
var SCROLLABLE_DISABLED_CLASS = "dx-scrollable-disabled";
var SCROLLABLE_CONTAINER_CLASS = "dx-scrollable-container";
var SCROLLABLE_WRAPPER_CLASS = "dx-scrollable-wrapper";
var SCROLLABLE_CONTENT_CLASS = "dx-scrollable-content";
var SCROLLABLE_CUSTOMIZABLE_SCROLLBARS_CLASS = "dx-scrollable-customizable-scrollbars";
var VERTICAL = "vertical";
var HORIZONTAL = "horizontal";
var BOTH = "both";
var deviceDependentOptions = function() {
    return [{
        device: function() {
            return !_support2.default.nativeScrolling
        },
        options: {
            useNative: false
        }
    }, {
        device: function(_device) {
            return !_devices2.default.isSimulator() && "desktop" === _devices2.default.real().deviceType && "generic" === _device.platform
        },
        options: {
            bounceEnabled: false,
            scrollByThumb: true,
            scrollByContent: _support2.default.touch,
            showScrollbar: "onHover"
        }
    }]
};
var Scrollable = _dom_component2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            disabled: false,
            onScroll: null,
            direction: VERTICAL,
            showScrollbar: "onScroll",
            useNative: true,
            bounceEnabled: true,
            scrollByContent: true,
            scrollByThumb: false,
            onUpdated: null,
            onStart: null,
            onEnd: null,
            onBounce: null,
            onStop: null,
            useSimulatedScrollbar: false,
            useKeyboard: true,
            inertiaEnabled: true,
            pushBackValue: 0,
            updateManually: false
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat(deviceDependentOptions(), [{
            device: function() {
                return _support2.default.nativeScrolling && "android" === _devices2.default.real().platform && !_browser2.default.mozilla
            },
            options: {
                useSimulatedScrollbar: true
            }
        }, {
            device: function() {
                return "ios" === _devices2.default.real().platform
            },
            options: {
                pushBackValue: 1
            }
        }])
    },
    _initOptions: function(options) {
        this.callBase(options);
        if (!("useSimulatedScrollbar" in options)) {
            this._setUseSimulatedScrollbar()
        }
    },
    _setUseSimulatedScrollbar: function() {
        if (!this.initialOption("useSimulatedScrollbar")) {
            this.option("useSimulatedScrollbar", !this.option("useNative"))
        }
    },
    _init: function() {
        this.callBase();
        this._initScrollableMarkup();
        this._locked = false
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            this.update();
            this._updateRtlPosition();
            this._savedScrollOffset && this.scrollTo(this._savedScrollOffset);
            delete this._savedScrollOffset
        } else {
            this._savedScrollOffset = this.scrollOffset()
        }
    },
    _initScrollableMarkup: function() {
        var $element = this.$element().addClass(SCROLLABLE_CLASS),
            $container = this._$container = (0, _renderer2.default)("<div>").addClass(SCROLLABLE_CONTAINER_CLASS),
            $wrapper = this._$wrapper = (0, _renderer2.default)("<div>").addClass(SCROLLABLE_WRAPPER_CLASS),
            $content = this._$content = (0, _renderer2.default)("<div>").addClass(SCROLLABLE_CONTENT_CLASS);
        if (_dom_adapter2.default.hasDocumentProperty("onbeforeactivate") && _browser2.default.msie && _browser2.default.version < 12) {
            _events_engine2.default.on($element, _utils2.default.addNamespace("beforeactivate", SCROLLABLE), function(e) {
                if (!(0, _renderer2.default)(e.target).is(_selectors2.default.focusable)) {
                    e.preventDefault()
                }
            })
        }
        $content.append($element.contents()).appendTo($container);
        $container.appendTo($wrapper);
        $wrapper.appendTo($element)
    },
    _dimensionChanged: function() {
        this.update()
    },
    _attachNativeScrollbarsCustomizationCss: function() {
        if ("desktop" === _devices2.default.real().deviceType && !(_window2.default.getNavigator().platform.indexOf("Mac") > -1 && _browser2.default.webkit)) {
            this.$element().addClass(SCROLLABLE_CUSTOMIZABLE_SCROLLBARS_CLASS)
        }
    },
    _initMarkup: function() {
        this.callBase();
        this._renderDirection()
    },
    _render: function() {
        this._renderStrategy();
        this._attachNativeScrollbarsCustomizationCss();
        this._attachEventHandlers();
        this._renderDisabledState();
        this._createActions();
        this.update();
        this.callBase();
        this._updateRtlPosition()
    },
    _updateRtlPosition: function() {
        var _this = this;
        this._updateBounds();
        if (this.option("rtlEnabled") && this.option("direction") !== VERTICAL) {
            _common2.default.deferUpdate(function() {
                var containerElement = _this._container().get(0);
                var maxLeftOffset = containerElement.scrollWidth - containerElement.clientWidth;
                _common2.default.deferRender(function() {
                    _this.scrollTo({
                        left: maxLeftOffset
                    })
                })
            })
        }
    },
    _updateBounds: function() {
        this._strategy.updateBounds()
    },
    _attachEventHandlers: function() {
        var strategy = this._strategy;
        var initEventData = {
            getDirection: strategy.getDirection.bind(strategy),
            validate: this._validate.bind(this),
            isNative: this.option("useNative"),
            scrollTarget: this._$container
        };
        _events_engine2.default.off(this._$wrapper, "." + SCROLLABLE);
        _events_engine2.default.on(this._$wrapper, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.init, SCROLLABLE), initEventData, this._initHandler.bind(this));
        _events_engine2.default.on(this._$wrapper, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.start, SCROLLABLE), strategy.handleStart.bind(strategy));
        _events_engine2.default.on(this._$wrapper, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.move, SCROLLABLE), strategy.handleMove.bind(strategy));
        _events_engine2.default.on(this._$wrapper, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.end, SCROLLABLE), strategy.handleEnd.bind(strategy));
        _events_engine2.default.on(this._$wrapper, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.cancel, SCROLLABLE), strategy.handleCancel.bind(strategy));
        _events_engine2.default.on(this._$wrapper, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.stop, SCROLLABLE), strategy.handleStop.bind(strategy));
        _events_engine2.default.off(this._$container, "." + SCROLLABLE);
        _events_engine2.default.on(this._$container, _utils2.default.addNamespace("scroll", SCROLLABLE), strategy.handleScroll.bind(strategy))
    },
    _validate: function(e) {
        if (this._isLocked()) {
            return false
        }
        this._updateIfNeed();
        return this._strategy.validate(e)
    },
    _initHandler: function() {
        var strategy = this._strategy;
        strategy.handleInit.apply(strategy, arguments)
    },
    _renderDisabledState: function() {
        this.$element().toggleClass(SCROLLABLE_DISABLED_CLASS, this.option("disabled"));
        if (this.option("disabled")) {
            this._lock()
        } else {
            this._unlock()
        }
    },
    _renderDirection: function() {
        this.$element().removeClass("dx-scrollable-" + HORIZONTAL).removeClass("dx-scrollable-" + VERTICAL).removeClass("dx-scrollable-" + BOTH).addClass("dx-scrollable-" + this.option("direction"))
    },
    _renderStrategy: function() {
        this._createStrategy();
        this._strategy.render();
        this.$element().data(SCROLLABLE_STRATEGY, this._strategy)
    },
    _createStrategy: function() {
        this._strategy = this.option("useNative") ? new _uiScrollable4.default(this) : new _uiScrollable2.default.SimulatedStrategy(this)
    },
    _createActions: function() {
        this._strategy && this._strategy.createActions()
    },
    _clean: function() {
        this._strategy && this._strategy.dispose()
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onStart":
            case "onEnd":
            case "onStop":
            case "onUpdated":
            case "onScroll":
            case "onBounce":
                this._createActions();
                break;
            case "direction":
                this._resetInactiveDirection();
                this._invalidate();
                break;
            case "useNative":
                this._setUseSimulatedScrollbar();
                this._invalidate();
                break;
            case "inertiaEnabled":
            case "scrollByContent":
            case "scrollByThumb":
            case "bounceEnabled":
            case "useKeyboard":
            case "showScrollbar":
            case "useSimulatedScrollbar":
            case "pushBackValue":
                this._invalidate();
                break;
            case "disabled":
                this._renderDisabledState();
                this._strategy && this._strategy.disabledChanged();
                break;
            case "updateManually":
                break;
            case "width":
                this.callBase(args);
                this._updateRtlPosition();
                break;
            default:
                this.callBase(args)
        }
    },
    _resetInactiveDirection: function() {
        var inactiveProp = this._getInactiveProp();
        if (!inactiveProp || !_window2.default.hasWindow()) {
            return
        }
        var scrollOffset = this.scrollOffset();
        scrollOffset[inactiveProp] = 0;
        this.scrollTo(scrollOffset)
    },
    _getInactiveProp: function() {
        var direction = this.option("direction");
        if (direction === VERTICAL) {
            return "left"
        }
        if (direction === HORIZONTAL) {
            return "top"
        }
    },
    _location: function() {
        return this._strategy.location()
    },
    _normalizeLocation: function(location) {
        if (_type2.default.isPlainObject(location)) {
            var left = _common2.default.ensureDefined(location.left, location.x);
            var top = _common2.default.ensureDefined(location.top, location.y);
            return {
                left: _type2.default.isDefined(left) ? -left : void 0,
                top: _type2.default.isDefined(top) ? -top : void 0
            }
        } else {
            var direction = this.option("direction");
            return {
                left: direction !== VERTICAL ? -location : void 0,
                top: direction !== HORIZONTAL ? -location : void 0
            }
        }
    },
    _isLocked: function() {
        return this._locked
    },
    _lock: function() {
        this._locked = true
    },
    _unlock: function() {
        if (!this.option("disabled")) {
            this._locked = false
        }
    },
    _isDirection: function(direction) {
        var current = this.option("direction");
        if (direction === VERTICAL) {
            return current !== HORIZONTAL
        }
        if (direction === HORIZONTAL) {
            return current !== VERTICAL
        }
        return current === direction
    },
    _updateAllowedDirection: function() {
        var allowedDirections = this._strategy._allowedDirections();
        if (this._isDirection(BOTH) && allowedDirections.vertical && allowedDirections.horizontal) {
            this._allowedDirectionValue = BOTH
        } else {
            if (this._isDirection(HORIZONTAL) && allowedDirections.horizontal) {
                this._allowedDirectionValue = HORIZONTAL
            } else {
                if (this._isDirection(VERTICAL) && allowedDirections.vertical) {
                    this._allowedDirectionValue = VERTICAL
                } else {
                    this._allowedDirectionValue = null
                }
            }
        }
    },
    _allowedDirection: function() {
        return this._allowedDirectionValue
    },
    _container: function() {
        return this._$container
    },
    $content: function() {
        return this._$content
    },
    content: function() {
        return (0, _dom.getPublicElement)(this._$content)
    },
    scrollOffset: function() {
        var location = this._location();
        return {
            top: -location.top,
            left: -location.left
        }
    },
    scrollTop: function() {
        return this.scrollOffset().top
    },
    scrollLeft: function() {
        return this.scrollOffset().left
    },
    clientHeight: function() {
        return this._$container.height()
    },
    scrollHeight: function() {
        return this.$content().outerHeight() - 2 * this._strategy.verticalOffset()
    },
    clientWidth: function() {
        return this._$container.width()
    },
    scrollWidth: function() {
        return this.$content().outerWidth()
    },
    update: function() {
        if (!this._strategy) {
            return
        }
        return (0, _deferred.when)(this._strategy.update()).done(function() {
            this._updateAllowedDirection()
        }.bind(this))
    },
    scrollBy: function(distance) {
        distance = this._normalizeLocation(distance);
        if (!distance.top && !distance.left) {
            return
        }
        this._updateIfNeed();
        this._strategy.scrollBy(distance)
    },
    scrollTo: function(targetLocation) {
        targetLocation = this._normalizeLocation(targetLocation);
        this._updateIfNeed();
        var location = this._location();
        if (!this.option("useNative")) {
            targetLocation = this._strategy._applyScaleRatio(targetLocation);
            location = this._strategy._applyScaleRatio(location)
        }
        var distance = this._normalizeLocation({
            left: location.left - _common2.default.ensureDefined(targetLocation.left, location.left),
            top: location.top - _common2.default.ensureDefined(targetLocation.top, location.top)
        });
        if (!distance.top && !distance.left) {
            return
        }
        this._strategy.scrollBy(distance)
    },
    scrollToElement: function(element, offset) {
        offset = offset || {};
        var $element = (0, _renderer2.default)(element);
        var elementInsideContent = this.$content().find(element).length;
        var elementIsInsideContent = $element.parents("." + SCROLLABLE_CLASS).length - $element.parents("." + SCROLLABLE_CONTENT_CLASS).length === 0;
        if (!elementInsideContent || !elementIsInsideContent) {
            return
        }
        var scrollPosition = {
            top: 0,
            left: 0
        };
        var direction = this.option("direction");
        if (direction !== VERTICAL) {
            scrollPosition.left = this._scrollToElementPosition($element, HORIZONTAL, offset)
        }
        if (direction !== HORIZONTAL) {
            scrollPosition.top = this._scrollToElementPosition($element, VERTICAL, offset)
        }
        this.scrollTo(scrollPosition)
    },
    _scrollToElementPosition: function($element, direction, offset) {
        var isVertical = direction === VERTICAL;
        var startOffset = (isVertical ? offset.top : offset.left) || 0;
        var endOffset = (isVertical ? offset.bottom : offset.right) || 0;
        var pushBackOffset = isVertical ? this._strategy.verticalOffset() : 0;
        var elementPositionRelativeToContent = this._elementPositionRelativeToContent($element, isVertical ? "top" : "left");
        var elementPosition = elementPositionRelativeToContent - pushBackOffset;
        var elementSize = $element[isVertical ? "outerHeight" : "outerWidth"]();
        var scrollLocation = isVertical ? this.scrollTop() : this.scrollLeft();
        var clientSize = isVertical ? this.clientHeight() : this.clientWidth();
        var startDistance = scrollLocation - elementPosition + startOffset;
        var endDistance = scrollLocation - elementPosition - elementSize + clientSize - endOffset;
        if (startDistance <= 0 && endDistance >= 0) {
            return scrollLocation
        }
        return scrollLocation - (Math.abs(startDistance) > Math.abs(endDistance) ? endDistance : startDistance)
    },
    _elementPositionRelativeToContent: function($element, prop) {
        var result = 0;
        while (this._hasScrollContent($element)) {
            result += $element.position()[prop];
            $element = $element.offsetParent()
        }
        return result
    },
    _hasScrollContent: function($element) {
        var $content = this.$content();
        return $element.closest($content).length && !$element.is($content)
    },
    _updateIfNeed: function() {
        if (!this.option("updateManually")) {
            this.update()
        }
    }
});
(0, _component_registrator2.default)(SCROLLABLE, Scrollable);
module.exports = Scrollable;
module.exports.deviceDependentOptions = deviceDependentOptions;
