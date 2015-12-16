'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.devTools = devTools;
function devTools(key) {
  return function (next) {
    return function (reducer) {
      var initialState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var store = next(reducer, initialState),
          originalDispatch = store._dispatch;
      store._dispatch = function (event) {
        var originState = JSON.parse(JSON.stringify(store.state)),
            resultState = originalDispatch(event);
        console.groupCollapsed('Dispatch event ' + event.type + ' in ' + key);
        console.log('Original State:', originState);
        console.log('New state:', resultState);
        console.groupEnd();
        return resultState;
      };
      return store;
    };
  };
}