'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.localStorageCache = localStorageCache;


/*istanbul ignore next*/
function localStorageCache(name) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return function (next) {
    return function (reducer, initialState, extenders) {
      var content = localStorage.getItem(name);
      if (localStorage.hasOwnProperty(name) && content != null) {
        try {
          initialState = _extends({}, initialState, JSON.parse(content));
        } catch (e) {}
      }
      var store = next(reducer, initialState, extenders);
      store.listen(function () {
        var state = store.getState();
        if (fields.length) {
          var data = fields.reduce(function (st, key) {
            st[key] = state[key];
            return st;
          }, {});
          localStorage.setItem(name, JSON.stringify(data));
        } else {
          localStorage.setItem(name, JSON.stringify(state));
        }
      });
      return store;
    };
  };
}