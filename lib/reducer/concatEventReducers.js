'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatEventReducers = concatEventReducers;
function concatEventReducers(reducers, initialState) {
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var event = arguments[1];

    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event);
    } else if (reducers.hasOwnProperty('default')) {
      return reducers.default(state, event);
    } else {
      return state;
    }
  };
}