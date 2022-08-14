// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/home/home.marko",
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
    marko_str = marko_helpers.s,
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

  out.w("<!doctype html><html lang=\"ru\" id=\"nojs\"><head><meta charset=\"utf-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"> <title>" +
    marko_escapeXml(data.settings.header) +
    "</title>");

  lasso_head_tag({}, out, __component, "5");

  out.w("</head><body>");

  component_globals_tag({}, out);

  presentation_nav_tag({
      page: "home"
    }, out, __component, "7");

  out.w("<div class=\"container\"><div class=\"py-2\"><div class=\"row\"><div class=\"col-12 my-2 text-center\">" +
    marko_str(data.settings.home_header) +
    "<p class=\"text-muted\">" +
    marko_str(data.settings.home_description) +
    "</p> </div> <div class=\"col-12 my-2 text-center\"><div class=\"card-columns\"><a href=\"/now\"><div class=\"card border-primary rounded-0\"><div class=\"card-body\"><h5 class=\"card-title text-uppercase text-primary\">Сейчас</h5> <p class=\"card-text text-muted condensed-text\">Информация о текущем выступлении и возможность задать вопрос спикеру напрямую.</p> </div> </div> </a> <a href=\"/schedule\"><div class=\"card border-primary rounded-0\"><div class=\"card-body\"><h5 class=\"card-title text-uppercase text-body\">Программа конференции</h5> <p class=\"card-text text-muted condensed-text\">Расписание основных событий конференции.</p> </div> </div> </a> <a href=\"/info\"><div class=\"card border-primary rounded-0\"><div class=\"card-body\"><h5 class=\"card-title text-uppercase text-body\">Общая информация</h5> <p class=\"card-text text-muted condensed-text\">Дополнительная программа, контакты.</p> </div> </div> </a> <a href=\"/speakers\"><div class=\"card border-primary rounded-0\"><div class=\"card-body\"><h5 class=\"card-title text-uppercase text-body\">Наша команда</h5> <p class=\"card-text text-muted condensed-text\">Информация и краткая биография.</p> </div> </div> </a> <a href=\"/feedback\"><div class=\"card border-primary rounded-0\"><div class=\"card-body\"><h5 class=\"card-title text-uppercase text-body\">Обратная связь</h5> <p class=\"card-text text-muted condensed-text\">Напишите нам!</p> </div> </div> </a> </div> </div> </div> </div></div>");

  if (data.settings.footer_enable) {
    sticky_footer_tag({
        text: data.settings.footer_text
      }, out, __component, "40");
  }

  browser_refresh_tag({}, out, __component, "41");

  lasso_body_tag({}, out, __component, "42");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "43");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/home/home.marko",
    tags: [
      "@lasso/marko-taglib/taglib/config-tag",
      "@lasso/marko-taglib/taglib/head-tag",
      "marko/src/core-tags/components/component-globals-tag",
      "../../components/presentation-nav",
      "../../components/sticky-footer",
      "browser-refresh-taglib/refresh-tag",
      "@lasso/marko-taglib/taglib/body-tag",
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer"
    ]
  };
