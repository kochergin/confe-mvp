// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/components/presentation-nav/index.marko",
    marko_component = require("./index.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_classAttr = marko_helpers.ca;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"navbar-expand-xl bg-primary\"><div class=\"container\"><nav class=\"navbar navbar-dark\"><button class=\"navbar-toggler rounded-0 collapsed\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarToggler\"><span class=\"navbar-toggler-icon\"></span></button><a class=\"navbar-brand\" href=\"/\"><img src=\"/images/logo_white.png\" width=\"96\" height=\"32\" alt=\"Roxar\"></a><div class=\"navbar-collapse collapse\" id=\"navbarToggler\"><ul class=\"navbar-nav mr-auto mt-2 mt-lg-0\"><li" +
    marko_classAttr("nav-item " + (input.page === "home" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/\">Домашняя страница</a></li><li" +
    marko_classAttr("nav-item " + (input.page === "schedule" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/schedule\">Программа конференции</a></li><li" +
    marko_classAttr("nav-item " + (input.page === "now" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/now\">Сейчас</a></li><li" +
    marko_classAttr("nav-item " + (input.page === "info" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/info\">Общая информация</a></li><li" +
    marko_classAttr("nav-item " + (input.page === "speakers" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/speakers\">Наша команда</a></li><li" +
    marko_classAttr("nav-item " + (input.page === "feedback" ? "active" : "")) +
    "><a class=\"nav-link\" href=\"/feedback\">Обратная связь</a></li></ul></div></nav></div></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/components/presentation-nav/index.marko",
    component: "./"
  };
