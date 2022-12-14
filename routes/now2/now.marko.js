// Compiled using marko@4.13.5 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/now2/now.marko",
    components_helpers = require("marko/src/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    __browser_json = require.resolve("./browser.json"),
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    lasso_page_tag = marko_loadTag(require("lasso/taglib/config-tag")),
    lasso_head_tag = marko_loadTag(require("lasso/taglib/head-tag")),
    component_globals_tag = marko_loadTag(require("marko/src/components/taglib/component-globals-tag")),
    marko_loadTemplate = require("marko/src/runtime/helper-loadTemplate"),
    presentation_nav_template = marko_loadTemplate(require.resolve("../../components/presentation-nav")),
    presentation_nav_tag = marko_loadTag(presentation_nav_template),
    now_content_template = marko_loadTemplate(require.resolve("./components/now-content.marko")),
    now_content_tag = marko_loadTag(now_content_template),
    sticky_footer_template = marko_loadTemplate(require.resolve("../../components/sticky-footer")),
    sticky_footer_tag = marko_loadTag(sticky_footer_template),
    browser_refresh_tag = marko_loadTag(require("browser-refresh-taglib/refresh-tag")),
    lasso_body_tag = marko_loadTag(require("lasso/taglib/body-tag")),
    init_components_tag = marko_loadTag(require("marko/src/components/taglib/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/taglibs/async/await-reorderer-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  lasso_page_tag({
      packagePath: __browser_json,
      dirname: __dirname,
      filename: __filename
    }, out);

  out.w("<!doctype html><html lang=\"ru\" id=\"nojs\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><title>????????????</title>");

  lasso_head_tag({}, out, __component, "5");

  out.w("</head><body>");

  component_globals_tag({}, out);

  presentation_nav_tag({
      page: "now"
    }, out, __component, "7");

  out.w("<div class=\"container\"><div class=\"py-2\">");

  now_content_tag({
      fingerprint: data.fingerprint,
      current_date_formatted: data.current_date_formatted,
      current_time: data.current_time,
      current_time_formatted: data.current_time_formatted,
      progress: data.progress,
      current_event: data.current_event,
      next_event: data.next_event,
      current_questions: data.current_questions
    }, out, __component, "10");

  out.w("</div></div>");

  if (data.settings.footer_enable) {
    sticky_footer_tag({
        text: data.settings.footer_text
      }, out, __component, "11");
  }

  browser_refresh_tag({}, out, __component, "12");

  lasso_body_tag({}, out, __component, "13");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "14");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/now2/now.marko",
    tags: [
      "lasso/taglib/config-tag",
      "lasso/taglib/head-tag",
      "marko/src/components/taglib/component-globals-tag",
      "../../components/presentation-nav",
      "./components/now-content.marko",
      "../../components/sticky-footer",
      "browser-refresh-taglib/refresh-tag",
      "lasso/taglib/body-tag",
      "marko/src/components/taglib/init-components-tag",
      "marko/src/taglibs/async/await-reorderer-tag"
    ]
  };
