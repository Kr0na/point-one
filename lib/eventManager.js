'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEventManager = createEventManager;
exports.getEventManager = getEventManager;
exports.getSharedEventManager = getSharedEventManager;
exports.dispatch = dispatch;
exports.register = register;

var sharedEventManager = void 0;

var managers = {};

function createEventManager() {
  var feed = [];
  function register(callback) {
    feed.push(callback);
    return function () {
      var index = feed.indexOf(callback);
      if (index != -1) {
        feed.splice(index, 1);
      }
    };
  }

  function dispatch(event) {
    feed.forEach(function (item) {
      return item(event);
    });

    return event;
  }

  return {
    register: register,
    dispatch: dispatch
  };
}

function getEventManager(name) {
  if (!managers.hasOwnProperty(name)) {
    managers[name] = createEventManager();
  }

  return managers[name];
}

function getSharedEventManager() {
  if (!sharedEventManager) {
    sharedEventManager = getEventManager('shared');
  }

  return sharedEventManager;
}

function dispatch(event) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof event == 'function') {
      console.warn('Global dispatch usage is aweful. Try to use local EventManager instances for this purposes. Please be careful because you send function to global dispatch. It\'s bad, because it will be executed many times');
    } else {
      console.warn('Global dispatch usage is aweful. Try to use local EventManager instances for this purposes. Event type is ' + event.type);
    }
  }
  return getSharedEventManager().dispatch(event);
}

function register(callback) {
  return getSharedEventManager().register(callback);
}