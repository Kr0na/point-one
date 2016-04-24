"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thunk = thunk;


/**
 * Please use this middleware when you want to use other middlewares
 */
/*istanbul ignore next*/
function thunk(api) {
  return function (next) {
    return function (event) {
      if (event instanceof Function) {
        return event(next, api.getState);
      } else {
        return next(event);
      }
    };
  };
}