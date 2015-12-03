'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventManager = getEventManager;
exports.getSharedEventManager = getSharedEventManager;
exports.dispatch = dispatch;
exports.register = register;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sharedEventManager = undefined;

var managers = {};

var EventManager = exports.EventManager = (function () {
  function EventManager(key) {
    _classCallCheck(this, EventManager);

    this.key = key;
    this.feed = {};
    this.globals = [];
    this.dispatch = this.dispatch.bind(this);
  }

  _createClass(EventManager, [{
    key: 'register',
    value: function register(callback) {
      var _this = this;

      this.globals.push(callback);
      return function () {
        _this.unregister(callback);
      };
    }
  }, {
    key: 'subscribe',
    value: function subscribe(eventName, callback) {
      var _this2 = this;

      if (!this.feed.hasOwnProperty(eventName)) {
        this.feed[eventName] = [];
      }
      this.feed[eventName].push(callback);

      return function () {
        _this2.unsubscribe(eventName, callback);
      };
    }

    /**
     * @param eventName
     * @param callback
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(eventName, callback) {
      if (!this.feed[eventName]) {
        return;
      }
      var index = this.feed[eventName].indexOf(callback);
      if (index != -1) {
        this.feed[eventName].splice(index, 1);
      }
    }
  }, {
    key: 'unregister',
    value: function unregister(callback) {
      var index = this.globals.indexOf(callback);
      if (index != -1) {
        this.globals.splice(index, 1);
      }
    }

    /**
     * @param {Object|Promise} data
     * @returns {Promise}
     */

  }, {
    key: 'dispatch',
    value: function dispatch(data) {
      if (data.then) {
        return data.then(this.dispatch, this.dispatch);
      }
      // $FlowIgnore
      var eventName = data.type;

      this.globals.forEach(function (item, index) {
        item(data);
      });
      if (!this.feed.hasOwnProperty(eventName)) {
        return Promise.resolve([]);
      }
      var listeners = [];
      this.feed[eventName].forEach(function (item, index) {
        listeners.push(new Promise(function (resolve, reject) {
          var event = Object.create(data);
          event.resolve = resolve;
          event.reject = reject;
          var result = item(event);
          if (result != null && result.then) {
            result.then(resolve, reject);
          } else {
            resolve(result || true);
          }
        }));
      });
      return Promise.all(listeners);
    }
  }]);

  return EventManager;
})();

function getEventManager(name) {
  if (!managers.hasOwnProperty(name)) {
    managers[name] = new EventManager(name);
  }

  return managers[name];
}

function getSharedEventManager() {
  if (!sharedEventManager) {
    sharedEventManager = new EventManager('shared');
  }

  return sharedEventManager;
}

function dispatch(event) {
  return getSharedEventManager().dispatch(event);
}

function register(callback) {
  return getSharedEventManager().register(callback);
}