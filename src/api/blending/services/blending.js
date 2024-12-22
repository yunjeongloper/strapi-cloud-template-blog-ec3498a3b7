'use strict';

/**
 * blending service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blending.blending');
