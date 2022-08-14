// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/info-admin/components/info-admin-content.marko",
    marko_component = require("./info-admin-content.component"),
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_forEach = marko_helpers.f,
    marko_escapeXml = marko_helpers.x,
    marko_attr = marko_helpers.a;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div class=\"border border-primary my-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Выписка и трансфер в аэропорт</p> </div> </div></div><div class=\"border p-2 mb-2 collapse show\">");

  if (data.admin_flights.length) {
    out.w("<table style=\"border-collapse: separate; border-spacing: 0rem 0.5rem;\"><tbody>");

    var $for$0 = 0;

    marko_forEach(data.admin_flights, function(flight) {
      var $keyScope$0 = "[" + (($for$0++) + "]");

      out.w("<tr><td rowspan=\"3\" class=\"text-center align-middle px-2 py-1 border\">Рейс<br><strong>№" +
        marko_escapeXml(flight.flight_number) +
        "</strong><br><a href=\"#\" class=\"badge badge-danger\">У</a>&nbsp;<a href=\"#\" class=\"badge badge-warning\">Р</a></td> <td class=\"pl-1\">Выписка: <strong>" +
        marko_escapeXml(flight.checkout_time_formatted) +
        "</strong></td> </tr> <tr><td class=\"pl-1\">Трансфер: <strong>" +
        marko_escapeXml(flight.transfer_time_formatted) +
        "</strong></td> </tr> <tr><td class=\"pl-1\">Вылет: <strong>" +
        marko_escapeXml(flight.flight_time_formatted) +
        "</strong></td> </tr> ");
    });

    out.w(" <tr><td colspan=\"2\"></td> </tr> </tbody> </table> ");
  }

  out.w(" <div class=\"w-100 mb-2\">");

  if (data.admin_flights.length) {
    out.w("<hr> ");
  }

  out.w(" <a class=\"text-success\" href=\"#\">Добавить рейс</a> </div></div><div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Контакты организаторов</p> </div> </div></div><div class=\"border p-2 mb-2 collapse show\"><div class=\"row no-gutters\">");

  var $for$1 = 0;

  marko_forEach(data.admin_contacts, function(contact, loopIndex, loopAll) {
    var $keyScope$1 = "[" + (($for$1++) + "]");

    out.w("<div class=\"col-12\">" +
      marko_escapeXml(contact.name) +
      " <a href=\"#\" class=\"badge badge-danger\">У</a>&nbsp;<a href=\"#\" class=\"badge badge-warning\">Р</a> </div> <div class=\"col-12\"><span class=\"text-primary\"><small>" +
      marko_escapeXml(contact.phone_number_formatted) +
      "</small></span> </div> <div class=\"col-12\"><hr> </div> ");
  });

  out.w(" <div class=\"col-12 mb-2\"><a class=\"text-success\" href=\"#\">Добавить контакт</a> </div> </div></div><div class=\"modal fade\" id=\"editFlightForm\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\"><div class=\"modal-content rounded-0\"><form><div class=\"modal-header\"><h5 class=\"modal-title\">...</h5> <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span> </button> </div> <div class=\"modal-body\"><div class=\"form-group\"><label for=\"flight_date\">Дата:</label> <input type=\"date\" name=\"date\" class=\"form-control\" id=\"flight_date\"" +
    marko_attr("value", state.editing_flight.date_input_formatted) +
    "> </div> <div class=\"form-group\"><label for=\"flight_number\">Номер рейса:</label> <input type=\"text\" name=\"title\" class=\"form-control\" id=\"flight_number\"" +
    marko_attr("value", state.editing_flight.flight_number) +
    "> </div> <div class=\"form-row\"><div class=\"col-12 col-sm-4\"><div class=\"form-group\"><label for=\"flight_checkout_time\">Выписка:</label> <input type=\"time\" name=\"checkout_time\" class=\"form-control\" id=\"flight_checkout_time\"" +
    marko_attr("value", state.editing_flight.checkout_time_formatted) +
    "> </div> </div> <div class=\"col-12 col-sm-4\"><div class=\"form-group\"><label for=\"flight_transfer_time\">Трансфер:</label> <input type=\"time\" name=\"transfer_time\" class=\"form-control\" id=\"flight_transfer_time\"" +
    marko_attr("value", state.editing_flight.transfer_time_formatted) +
    "> </div> </div> <div class=\"col-12 col-sm-4\"><div class=\"form-group\"><label for=\"flight_time\">Вылет:</label> <input type=\"time\" name=\"flight_time\" class=\"form-control\" id=\"flight_time\"" +
    marko_attr("value", state.editing_flight.flight_time_formatted) +
    "> </div> </div> </div> </div> <div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary rounded-0\" data-dismiss=\"modal\">Закрыть</button> <button class=\"btn btn-success rounded-0\">Сохранить</button> </div> </form> </div> </div></div><div class=\"modal fade\" id=\"editContactForm\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\"><div class=\"modal-content rounded-0\"><form><div class=\"modal-header\"><h5 class=\"modal-title\">...</h5> <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span> </button> </div> <div class=\"modal-body\"><div class=\"form-row\"><div class=\"col-12 col-sm-1\"><div class=\"form-group\"><label for=\"contact_order_number\">№ п/п</label> <input type=\"text\" name=\"order_number\" class=\"form-control\" id=\"contact_order_number\"" +
    marko_attr("value", state.editing_contact.order_num) +
    "> </div> </div> <div class=\"col-12 col-sm-11\"><div class=\"form-group\"><label for=\"contact_name\">Имя:</label> <input type=\"text\" name=\"name\" class=\"form-control\" id=\"contact_name\"" +
    marko_attr("value", state.editing_contact.name) +
    "> </div> </div> </div> <div class=\"form-group\"><label for=\"contact_phone_number\">Телефон:</label> <input type=\"text\" name=\"phone_number\" class=\"form-control\" id=\"contact_phone_number\"" +
    marko_attr("value", state.editing_contact.phone_number) +
    "> </div> </div> <div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary rounded-0\" data-dismiss=\"modal\">Закрыть</button> <button class=\"btn btn-success rounded-0\">Сохранить</button> </div> </form> </div> </div></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/info-admin/components/info-admin-content.marko",
    component: "./info-admin-content.marko"
  };
