/**
 * @module Misc
 * @category Constants
 */

/**
 * Fixed object containing all possible configurator-states
 * @const {Object}
 */
export const StatusEnum = Object.freeze({
  NONE: 1,
  PLACING_CYLINDER: 2,
  CYLINDER_SELECTED: 3,
});

/**
 * Fixed object containing all possible order-states
 * @const {Object}
 */
export const OrderStatus = Object.freeze({
  PENDING: "PENDING",
  IN_PRODUCTION: "IN_PRODUCTION",
  FINISHED: "FINISHED",
});


/**
 * x-Position of the right cylinder-stack in the scene
 * @const {number}
 */
export const xRight = 52.5;

/**
 * x-Position of the left cylinder-stack in the scene
 * @const {number}
 */
export const xLeft = -52.5;
