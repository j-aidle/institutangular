/**
 * DevExtreme (ui/diagram/ui.diagram.dialogmanager.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _diagram_importer = require("./diagram_importer");
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _window = require("../../core/utils/window");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var FileUploader = require("../file_uploader");
var DiagramDialogManager = {
    getConfigurations: function() {
        var _getDiagram = (0, _diagram_importer.getDiagram)(),
            DiagramCommand = _getDiagram.DiagramCommand;
        return this.dialogList || (this.dialogList = [{
            command: DiagramCommand.InsertShapeImage,
            title: _message2.default.format("dxDiagram-dialogInsertShapeImageTitle"),
            onGetContent: this.getChangeImageDialogContent
        }, {
            command: DiagramCommand.EditShapeImage,
            title: _message2.default.format("dxDiagram-dialogEditShapeImageTitle"),
            onGetContent: this.getChangeImageDialogContent
        }])
    },
    getChangeImageDialogContent: function(args) {
        var $uploader = (0, _renderer2.default)("<div>");
        args.component._createComponent($uploader, FileUploader, {
            selectButtonText: _message2.default.format("dxDiagram-dialogEditShapeImageSelectButton"),
            accept: "image/*",
            uploadMode: "useForm",
            onValueChanged: function(e) {
                var window = (0, _window.getWindow)();
                var reader = new window.FileReader;
                reader.onload = function(e) {
                    args.component._commandParameter = e.target.result
                };
                reader.readAsDataURL(e.value[0])
            }
        });
        return $uploader
    },
    getDialogParameters: function(command) {
        var commandIndex = this.getConfigurations().map(function(c) {
            return c.command
        }).indexOf(command);
        if (commandIndex >= 0) {
            return this.getConfigurations()[commandIndex]
        } else {
            return null
        }
    }
};
module.exports = DiagramDialogManager;
