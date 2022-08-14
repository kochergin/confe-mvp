// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/schedule/schedule.marko",
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    __browser_json = require.resolve("./browser.json"),
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    lasso_page_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/config-tag")),
    marko_escapeXml = marko_helpers.x,
    lasso_head_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/head-tag")),
    component_globals_tag = marko_loadTag(require("marko/src/core-tags/components/component-globals-tag")),
    presentation_nav_template = require("../../components/presentation-nav"),
    presentation_nav_tag = marko_loadTag(presentation_nav_template),
    schedule_calendar_template = require("./components/schedule-calendar.marko"),
    schedule_calendar_tag = marko_loadTag(schedule_calendar_template),
    sticky_footer_template = require("../../components/sticky-footer"),
    sticky_footer_tag = marko_loadTag(sticky_footer_template),
    browser_refresh_tag = marko_loadTag(require("browser-refresh-taglib/refresh-tag")),
    lasso_body_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/body-tag")),
    init_components_tag = marko_loadTag(require("marko/src/core-tags/components/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/core-tags/core/await/reorderer-renderer"));

function render(input, out, __component, component, state) {
  var data = input;

  lasso_page_tag({
      packagePath: __browser_json,
      dirname: __dirname,
      filename: __filename
    }, out);

  out.w("<!doctype html><html lang=\"ru\" id=\"nojs\"><head><meta charset=\"utf-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"> <title>Программа конференции - " +
    marko_escapeXml(data.settings.header) +
    "</title>");

  lasso_head_tag({}, out, __component, "5");

  out.w("</head><body>");

  component_globals_tag({}, out);

  presentation_nav_tag({
      page: "schedule"
    }, out, __component, "7");

  out.w("<div class=\"container\"><div class=\"py-2\"><div class=\"border border-primary mb-2\"><div class=\"row no-gutters\"><div class=\"col-12 bg-primary\"><p class=\"px-2 py-1 m-0 text-light text-uppercase\">Программа конференции</p> </div> </div> </div> ");

  schedule_calendar_tag({
      fingerprint: data.fingerprint,
      schedule: data.schedule
    }, out, __component, "14");

  out.w(" </div></div>");

  if (data.settings.footer_enable) {
    sticky_footer_tag({
        text: data.settings.footer_text
      }, out, __component, "15");
  }

  browser_refresh_tag({}, out, __component, "16");

  lasso_body_tag({}, out, __component, "17");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "18");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/schedule/schedule.marko",
    tags: [
      "@lasso/marko-taglib/taglib/config-tag",
      "@lasso/marko-taglib/taglib/head-tag",
      "marko/src/core-tags/components/component-globals-tag",
      "../../components/presentation-nav",
      "./components/schedule-calendar.marko",
      "../../components/sticky-footer",
      "browser-refresh-taglib/refresh-tag",
      "@lasso/marko-taglib/taglib/body-tag",
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer"
    ]
  };
