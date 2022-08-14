// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/now/components/now-content.marko",
    marko_component = require("./now-content.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_escapeXml = marko_helpers.x,
    marko_escapeXmlAttr = marko_helpers.xa,
    marko_attr = marko_helpers.a,
    marko_forRange = require("marko/src/runtime/helper-forRange"),
    marko_loadTag = marko_helpers.t,
    _preserve_tag = marko_loadTag(require("marko/src/core-tags/components/preserve-tag")),
    marko_forEach = marko_helpers.f,
    marko_classAttr = marko_helpers.ca;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Сейчас</p> </div> </div></div><div class=\"m-0 p-0 show\">");

  if (state.current_event) {
    out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"h3 mb-0 text-center text-primary\">" +
      marko_escapeXml(state.current_time_formatted || "...") +
      "</div> </div> <div class=\"col-12\"><div class=\"text-center\">" +
      marko_escapeXml(state.current_date_formatted) +
      "</div> </div> <div class=\"col-12\"><div class=\"\"><div class=\"progress\" style=\"height: 5px;\"><div class=\"progress-bar\" role=\"progressbar\" style=\"width:" +
      marko_escapeXmlAttr(state.progress || 0) +
      "%\"" +
      marko_attr("aria-valuenow", "" + (state.progress || 0)) +
      " aria-valuemin=\"0\" aria-valuemax=\"100\"></div> </div> </div> </div> <div class=\"w-100\"></div> <div class=\"col-6\"><p class=\"text-left m-0\">" +
      marko_escapeXml(state.current_event.start_time_formatted) +
      "</p> </div> <div class=\"col-6\"><p class=\"text-right m-0\">" +
      marko_escapeXml(state.current_event.end_time_formatted) +
      "</p>");

    if (state.overtime_formatted) {
      out.w("<p class=\"text-right text-danger m-0\">+ <b>" +
        marko_escapeXml(state.overtime_formatted) +
        "</b> мин</p>");
    }

    out.w("</div><div class=\"w-100 mb-3\"></div> <div class=\"col-12\"><p class=\"\"><strong>" +
      marko_escapeXml(state.current_event.title) +
      "</strong></p> ");

    if (state.current_event.speaker_name) {
      out.w("<p class=\"m-0\">");

      if (state.current_event.speaker_link && (!state.current_event.speaker_hidden)) {
        out.w("<a" +
          marko_attr("href", "speakers#" + state.current_event.speaker_link) +
          " class=\"text-primary\"" +
          marko_attr("alt", "Докладчик: " + state.current_event.speaker_name) +
          "><strong>" +
          marko_escapeXml(state.current_event.speaker_name) +
          "</strong></a> ");
      } else {
        out.w("<span class=\"text-primary\"><strong>" +
          marko_escapeXml(state.current_event.speaker_name) +
          "</strong></span> ");
      }

      out.w(" </p> ");
    }

    out.w(" </div> </div> </div> ");

    if (state.current_event && state.current_event.ratings_allowed) {
      out.w("<div class=\"border border-primary p-2 mb-2\"><form><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"m-0\"><span class=\"text-uppercase\">Оцените доклад</span></p> <p><small class=\"text-muted\">(пожалуйста оцените по пятибалльной шкале, где 5 – высший балл)</small></p> ");

      var $for$0 = 0;

      marko_forRange(1, 5, null, function(rating) {
        var $keyScope$0 = "[" + (($for$0++) + "]");

        out.w("<div class=\"custom-control custom-radio custom-control-inline\">");

        var $key$0 = __component.___nextKey("38" + $keyScope$0);

        _preserve_tag({
            key: $key$0,
            renderBody: function(out) {
              out.w("<input type=\"radio\"" +
                marko_attr("id", "eventRating" + rating) +
                " name=\"eventRating\" class=\"custom-control-input event-rating-buttons\"" +
                marko_attr("checked", input.current_event.rating == rating) +
                marko_attr("value", "" + rating) +
                ">");
            }
          }, out);

        out.w(" <label class=\"custom-control-label\"" +
          marko_attr("for", "eventRating" + rating) +
          ">" +
          marko_escapeXml(rating) +
          "</label> </div> ");
      });

      out.w(" </div> </div> <div class=\"row no-gutters pt-2\"><div class=\"col-12\"><button class=\"btn btn-outline-primary float-right\" type=\"submit\">Отправить</button> </div> </div> <div class=\"row no-gutters pt-2 collapse\"><div class=\"col-12\"><div class=\"alert mb-0 p-2 small\" role=\"alert\"></div> </div> </div> </form> </div> ");
    }

    out.w(" ");

    if (state.current_event && state.current_event.questions_allowed) {
      out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"text-uppercase m-0\">Задать вопрос</p> <form><textarea class=\"form-control my-2\" id=\"exampleFormControlTextarea1\" rows=\"2\" placeholder=\"Текст вопроса\"></textarea> <button class=\"btn btn-outline-primary float-right\" type=\"submit\">Отправить</button> </form> </div> </div> <div class=\"row no-gutters pt-2 collapse\"><div class=\"col-12\"><div class=\"alert alert-success mb-0 p-2 small\" role=\"alert\"><small>Спасибо! Ваш вопрос успешно отправлен. Он будет добавлен в список вопросов, как только пройдёт модерацию.</small></div> </div> </div> <div class=\"row no-gutters pt-2 collapse\"><div class=\"col-12\"><div class=\"alert alert-danger mb-0 p-2 small\" role=\"alert\"><small>Ошибка при добавлении вопроса.</small></div> </div> </div> <div class=\"row no-gutters pt-2 collapse\"><div class=\"col-12\"><div class=\"alert alert-warning mb-0 p-2 small\" role=\"alert\"><small>Один из заданных вами вопросов был отклонён модератором.</small></div> </div> </div> <div class=\"row no-gutters pt-2 collapse\"><div class=\"col-12\"><div class=\"alert alert-info mb-0 p-2\" role=\"alert\"><small>К сожалению, сейчас отсутсвует подключение к серверу и ваш вопрос не может быть отправлен.</small></div> </div> </div> <div class=\"m-0 pt-2 fade show\">");

      if (state.current_questions.length) {
        var $for$1 = 0;

        marko_forEach(state.current_questions, function(question, loopIndex, loopAll) {
          var $keyScope$1 = "[" + (($for$1++) + "]");

          out.w("<div class=\"row no-gutters pt-2\"><div" +
            marko_classAttr("col-3 col-sm-2 col-lg-1" + ((question.owned ? " text-orange-warning" : "") + (question.voted && (!question.owned) ? " text-success" : ""))) +
            "><div class=\"mx-auto ios-clickable\" style=\"width: 3rem; height: 3rem;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 4000 4000\" class=\"like-icon d-inline-block w-100 h-100\"><path d=\"M820 1759c186-13 370 16 524-8l-4 1551c-72 128-361 185-487 122-64-31-117-86-139-147-63-178 33-479 27-763-5-232-119-447-110-637 6-129 76-110 189-118zm194 1412c27 0 50 22 50 50 0 28-23 50-50 50-28 0-50-22-50-50 0-28 22-50 50-50zm330-1420c426-67 537-512 559-878 5-91-1-159 39-245 146-321 616 41 340 955-31 101 0 77 121 72 277-12 640-97 827-11 219 100 238 273 63 492-38 48-33 31 16 79 159 156 162 224-56 423-49 45-38 21-18 78 74 213-10 265-169 365-51 31-44 21-34 78 29 179 22 276-206 287-769 34-993 94-1486-144l4-1551z\"></path> </svg></div>");

          if (question.status != "rejected") {
            out.w("<p class=\"text-center\">" +
              marko_escapeXml(question.voters_count) +
              "</p>");
          } else {
            out.w("<p class=\"text-center\">&ndash;</p>");
          }

          out.w("</div><div class=\"col-9 col-sm-10 col-lg-11\"><div><p class=\"m-0\">");

          if (question.status == "new") {
            out.w("<span class=\"badge badge-warning mr-2\">Модерируется</span><strong>" +
              marko_escapeXml(question.text) +
              "</strong>");
          } else if (question.status == "top") {
            out.w("<span class=\"badge badge-primary mr-2\">Задается</span><strong>" +
              marko_escapeXml(question.text) +
              "</strong>");
          } else if (question.status == "answered") {
            out.w("<span class=\"badge badge-success mr-2\">Отвечен</span><span class=\"text-muted\">" +
              marko_escapeXml(question.text) +
              "</span>");
          } else {
            out.w("<strong>" +
              marko_escapeXml(question.text) +
              "</strong>");
          }

          out.w("</p></div></div></div>");

          if (!(loopIndex === (loopAll.length - 1))) {
            out.w("<hr style=\"margin-top: 0.5rem; margin-bottom: 0.5rem;\"> ");
          }

          out.w(" ");
        });

        out.w(" ");
      } else {
        out.w("<div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"m-0 text-center\"><strong>Вопросов пока нет.<br>Ваш может стать первым!</strong></p> </div> </div> ");
      }

      out.w(" </div> </div> ");
    }

    out.w(" ");
  } else {
    out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"h3 mb-0 text-center text-primary\">" +
      marko_escapeXml(state.current_time_formatted || "...") +
      "</div> </div> <div class=\"col-12\"><div class=\"text-center\">" +
      marko_escapeXml(state.current_date_formatted) +
      "</div> </div> <div class=\"w-100 mb-3\"></div> <div class=\"col-12\"><p class=\"text-uppercase text-center\"><strong>Сейчас событий нет</strong></p> </div> </div> </div> ");
  }

  out.w("</div><div class=\"m-0 p-0 show\">");

  if (state.next_event) {
    out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Следующее событие</p> </div> </div> </div> <div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"h3 mb-0 text-center text-primary\">" +
      marko_escapeXml(state.next_event.start_time_formatted) +
      "</div> </div> <div class=\"col-12\"><div class=\"text-center\">" +
      marko_escapeXml(state.next_event.date_formatted) +
      "</div> </div> <div class=\"w-100 mb-3\"></div> <div class=\"col-12\"><p class=\"\"><strong>" +
      marko_escapeXml(state.next_event.title) +
      "</strong></p> ");

    if (state.next_event.speaker_name) {
      out.w("<p class=\"m-0\">");

      if (state.next_event.speaker_link && (!state.next_event.speaker_hidden)) {
        out.w("<a" +
          marko_attr("href", "b-speakers.html#" + state.next_event.speaker_link) +
          " class=\"text-primary\"" +
          marko_attr("alt", "Докладчик: " + state.next_event.speaker_name) +
          "><strong>" +
          marko_escapeXml(state.next_event.speaker_name) +
          "</strong></a> ");
      } else {
        out.w("<span class=\"text-primary\"><strong>" +
          marko_escapeXml(state.next_event.speaker_name) +
          "</strong></span> ");
      }

      out.w(" </p> ");
    }

    out.w(" </div> </div> </div> ");
  }

  out.w("</div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/now/components/now-content.marko",
    component: "./now-content.marko",
    tags: [
      "marko/src/core-tags/components/preserve-tag"
    ]
  };
