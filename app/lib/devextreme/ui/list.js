/**
 * DevExtreme (ui/list.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ListEdit = require("./list/ui.list.edit.search"),
    registerComponent = require("../core/component_registrator");
registerComponent("dxList", ListEdit);
module.exports = ListEdit;
module.exports.default = module.exports;
