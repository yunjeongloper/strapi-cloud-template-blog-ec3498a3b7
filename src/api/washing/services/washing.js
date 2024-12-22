'use strict';

/**
 * washing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::washing.washing');
