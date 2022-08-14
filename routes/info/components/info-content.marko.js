// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/info/components/info-content.marko",
    marko_component = require("./info-content.component"),
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

  out.w("<div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\" data-toggle=\"collapse\" data-target=\"#collapseExtraSchedule\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Дополнительная программа</p> </div> </div></div><div class=\"collapse show\" id=\"collapseExtraSchedule\">");

  var $for$0 = 0;

  marko_forEach(data.extra_schedule, function(day, loopIndex, loopAll) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    out.w("<div" +
      marko_classAttr("row no-gutters" + (!(loopIndex === 0) ? " mt-2" : "")) +
      "><div class=\"col-12\"><div class=\"border text-uppercase p-2 ios-clickable\" data-toggle=\"collapse\"" +
      marko_attr("data-target", "#collapseExtraScheduleDay" + (loopIndex + 1)) +
      ">" +
      marko_escapeXml(day.date_formatted) +
      "</div> </div> </div> <div class=\"collapse show\"" +
      marko_attr("id", "collapseExtraScheduleDay" + (loopIndex + 1)) +
      "><table class=\"table table-bordered small mb-0\"><thead></thead> <tbody><tr class=\"gray-light\"><th scope=\"col\">Время</th> <th scope=\"col\">Мероприятие</th> <th scope=\"col\" class=\"d-none d-sm-table-cell\">Место проведения</th> </tr> ");

    var $for$1 = 0;

    marko_forEach(day.sessions, function(session) {
      var $keyScope$1 = "[" + ((($for$1++) + $keyScope$0) + "]");

      if (session.show_title) {
        out.w("<tr class=\"bg-secondary\"><td colspan=\"3\" class=\"text-uppercase\">" +
          marko_escapeXml(session.title || "Без названия") +
          "</td> </tr> ");
      }

      out.w(" ");

      var $for$2 = 0;

      marko_forEach(session.events, function(event) {
        var $keyScope$2 = "[" + ((($for$2++) + $keyScope$1) + "]");

        out.w("<tr><th scope=\"row\"><div class=\"m-0 p-0 dropdown\"><a role=\"button\" data-toggle=\"dropdown\">" +
          marko_escapeXml(event.start_time_formatted) +
          " – " +
          marko_escapeXml(event.end_time_formatted) +
          "</a> <div class=\"dropdown-menu rounded-0\"><span class=\"dropdown-header\"><strong>Добавить в календарь:</strong></span> <a class=\"dropdown-item\"" +
          marko_attr("href", "/ics?event_id=" + event._id) +
          ">Apple iOS</a> <a class=\"dropdown-item\"" +
          marko_attr("href", "/ics?event_id=" + event._id) +
          ">Microsoft Outlook</a> <a class=\"dropdown-item\"" +
          marko_attr("href", (((((((((("https://www.google.com/calendar/render?action=TEMPLATE&text=" + event.title) + "&location=") + event.location) + "&details=%22") + event.title) + "%22%0D%0A%0D%0A") + ("Место проведения: " + event.location)) + "&dates=") + event.start_stamp) + "%2F") + event.end_stamp) +
          ">Google Calendar</a> </div> </div> </th> <td>" +
          marko_escapeXml(event.title) +
          "<span class=\"d-inline d-sm-none\"><br><br>" +
          marko_escapeXml(event.location) +
          "</span></td> <td class=\"d-none d-sm-table-cell\">" +
          marko_escapeXml(event.location) +
          "</td> </tr> ");
      });

      out.w(" ");
    });

    out.w(" </tbody> </table> </div> ");
  });

  out.w("</div><div class=\"border border-primary my-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\" data-toggle=\"collapse\" data-target=\"#collapseFlightInfo\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Выписка и трансфер в аэропорт</p></div></div></div><div class=\"border p-2 mb-2 collapse\" id=\"collapseFlightInfo\"><table style=\"border-collapse: separate; border-spacing: 0rem 0.5rem;\"><tbody>");

  var $for$3 = 0;

  marko_forEach(data.flights, function(flight) {
    var $keyScope$3 = "[" + (($for$3++) + "]");

    out.w("<tr><td rowspan=\"4\" class=\"text-center align-middle px-2 py-1 border\">Рейс<br><strong>№" +
      marko_escapeXml(flight.flight_number) +
      "</strong></td><td class=\"pl-1\"><strong>" +
      marko_escapeXml(flight.date_formatted) +
      "</strong></td></tr><tr><td class=\"pl-1\">Выписка: <strong>" +
      marko_escapeXml(flight.checkout_time_formatted) +
      "</strong></td></tr><tr><td class=\"pl-1\">Трансфер: <strong>" +
      marko_escapeXml(flight.transfer_time_formatted) +
      "</strong></td></tr><tr><td class=\"pl-1\">Вылет: <strong>" +
      marko_escapeXml(flight.flight_time_formatted) +
      "</strong></td></tr>");
  });

  out.w("</tbody></table></div><div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\" data-toggle=\"collapse\" data-target=\"#collapseContactInfo\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Контакты организаторов</p> </div> </div></div><div class=\"border p-2 mb-2 collapse show\" id=\"collapseContactInfo\"><div class=\"row no-gutters\">");

  var $for$4 = 0;

  marko_forEach(data.contacts, function(contact, loopIndex, loopAll) {
    var $keyScope$4 = "[" + (($for$4++) + "]");

    out.w("<div class=\"col-12 col-sm-7 col-m-8\">" +
      marko_escapeXml(contact.name) +
      "</div> <div class=\"col-12 col-sm-5 col-m-4 text-sm-right\"><a" +
      marko_attr("href", "tel:" + contact.phone_number) +
      "><small>" +
      marko_escapeXml(contact.phone_number_formatted) +
      "</small></a> </div> ");

    if (!(loopIndex === (loopAll.length - 1))) {
      out.w("<div class=\"col-12\"><hr> </div> ");
    }

    out.w(" ");
  });

  out.w(" </div></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/info/components/info-content.marko",
    component: "./info-content.marko"
  };
