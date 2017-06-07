'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createPromiseAction = createPromiseAction;


/**
 * Converts some handler result Promise filling to event for dispatching.
 * For example:
 * function checkUserExists(userId) {
 *   return fetch('some/url/' + userId).then(resp => resp.json())
 * }
 * let checkFromUser = createPromiseAction(checkUserExists, FROM_FOUND)
 * let checkToUser = createPromiseAction(checkUserExists, TO_FOUND)
 */
function createPromiseAction(handler, onSuccess) {
  var onFail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!onFail) {
    onFail = onSuccess + '_FAIL';
  }

  return function () {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    return function (dispatch) {
      return handler.apply(undefined, props).then(function (data) {
        return dispatch(_extends({}, data, {
          type: onSuccess
        }));
      }, function (err) {
        return dispatch(_extends({}, err, {
          type: onFail
        }));
      });
    };
  };
}