// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/components/presentation-admin-nav/index.marko",
    marko_component = require("./index.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_classAttr = marko_helpers.ca;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<nav class=\"navbar navbar-expand-lg navbar-dark bg-primary\"><button class=\"navbar-toggler rounded-0\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarToggler\" aria-controls=\"navbarToggler\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"><span class=\"navbar-toggler-icon\"></span></button><a class=\"navbar-brand text-light\"><small>Администрирование</small></a><div class=\"collapse navbar-collapse\" id=\"navbarToggler\"><ul class=\"navbar-nav mr-auto mt-2 mt-lg-0\"><li" +
    marko_classAttr("nav-item " + (input.page === "schedule" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/admin/schedule\">Программа конференции</a></li>");

  if (input.is_admin) {
    out.w("<li" +
      marko_classAttr("nav-item " + (input.page === "info" ? "active" : "")) +
      "><a class=\"nav-link\" href=\"/admin/info\">Общая информация</a></li><li" +
      marko_classAttr("nav-item " + (input.page === "speakers" ? "active" : "")) +
      "><a class=\"nav-link\" href=\"/admin/speakers\">Наша команда</a></li><li" +
      marko_classAttr("nav-item " + (input.page === "feedback" ? "active" : "")) +
      "><a class=\"nav-link\" href=\"/admin/feedback\">Обратная связь</a></li><li" +
      marko_classAttr("nav-item " + (input.page === "settings" ? "active" : "")) +
      "><a class=\"nav-link\" href=\"/admin/settings\">Настройки</a></li>");
  }

  out.w("<li" +
    marko_classAttr("nav-item " + (input.page === "mod" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/mod\">Модераторская</a></li></ul></div></nav>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/components/presentation-admin-nav/index.marko",
    component: "./"
  };
