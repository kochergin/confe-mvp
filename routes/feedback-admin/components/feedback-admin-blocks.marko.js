// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/feedback-admin/components/feedback-admin-blocks.marko",
    marko_component = require("./feedback-admin-blocks.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x,
    marko_attr = marko_helpers.a;

function render(input, out, __component, component, state) {
  var data = input;

  var $for$0 = 0;

  marko_forEach(state.blocks, function(block) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    if (block.questions) {
      out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"border-0 p-0 ios-clickable\" data-toggle=\"collapse\"" +
        marko_attr("data-target", "#feedbackBlock" + block._id) +
        "><p class=\"text-uppercase m-0\"><strong>Блок " +
        marko_escapeXml(block.num) +
        "<br>" +
        marko_escapeXml(block.title) +
        "</strong></p> </div> <div class=\"collapse show\"" +
        marko_attr("id", "feedbackBlock" + block._id) +
        "><div>");

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
          out.w("<div class=\"feedbackCanvasContainers\"><canvas" +
            marko_attr("id", (("feedbackCanvas" + block._id) + "_") + question.question_id) +
            " class=\"feedbackCanvases\"></canvas> </div> ");
        }

        out.w(" ");

        if ((question.type == "text") && question.texts) {
          if (question.texts.length) {
            var $for$2 = 0;

            marko_forEach(question.texts, function(answer, loopIndex, loopAll) {
              var $keyScope$2 = "[" + ((($for$2++) + $keyScope$1) + "]");

              if (answer) {
                out.w("<p class=\"mb-0 mt-2\">" +
                  marko_escapeXml(answer) +
                  "</p>");
              }

              out.w(" ");

              if (!(loopIndex === (loopAll.length - 1))) {
                out.w("<hr class=\"my-2\"> ");
              }

              out.w(" ");
            });

            out.w(" ");
          } else {
            out.w("<p class=\"mb-0 mt-2\">Нет ответов.</p> ");
          }

          out.w(" ");
        }

        out.w(" ");
      });

      out.w(" </div> </div> </div> </div> </div>");
    }
  });
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/feedback-admin/components/feedback-admin-blocks.marko",
    component: "./feedback-admin-blocks.marko"
  };
