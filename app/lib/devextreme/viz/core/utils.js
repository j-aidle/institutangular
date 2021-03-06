/**
 * DevExtreme (viz/core/utils.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    mathUtils = require("../../core/utils/math"),
    dateToMilliseconds = require("../../core/utils/date").dateToMilliseconds,
    domAdapter = require("../../core/dom_adapter"),
    isDefined = typeUtils.isDefined,
    isNumber = typeUtils.isNumeric,
    isExponential = typeUtils.isExponential,
    _math = Math,
    _round = _math.round,
    _sqrt = Math.sqrt;
var PI = Math.PI,
    MAX_PIXEL_COUNT = 1e10,
    PI_DIV_180 = PI / 180,
    LN10 = Math.LN10;
var cosFunc = Math.cos,
    sinFunc = Math.sin,
    abs = Math.abs,
    log = Math.log,
    floor = Math.floor,
    ceil = Math.ceil,
    max = Math.max,
    _isNaN = isNaN,
    _Number = Number,
    _NaN = NaN;
var adjust = mathUtils.adjust,
    sign = mathUtils.sign;
var PANE_PADDING = 10;
var getLog = function(value, base) {
    if (!value) {
        return _NaN
    }
    return Math.log(value) / Math.log(base)
};
var getAdjustedLog10 = function(value) {
    return adjust(getLog(value, 10))
};
var raiseTo = function(power, base) {
    return Math.pow(base, power)
};
var normalizeAngle = function(angle) {
    return (angle % 360 + 360) % 360
};
var convertAngleToRendererSpace = function(angle) {
    return 90 - angle
};
var degreesToRadians = function(value) {
    return PI * value / 180
};
var getCosAndSin = function(angle) {
    var angleInRadians = degreesToRadians(angle);
    return {
        cos: cosFunc(angleInRadians),
        sin: sinFunc(angleInRadians)
    }
};
var DECIMAL_ORDER_THRESHOLD = 1e-14;
var getDistance = function(x1, y1, x2, y2) {
    var diffX = x2 - x1,
        diffY = y2 - y1;
    return Math.sqrt(diffY * diffY + diffX * diffX)
};
var getDecimalOrder = function(number) {
    var cn, n = abs(number);
    if (!_isNaN(n)) {
        if (n > 0) {
            n = log(n) / LN10;
            cn = ceil(n);
            return cn - n < DECIMAL_ORDER_THRESHOLD ? cn : floor(n)
        }
        return 0
    }
    return _NaN
};
var getAppropriateFormat = function(start, end, count) {
    var format, order = max(getDecimalOrder(start), getDecimalOrder(end)),
        precision = -getDecimalOrder(abs(end - start) / count);
    if (!_isNaN(order) && !_isNaN(precision)) {
        if (abs(order) <= 4) {
            format = "fixedPoint";
            precision < 0 && (precision = 0);
            precision > 4 && (precision = 4)
        } else {
            format = "exponential";
            precision += order - 1;
            precision > 3 && (precision = 3)
        }
        return {
            type: format,
            precision: precision
        }
    }
    return null
};
var roundValue = function(value, precision) {
    if (precision > 20) {
        precision = 20
    }
    if (isNumber(value)) {
        if (isExponential(value)) {
            return _Number(value.toExponential(precision))
        } else {
            return _Number(value.toFixed(precision))
        }
    }
};
var getPower = function(value) {
    return value.toExponential().split("e")[1]
};

function map(array, callback) {
    var value, i = 0,
        len = array.length,
        result = [];
    while (i < len) {
        value = callback(array[i], i);
        if (null !== value) {
            result.push(value)
        }
        i++
    }
    return result
}

function selectByKeys(object, keys) {
    return map(keys, function(key) {
        return object[key] ? object[key] : null
    })
}

function decreaseFields(object, keys, eachDecrease, decrease) {
    var dec = decrease;
    each(keys, function(_, key) {
        if (object[key]) {
            object[key] -= eachDecrease;
            dec -= eachDecrease
        }
    });
    return dec
}

function normalizeEnum(value) {
    return String(value).toLowerCase()
}

function setCanvasValues(canvas) {
    if (canvas) {
        canvas.originalTop = canvas.top;
        canvas.originalBottom = canvas.bottom;
        canvas.originalLeft = canvas.left;
        canvas.originalRight = canvas.right
    }
    return canvas
}

function normalizeBBoxField(value) {
    return -MAX_PIXEL_COUNT < value && value < +MAX_PIXEL_COUNT ? value : 0
}

function normalizeBBox(bBox) {
    var xl = normalizeBBoxField(floor(bBox.x)),
        yt = normalizeBBoxField(floor(bBox.y)),
        xr = normalizeBBoxField(ceil(bBox.width + bBox.x)),
        yb = normalizeBBoxField(ceil(bBox.height + bBox.y)),
        result = {
            x: xl,
            y: yt,
            width: xr - xl,
            height: yb - yt
        };
    result.isEmpty = !result.x && !result.y && !result.width && !result.height;
    return result
}

function rotateBBox(bBox, center, angle) {
    var cos = _Number(cosFunc(angle * PI_DIV_180).toFixed(3)),
        sin = _Number(sinFunc(angle * PI_DIV_180).toFixed(3)),
        w2 = bBox.width / 2,
        h2 = bBox.height / 2,
        centerX = bBox.x + w2,
        centerY = bBox.y + h2,
        w2_ = abs(w2 * cos) + abs(h2 * sin),
        h2_ = abs(w2 * sin) + abs(h2 * cos),
        centerX_ = center[0] + (centerX - center[0]) * cos + (centerY - center[1]) * sin,
        centerY_ = center[1] - (centerX - center[0]) * sin + (centerY - center[1]) * cos;
    return normalizeBBox({
        x: centerX_ - w2_,
        y: centerY_ - h2_,
        width: 2 * w2_,
        height: 2 * h2_
    })
}
extend(exports, {
    decreaseGaps: function(object, keys, decrease) {
        var arrayGaps;
        do {
            arrayGaps = selectByKeys(object, keys);
            arrayGaps.push(_math.ceil(decrease / arrayGaps.length));
            decrease = decreaseFields(object, keys, _math.min.apply(null, arrayGaps), decrease)
        } while (decrease > 0 && arrayGaps.length > 1);
        return decrease
    },
    normalizeEnum: normalizeEnum,
    parseScalar: function(value, defaultValue) {
        return void 0 !== value ? value : defaultValue
    },
    enumParser: function(values) {
        var i, ii, stored = {};
        for (i = 0, ii = values.length; i < ii; ++i) {
            stored[normalizeEnum(values[i])] = 1
        }
        return function(value, defaultValue) {
            var _value = normalizeEnum(value);
            return stored[_value] ? _value : defaultValue
        }
    },
    patchFontOptions: function(options) {
        var fontOptions = {};
        each(options || {}, function(key, value) {
            if (/^(cursor|opacity)$/i.test(key)) {} else {
                if ("color" === key) {
                    key = "fill"
                } else {
                    key = "font-" + key
                }
            }
            fontOptions[key] = value
        });
        return fontOptions
    },
    checkElementHasPropertyFromStyleSheet: function(element, property) {
        var slice = Array.prototype.slice;
        var cssRules = slice.call(domAdapter.getDocument().styleSheets).reduce(function(rules, styleSheet) {
            return rules.concat(slice.call(styleSheet.cssRules || styleSheet.rules))
        }, []);
        var elementRules = cssRules.filter(function(rule) {
            try {
                return domAdapter.elementMatches(element, rule.selectorText)
            } catch (e) {
                return false
            }
        });
        return elementRules.some(function(rule) {
            return !!rule.style[property]
        })
    },
    convertPolarToXY: function(centerCoords, startAngle, angle, radius) {
        var shiftAngle = 90;
        var normalizedRadius = radius > 0 ? radius : 0;
        angle = isDefined(angle) ? angle + startAngle - shiftAngle : 0;
        var cosSin = getCosAndSin(angle);
        return {
            x: _round(centerCoords.x + normalizedRadius * cosSin.cos),
            y: _round(centerCoords.y + normalizedRadius * cosSin.sin)
        }
    },
    convertXYToPolar: function(centerCoords, x, y) {
        var radius = getDistance(centerCoords.x, centerCoords.y, x, y),
            angle = _math.atan2(y - centerCoords.y, x - centerCoords.x);
        return {
            phi: _round(normalizeAngle(180 * angle / _math.PI)),
            r: _round(radius)
        }
    },
    processSeriesTemplate: function(seriesTemplate, items) {
        var series, length, data, customizeSeries = typeUtils.isFunction(seriesTemplate.customizeSeries) ? seriesTemplate.customizeSeries : noop,
            nameField = seriesTemplate.nameField,
            generatedSeries = {},
            seriesOrder = [],
            i = 0;
        items = items || [];
        for (length = items.length; i < length; i++) {
            data = items[i];
            if (nameField in data) {
                series = generatedSeries[data[nameField]];
                if (!series) {
                    series = generatedSeries[data[nameField]] = {
                        name: data[nameField],
                        nameFieldValue: data[nameField]
                    };
                    seriesOrder.push(series.name)
                }
            }
        }
        return map(seriesOrder, function(orderedName) {
            var group = generatedSeries[orderedName];
            return extend(group, customizeSeries.call(null, group.name))
        })
    },
    getCategoriesInfo: function(categories, startValue, endValue) {
        if (0 === categories.length) {
            return {
                categories: []
            }
        }
        startValue = isDefined(startValue) ? startValue : categories[0];
        endValue = isDefined(endValue) ? endValue : categories[categories.length - 1];
        var visibleCategories, swapBuf, lastIdx, categoriesValue = map(categories, function(category) {
                return isDefined(category) ? category.valueOf() : null
            }),
            indexStartValue = categoriesValue.indexOf(startValue.valueOf()),
            indexEndValue = categoriesValue.indexOf(endValue.valueOf()),
            inverted = false;
        indexStartValue < 0 && (indexStartValue = 0);
        indexEndValue < 0 && (indexEndValue = categories.length - 1);
        if (indexEndValue < indexStartValue) {
            swapBuf = indexEndValue;
            indexEndValue = indexStartValue;
            indexStartValue = swapBuf;
            inverted = true
        }
        visibleCategories = categories.slice(indexStartValue, indexEndValue + 1);
        lastIdx = visibleCategories.length - 1;
        return {
            categories: visibleCategories,
            start: visibleCategories[inverted ? lastIdx : 0],
            end: visibleCategories[inverted ? 0 : lastIdx],
            inverted: inverted
        }
    },
    setCanvasValues: setCanvasValues,
    normalizePanesHeight: function(panes) {
        panes.forEach(function(pane) {
            var height = pane.height;
            var unit = 0;
            var parsedHeight = parseFloat(height) || void 0;
            if (typeUtils.isString(height) && height.indexOf("px") > -1 || typeUtils.isNumeric(height) && height > 1) {
                parsedHeight = _round(parsedHeight);
                unit = 1
            }
            if (!unit && parsedHeight) {
                if (typeUtils.isString(height) && height.indexOf("%") > -1) {
                    parsedHeight /= 100
                } else {
                    if (parsedHeight < 0) {
                        parsedHeight = parsedHeight < -1 ? 1 : _math.abs(parsedHeight)
                    }
                }
            }
            pane.height = parsedHeight;
            pane.unit = unit
        });
        var weightSum = panes.filter(function(pane) {
            return !pane.unit
        }).reduce(function(prev, next) {
            return prev + (next.height || 0)
        }, 0);
        var weightHeightCount = panes.filter(function(pane) {
            return !pane.unit
        }).length;
        var emptyHeightCount = panes.filter(function(pane) {
            return !pane.unit && !pane.height
        }).length;
        if (weightSum < 1 && emptyHeightCount) {
            panes.filter(function(pane) {
                return !pane.unit && !pane.height
            }).forEach(function(pane) {
                return pane.height = (1 - weightSum) / emptyHeightCount
            })
        } else {
            if (weightSum > 1 || weightSum < 1 && !emptyHeightCount || 1 === weightSum && emptyHeightCount) {
                if (emptyHeightCount) {
                    var weightForEmpty = weightSum / weightHeightCount;
                    var emptyWeightSum = emptyHeightCount * weightForEmpty;
                    panes.filter(function(pane) {
                        return !pane.unit && pane.height
                    }).forEach(function(pane) {
                        return pane.height *= (weightSum - emptyWeightSum) / weightSum
                    });
                    panes.filter(function(pane) {
                        return !pane.unit && !pane.height
                    }).forEach(function(pane) {
                        return pane.height = weightForEmpty
                    })
                }
                panes.forEach(function(pane) {
                    return !pane.unit && (pane.height *= 1 / weightSum)
                })
            }
        }
    },
    updatePanesCanvases: function(panes, canvas, rotated) {
        var distributedSpace = 0;
        var padding = PANE_PADDING;
        var paneSpace = rotated ? canvas.width - canvas.left - canvas.right : canvas.height - canvas.top - canvas.bottom;
        var usefulSpace = paneSpace - padding * (panes.length - 1);
        var startName = rotated ? "left" : "top";
        var endName = rotated ? "right" : "bottom";
        var totalCustomSpace = panes.reduce(function(prev, cur) {
            return prev + (cur.unit ? cur.height : 0)
        }, 0);
        usefulSpace -= totalCustomSpace;
        panes.forEach(function(pane) {
            var calcLength = pane.unit ? pane.height : _round(pane.height * usefulSpace);
            pane.canvas = pane.canvas || {};
            extend(pane.canvas, canvas);
            pane.canvas[startName] = canvas[startName] + distributedSpace;
            pane.canvas[endName] = canvas[endName] + (paneSpace - calcLength - distributedSpace);
            distributedSpace = distributedSpace + calcLength + padding;
            setCanvasValues(pane.canvas)
        })
    },
    unique: function(array) {
        var values = {};
        return map(array, function(item) {
            var result = !values[item] ? item : null;
            values[item] = true;
            return result
        })
    },
    map: map,
    getVerticallyShiftedAngularCoords: function(bBox, dy, center) {
        var isPositive = bBox.x + bBox.width / 2 >= center.x,
            horizontalOffset1 = (isPositive ? bBox.x : bBox.x + bBox.width) - center.x,
            verticalOffset1 = bBox.y - center.y,
            verticalOffset2 = verticalOffset1 + dy,
            horizontalOffset2 = _round(_sqrt(horizontalOffset1 * horizontalOffset1 + verticalOffset1 * verticalOffset1 - verticalOffset2 * verticalOffset2)),
            dx = (isPositive ? +horizontalOffset2 : -horizontalOffset2) || horizontalOffset1;
        return {
            x: center.x + (isPositive ? dx : dx - bBox.width),
            y: bBox.y + dy
        }
    },
    mergeMarginOptions: function(opt1, opt2) {
        return {
            checkInterval: opt1.checkInterval || opt2.checkInterval,
            size: Math.max(opt1.size || 0, opt2.size || 0),
            percentStick: opt1.percentStick || opt2.percentStick,
            sizePointNormalState: Math.max(opt1.sizePointNormalState || 0, opt2.sizePointNormalState || 0)
        }
    }
});

function getVizRangeObject(value) {
    if (Array.isArray(value)) {
        return {
            startValue: value[0],
            endValue: value[1]
        }
    } else {
        return value || {}
    }
}

function convertVisualRangeObject(visualRange, convertToVisualRange) {
    if (convertToVisualRange) {
        return visualRange
    }
    return [visualRange.startValue, visualRange.endValue]
}

function getAddFunction(range, correctZeroLevel) {
    if ("datetime" === range.dataType) {
        return function(rangeValue, marginValue) {
            var sign = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
            return new Date(rangeValue.getTime() + sign * marginValue)
        }
    }
    if ("logarithmic" === range.axisType) {
        return function(rangeValue, marginValue) {
            var sign = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
            var log = getLogExt(rangeValue, range.base) + sign * marginValue;
            return raiseToExt(log, range.base)
        }
    }
    return function(rangeValue, marginValue) {
        var sign = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        var newValue = rangeValue + sign * marginValue;
        return correctZeroLevel && newValue * rangeValue <= 0 ? 0 : newValue
    }
}

function adjustVisualRange(options, visualRange, wholeRange, dataRange) {
    var minDefined = typeUtils.isDefined(visualRange.startValue);
    var maxDefined = typeUtils.isDefined(visualRange.endValue);
    var nonDiscrete = "discrete" !== options.axisType;
    dataRange = dataRange || wholeRange;
    var add = getAddFunction(options, false);
    var min = minDefined ? visualRange.startValue : dataRange.min;
    var max = maxDefined ? visualRange.endValue : dataRange.max;
    var rangeLength = visualRange.length;
    var categories = dataRange.categories;
    if (nonDiscrete && !typeUtils.isDefined(min) && !typeUtils.isDefined(max)) {
        return {
            startValue: min,
            endValue: max
        }
    }
    if (isDefined(rangeLength)) {
        if (nonDiscrete) {
            if ("datetime" === options.dataType && !isNumber(rangeLength)) {
                rangeLength = dateToMilliseconds(rangeLength)
            }
            if (maxDefined && !minDefined || !maxDefined && !minDefined) {
                isDefined(wholeRange.max) && (max = max > wholeRange.max ? wholeRange.max : max);
                min = add(max, rangeLength, -1)
            } else {
                if (minDefined && !maxDefined) {
                    isDefined(wholeRange.min) && (min = min < wholeRange.min ? wholeRange.min : min);
                    max = add(min, rangeLength)
                }
            }
        } else {
            rangeLength = parseInt(rangeLength);
            if (!isNaN(rangeLength) && isFinite(rangeLength)) {
                rangeLength--;
                if (!maxDefined && !minDefined) {
                    max = categories[categories.length - 1];
                    min = categories[categories.length - 1 - rangeLength]
                } else {
                    if (minDefined && !maxDefined) {
                        var categoriesInfo = exports.getCategoriesInfo(categories, min, void 0);
                        max = categoriesInfo.categories[rangeLength]
                    } else {
                        if (!minDefined && maxDefined) {
                            var _categoriesInfo = exports.getCategoriesInfo(categories, void 0, max);
                            min = _categoriesInfo.categories[_categoriesInfo.categories.length - 1 - rangeLength]
                        }
                    }
                }
            }
        }
    }
    if (nonDiscrete) {
        if (isDefined(wholeRange.max) && max > wholeRange.max) {
            max = wholeRange.max
        }
        if (isDefined(wholeRange.min) && min < wholeRange.min) {
            min = wholeRange.min
        }
    }
    return {
        startValue: min,
        endValue: max
    }
}

function getLogExt(value, base) {
    var allowNegatives = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
    var linearThreshold = arguments[3];
    if (!allowNegatives) {
        return getLog(value, base)
    }
    if (0 === value) {
        return 0
    }
    var transformValue = getLog(Math.abs(value), base) - (linearThreshold - 1);
    if (transformValue < 0) {
        return 0
    }
    return adjust(sign(value) * transformValue, Number(Math.pow(base, linearThreshold - 1).toFixed(Math.abs(linearThreshold))))
}

function raiseToExt(value, base) {
    var allowNegatives = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
    var linearThreshold = arguments[3];
    if (!allowNegatives) {
        return raiseTo(value, base)
    }
    if (0 === value) {
        return 0
    }
    var transformValue = raiseTo(Math.abs(value) + (linearThreshold - 1), base);
    if (transformValue < 0) {
        return 0
    }
    return adjust(sign(value) * transformValue, Number(Math.pow(base, linearThreshold).toFixed(Math.abs(linearThreshold))))
}

function rangesAreEqual(range, rangeFromOptions) {
    if (Array.isArray(rangeFromOptions)) {
        return range.length === rangeFromOptions.length && range.every(function(item, i) {
            return item === rangeFromOptions[i]
        })
    } else {
        return range.startValue === rangeFromOptions.startValue && range.endValue === rangeFromOptions.endValue
    }
}
exports.getVizRangeObject = getVizRangeObject;
exports.convertVisualRangeObject = convertVisualRangeObject;
exports.adjustVisualRange = adjustVisualRange;
exports.getAddFunction = getAddFunction;
exports.getLog = getLog;
exports.getLogExt = getLogExt;
exports.getAdjustedLog10 = getAdjustedLog10;
exports.raiseTo = raiseTo;
exports.raiseToExt = raiseToExt;
exports.normalizeAngle = normalizeAngle;
exports.convertAngleToRendererSpace = convertAngleToRendererSpace;
exports.degreesToRadians = degreesToRadians;
exports.getCosAndSin = getCosAndSin;
exports.getDecimalOrder = getDecimalOrder;
exports.getAppropriateFormat = getAppropriateFormat;
exports.getDistance = getDistance;
exports.roundValue = roundValue;
exports.getPower = getPower;
exports.rotateBBox = rotateBBox;
exports.normalizeBBox = normalizeBBox;
exports.PANE_PADDING = PANE_PADDING;
exports.rangesAreEqual = rangesAreEqual;
