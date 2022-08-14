// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/speakers/components/speakers-content.marko",
    marko_component = require("./speakers-content.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x,
    marko_attr = marko_helpers.a,
    marko_classAttr = marko_helpers.ca,
    marko_str = marko_helpers.s;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Наша команда</p> </div> </div></div>");

  var $for$0 = 0;

  marko_forEach(state.speakers, function(speaker, loopIndex, loopAll) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    if (!speaker.hidden) {
      out.w("<div" +
        marko_classAttr("border border-primary mb-1" + (speaker.biography ? " ios-clickable" : "")) +
        marko_attr("id", "" + speaker.link) +
        marko_attr("data-toggle", speaker.biography ? "collapse" : null) +
        marko_attr("data-target", speaker.biography ? "#bio-" + speaker.link : null) +
        "><div class=\"row no-gutters\"><div class=\"col-12 p-2\"><div class=\"row no-gutters\"><div class=\"col-8 col-sm-9 col-lg-10 col-xl-11 mb-3\"><div><span class=\"h4 text-primary\">" +
        marko_escapeXml(speaker.name) +
        "</span> </div> <div class=\"mt-2 mt-m-3 mt-lg-4\"><strong>" +
        marko_escapeXml(speaker.position) +
        "</strong></div> <div><span class=\"small text-muted\">" +
        marko_escapeXml(speaker.department) +
        "</span> </div> </div> <div class=\"col-4 col-sm-3 col-lg-2 col-xl-1\">");

      if (speaker.photo) {
        out.w("<div class=\"text-right pl-2\"><img" +
          marko_attr("src", "/photos/" + speaker.photo) +
          " class=\"img-fluid\"" +
          marko_attr("alt", "" + speaker.name) +
          "> </div> ");
      }

      out.w(" </div> </div> </div> </div> </div> ");

      if (speaker.biography) {
        out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 p-2\"><p class=\"text-uppercase m-0 ios-clickable\" data-toggle=\"collapse\"" +
          marko_attr("data-target", "#bio-" + speaker.link) +
          "><strong>Краткая биография</strong></p> <p" +
          marko_attr("id", "bio-" + speaker.link) +
          " class=\"small collapse mt-2\">" +
          marko_str(speaker.biography) +
          "</p> </div> </div> </div> ");
      }

      out.w(" ");

      if (!(loopIndex === (loopAll.length - 1))) {
        out.w("<hr>");
      }
    }
  });
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/speakers/components/speakers-content.marko",
    component: "./speakers-content.marko"
  };
