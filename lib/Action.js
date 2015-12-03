'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPromiseAction = createPromiseAction;
exports.createPositiveAction = createPositiveAction;
exports.createMemoizeAction = createMemoizeAction;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createPromiseAction(handler, onSuccess) {
  var onFail = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (!onFail) {
    onFail = onSuccess + '_FAIL';
  }
  return function () {
    return handler.apply(undefined, arguments).then(function (data) {
      return _extends({}, data, {
        type: onSuccess
      });
    }, function (err) {
      return _extends({}, err, {
        type: onFail
      });
    });
  };
}

var ActionSource = exports.ActionSource = (function () {
  function ActionSource(promise, callEvent, onFail) {
    _classCallCheck(this, ActionSource);

    this.promise = promise;
    this.callEvent = callEvent;
    this.onFail = onFail;
  }

  _createClass(ActionSource, [{
    key: 'emit',
    value: function emit(event) {
      if (this.dispatcher == null) {
        throw new Error('Please provide dispatcher');
      } else {
        this.dispatcher(event);
      }
    }
  }, {
    key: 'injectDispatcher',
    value: function injectDispatcher(dispatcher) {
      var _this = this;

      this.dispatcher = dispatcher;
      this.dispatcher(this.callEvent);
      return this.promise.catch(function (err) {
        dispatcher(_extends({}, _this.onFail, err));
      });
    }
  }]);

  return ActionSource;
})();

function createPositiveAction(handler, onCall, onFail) {
  if (onFail == null) {
    onFail = onCall + '_FAIL';
  }
  return function () {
    return new ActionSource(handler.apply(undefined, arguments), _extends({ type: onCall }, arguments[0]), _extends({ type: onFail }, arguments[0]));
  };
}

function createMemoizeAction(handler) {
  var result = null,
      promise = null;

  return function () {
    if (result) {
      return result;
    } else if (promise) {
      return promise;
    } else {
      var event = handler.apply(undefined, arguments);
      if (event.then) {
        promise = event;
        event.then(function (data) {
          result = data;
          //Remove link to promise to prevent Memory leak
          promise = null;
        }, function (err) {
          result = err;
          //Remove link to promise to prevent Memory leak
          promise = null;
        });
      } else {
        result = event;
      }
      return event;
    }
  };
}