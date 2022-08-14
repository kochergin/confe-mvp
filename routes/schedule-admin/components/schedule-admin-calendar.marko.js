// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/schedule-admin/components/schedule-admin-calendar.marko",
    marko_component = require("./schedule-admin-calendar.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x,
    marko_attr = marko_helpers.a,
    marko_classAttr = marko_helpers.ca,
    marko_escapeXmlAttr = marko_helpers.xa;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"fade show\">");

  marko_forEach(state.admin_schedule, function(day, loop_daysIndex, loop_daysAll) {
    var $keyValue$0 = "@" + ("day_" + day.date),
        $keyScope$0 = "[" + ($keyValue$0 + "]");

    out.w("<div><div class=\"row no-gutters mt-2\"><div class=\"col-12\"><div class=\"border text-uppercase p-2 ios-clickable\" data-toggle=\"collapse\"" +
      marko_attr("data-target", "#collapseAdminScheduleDay" + (loop_daysIndex + 1)) +
      ">" +
      marko_escapeXml(day.date_formatted) +
      "</div> </div> </div> <div class=\"collapse show\"" +
      marko_attr("id", "collapseAdminScheduleDay" + (loop_daysIndex + 1)) +
      "><table class=\"table table-bordered small\"><thead></thead> <tbody><tr class=\"gray-light\"><th scope=\"col\">Время</th> <th scope=\"col\">Тема</th> <th scope=\"col\" class=\"d-none d-sm-table-cell\">Докладчик</th> <th scope=\"col\"></th> </tr> ");

    var $for$0 = 0;

    marko_forEach(day.sessions, function(session) {
      var $keyScope$1 = "[" + ((($for$0++) + $keyScope$0) + "]");

      out.w("<tr class=\"bg-secondary\"><td colspan=\"4\"><p class=\"m-0\">");

      if (session.extra_session) {
        out.w("<span class=\"text-uppercase\">(Дополнительная)</span> ");
      }

      if (!session.show_title) {
        out.w("<span class=\"text-uppercase\">(Скрытая)</span> ");
      }

      out.w("<span class=\"text-uppercase\">" +
        marko_escapeXml(session.title || "Без названия") +
        "</span> ");

      if (input.is_admin) {
        out.w("<a href=\"#\" class=\"badge badge-danger\">У</a>&nbsp;<a href=\"#\" class=\"badge badge-warning\">Р</a>");
      }

      out.w("</p>");

      if (session.location) {
        out.w("<p class=\"m-0\">" +
          marko_escapeXml(session.location) +
          "</p>");
      } else {}

      out.w("</td> </tr> ");

      var $for$1 = 0;

      marko_forEach(session.events, function(event) {
        var $keyScope$2 = "[" + ((($for$1++) + $keyScope$1) + "]");

        out.w("<tr" +
          marko_classAttr(event.type.rowClasses) +
          "><th scope=\"row\">" +
          marko_escapeXml(event.start_time_formatted) +
          " – " +
          marko_escapeXml(event.end_time_formatted) +
          "</th> ");

        if (event.speaker_name) {
          out.w("<td colspan=\"1\" class=\"\"><span" +
            marko_classAttr(event.type.cellClasses) +
            ">" +
            marko_escapeXml(event.title) +
            "</span><span class=\"d-inline d-sm-none\"><br><br>" +
            marko_escapeXml(event.speaker_name) +
            marko_escapeXml(event.speaker_hidden ? " (скрытый)" : "") +
            "</span></td><td colspan=\"1\" class=\"d-none d-sm-table-cell\">" +
            marko_escapeXml(event.speaker_name) +
            marko_escapeXml(event.speaker_hidden ? " (скрытый)" : "") +
            "</td>");
        } else {
          out.w("<td colspan=\"2\"" +
            marko_classAttr("text-center " + event.type.cellClasses) +
            ">" +
            marko_escapeXml(event.title) +
            "</td> ");
        }

        out.w("<td colspan=\"1\" class=\"text-right\">");

        if (input.is_admin) {
          out.w("<a href=\"#\" class=\"badge badge-danger\">У</a>&nbsp;");
        }

        out.w("<a href=\"#\" class=\"badge badge-warning\">Р</a>");

        if (event.questions_allowed) {
          out.w("&nbsp;<a" +
            marko_attr("href", "/questions?event_id=" + event._id) +
            " target=\"_blank\" class=\"badge badge-success\">В</a>");
        }

        out.w("</td> </tr>");
      });

      if (input.is_admin) {
        out.w("<tr class=\"\"><td colspan=\"4\" class=\"text-center\"><a href=\"#\" class=\"text-success\">Добавить событие</a></td> </tr>");
      }
    });

    if (input.is_admin) {
      out.w("<tr><td colspan=\"4\" class=\"text-center\"><a href=\"#\" class=\"text-success\">Добавить сессию в этот день</a></td></tr>");
    }

    out.w("</tbody> </table> </div> </div> ");
  });

  if (input.is_admin) {
    out.w("<div class=\"px-3 py-2\"><a href=\"#\" class=\"text-success\">Добавить сессию в новый день</a> </div>");
  }

  out.w("</div><div class=\"modal fade\" id=\"editSessionForm\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\"><div class=\"modal-content rounded-0\"><form><div class=\"modal-header\"><h5 class=\"modal-title\">...</h5> <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span> </button> </div> <div class=\"modal-body\"><div class=\"form-group\"><label for=\"day_date\">Дата:</label> <input type=\"date\" name=\"date\" class=\"form-control\" id=\"session_date\"" +
    marko_attr("value", state.editing_session.date_input_formatted) +
    "> </div> <div class=\"form-group\"><label for=\"session_title\">Название:</label> <input type=\"text\" name=\"title\" class=\"form-control\" id=\"session_title\"" +
    marko_attr("value", state.editing_session.title) +
    "> </div> <div class=\"form-group\"><label for=\"session_location\">Место:</label> <input type=\"text\" name=\"title\" class=\"form-control\" id=\"session_location\"" +
    marko_attr("value", state.editing_session.location) +
    "> </div> <div class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" id=\"session_show_title\"" +
    marko_attr("checked", state.editing_session.show_title) +
    "> <label class=\"custom-control-label\" for=\"session_show_title\">Показывать название сессии в расписании</label> </div> <div class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" id=\"session_extra_session\"" +
    marko_attr("checked", state.editing_session.extra_session) +
    "> <label class=\"custom-control-label\" for=\"session_extra_session\">Сессия для дополнительной программы</label> </div><div class=\"form-group collapse\"><div class=\"alert alert-danger mb-0 p-2\" role=\"alert\"><small><strong>Не удалось сохранить сессию.</strong> Проверьте введённые данные и попробуйте ещё раз.</small></div></div></div> <div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary rounded-0\" data-dismiss=\"modal\">Закрыть</button> <button class=\"btn btn-success rounded-0\">Сохранить</button> </div> </form> </div> </div></div><div class=\"modal fade\" id=\"editEventForm\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\"><div class=\"modal-content rounded-0\"><form><div class=\"modal-header\"><h5 class=\"modal-title\">...</h5> <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span> </button> </div> <div class=\"modal-body\"><div class=\"form-group\"><label for=\"event_date\">Дата:</label> <select class=\"form-control\" id=\"event_session\">");

  var $for$2 = 0;

  marko_forEach(state.admin_schedule, function(day) {
    var $keyScope$3 = "[" + (($for$2++) + "]");

    out.w("<option" +
      marko_attr("value", day._id) +
      marko_attr("selected", day._id == state.editing_event_date) +
      ">" +
      marko_escapeXml(day.date_formatted) +
      "</option> ");
  });

  out.w(" </select> </div> <div class=\"form-group\"><label for=\"event_session\">Сессия:</label> <select class=\"form-control\" id=\"event_session\">");

  var $for$3 = 0;

  marko_forEach(state.current_sessions, function(session) {
    var $keyScope$4 = "[" + (($for$3++) + "]");

    out.w("<option" +
      marko_attr("value", session._id) +
      marko_attr("selected", session._id == state.editing_event_session_id) +
      ">" +
      marko_escapeXml(session.extra_session ? "(Доп. программа) " : "") +
      marko_escapeXml(!session.show_title ? "(Скрытая) " : "") +
      marko_escapeXml(session.title || "Без названия") +
      "</option> ");
  });

  out.w(" </select> </div> <div class=\"form-group\"><label for=\"event_title\">Название:</label> <input type=\"text\" name=\"title\" class=\"form-control\" id=\"event_title\"" +
    marko_attr("value", state.editing_event.title) +
    "> </div> <div class=\"form-group\"><label for=\"event_type\">Тип:</label> <select class=\"form-control\" id=\"event_session\">");

  var $for$4 = 0;

  marko_forEach(data.event_types, function(ev_type) {
    var $keyScope$5 = "[" + (($for$4++) + "]");

    out.w("<option" +
      marko_attr("value", ev_type._id) +
      marko_attr("selected", ev_type._id == state.editing_event.type._id) +
      " class=\"" +
      marko_escapeXmlAttr(ev_type.rowClasses) +
      " " +
      marko_escapeXmlAttr(ev_type.cellClasses) +
      "\">" +
      marko_escapeXml(ev_type.name) +
      "</option> ");
  });

  out.w(" </select> </div> <div class=\"form-row\"><div class=\"col-6\"><div class=\"form-group\"><label for=\"event_start_time\">Время начала:</label> <input type=\"time\" name=\"start_time\" class=\"form-control\" id=\"event_start_time\"" +
    marko_attr("value", state.editing_event.start_time_formatted) +
    "> </div> </div> <div class=\"col-6\"><div class=\"form-group\"><label for=\"event_end_time\">Время окончания:</label> <input type=\"time\" name=\"end_time\" class=\"form-control\" id=\"event_end_time\"" +
    marko_attr("value", state.editing_event.end_time_formatted) +
    "> </div> </div> </div> <div class=\"form-group collapse\" id=\"editEventSpeaker\"><label for=\"event_speaker\">Докладчик:</label> <select class=\"form-control\" id=\"event_speaker\"><option value=\"\"" +
    marko_attr("selected", (!state.editing_event.speaker_link) && (!state.editing_event.speaker_name)) +
    ">Нет докладчика</option> <option value=\"custom-speaker\"" +
    marko_attr("selected", (!state.editing_event.speaker_link) && state.editing_event.speaker_name) +
    ">Другой докладчик</option> ");

  var $for$5 = 0;

  marko_forEach(state.current_speakers, function(speaker) {
    var $keyScope$6 = "[" + (($for$5++) + "]");

    out.w("<option" +
      marko_attr("value", speaker.link) +
      marko_attr("selected", speaker.link == state.editing_event.speaker_link) +
      ">" +
      marko_escapeXml(speaker.name) +
      marko_escapeXml(speaker.hidden ? " (скрытый)" : "") +
      "</option> ");
  });

  out.w(" </select> </div> <div class=\"form-group collapse\" id=\"editEventCustomSpeaker\"><label for=\"event_custom_speaker\">Другой докладчик:</label> <input type=\"text\" name=\"custom_speaker\" class=\"form-control\" id=\"event_custom_speaker\"" +
    marko_attr("value", state.editing_event.speaker_name) +
    "> </div> <div class=\"form-group collapse\" id=\"editEventLocation\"><label for=\"event_location\">Место проведения:</label> <input type=\"text\" name=\"custom_speaker\" class=\"form-control\" id=\"event_location\"" +
    marko_attr("value", state.editing_event.location) +
    "> </div> <div class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" id=\"event_questions_allowed\"" +
    marko_attr("checked", state.editing_event.questions_allowed) +
    "> <label class=\"custom-control-label\" for=\"event_questions_allowed\">Разрешить вопросы</label> </div> <div class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" id=\"event_ratings_allowed\"" +
    marko_attr("checked", state.editing_event.ratings_allowed) +
    "> <label class=\"custom-control-label\" for=\"event_ratings_allowed\">Разрешить ставить рейтинг</label> </div><div class=\"form-group collapse\"><div class=\"alert alert-danger mb-0 p-2\" role=\"alert\"><small><strong>Не удалось сохранить событие.</strong> Проверьте введённые данные и попробуйте ещё раз.</small></div></div></div> <div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary rounded-0\" data-dismiss=\"modal\">Закрыть</button> <button class=\"btn btn-success rounded-0\">Сохранить</button> </div> </form> </div> </div></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/schedule-admin/components/schedule-admin-calendar.marko",
    component: "./schedule-admin-calendar.marko"
  };
