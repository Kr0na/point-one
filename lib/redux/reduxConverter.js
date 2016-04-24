'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.reduxConverter = reduxConverter;


/**
 * Fix main differences between point-one and redux
 */
function reduxConverter(next) {
  return function (reducer, initialState, extenders) {
    var store = next(function (state, event) {
      //Redux DevTools subscribe INIT event so we convert it to redux
      if (event.type == '@@point/INIT') {
        event.type = '@@redux/INIT';
      }
      return reducer(state, event);
    }, initialState, extenders);
    return _extends({}, store, {
      subscribe: store.listen,
      //Hot reloading should not trigger warnings
      replaceReducer: function replaceReducer(reducer) {
        return store.dangerously.replaceReducer(reducer, true);
      }
    });
  };
}