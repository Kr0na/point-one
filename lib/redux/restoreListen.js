"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.restoreListen = restoreListen;


/**
 * Redux DevTools change format of store state so we need call getState callback
 */
function restoreListen(next) {
  return function (reducer, initialState, extenders) {
    var store = next(reducer, initialState, extenders);
    return _extends({}, store, {
      listen: function listen(callback) {
        return store.listen(function () {
          return callback(store.getState());
        });
      }
    });
  };
}