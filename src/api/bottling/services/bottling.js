'use strict';

/**
 * bottling service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bottling.bottling');
