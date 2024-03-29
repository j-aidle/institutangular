/**
 * DevExtreme (core/dom_component_with_template.js)
 * Version: 19.2.4
 * Build date: Tue Nov 19 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("./renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _type = require("./utils/type");
var _common = require("./utils/common");
var _extend = require("./utils/extend");
var _errors = require("./errors");
var _dom = require("./utils/dom");
var _devices = require("./devices");
var _devices2 = _interopRequireDefault(_devices);
var _dom_component = require("./dom_component");
var _dom_component2 = _interopRequireDefault(_dom_component);
var _template = require("./templates/template");
var _template_base = require("./templates/template_base");
var _function_template = require("./templates/function_template");
var _empty_template = require("./templates/empty_template");
var _child_default_template = require("./templates/child_default_template");
var _inflector = require("./utils/inflector");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var TEXT_NODE = 3;
var ANONYMOUS_TEMPLATE_NAME = "template";
var TEMPLATE_SELECTOR = "[data-options*='dxTemplate']";
var TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
var DX_POLYMORPH_WIDGET_TEMPLATE = new _function_template.FunctionTemplate(function(options) {
    var widgetName = options.model.widget;
    if (widgetName) {
        var widgetElement = (0, _renderer2.default)("<div>"),
            widgetOptions = options.model.options || {};
        if ("button" === widgetName || "tabs" === widgetName || "dropDownMenu" === widgetName) {
            var deprecatedName = widgetName;
            widgetName = (0, _inflector.camelize)("dx-" + widgetName);
            (0, _errors.log)("W0001", "dxToolbar - 'widget' item field", deprecatedName, "16.1", "Use: '" + widgetName + "' instead")
        }
        if (options.parent) {
            options.parent._createComponent(widgetElement, widgetName, widgetOptions)
        } else {
            widgetElement[widgetName](widgetOptions)
        }
        return widgetElement
    }
    return (0, _renderer2.default)()
});
var DOMComponentWithTemplate = _dom_component2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            integrationOptions: {
                watchMethod: function(fn, callback, options) {
                    options = options || {};
                    if (!options.skipImmediate) {
                        callback(fn())
                    }
                    return _common.noop
                },
                templates: {
                    "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE
                },
                createTemplate: function(element) {
                    return new _template.Template(element)
                }
            }
        })
    },
    _init: function() {
        this.callBase();
        this._tempTemplates = [];
        this._defaultTemplates = {};
        this._initTemplates()
    },
    _dispose: function() {
        this._cleanTemplates();
        this.callBase()
    },
    _cleanTemplates: function() {
        this._tempTemplates.forEach(function(t) {
            t.template.dispose && t.template.dispose()
        });
        this._tempTemplates = []
    },
    _initTemplates: function() {
        this._extractTemplates();
        this._extractAnonymousTemplate()
    },
    _extractTemplates: function() {
        var templateElements = this.$element().contents().filter(TEMPLATE_SELECTOR);
        var templatesMap = {};
        templateElements.each(function(_, template) {
            var templateOptions = (0, _dom.getElementOptions)(template).dxTemplate;
            if (!templateOptions) {
                return
            }
            if (!templateOptions.name) {
                throw (0, _errors.Error)("E0023")
            }(0, _renderer2.default)(template).addClass(TEMPLATE_WRAPPER_CLASS).detach();
            templatesMap[templateOptions.name] = templatesMap[templateOptions.name] || [];
            templatesMap[templateOptions.name].push(template)
        });
        for (var templateName in templatesMap) {
            var deviceTemplate = this._findTemplateByDevice(templatesMap[templateName]);
            if (deviceTemplate) {
                this._saveTemplate(templateName, deviceTemplate)
            }
        }
    },
    _saveTemplate: function(name, template) {
        var templates = this.option("integrationOptions.templates");
        templates[name] = this._createTemplate(template)
    },
    _findTemplateByDevice: function(templates) {
        var suitableTemplate = (0, _common.findBestMatches)(_devices2.default.current(), templates, function(template) {
            return (0, _dom.getElementOptions)(template).dxTemplate
        })[0];
        templates.forEach(function(template) {
            if (template !== suitableTemplate) {
                (0, _renderer2.default)(template).remove()
            }
        });
        return suitableTemplate
    },
    _extractAnonymousTemplate: function() {
        var templates = this.option("integrationOptions.templates"),
            anonymousTemplateName = this._getAnonymousTemplateName(),
            $anonymousTemplate = this.$element().contents().detach();
        var $notJunkTemplateContent = $anonymousTemplate.filter(function(_, element) {
                var isTextNode = element.nodeType === TEXT_NODE,
                    isEmptyText = (0, _renderer2.default)(element).text().trim().length < 1;
                return !(isTextNode && isEmptyText)
            }),
            onlyJunkTemplateContent = $notJunkTemplateContent.length < 1;
        if (!templates[anonymousTemplateName] && !onlyJunkTemplateContent) {
            templates[anonymousTemplateName] = this._createTemplate($anonymousTemplate)
        }
    },
    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME
    },
    _createTemplateIfNeeded: function(templateSource) {
        var templateKey = function(templateSource) {
            return (0, _type.isRenderer)(templateSource) && templateSource[0] || templateSource
        };
        var cachedTemplate = this._tempTemplates.filter(function(t) {
            templateSource = templateKey(templateSource);
            return t.source === templateSource
        })[0];
        if (cachedTemplate) {
            return cachedTemplate.template
        }
        var template = this._createTemplate(templateSource);
        this._tempTemplates.push({
            template: template,
            source: templateKey(templateSource)
        });
        return template
    },
    _createTemplate: function(templateSource) {
        templateSource = "string" === typeof templateSource ? (0, _dom.normalizeTemplateElement)(templateSource) : templateSource;
        return this.option("integrationOptions.createTemplate")(templateSource)
    },
    _getTemplateByOption: function(optionName) {
        return this._getTemplate(this.option(optionName))
    },
    _getTemplate: function(templateSource) {
        if ((0, _type.isFunction)(templateSource)) {
            return new _function_template.FunctionTemplate(function(options) {
                var templateSourceResult = templateSource.apply(this, this._getNormalizedTemplateArgs(options));
                if (!(0, _type.isDefined)(templateSourceResult)) {
                    return new _empty_template.EmptyTemplate
                }
                var dispose = false;
                var template = this._acquireTemplate(templateSourceResult, function(templateSource) {
                    if (templateSource.nodeType || (0, _type.isRenderer)(templateSource) && !(0, _renderer2.default)(templateSource).is("script")) {
                        return new _function_template.FunctionTemplate(function() {
                            return templateSource
                        })
                    }
                    dispose = true;
                    return this._createTemplate(templateSource)
                }.bind(this));
                var result = template.render(options);
                dispose && template.dispose && template.dispose();
                return result
            }.bind(this))
        }
        return this._acquireTemplate(templateSource, this._createTemplateIfNeeded.bind(this))
    },
    _acquireTemplate: function(templateSource, createTemplate) {
        if (null == templateSource) {
            return new _empty_template.EmptyTemplate
        }
        if (templateSource instanceof _child_default_template.ChildDefaultTemplate) {
            return this._defaultTemplates[templateSource.name]
        }
        if (templateSource instanceof _template_base.TemplateBase) {
            return templateSource
        }
        if ((0, _type.isFunction)(templateSource.render) && !(0, _type.isRenderer)(templateSource)) {
            return this._addOneRenderedCall(templateSource)
        }
        if (templateSource.nodeType || (0, _type.isRenderer)(templateSource)) {
            return createTemplate((0, _renderer2.default)(templateSource))
        }
        if ("string" === typeof templateSource) {
            var nonIntegrationTemplates = this.option("integrationOptions.skipTemplates") || [];
            var integrationTemplate = null;
            if (nonIntegrationTemplates.indexOf(templateSource) === -1) {
                integrationTemplate = this._renderIntegrationTemplate(templateSource)
            }
            return integrationTemplate || this._defaultTemplates[templateSource] || createTemplate(templateSource)
        }
        return this._acquireTemplate(templateSource.toString(), createTemplate)
    },
    _getNormalizedTemplateArgs: function(options) {
        var args = [];
        if ("model" in options) {
            args.push(options.model)
        }
        if ("index" in options) {
            args.push(options.index)
        }
        args.push(options.container);
        return args
    },
    _addOneRenderedCall: function(template) {
        var _render = template.render.bind(template);
        return (0, _extend.extend)({}, template, {
            render: function(options) {
                var templateResult = _render(options);
                options && options.onRendered && options.onRendered();
                return templateResult
            }
        })
    },
    _renderIntegrationTemplate: function(templateSource) {
        var integrationTemplate = this.option("integrationOptions.templates")[templateSource];
        if (integrationTemplate && !(integrationTemplate instanceof _template_base.TemplateBase)) {
            var isAsyncTemplate = this.option("templatesRenderAsynchronously");
            if (!isAsyncTemplate) {
                return this._addOneRenderedCall(integrationTemplate)
            }
        }
        return integrationTemplate
    }
});
module.exports = DOMComponentWithTemplate;
