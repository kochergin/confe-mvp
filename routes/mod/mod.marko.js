// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/mod/mod.marko",
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    __browser_json = require.resolve("./browser.json"),
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    lasso_page_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/config-tag")),
    lasso_head_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/head-tag")),
    component_globals_tag = marko_loadTag(require("marko/src/core-tags/components/component-globals-tag")),
    presentation_admin_nav_template = require("../../components/presentation-admin-nav"),
    presentation_admin_nav_tag = marko_loadTag(presentation_admin_nav_template),
    mod_content_template = require("./components/mod-content.marko"),
    mod_content_tag = marko_loadTag(mod_content_template),
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

  out.w("<!doctype html><html lang=\"ru\" id=\"nojs\"><head><meta charset=\"utf-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"> <title>Модераторская</title>");

  lasso_head_tag({}, out, __component, "5");

  out.w("</head><body>");

  component_globals_tag({}, out);

  presentation_admin_nav_tag({
      page: "mod",
      is_admin: data.is_admin
    }, out, __component, "7");

  out.w("<div class=\"container\"><div class=\"py-2\">");

  mod_content_tag({
      fingerprint: data.fingerprint,
      current_date_formatted: data.current_date_formatted,
      current_time: data.current_time,
      current_time_formatted: data.current_time_formatted,
      current_utc_offset: data.current_utc_offset,
      holding_current_event: data.holding_current_event,
      overtime_formatted: data.overtime_formatted,
      progress: data.progress,
      current_event: data.current_event,
      previous_events: data.previous_events,
      next_event: data.next_event,
      mod_questions: data.mod_questions
    }, out, __component, "10");

  out.w(" </div></div>");

  browser_refresh_tag({}, out, __component, "11");

  lasso_body_tag({}, out, __component, "12");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "13");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/mod/mod.marko",
    tags: [
      "@lasso/marko-taglib/taglib/config-tag",
      "@lasso/marko-taglib/taglib/head-tag",
      "marko/src/core-tags/components/component-globals-tag",
      "../../components/presentation-admin-nav",
      "./components/mod-content.marko",
      "browser-refresh-taglib/refresh-tag",
      "@lasso/marko-taglib/taglib/body-tag",
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer"
    ]
  };
