// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/settings-admin/components/settings-admin-content.marko",
    marko_component = require("./settings-admin-content.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_attr = marko_helpers.a,
    marko_escapeXml = marko_helpers.x,
    marko_forEach = marko_helpers.f;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"border border-primary my-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Общие настройки сайта</p> </div> </div></div><div class=\"border p-2 mb-2 collapse show\"><form><div class=\"form-group row\"> <label for=\"site_header\" class=\"col-sm-2 col-form-label\">Заголовок сайта</label> <div class=\"col-sm-10\"><input type=\"text\" name=\"site_header\" class=\"form-control\" id=\"site_header\"" +
    marko_attr("value", "" + data.site_settings.header) +
    "><small class=\"form-text text-muted\">Текст, который будет отображаться в браузере в закладках и т.п.</small></div></div><div class=\"form-group row\"> <label for=\"site_home_header\" class=\"col-sm-2 col-form-label\">Приветствие</label> <div class=\"col-sm-10\"><textarea class=\"form-control my-2\" rows=\"3\">" +
    marko_escapeXml(data.site_settings.home_header) +
    "</textarea><small class=\"form-text text-muted\">Приветствие будет отображаться на главной странице.</small></div></div><div class=\"form-group row\"> <label for=\"site_home_description\" class=\"col-sm-2 col-form-label\">Слоган</label> <div class=\"col-sm-10\"><textarea class=\"form-control my-2\" rows=\"3\">" +
    marko_escapeXml(data.site_settings.home_description) +
    "</textarea><small class=\"form-text text-muted\">Слоган будет отображаться на главной странице сразу под приветствием.</small></div></div><div class=\"form-group row\"> <div class=\"col-sm-2\">Отображение \"подвала\"</div> <div class=\"col-sm-10\"><div class=\"form-check\"><input type=\"checkbox\" class=\"form-check-input\" id=\"site_footer_enabled\"" +
    marko_attr("checked", data.site_settings.footer_enable) +
    "><label class=\"form-check-label\" for=\"site_footer_enabled\">Включить \"подвал\"</label></div><small class=\"form-text text-muted\">\"Подвал\" отображается в нижней части сайта.</small></div></div><div class=\"form-group row\"> <label for=\"site_footer_text\" class=\"col-sm-2 col-form-label\">Содержимое \"подвала\"</label> <div class=\"col-sm-10\"><textarea class=\"form-control my-2\" rows=\"3\">" +
    marko_escapeXml(data.site_settings.footer_text) +
    "</textarea><small class=\"form-text text-muted\">Текст, который будет отображаться в \"подвале\", если тот будет включен.</small></div></div><div class=\"form-group row\"> <label for=\"site_timezone\" class=\"col-sm-2 col-form-label\">Временная зона</label> <div class=\"col-sm-10\"><select class=\"form-control\" id=\"site_timezone\">");

  var $for$0 = 0;

  marko_forEach(data.available_timezones, function(timezone) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    out.w("<option" +
      marko_attr("value", timezone.name) +
      marko_attr("selected", timezone.name == data.site_settings.timezone) +
      ">" +
      marko_escapeXml(timezone.name) +
      " (" +
      marko_escapeXml(timezone.offset >= 0 ? "+" + timezone.offset : timezone.offset) +
      ")</option> ");
  });

  out.w(" </select> <small class=\"form-text text-muted\">Временная зона, которая будет использована на сайте.</small></div></div><div class=\"form-group row\"><div class=\"col-sm-10\"><button type=\"submit\" class=\"btn btn-primary\">Сохранить</button></div></div></form></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/settings-admin/components/settings-admin-content.marko",
    component: "./settings-admin-content.marko"
  };
