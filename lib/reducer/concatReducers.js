"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatReducers = concatReducers;
function concatReducers(reducers) {
  return function (state, event) {
    var hasChanges = false;
    var newState = Object.keys(reducers).reduce(function (rawState, key) {
      var reducer = reducers[key],
          value = state[key],
          newValue = reducer(value, event);
      if (value !== undefined || newValue !== undefined) {
        rawState[key] = newValue;
      }
      hasChanges = hasChanges || !Object.is(value, newValue);
      return rawState;
    }, {});
    return hasChanges ? _extends({}, state, newState) : state;
  };
}