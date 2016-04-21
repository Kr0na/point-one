'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.devTools = devTools;
function devTools(name) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (event) {
        var execute = function execute(data) {
          var initialState = getState(),
              result = next(data),
              finalState = getState();
          console.groupCollapsed('Dispatch event ' + data.type + ' in ' + name);
          console.log('Original State:', initialState);
          console.log('New state:', finalState);
          console.groupEnd();
          return result;
        };
        if (event instanceof Function) {
          return event(execute, getState);
        } else {
          return execute(event);
        }
      };
    };
  };
}