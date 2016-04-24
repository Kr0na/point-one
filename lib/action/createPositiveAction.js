'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createPositiveAction = createPositiveAction;


/**
 * Promise that some async action will be resolved and trigger action just on call.
 * Helpful for readCounters and/or some unrelevant data and we don't need details from action result
 * If Action will be rejected it's fires Fail event
 */
function createPositiveAction(handler, onCall, onFail) {
  if (onFail == null) {
    onFail = onCall + '_FAIL';
  }
  return function () {
    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    return function (dispatch) {
      dispatch(_extends({ type: onCall }, props[0]));
      return handler.apply(undefined, props).catch(function (err) {
        return dispatch(_extends({
          type: onFail
        }, props[0], err));
      });
    };
  };
}