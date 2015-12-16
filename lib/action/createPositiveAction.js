'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPositiveAction = createPositiveAction;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionSource = (function () {
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