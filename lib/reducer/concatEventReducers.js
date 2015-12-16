'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatEventReducers = concatEventReducers;
function concatEventReducers(reducers) {
  return function (state, event) {
    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event);
    } else if (reducers.hasOwnProperty('default')) {
      return reducers.default(state, event);
    } else {
      return state;
    }
  };
}