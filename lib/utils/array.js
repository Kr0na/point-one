"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayRemove = arrayRemove;
exports.arrayReplace = arrayReplace;
exports.arrayPlace = arrayPlace;
exports.arrayAppend = arrayAppend;
exports.arrayPrepend = arrayPrepend;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function arrayRemove(state, index) {
  return [].concat(_toConsumableArray(state.slice(0, index)), _toConsumableArray(state.slice(index + 1, state.length)));
}

function arrayReplace(state, index, newItem) {
  return [].concat(_toConsumableArray(state.slice(0, index)), [newItem], _toConsumableArray(state.slice(index + 1, state.length)));
}

function arrayPlace(state, item, after) {
  return [].concat(_toConsumableArray(state.slice(0, after)), [item], _toConsumableArray(state.slice(after, state.length)));
}

function arrayAppend(state, item) {
  return [].concat(_toConsumableArray(state), [item]);
}

function arrayPrepend(state, item) {
  return [item].concat(_toConsumableArray(state));
}