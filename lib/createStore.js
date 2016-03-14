'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POINT_INIT = undefined;
exports.createStore = createStore;

var _EventManager = require('./EventManager');

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POINT_INIT = exports.POINT_INIT = '@@point/INIT';

function createStore(reducer) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var extenders = arguments[2];

  //Add ability to use extenders
  if (extenders instanceof Function) {
    return extenders(createStore)(reducer, state);
  }

  if (!reducer instanceof Function) {
    throw new Error('Reducer must be a function');
  }
  var currentReducer = reducer,
      currentState = state,
      listeners = new Map(),
      currentIndex = 0;

  function getState() {
    return currentState;
  }

  function listen(callback) {
    if (!callback instanceof Function) {
      throw new Error('Listen callback must be a function');
    }
    var index = ++currentIndex;
    listeners.set(index, callback);

    return function () {
      listeners.delete(index);
    };
  }

  function dispatch(event) {
    //Thunk functionallity
    if (event instanceof Function) {
      return event(dispatch, getState);
    } else if (!(0, _isPlainObject2.default)(event)) {
      throw new Error('event must be a Plain Object or Function. Maybe you forgot to compose createStore with some dispatch extender?');
    }
    var result = currentReducer(currentState, event);
    if (!Object.is(currentState, result)) {
      currentState = result;
      listeners.forEach(function (callback) {
        return callback(currentState);
      });
    }

    return event;
  }

  //Register store to global dispatcher
  (0, _EventManager.register)(dispatch);

  dispatch({ type: POINT_INIT });

  return {
    getState: getState,
    listen: listen,
    dispatch: dispatch,
    //While using dangerous actions user must understand what he want to do
    dangerously: {
      replaceReducer: function replaceReducer(reducer) {
        var safe = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        if (!safe) {
          console.warn('Unsafe replacing reducer. Please check that replacing reducer is really needed');
        }
        currentReducer = reducer;
      }
    }
  };
}