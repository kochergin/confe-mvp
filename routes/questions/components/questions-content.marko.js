// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/questions/components/questions-content.marko",
    marko_component = require("./questions-content.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"py-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><h1 class=\"text-primary display-3\">Вопросы</h1> </div> </div> </div> <div class=\"p-2 mb-2\"><div class=\"m-0 pt-2 fade show\">");

  if (state.current_questions) {
    if (state.current_questions.length) {
      var $for$0 = 0;

      marko_forEach(state.current_questions, function(question, loopIndex, loopAll) {
        var $keyScope$0 = "[" + (($for$0++) + "]");

        out.w("<div class=\"row no-gutters pt-2\"><div class=\"col-3 col-sm-2 col-lg-1 text-primary\"><div class=\"mx-auto\" style=\"width: 3em; height: 3em;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 4000 4000\" class=\"like-icon d-inline-block w-100 h-100\"><path d=\"M820 1759c186-13 370 16 524-8l-4 1551c-72 128-361 185-487 122-64-31-117-86-139-147-63-178 33-479 27-763-5-232-119-447-110-637 6-129 76-110 189-118zm194 1412c27 0 50 22 50 50 0 28-23 50-50 50-28 0-50-22-50-50 0-28 22-50 50-50zm330-1420c426-67 537-512 559-878 5-91-1-159 39-245 146-321 616 41 340 955-31 101 0 77 121 72 277-12 640-97 827-11 219 100 238 273 63 492-38 48-33 31 16 79 159 156 162 224-56 423-49 45-38 21-18 78 74 213-10 265-169 365-51 31-44 21-34 78 29 179 22 276-206 287-769 34-993 94-1486-144l4-1551z\"></path> </svg> </div><p class=\"text-center\">" +
          marko_escapeXml(question.voters_count) +
          "</p> </div> <div class=\"col-9 col-sm-10 col-lg-11\">");

        if (question.status == "top") {
          out.w("<h3 class=\"m-0 d-inline-block align-middle text-primary\"><span class=\"badge badge-primary mr-2\">Задается</span><strong>" +
            marko_escapeXml(question.text) +
            "</strong></h3>");
        } else if (question.status == "answered") {
          out.w("<h4 class=\"m-0 d-inline-block align-middle\"><span class=\"badge badge-success mr-2\">Отвечен</span><span class=\"text-muted\">" +
            marko_escapeXml(question.text) +
            "</span></h4>");
        } else if (question.status == "rejected") {
          out.w("<h4 class=\"m-0 d-inline-block align-middle\"><span class=\"badge badge-danger mr-2\">Отклонен</span><span class=\"text-muted\">" +
            marko_escapeXml(question.text) +
            "</span></h4>");
        } else {
          out.w("<h4 class=\"m-0 d-inline-block align-middle\">" +
            marko_escapeXml(question.text) +
            "</h4> ");
        }

        out.w("</div> </div> ");

        if (!(loopIndex === (loopAll.length - 1))) {
          out.w("<hr style=\"margin-top: 0.5rem; margin-bottom: 0.5rem;\"> ");
        }

        out.w(" ");
      });

      out.w(" ");
    } else {
      out.w("<div class=\"row no-gutters\"><div class=\"col-12\"><h3 class=\"m-0 text-center\">Вопросов пока нет.</h3> </div> </div> ");
    }

    out.w(" ");
  }

  out.w(" </div> </div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/questions/components/questions-content.marko",
    component: "./questions-content.marko"
  };
