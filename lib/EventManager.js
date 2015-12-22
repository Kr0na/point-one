'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEventManager = createEventManager;
exports.getEventManager = getEventManager;
exports.getSharedEventManager = getSharedEventManager;
exports.dispatch = dispatch;
exports.register = register;

var sharedEventManager = undefined;

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
  return getSharedEventManager().dispatch(event);
}

function register(callback) {
  return getSharedEventManager().register(callback);
}