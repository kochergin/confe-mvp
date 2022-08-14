// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/schedule/components/schedule-calendar.marko",
    marko_component = require("./schedule-calendar.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x,
    marko_attr = marko_helpers.a,
    marko_classAttr = marko_helpers.ca;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"fade show\">");

  var $for$0 = 0;

  marko_forEach(data.schedule, function(day, loop_daysIndex, loop_daysAll) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    out.w("<div class=\"row no-gutters mt-2\"><div class=\"col-12\"><div class=\"border text-uppercase p-2 ios-clickable schedule-day-header collapsed\" data-toggle=\"collapse\"" +
      marko_attr("data-target", "#collapseMainScheduleDay" + (loop_daysIndex + 1)) +
      ">" +
      marko_escapeXml(day.date_formatted) +
      "</div> </div> </div> <div class=\"collapse\"" +
      marko_attr("id", "collapseMainScheduleDay" + (loop_daysIndex + 1)) +
      "><table class=\"table table-bordered small\"><thead></thead> <tbody><tr class=\"gray-light\"><th scope=\"col\">Время</th> <th scope=\"col\">Тема</th> <th scope=\"col\" class=\"d-none d-sm-table-cell\">Докладчик</th> </tr> ");

    var $for$1 = 0;

    marko_forEach(day.sessions, function(session, loop_sessionsIndex, loop_sessionsAll) {
      var $keyScope$1 = "[" + ((($for$1++) + $keyScope$0) + "]");

      if (session.show_title) {
        out.w("<tr class=\"bg-secondary\"><td colspan=\"3\" class=\"ios-clickable\" data-toggle=\"collapse\"" +
          marko_attr("data-target", ((".collapse-" + (loop_daysIndex + 1)) + "-") + (loop_sessionsIndex + 1)) +
          "><p class=\"m-0 text-uppercase\">" +
          marko_escapeXml(session.title || "Без названия") +
          "</p>");

        if (session.location) {
          out.w("<p class=\"m-0\">" +
            marko_escapeXml(session.location) +
            "</p>");
        }

        out.w("</td></tr> ");
      }

      out.w(" ");

      var $for$2 = 0;

      marko_forEach(session.events, function(event) {
        var $keyScope$2 = "[" + ((($for$2++) + $keyScope$1) + "]");

        out.w("<tr" +
          marko_classAttr((((("align-row-middle " + event.type.rowClasses) + " collapse show collapse-") + (loop_daysIndex + 1)) + "-") + (loop_sessionsIndex + 1)) +
          "><th scope=\"row\"><div class=\"m-0 p-0 dropdown text-center\"><a class=\"ios-clickable\" role=\"button\" data-toggle=\"dropdown\">" +
          marko_escapeXml(event.start_time_formatted) +
          " – " +
          marko_escapeXml(event.end_time_formatted) +
          "</a> <div class=\"dropdown-menu rounded-0\"><span class=\"dropdown-header\"><strong>Добавить в календарь:</strong></span> <a class=\"dropdown-item\"" +
          marko_attr("href", "/ics?event_id=" + event._id) +
          ">Apple iOS</a> <a class=\"dropdown-item\"" +
          marko_attr("href", "/ics?event_id=" + event._id) +
          ">Microsoft Outlook</a> ");

        if (event.speaker_name) {
          out.w("<a class=\"dropdown-item\"" +
            marko_attr("href", (((((((("https://www.google.com/calendar/render?action=TEMPLATE&text=" + event.title) + "&details=") + (("Доклад %22" + event.title) + "%22")) + "%0D%0A%0D%0A") + ("Докладчик: " + event.speaker_name)) + "&dates=") + event.start_stamp) + "%2F") + event.end_stamp) +
            ">Google Calendar</a> ");
        } else {
          out.w("<a class=\"dropdown-item\"" +
            marko_attr("href", (((((("https://www.google.com/calendar/render?action=TEMPLATE&text=" + event.title) + "&details=") + event.title) + "&dates=") + event.start_stamp) + "%2F") + event.end_stamp) +
            ">Google Calendar</a> ");
        }

        out.w(" </div> </div> </th> ");

        if (event.speaker_name && event.speaker_link) {
          out.w("<td colspan=\"1\" class=\"\"><span" +
            marko_classAttr(event.type.cellClasses) +
            ">" +
            marko_escapeXml(event.title) +
            "</span><span class=\"d-inline d-sm-none\"><br><br><a" +
            marko_attr("href", "speakers#" + event.speaker_link) +
            ">" +
            marko_escapeXml(event.speaker_name) +
            "</a></span></td><td colspan=\"1\" class=\"d-none d-sm-table-cell\"><a" +
            marko_attr("href", "speakers#" + event.speaker_link) +
            ">" +
            marko_escapeXml(event.speaker_name) +
            "</a></td>");
        } else if (event.speaker_name) {
          out.w("<td colspan=\"1\" class=\"\"><span" +
            marko_classAttr(event.type.cellClasses) +
            ">" +
            marko_escapeXml(event.title) +
            "</span><span class=\"d-inline d-sm-none\"><br><br>" +
            marko_escapeXml(event.speaker_name) +
            "</span></td><td colspan=\"1\" class=\"d-none d-sm-table-cell\">" +
            marko_escapeXml(event.speaker_name) +
            "</td> ");
        } else {
          out.w("<td colspan=\"2\"" +
            marko_classAttr("text-center " + event.type.cellClasses) +
            ">" +
            marko_escapeXml(event.title) +
            "</td>");
        }

        out.w("</tr> ");
      });

      out.w(" ");
    });

    out.w(" </tbody> </table> </div> ");
  });

  out.w("</div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/schedule/components/schedule-calendar.marko",
    component: "./schedule-calendar.marko"
  };
