'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.concatReducers = concatReducers;
function concatReducers(reducers) {
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var event = arguments[1];

    var hasChanges = false;
    var newState = Object.keys(reducers).reduce(function (rawState, key) {
      var reducer = reducers[key],
          value = state[key],
          newValue = reducer(value, event);
      if (value !== undefined || newValue !== undefined) {
        rawState[key] = newValue;
      }
      if (process.env.NODE_ENV !== 'production') {
        if (value === undefined && newValue === undefined) {
          console.warn('Reducer for field ' + key + ' returns undefined and there\'s no initialState in Store. Please try to make initialState for this field');
        }
      }
      hasChanges = hasChanges || !Object.is(value, newValue);
      return rawState;
    }, {});
    return hasChanges ? _extends({}, state, newState) : state;
  };
}