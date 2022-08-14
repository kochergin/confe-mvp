// Compiled using marko@4.18.13 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/marko-express$0.0.1/routes/iwanna/iwanna.marko",
    components_helpers = require("marko/src/runtime/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    __browser_json = require.resolve("./browser.json"),
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    lasso_page_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/config-tag")),
    lasso_head_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/head-tag")),
    component_globals_tag = marko_loadTag(require("marko/src/core-tags/components/component-globals-tag")),
    presentation_nav_template = require("../../components/presentation-nav"),
    presentation_nav_tag = marko_loadTag(presentation_nav_template),
    marko_escapeXml = marko_helpers.x,
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

  out.w("<!doctype html><html lang=\"ru\" id=\"nojs\"><head><meta charset=\"utf-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"> <title>Не очень секретная страница</title>");

  lasso_head_tag({}, out, __component, "5");

  out.w("</head><body>");

  component_globals_tag({}, out);

  presentation_nav_tag({
      page: "iwanna"
    }, out, __component, "7");

  out.w("<div class=\"container-fluid\"><div class=\"py-2\">");

  if (data.msg) {
    out.w("<div class=\"row\"><div class=\"col-12 m-2 text-center\"><div class=\"alert alert-primary\" role=\"alert\">" +
      marko_escapeXml(data.msg) +
      "</div> </div> </div> ");
  }

  out.w(" <div class=\"row\">");

  if (data.is_mod) {
    out.w("<div class=\"col-12 m-2 text-center\"><p class=\"m-0\">Больше не хотите быть модератором?</p> </div> <div class=\"col-12 m-2 text-center\"><form><input type=\"hidden\" name=\"role\" value=\"mod\"> <input type=\"hidden\" name=\"action\" value=\"revoke\"> <button class=\"btn btn-secondary\" type=\"submit\">Не хочу</button> </form> </div> ");
  } else {
    out.w("<div class=\"col-12 m-2 text-center\"><p class=\"m-0\">Хотите быть модератором?</p> </div> ");

    if (!data.is_mod) {
      out.w("<div class=\"col-12 m-2 text-center\"><form><input type=\"hidden\" name=\"role\" value=\"mod\"> <input type=\"hidden\" name=\"action\" value=\"grant\"> <button class=\"btn btn-warning\" type=\"submit\">Хочу</button> </form> </div>");
    }

    out.w(" ");
  }

  out.w(" </div> </div></div>");

  browser_refresh_tag({}, out, __component, "28");

  lasso_body_tag({}, out, __component, "29");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "30");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/marko-express$0.0.1/routes/iwanna/iwanna.marko",
    tags: [
      "@lasso/marko-taglib/taglib/config-tag",
      "@lasso/marko-taglib/taglib/head-tag",
      "marko/src/core-tags/components/component-globals-tag",
      "../../components/presentation-nav",
      "browser-refresh-taglib/refresh-tag",
      "@lasso/marko-taglib/taglib/body-tag",
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer"
    ]
  };
