// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/mod/components/mod-content.marko",
    marko_component = require("./mod-content.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_escapeXml = marko_helpers.x,
    marko_escapeXmlAttr = marko_helpers.xa,
    marko_attr = marko_helpers.a,
    marko_forEach = marko_helpers.f;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Модераторская</p> </div> </div></div><div class=\"m-0 p-0 show\">");

  if (state.current_event) {
    out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"h3 mb-0 text-center text-primary\">" +
      marko_escapeXml((state.current_time_formatted ? state.current_time_formatted : data.current_time_formatted) || "...") +
      "</div> </div> <div class=\"col-12\"><div class=\"text-center\">" +
      marko_escapeXml(data.current_date_formatted) +
      "</div> </div> <div class=\"col-12\"><div class=\"\"><div class=\"progress\" style=\"height: 5px;\"><div class=\"progress-bar\" role=\"progressbar\" style=\"width:" +
      marko_escapeXmlAttr(state.progress ? state.progress : data.progress) +
      "%\"" +
      marko_attr("aria-valuenow", "" + (state.progress ? state.progress : data.progress)) +
      " aria-valuemin=\"0\" aria-valuemax=\"100\"></div> </div> </div> </div><div class=\"w-100\"></div><div class=\"col-6\"><p class=\"text-left m-0\">" +
      marko_escapeXml(state.current_event.start_time_formatted) +
      "</p> </div> <div class=\"col-6\"><p class=\"text-right m-0\">" +
      marko_escapeXml(state.current_event.end_time_formatted) +
      "</p>");

    if (state.overtime_formatted) {
      out.w("<p class=\"text-right text-danger m-0\">+ <b>" +
        marko_escapeXml(state.overtime_formatted) +
        "</b> мин</p>");
    }

    out.w("</div> <div class=\"w-100 mb-3\"></div> <div class=\"col-12\"><p class=\"\"><strong>" +
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

    out.w(" </div><div class=\"w-100\"></div> <div class=\"col-12 mt-2 text-center\">");

    if (state.holding_current_event) {
      out.w("<button class=\"btn btn-warning text-uppercase\">Вернуться к расписанию</button>");
    } else {
      out.w("<button class=\"btn btn-danger text-uppercase\">Приостановить событие</button>");
    }

    out.w("</div></div> </div> ");

    if (state.current_event.questions_allowed) {
      out.w("<div class=\"row no-gutters pt-2 collapse\"><div class=\"col-12\"><div class=\"alert alert-info mb-0 p-2\" role=\"alert\"><small>К сожалению, сейчас отсутсвует подключение к серверу.</small></div></div></div><div class=\"m-0 pt-2 fade show\">");

      if (state.mod_questions.length) {
        var $for$0 = 0;

        marko_forEach([
            "top",
            "new",
            "accepted",
            "answered",
            "rejected"
          ], function(status) {
          var $keyScope$0 = "[" + (($for$0++) + "]");

          if (status == "top") {
            out.w("<div class=\"mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"px-2 py-1 m-0 text-info text-uppercase\"><strong>Задаваемый</strong></p> </div></div></div>");
          }

          if (status == "new") {
            out.w("<div class=\"mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"px-2 py-1 m-0 text-primary text-uppercase\"><strong>Новые</strong></p> </div></div></div>");
          }

          if (status == "accepted") {
            out.w("<div class=\"mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"px-2 py-1 m-0 text-success text-uppercase\"><strong>Одобренные</strong></p> </div></div></div>");
          }

          if (status == "answered") {
            out.w("<div class=\"mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"px-2 py-1 m-0 text-secondary text-uppercase\"><strong>Отвеченные</strong></p> </div></div></div>");
          }

          if (status == "rejected") {
            out.w("<div class=\"mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"px-2 py-1 m-0 text-danger text-uppercase\"><strong>Отклоненные</strong></p> </div></div></div>");
          }

          const statusQuestions = state.mod_questions.filter((q) => q.status == status);

          if (statusQuestions.length) {
            out.w("<div class=\"border border-primary p-2 mb-2\">");

            marko_forEach(statusQuestions, function(question, loopIndex, loopAll) {
              var $keyValue$0 = "@" + ("question_" + question._id),
                  $keyScope$1 = "[" + ($keyValue$0 + "]");

              out.w("<div class=\"collapse show\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"m-0 px-1 pb-1 h5\">" +
                marko_escapeXml(question.text) +
                "</p></div></div><div class=\"row no-gutters\"><div class=\"col-6 order-1 col-sm-3 order-sm-1 p-1\">");

              if (question.status != "rejected") {
                out.w("<button class=\"btn btn-outline-danger btn-block text-truncate\">Отклонить</button>");
              }

              out.w("</div><div class=\"col-4 order-4 col-sm-2 order-sm-2 p-1\"><button class=\"btn btn-outline-warning btn-block text-truncate\">✎</button></div><div class=\"col-6 order-2 col-sm-3 order-sm-3 p-1\">");

              if (question.status != "accepted") {
                out.w("<button class=\"btn btn-outline-success btn-block text-truncate\">Одобрить</button>");
              }

              out.w("</div><div class=\"col-4 order-3 col-sm-2 order-sm-4 p-1\">");

              if (question.status != "answered") {
                out.w("<button class=\"btn btn-outline-secondary btn-block text-truncate text-reset\">✓</button>");
              }

              out.w("</div><div class=\"col-4 order-5 col-sm-2 order-sm-5 p-1\">");

              if (question.status != "top") {
                out.w("<button class=\"btn btn-outline-info btn-block text-truncate\">▲</button>");
              }

              out.w("</div></div>");

              if (!(loopIndex === (loopAll.length - 1))) {
                out.w("<hr style=\"margin-top: 0.5rem; margin-bottom: 0.5rem;\">");
              }

              out.w("</div> ");
            });

            out.w("</div>");
          } else {
            out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"m-0 text-center text-muted\">Вопросов ещё нет</p></div></div></div>");
          }
        });
      } else {
        out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"m-0 text-center\"><strong>Вопросов пока нет.<br>Но могут появиться в любой момент!</strong></p> </div> </div></div>");
      }

      out.w(" </div>");
    } else {
      out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"m-0 pt-2 fade show\"><div class=\"row no-gutters\"><div class=\"col-12\"><p class=\"m-0 text-center\"><strong>Вопросы к данному событию не предусмотрены.</strong></p> </div> </div> </div> </div> ");
    }

    out.w(" ");
  } else {
    out.w("<div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"h3 mb-0 text-center text-primary\">" +
      marko_escapeXml(data.time || "...") +
      "</div> </div> <div class=\"col-12\"><div class=\"text-center\">" +
      marko_escapeXml(data.date) +
      "</div> </div> <div class=\"w-100 mb-3\"></div> <div class=\"col-12\"><p class=\"text-uppercase text-center\"><strong>Сейчас событий нет</strong></p> </div> </div> </div> ");
  }

  out.w("</div>");

  if (state.previous_events && state.previous_events.length) {
    out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Вопросы к предыдущим событиям сегодня</p> </div> </div> </div> <div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"list-group list-group-flush\">");

    var $for$1 = 0;

    marko_forEach(state.previous_events, function(previous_event) {
      var $keyScope$2 = "[" + (($for$1++) + "]");

      out.w("<a" +
        marko_attr("href", "/questions?event_id=" + previous_event._id) +
        " target=\"_blank\" class=\"list-group-item list-group-item-action\">" +
        marko_escapeXml(previous_event.title) +
        "</a>");
    });

    out.w(" </div> </div> </div> </div> ");
  }

  if (state.next_event) {
    out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Следующее событие</p> </div> </div> </div> <div class=\"border border-primary p-2 mb-2\"><div class=\"row no-gutters\"><div class=\"col-12\"><div class=\"h3 mb-0 text-center text-primary\">" +
      marko_escapeXml(state.next_event.start_time_formatted) +
      "</div> </div> <div class=\"col-12\"><div class=\"text-center\">" +
      marko_escapeXml(state.next_event.date) +
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

    out.w(" </div> </div> </div>");
  }

  out.w("<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"questionEditingModalHeader\" aria-hidden=\"true\"><div class=\"modal-dialog modal-dialog-centered\" role=\"document\"><div class=\"modal-content\"><form><div class=\"modal-header\"><h5 class=\"modal-title\" id=\"questionEditingModalHeader\">Редактирование вопроса</h5><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span></button></div><div class=\"modal-body\"><textarea class=\"form-control my-2\" rows=\"3\"></textarea></div> <div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-light\" data-dismiss=\"modal\">Закрыть</button><button class=\"btn btn-success\">Сохранить и отправить</button> </div> </form> </div> </div></div><div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\"><div class=\"modal-dialog modal-dialog-centered\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\" aria-hidden=\"true\">Много задаваемых вопросов</h5><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span></button></div><div class=\"modal-body\"><p>В задаваемых уже есть вопрос, какой статус ему присвоить?</p></div> <div class=\"modal-footer\"><div class=\"container no-gutters p-0\"><div class=\"row\"><div class=\"col-6 col-sm-4 order-sm-2 p-1\"><button type=\"button\" class=\"btn btn-secondary btn-block\">Отвеченный</button></div><div class=\"col-6 col-sm-4 order-sm-3 p-1\"><button type=\"button\" class=\"btn btn-success btn-block\">Одобренный</button></div><div class=\"col-12 col-sm-4 order-sm-1 p-1\"><button type=\"button\" class=\"btn btn-light btn-block\" data-dismiss=\"modal\">Закрыть</button></div></div></div></div> </div> </div></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/mod/components/mod-content.marko",
    component: "./mod-content.marko"
  };
