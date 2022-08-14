// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/speakers-admin/components/speakers-admin-content.marko",
    marko_component = require("./speakers-admin-content.component"),
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

  out.w("<div class=\"row no-gutters\"><div class=\"col-12\"><table class=\"table table-bordered table-hover\"><thead><tr><th>№ п/п</th> <th>Имя</th> <th>Департамент</th> <th>Позиция</th> <th>Фото</th> <th></th> </tr> </thead> <tbody>");

  var $for$0 = 0;

  marko_forEach(data.admin_speakers, function(speaker) {
    var $keyScope$0 = "[" + (($for$0++) + "]");

    out.w("<tr" +
      marko_classAttr(speaker.hidden ? "table-secondary" : null) +
      "><td class=\"align-right\">" +
      marko_escapeXml(speaker.order_num) +
      "</td> <td class=\"align-middle\">" +
      marko_escapeXml(speaker.name) +
      "</td> <td class=\"align-middle\">" +
      marko_escapeXml(speaker.department) +
      "</td> <td class=\"align-middle\">" +
      marko_escapeXml(speaker.position) +
      "</td> <td class=\"align-middle\">");

    if (speaker.photo) {
      out.w("<img" +
        marko_attr("src", "/photos/" + speaker.photo) +
        " class=\"img-fluid\"" +
        marko_attr("alt", "" + speaker.name) +
        " width=\"32\" height=\"32\"> ");
    } else {
      out.w("Нет фото");
    }

    out.w(" </td> <td class=\"align-middle\"><a href=\"#\" class=\"badge badge-danger\">У</a>");

    if (speaker.hidden) {
      out.w("&nbsp;<a href=\"#\" class=\"badge badge-success\">П</a>&nbsp;");
    } else {
      out.w("&nbsp;<a href=\"#\" class=\"badge badge-info\">С</a>&nbsp;");
    }

    out.w("<a href=\"#\" class=\"badge badge-warning\">Р</a></td> </tr> ");
  });

  out.w(" <tr><td colspan=\"6\"><a class=\"text-success\">Добавить докладчика</a></td> </tr> </tbody> </table> </div></div><div class=\"modal fade\" id=\"editSpeakerForm\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\"><div class=\"modal-content rounded-0\"><form><div class=\"modal-header\"><h5 class=\"modal-title\">...</h5> <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Закрыть\"><span aria-hidden=\"true\">&times;</span> </button> </div> <div class=\"modal-body\"><div class=\"form-row\"><div class=\"col-12 col-sm-1\"><div class=\"form-group\"><label for=\"contact_order_number\">№ п/п</label> <input type=\"text\" name=\"order_num\" class=\"form-control\" id=\"order_number\"" +
    marko_attr("value", state.editing_speaker.order_num) +
    "> </div> </div> <div class=\"col-12 col-sm-11\"><div class=\"form-group\"><label for=\"speaker_name\">Имя:</label> <input type=\"text\" name=\"name\" class=\"form-control\" id=\"speaker_name\"" +
    marko_attr("value", state.editing_speaker.name) +
    "> </div> </div> </div><div class=\"form-group\"><div class=\"custom-control custom-checkbox\"><input class=\"custom-control-input\" type=\"checkbox\" id=\"speaker_is_hidden\" name=\"hidden\"" +
    marko_attr("checked", state.editing_speaker.hidden) +
    "><label class=\"custom-control-label\" for=\"speaker_is_hidden\">Скрыть докладчика из списка и скрыть ссылку на него в докладах</label></div></div><div class=\"form-group\"><label for=\"speaker_department\">Департамент:</label> <input type=\"text\" name=\"department\" class=\"form-control\" id=\"speaker_department\"" +
    marko_attr("value", state.editing_speaker.department) +
    "> </div> <div class=\"form-group\"><label for=\"speaker_position\">Позиция:</label> <input type=\"text\" name=\"position\" class=\"form-control\" id=\"speaker_position\"" +
    marko_attr("value", state.editing_speaker.position) +
    "> </div> <div class=\"form-group\"><label for=\"speaker_biography\">Биография:</label> <textarea name=\"biography\" class=\"form-control\" id=\"speaker_biography\" rows=\"5\">" +
    marko_escapeXml(state.editing_speaker.biography) +
    "</textarea> </div> <div class=\"form-group\"><div class=\"custom-file\"><input type=\"file\" class=\"custom-file-input\" id=\"speaker_photo\" name=\"photo\"> <label class=\"custom-file-label\" for=\"speaker_photo\">" +
    marko_escapeXml(state.editing_speaker.photo ? "Фото уже загружено" : "Выберите фото для загрузки") +
    "</label> </div> </div> <div class=\"collapse\" id=\"editSpeakerError\"><div class=\"alert alert-danger\" role=\"alert\" id=\"editSpeakerErrorContent\"></div> </div> </div> <div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary rounded-0\" data-dismiss=\"modal\">Закрыть</button> <button class=\"btn btn-success rounded-0\">Сохранить</button> </div> </form> </div> </div></div>");
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/speakers-admin/components/speakers-admin-content.marko",
    component: "./speakers-admin-content.marko"
  };
