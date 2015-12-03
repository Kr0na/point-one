'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;
exports.useReselect = useReselect;
exports.useArrayHash = useArrayHash;
exports.concatEventReducers = concatEventReducers;
exports.concatReducers = concatReducers;
function createReducer(eventType, callback) {
  return function (state, event) {
    switch (event.type) {
      case eventType:
        return callback(state, event);
      default:
        return state;
    }
  };
}

function getCacher() {
  var data = undefined;
  return {
    store: function store(raw) {
      data = raw;
    },
    get: function get() {
      return data;
    }
  };
}

/**
 * Changing Filtering/Ordering based on original setup event with cache for one time loaded things
 * Example:
 * Store item structure:
 *   my_item: {
 *     filter: SOME_FILTER,
 *     order: SOME_ORDER,
 *     limit: 10,
 *     items: [] //this 10 items will be used for render
  *  }
 * @param callback
 * @param resetEventName
 * @param cacher
 * @returns {*}
 */
function useReselect(callback) {
  var resetEventType = arguments.length <= 1 || arguments[1] === undefined ? 'LOAD' : arguments[1];
  var cacher = arguments.length <= 2 || arguments[2] === undefined ? getCacher() : arguments[2];

  var loaded = false;
  return function (state, event) {
    if (event.type == resetEventType) {
      cacher.store(event);
      loaded = true;
    }
    var data = cacher.get();
    return callback(state, event, data);
  };
}

function useArrayHash(callback) {
  var idProperty = arguments.length <= 1 || arguments[1] === undefined ? 'id' : arguments[1];

  var hasHash = false,
      hash = {},
      rehash = function rehash(state) {
    hash = {};
    if (Array.isArray(state)) {
      state.forEach(function (item, index) {
        return hash[item[idProperty]] = index;
      });
    }
  };
  return function (state, event) {
    if (!hasHash) {
      rehash(state);
    }
    var result = callback(state, event, hash);
    if (!Object.is(state, result) || !hasHash) {
      rehash(result);
    }
    return result;
  };
}

function concatEventReducers(reducers) {
  return function (state, event) {
    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event);
    } else {
      return state;
    }
  };
}

function concatReducers(reducers) {
  return function (state, event) {
    var hasChanges = false,
        finalState = {};
    Object.keys(reducers).forEach(function (key) {
      var reducer = reducers[key],
          value = state[key],
          newValue = undefined;
      if (reducer instanceof Function) {
        newValue = reducer(value, event);
      } else {
        //Inner Object
        newValue = concatReducers(reducer)(value, event);
      }
      if (value !== undefined || newValue !== undefined) {
        finalState[key] = newValue;
      }
      hasChanges = hasChanges || !Object.is(value, newValue);
    });

    return hasChanges ? _extends({}, state, finalState) : state;
  };
}