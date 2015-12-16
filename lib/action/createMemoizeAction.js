"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMemoizeAction = createMemoizeAction;

/**
 * Remember Action result after first call and use it after
 * For example:
 *   let getSessionId = createMemoizeAction(function() {
 *     return Math.round((Math.random() * 10000).toString(16));
 *   })
 * After first execution will return the same result
 */
function createMemoizeAction(handler) {
  var result = null,
      promise = null;

  return function () {
    if (result) {
      return result;
    } else if (promise) {
      return promise;
    } else {
      var event = handler.apply(undefined, arguments);
      if (event.then) {
        promise = event;
        event.then(function (data) {
          result = data;
          //Remove link to promise to prevent Memory leak
          promise = null;
        }, function (err) {
          result = err;
          //Remove link to promise to prevent Memory leak
          promise = null;
        });
      } else {
        result = event;
      }
      return event;
    }
  };
}