// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/feedback/components/feedback-blocks.marko",
    marko_component = require("./feedback-blocks.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x,
    marko_attr = marko_helpers.a,
    marko_forEachProp = require("marko/src/runtime/helper-forEachProperty");

function render(input, out, __component, component, state) {
  var data = input;

  var $for$0 = 0;

  marko_forEach(data.blocks, function(block) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    if (block.questions) {
      out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"border-0 p-0 ios-clickable\" data-toggle=\"collapse\"" +
        marko_attr("data-target", "#feedbackBlock" + block._id) +
        "><p class=\"text-uppercase m-0\"><strong>Блок " +
        marko_escapeXml(block.num) +
        "<br>" +
        marko_escapeXml(block.title) +
        "</strong></p> </div> <div class=\"collapse\"" +
        marko_attr("id", "feedbackBlock" + block._id) +
        "><form>");

      if (block.comment) {
        out.w("<p><small class=\"text-muted\">" +
          marko_escapeXml(block.comment) +
          "</small></p>");
      }

      out.w(" ");

      var $for$1 = 0;

      marko_forEach(block.questions, function(question) {
        var $keyScope$1 = "[" + ((($for$1++) + $keyScope$0) + "]");

        if (question.num && question.content) {
          out.w("<p class=\"mt-2\">" +
            marko_escapeXml(question.num) +
            ". " +
            marko_escapeXml(question.content) +
            "</p> ");
        } else if (question.content) {
          out.w("<p class=\"mt-2\">" +
            marko_escapeXml(question.content) +
            "</p> ");
        }

        out.w(" ");

        if (question.type == "variants") {
          var $for$2 = 0;

          marko_forEachProp(question.variants, function(i, variant) {
            var $keyScope$2 = "[" + ((($for$2++) + $keyScope$1) + "]");

            out.w("<div class=\"custom-control custom-radio custom-control-inline small\"><input type=\"radio\"" +
              marko_attr("id", (((("b" + block._id) + "_q") + question.question_id) + "_") + (i + 1)) +
              marko_attr("name", "q" + question.question_id) +
              " class=\"custom-control-input\"" +
              marko_attr("value", i) +
              marko_attr("checked", i == block.answers[question.question_id]) +
              "> <label class=\"custom-control-label\"" +
              marko_attr("for", (((("b" + block._id) + "_q") + question.question_id) + "_") + (i + 1)) +
              ">" +
              marko_escapeXml(variant) +
              "</label> </div> ");
          });

          out.w(" ");
        }

        out.w(" ");

        if (question.type == "text") {
          out.w("<div class=\"form-group\"><textarea class=\"form-control\"" +
            marko_attr("name", "q" + question.question_id) +
            " rows=\"3\"" +
            marko_attr("placeholder", question.placeholder || "Текст") +
            ">" +
            marko_escapeXml(block.answers[question.question_id]) +
            "</textarea> </div> ");
        }

        out.w(" ");
      });

      out.w(" <div class=\"text-right\"><button class=\"btn btn-outline-primary rounded-0\" type=\"submit\">Сохранить</button> </div> </form> </div> </div> </div> </div>");
    }
  });
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/feedback/components/feedback-blocks.marko",
    component: "./feedback-blocks.marko"
  };
