/**
 * DevExtreme (viz/translators/logarithmic_translator.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var vizUtils = require("../core/utils"),
    isDefined = require("../../core/utils/type").isDefined,
    raiseTo = vizUtils.raiseToExt,
    getLog = vizUtils.getLogExt;
module.exports = {
    _fromValue: function(value) {
        return null !== value ? getLog(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value
    },
    _toValue: function(value) {
        return null !== value ? raiseTo(value, this._canvasOptions.base, this._businessRange.allowNegatives, this._businessRange.linearThreshold) : value
    },
    getMinBarSize: function(minBarSize) {
        var visibleArea = this.getCanvasVisibleArea(),
            minValue = this.from(visibleArea.min + minBarSize),
            canvasOptions = this._canvasOptions;
        return Math.pow(canvasOptions.base, canvasOptions.rangeMinVisible + this._fromValue(this.from(visibleArea.min)) - this._fromValue(!isDefined(minValue) ? this.from(visibleArea.max) : minValue))
    },
    checkMinBarSize: function(initialValue, minShownValue, stackValue) {
        var minBarSize, updateValue, canvasOptions = this._canvasOptions,
            prevValue = stackValue - initialValue,
            baseMethod = this.constructor.prototype.checkMinBarSize;
        if (isDefined(minShownValue) && prevValue > 0) {
            minBarSize = baseMethod(this._fromValue(stackValue / prevValue), this._fromValue(minShownValue) - canvasOptions.rangeMinVisible);
            updateValue = Math.pow(canvasOptions.base, this._fromValue(prevValue) + minBarSize) - prevValue
        } else {
            updateValue = baseMethod(initialValue, minShownValue)
        }
        return updateValue
    }
};
