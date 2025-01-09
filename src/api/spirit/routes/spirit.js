"use strict";

/**
 * spirit router
 */
// @ts-ignore
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::spirit.spirit", {
  prefix: "",
  config: {
    // findOne: {},
    // create: {},
    // update: {},
    // delete: {},
  },
});
