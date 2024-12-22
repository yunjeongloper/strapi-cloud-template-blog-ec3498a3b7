'use strict';

/**
 * spirit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::spirit.spirit');
