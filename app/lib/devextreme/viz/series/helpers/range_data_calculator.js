/**
 * DevExtreme (viz/series/helpers/range_data_calculator.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _utils = require("../../core/utils");
var _type = require("../../../core/utils/type");
var _common = require("../../../core/utils/common");
var DISCRETE = "discrete";
var abs = Math.abs,
    floor = Math.floor,
    ceil = Math.ceil;

function continuousRangeCalculator(range, minValue, maxValue) {
    range.min = range.min < minValue ? range.min : minValue;
    range.max = range.max > maxValue ? range.max : maxValue
}

function createGetLogFunction(axisType, axis) {
    if ("logarithmic" !== axisType) {
        return null
    }
    var base = axis.getOptions().logarithmBase;
    return function(value) {
        var log = (0, _utils.getLog)(abs(value), base);
        var round = log < 0 ? floor : ceil;
        return round(log)
    }
}

function getRangeCalculator(axisType, axis, getLog) {
    var rangeCalculator = continuousRangeCalculator;
    if (axisType === DISCRETE) {
        rangeCalculator = function(range, minValue, maxValue) {
            if (minValue !== maxValue) {
                range.categories.push(maxValue)
            }
            range.categories.push(minValue)
        }
    } else {
        if (axis) {
            rangeCalculator = function(range, value) {
                var interval = axis.calculateInterval(value, range.prevValue),
                    minInterval = range.interval;
                range.interval = (minInterval < interval ? minInterval : interval) || minInterval;
                range.prevValue = value;
                continuousRangeCalculator(range, value, value)
            }
        }
    }
    if (getLog) {
        return function(range, minValue, maxValue) {
            rangeCalculator(range, minValue, maxValue);
            var linearThreshold = Math.min(getLog(minValue), getLog(maxValue));
            range.linearThreshold = range.linearThreshold < linearThreshold ? range.linearThreshold : linearThreshold
        }
    }
    return rangeCalculator
}

function getInitialRange(axisType, dataType, firstValue) {
    var range = {
        axisType: axisType,
        dataType: dataType
    };
    if (axisType === DISCRETE) {
        range.categories = []
    } else {
        range.min = firstValue;
        range.max = firstValue
    }
    return range
}

function processCategories(range) {
    if (range.categories) {
        range.categories = (0, _utils.unique)(range.categories)
    }
    return range
}

function getValueForArgument(point, extraPoint, x, range) {
    if (extraPoint && (0, _type.isDefined)(extraPoint.value)) {
        var y1 = point.value,
            y2 = extraPoint.value,
            x1 = point.argument,
            x2 = extraPoint.argument;
        var r = (x - x1) * (y2 - y1) / (x2 - x1) + y1.valueOf();
        return "datetime" === range.dataType ? new Date(r) : r
    } else {
        return point.value
    }
}

function calculateRangeBetweenPoints(rangeCalculator, range, point, prevPoint, bound) {
    var value = getValueForArgument(point, prevPoint, bound, range);
    rangeCalculator(range, value, value)
}

function isLineSeries(series) {
    return series.type.toLowerCase().indexOf("line") >= 0 || series.type.toLowerCase().indexOf("area") >= 0
}

function getViewportReducer(series) {
    var viewportFilter, rangeCalculator = getRangeCalculator(series.valueAxisType),
        argumentAxis = series.getArgumentAxis(),
        viewport = argumentAxis && series.getArgumentAxis().visualRange() || {},
        calculatePointBetweenPoints = isLineSeries(series) ? calculateRangeBetweenPoints : _common.noop;
    if (argumentAxis && argumentAxis.getMarginOptions().checkInterval) {
        var range = series.getArgumentAxis().getTranslator().getBusinessRange();
        var add = (0, _utils.getAddFunction)(range, false);
        var interval = range.interval;
        if (isFinite(interval) && (0, _type.isDefined)(viewport.startValue) && (0, _type.isDefined)(viewport.endValue)) {
            viewport.startValue = add(viewport.startValue, interval, -1);
            viewport.endValue = add(viewport.endValue, interval)
        }
    }
    viewportFilter = getViewPortFilter(viewport);
    return function(range, point, index, points) {
        var argument = point.argument;
        if (!point.hasValue()) {
            return range
        }
        if (viewportFilter(argument)) {
            if (!range.startCalc) {
                range.startCalc = true;
                calculatePointBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.startValue)
            }
            rangeCalculator(range, point.getMinValue(), point.getMaxValue())
        } else {
            if (!viewport.categories && (0, _type.isDefined)(viewport.startValue) && argument > viewport.startValue) {
                if (!range.startCalc) {
                    calculatePointBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.startValue)
                }
                range.endCalc = true;
                calculatePointBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.endValue)
            }
        }
        return range
    }
}

function getViewPortFilter(viewport) {
    if (viewport.categories) {
        var dictionary = viewport.categories.reduce(function(result, category) {
            result[category.valueOf()] = true;
            return result
        }, {});
        return function(argument) {
            return (0, _type.isDefined)(argument) && dictionary[argument.valueOf()]
        }
    }
    if (!(0, _type.isDefined)(viewport.startValue) && !(0, _type.isDefined)(viewport.endValue)) {
        return function() {
            return true
        }
    }
    if (!(0, _type.isDefined)(viewport.endValue)) {
        return function(argument) {
            return argument >= viewport.startValue
        }
    }
    if (!(0, _type.isDefined)(viewport.startValue)) {
        return function(argument) {
            return argument <= viewport.endValue
        }
    }
    return function(argument) {
        return argument >= viewport.startValue && argument <= viewport.endValue
    }
}
module.exports = {
    getViewPortFilter: getViewPortFilter,
    getArgumentRange: function(series) {
        var data = series._data || [],
            range = {};
        if (data.length) {
            if (series.argumentAxisType === DISCRETE) {
                range = {
                    categories: data.map(function(item) {
                        return item.argument
                    })
                }
            } else {
                var interval = void 0;
                if (data.length > 1) {
                    var i1 = series.getArgumentAxis().calculateInterval(data[0].argument, data[1].argument);
                    var i2 = series.getArgumentAxis().calculateInterval(data[data.length - 1].argument, data[data.length - 2].argument);
                    interval = Math.min(i1, i2)
                }
                range = {
                    min: data[0].argument,
                    max: data[data.length - 1].argument,
                    interval: interval
                }
            }
        }
        return processCategories(range)
    },
    getRangeData: function(series) {
        var points = series.getPoints();
        var useAggregation = series.useAggregation();
        var argumentCalculator = getRangeCalculator(series.argumentAxisType, points.length > 1 && series.getArgumentAxis(), createGetLogFunction(series.argumentAxisType, series.getArgumentAxis()));
        var valueRangeCalculator = getRangeCalculator(series.valueAxisType, null, createGetLogFunction(series.valueAxisType, series.getValueAxis()));
        var viewportReducer = getViewportReducer(series);
        var range = points.reduce(function(range, point, index, points) {
            var argument = point.argument;
            if (!point.isArgumentCorrect()) {
                return range
            }
            argumentCalculator(range.arg, argument, argument);
            if (point.hasValue()) {
                valueRangeCalculator(range.val, point.getMinValue(), point.getMaxValue());
                viewportReducer(range.viewport, point, index, points)
            }
            return range
        }, {
            arg: getInitialRange(series.argumentAxisType, series.argumentType),
            val: getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : void 0),
            viewport: getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : void 0)
        });
        if (useAggregation) {
            var argumentRange = this.getArgumentRange(series);
            if (series.argumentAxisType === DISCRETE) {
                range.arg = argumentRange
            } else {
                var viewport = series.getArgumentAxis().getViewport();
                if ((0, _type.isDefined)(viewport.startValue) || (0, _type.isDefined)(viewport.length)) {
                    argumentCalculator(range.arg, argumentRange.min, argumentRange.min)
                }
                if ((0, _type.isDefined)(viewport.endValue) || (0, _type.isDefined)(viewport.length) && (0, _type.isDefined)(viewport.startValue)) {
                    argumentCalculator(range.arg, argumentRange.max, argumentRange.max)
                }
            }
        }
        processCategories(range.arg);
        processCategories(range.val);
        return range
    },
    getViewport: function(series) {
        var reducer, points = series.getPoints(),
            range = {};
        reducer = getViewportReducer(series);
        range = getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : void 0);
        points.some(function(point, index) {
            reducer(range, point, index, points);
            return range.endCalc
        });
        return range
    },
    getPointsInViewPort: function(series) {
        var argumentViewPortFilter = getViewPortFilter(series.getArgumentAxis().visualRange() || {}),
            valueViewPort = series.getValueAxis().visualRange() || {},
            valueViewPortFilter = getViewPortFilter(valueViewPort),
            points = series.getPoints(),
            addValue = function(values, point, isEdge) {
                var minValue = point.getMinValue(),
                    maxValue = point.getMaxValue(),
                    isMinValueInViewPort = valueViewPortFilter(minValue),
                    isMaxValueInViewPort = valueViewPortFilter(maxValue);
                if (isMinValueInViewPort) {
                    values.push(minValue)
                }
                if (maxValue !== minValue && isMaxValueInViewPort) {
                    values.push(maxValue)
                }
                if (isEdge && !isMinValueInViewPort && !isMaxValueInViewPort) {
                    if (!values.length) {
                        values.push(valueViewPort.startValue)
                    } else {
                        values.push(valueViewPort.endValue)
                    }
                }
            },
            addEdgePoints = isLineSeries(series) ? function(result, points, index) {
                var point = points[index],
                    prevPoint = points[index - 1],
                    nextPoint = points[index + 1];
                if (nextPoint && argumentViewPortFilter(nextPoint.argument)) {
                    addValue(result[1], point, true)
                }
                if (prevPoint && argumentViewPortFilter(prevPoint.argument)) {
                    addValue(result[1], point, true)
                }
            } : _common.noop,
            checkPointInViewport = function(result, point, index) {
                if (argumentViewPortFilter(point.argument)) {
                    addValue(result[0], point)
                } else {
                    addEdgePoints(result, points, index)
                }
                return result
            };
        return points.reduce(checkPointInViewport, [
            [],
            []
        ])
    }
};
