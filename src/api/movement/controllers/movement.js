'use strict';

/**
 * movement controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::movement.movement');
