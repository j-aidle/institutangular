/**
 * DevExtreme (ui/diagram/ui.diagram.optionsupdate.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
    return typeof obj
} : function(obj) {
    return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
};
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
var _diagram_bar = require("./diagram_bar");
var _diagram_bar2 = _interopRequireDefault(_diagram_bar);
var _diagram_importer = require("./diagram_importer");

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
var DiagramOptionsUpdateBar = function(_DiagramBar) {
    _inherits(DiagramOptionsUpdateBar, _DiagramBar);

    function DiagramOptionsUpdateBar(owner) {
        _classCallCheck(this, DiagramOptionsUpdateBar);
        var _this = _possibleConstructorReturn(this, (DiagramOptionsUpdateBar.__proto__ || Object.getPrototypeOf(DiagramOptionsUpdateBar)).call(this, owner));
        var _getDiagram = (0, _diagram_importer.getDiagram)(),
            DiagramCommand = _getDiagram.DiagramCommand;
        _this.commandOptions = {};
        _this.commandOptions[DiagramCommand.Fullscreen] = "fullScreen";
        _this.commandOptions[DiagramCommand.ZoomLevel] = function(value) {
            if ("object" === _typeof(this._getOption("zoomLevel"))) {
                this._setOption("zoomLevel.value", value)
            } else {
                this._setOption("zoomLevel", value)
            }
        };
        _this.commandOptions[DiagramCommand.SwitchAutoZoom] = function(value) {
            var _getDiagram2 = (0, _diagram_importer.getDiagram)(),
                AutoZoomMode = _getDiagram2.AutoZoomMode;
            switch (value) {
                case AutoZoomMode.FitContent:
                    this._setOption("autoZoom", "fitContent");
                    break;
                case AutoZoomMode.FitToWidth:
                    this._setOption("autoZoom", "fitWidth");
                    break;
                case AutoZoomMode.Disabled:
                    this._setOption("autoZoom", "disabled")
            }
        };
        _this.commandOptions[DiagramCommand.ToggleSimpleView] = "simpleView";
        _this.commandOptions[DiagramCommand.ShowGrid] = "showGrid";
        _this.commandOptions[DiagramCommand.SnapToGrid] = "snapToGrid";
        _this.commandOptions[DiagramCommand.GridSize] = function(value) {
            if ("object" === _typeof(this._getOption("gridSize"))) {
                this._setOption("gridSize.value", value)
            } else {
                this._setOption("gridSize", value)
            }
        };
        _this.commandOptions[DiagramCommand.ViewUnits] = "viewUnits";
        _this.commandOptions[DiagramCommand.PageSize] = "pageSize";
        _this.commandOptions[DiagramCommand.PageLandscape] = function(value) {
            this._setOption("pageOrientation", value ? "landscape" : "portrait")
        };
        _this.commandOptions[DiagramCommand.ViewUnits] = function(value) {
            var _getDiagram3 = (0, _diagram_importer.getDiagram)(),
                DiagramUnit = _getDiagram3.DiagramUnit;
            switch (value) {
                case DiagramUnit.In:
                    this._setOption("viewUnits", "in");
                    break;
                case DiagramUnit.Cm:
                    this._setOption("viewUnits", "cm");
                    break;
                case DiagramUnit.Px:
                    this._setOption("viewUnits", "px")
            }
        };
        _this.commandOptions[DiagramCommand.PageColor] = "pageColor";
        _this._updateLock = 0;
        return _this
    }
    _createClass(DiagramOptionsUpdateBar, [{
        key: "getCommandKeys",
        value: function() {
            return Object.keys(this.commandOptions).map(function(key) {
                return parseInt(key)
            })
        }
    }, {
        key: "setItemValue",
        value: function(key, value) {
            if (this.isUpdateLocked()) {
                return
            }
            this.beginUpdate();
            try {
                if ("function" === typeof this.commandOptions[key]) {
                    this.commandOptions[key].call(this, value)
                } else {
                    this._setOption(this.commandOptions[key], value)
                }
            } finally {
                this.endUpdate()
            }
        }
    }, {
        key: "beginUpdate",
        value: function() {
            this._updateLock++
        }
    }, {
        key: "endUpdate",
        value: function() {
            this._updateLock--
        }
    }, {
        key: "isUpdateLocked",
        value: function() {
            return this._updateLock > 0
        }
    }, {
        key: "_getOption",
        value: function(name) {
            return this._owner.option(name)
        }
    }, {
        key: "_setOption",
        value: function(name, value) {
            this._owner.option(name, value)
        }
    }]);
    return DiagramOptionsUpdateBar
}(_diagram_bar2.default);
module.exports = DiagramOptionsUpdateBar;
