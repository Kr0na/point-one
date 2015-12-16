'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = undefined;
exports.localStorageCache = localStorageCache;
exports.createStore = createStore;

var _EventManager = require('./EventManager');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = exports.Store = (function () {
  function Store(options) {
    var _this = this;

    _classCallCheck(this, Store);

    this.state = {};
    if (options.state) {
      if (_typeof(options.state) == "object") {
        Object.keys(options.state).forEach(function (key) {
          _this.state[key] = options.state[key];
        });
      } else {
        this.state = options.state;
      }
    }
    this.reducer = options.reducer;
    this.listeners = {};
    this.index = 10;
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.listen = this.listen.bind(this);
    this.trigger = this.trigger.bind(this);
    (0, _EventManager.register)(this.dispatch);
  }

  _createClass(Store, [{
    key: 'dispatch',
    value: function dispatch(event) {
      if (event instanceof ActionSource) {
        return event.injectDispatcher(this.dispatch);
      } else if (event instanceof Promise || event.then) {
        //$FlowIgnore
        return event.then(this.dispatch, this.dispatch);
      } else if (event.type) {
        return this._dispatch(event);
      } else {
        throw new Error('Wrong event');
      }
    }
  }, {
    key: '_dispatch',
    value: function _dispatch(event) {
      var result = this.reducer(this.state, event);
      if (!Object.is(this.state, result)) {
        this.state = result;
        this.trigger();
      } else {
        //Nothing to do. Reducer returns the same object
      }
      return Promise.resolve(this.state);
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'listen',
    value: function listen(callback) {
      var _this2 = this;

      var index = ++this.index;
      this.listeners[index] = callback;
      return function () {
        delete _this2.listeners[index];
      };
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      var _this3 = this;

      Object.keys(this.listeners).forEach(function (key) {
        return _this3.listeners[key](_this3.state);
      });
    }
  }]);

  return Store;
})();

function localStorageCache(key) {
  return function (next) {
    return function (reducer) {
      var initialState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var content = localStorage.getItem(key);
      if (localStorage.hasOwnProperty(key) && content != null) {
        try {
          initialState = JSON.parse(content);
        } catch (e) {}
      }
      var store = next(reducer, initialState);
      store.listen(function (state) {
        localStorage.setItem(key, JSON.stringify(state));
      });
      return store;
    };
  };
}

function createStore(reducer) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Store({ reducer: reducer, state: state });
}