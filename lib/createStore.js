'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POINT_INIT = undefined;
exports.createStore = createStore;

var _eventManager = require('./eventManager');

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POINT_INIT = exports.POINT_INIT = '@@point/INIT';
function createStore(reducer, state, extenders) {
  if (typeof state === 'function' && typeof extenders === 'undefined') {
    extenders = state;
    state = undefined;
  }
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
    if (typeof event == 'function') {
      return event(dispatch, getState);
    } else if (!(0, _isPlainObject2.default)(event) || !event.hasOwnProperty('type')) {
      throw new Error('event must be a Plain Object or Function. Maybe you forgot to compose createStore with some dispatch extender?');
    }
    try {
      var result = currentReducer(currentState, event);
      if (!Object.is(currentState, result)) {
        currentState = result;
        listeners.forEach(function (callback) {
          return callback(currentState);
        });
      }
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error with dispatching event ' + event.type + '. Please check corresponding reducers', e);
      }
      throw e;
    }

    return event;
  }

  //Register store to global dispatcher
  (0, _eventManager.register)(dispatch);

  dispatch({ type: POINT_INIT });

  return {
    getState: getState,
    listen: listen,
    dispatch: dispatch,
    //While using dangerous actions user must understand what he want to do
    dangerously: {
      replaceReducer: function replaceReducer(reducer) {
        var safe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!safe) {
          console.warn('Unsafe replacing reducer. Please check that replacing reducer is really needed');
        }
        currentReducer = reducer;
        dispatch({ type: POINT_INIT });
      }
    }
  };
}