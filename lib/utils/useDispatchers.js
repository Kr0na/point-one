'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.useDispatchers = useDispatchers;

var _compose = require('./compose');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function useDispatchers() {
  for (var _len = arguments.length, dispatchers = Array(_len), _key = 0; _key < _len; _key++) {
    dispatchers[_key] = arguments[_key];
  }

  return function (next) {
    return function (reducer, initialState, extenders) {
      var store = next(reducer, initialState, extenders),
          _dispatch = store.dispatch,
          api = {
        getState: store.getState,
        dispatch: function dispatch(event) {
          return _dispatch(event);
        }
      };

      _dispatch = _compose.compose.apply(undefined, _toConsumableArray(dispatchers.map(function (callback) {
        return callback(api);
      })))(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}