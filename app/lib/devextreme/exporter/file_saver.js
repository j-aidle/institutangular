/**
 * DevExtreme (exporter/file_saver.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _dom_adapter = require("../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _window = require("../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _ui = require("../ui/widget/ui.errors");
var _ui2 = _interopRequireDefault(_ui);
var _type = require("../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _console = require("../core/utils/console");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = _window2.default.getWindow();
var navigator = _window2.default.getNavigator();
var FILE_EXTESIONS = {
    EXCEL: "xlsx",
    CSS: "css",
    PNG: "png",
    JPEG: "jpeg",
    GIF: "gif",
    SVG: "svg",
    PDF: "pdf"
};
var MIME_TYPES = exports.MIME_TYPES = {
    CSS: "text/css",
    EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PNG: "image/png",
    JPEG: "image/jpeg",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    PDF: "application/pdf"
};
exports.fileSaver = {
    _revokeObjectURLTimeout: 3e4,
    _getDataUri: function(format, data) {
        return "data:" + MIME_TYPES[format] + ";base64," + data
    },
    _linkDownloader: function(fileName, href) {
        var exportLinkElement = _dom_adapter2.default.createElement("a");
        exportLinkElement.download = fileName;
        exportLinkElement.href = href;
        exportLinkElement.target = "_blank";
        return exportLinkElement
    },
    _formDownloader: function(proxyUrl, fileName, contentType, data) {
        var formAttributes = {
                method: "post",
                action: proxyUrl,
                enctype: "multipart/form-data"
            },
            exportForm = (0, _renderer2.default)("<form>").css({
                display: "none"
            }).attr(formAttributes);
        exportForm.append('<input type="hidden" name="fileName" value="' + fileName + '" />');
        exportForm.append('<input type="hidden" name="contentType" value="' + contentType + '" />');
        exportForm.append('<input type="hidden" name="data" value="' + data + '" />');
        exportForm.appendTo("body");
        _events_engine2.default.trigger(exportForm, "submit");
        if (_events_engine2.default.trigger(exportForm, "submit")) {
            exportForm.remove()
        }
    },
    _saveByProxy: function(proxyUrl, fileName, format, data) {
        return this._formDownloader(proxyUrl, fileName, MIME_TYPES[format], data)
    },
    _winJSBlobSave: function(blob, fileName, format) {
        var savePicker = new Windows.Storage.Pickers.FileSavePicker;
        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        savePicker.fileTypeChoices.insert(MIME_TYPES[format], ["." + FILE_EXTESIONS[format]]);
        savePicker.suggestedFileName = fileName;
        savePicker.pickSaveFileAsync().then(function(file) {
            if (file) {
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function(outputStream) {
                    var inputStream = blob.msDetachStream();
                    Windows.Storage.Streams.RandomAccessStream.copyAsync(inputStream, outputStream).then(function() {
                        outputStream.flushAsync().done(function() {
                            inputStream.close();
                            outputStream.close()
                        })
                    })
                })
            }
        })
    },
    _click: function(link) {
        try {
            link.dispatchEvent(new MouseEvent("click", {
                cancelable: true
            }))
        } catch (e) {
            var event = _dom_adapter2.default.getDocument().createEvent("MouseEvents");
            event.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
            link.dispatchEvent(event)
        }
    },
    _saveBlobAs: function(fileName, format, data) {
        var _this = this;
        this._blobSaved = false;
        if (_type2.default.isDefined(navigator.msSaveOrOpenBlob)) {
            navigator.msSaveOrOpenBlob(data, fileName);
            this._blobSaved = true
        } else {
            if (_type2.default.isDefined(window.WinJS)) {
                this._winJSBlobSave(data, fileName, format);
                this._blobSaved = true
            } else {
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;
                if (_type2.default.isDefined(URL)) {
                    var objectURL = URL.createObjectURL(data);
                    var downloadLink = this._linkDownloader(fileName, objectURL);
                    setTimeout(function() {
                        URL.revokeObjectURL(objectURL);
                        _this._objectUrlRevoked = true
                    }, this._revokeObjectURLTimeout);
                    this._click(downloadLink)
                } else {
                    _console.logger.warn("window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL is not defined")
                }
            }
        }
    },
    saveAs: function(fileName, format, data, proxyURL, forceProxy) {
        fileName += "." + FILE_EXTESIONS[format];
        if (_type2.default.isDefined(proxyURL)) {
            _ui2.default.log("W0001", "Export", "proxyURL", "19.2", "This option is no longer required")
        }
        if (forceProxy) {
            this._saveByProxy(proxyURL, fileName, format, data)
        } else {
            if (_type2.default.isFunction(window.Blob)) {
                this._saveBlobAs(fileName, format, data)
            } else {
                if (_type2.default.isDefined(proxyURL) && !_type2.default.isDefined(navigator.userAgent.match(/iPad/i))) {
                    this._saveByProxy(proxyURL, fileName, format, data)
                } else {
                    if (!_type2.default.isDefined(navigator.userAgent.match(/iPad/i))) {
                        _ui2.default.log("E1034")
                    }
                    var downloadLink = this._linkDownloader(fileName, this._getDataUri(format, data));
                    this._click(downloadLink)
                }
            }
        }
    }
};
