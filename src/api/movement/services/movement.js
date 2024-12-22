'use strict';

/**
 * movement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::movement.movement');
