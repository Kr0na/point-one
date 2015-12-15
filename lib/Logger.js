'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogger = getLogger;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* istanbul ignore next */

var Logger = exports.Logger = (function () {
  function Logger() {
    var logLevel = arguments.length <= 0 || arguments[0] === undefined ? 4 : arguments[0];

    _classCallCheck(this, Logger);

    this.logLevel = logLevel;
  }

  _createClass(Logger, [{
    key: 'debug',
    value: function debug(name) {
      if (!this.isAllowed(Logger.DEBUG)) return;

      for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        props[_key - 1] = arguments[_key];
      }

      if (props.length > 0) {
        console.groupCollapsed('[DEBUG]' + name);
        props.forEach(function (item) {
          return console.debug(item);
        });
        console.groupEnd();
      } else {
        console.debug('[DEBUG]' + name);
      }
    }
  }, {
    key: 'info',
    value: function info(name) {
      if (!this.isAllowed(Logger.INFO)) return;

      for (var _len2 = arguments.length, props = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        props[_key2 - 1] = arguments[_key2];
      }

      if (props.length > 0) {
        console.groupCollapsed('[INFO]' + name);
        props.forEach(function (item) {
          return console.info(item);
        });
        console.groupEnd();
      } else {
        console.info('[INFO]' + name);
      }
    }
  }, {
    key: 'warn',
    value: function warn(name) {
      if (!this.isAllowed(Logger.WARN)) return;

      for (var _len3 = arguments.length, props = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        props[_key3 - 1] = arguments[_key3];
      }

      if (props.length > 0) {
        console.group('[WARN]' + name);
        props.forEach(function (item) {
          return console.warn(item);
        });
        console.groupEnd();
      } else {
        console.warn('[WARN]' + name);
      }
    }
  }, {
    key: 'error',
    value: function error(name) {
      if (!this.isAllowed(Logger.ERROR)) return;

      for (var _len4 = arguments.length, props = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        props[_key4 - 1] = arguments[_key4];
      }

      if (props.length > 0) {
        console.group('[ERROR]' + name);
        props.forEach(function (item) {
          return console.error(item);
        });
        console.groupEnd();
      } else {
        console.error('[ERROR]' + name);
      }
    }
  }, {
    key: 'fatal',
    value: function fatal(name) {
      if (!this.isAllowed(Logger.FATAL)) return;

      for (var _len5 = arguments.length, props = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        props[_key5 - 1] = arguments[_key5];
      }

      if (props.length > 0) {
        console.group('[FATAL]' + name);
        props.forEach(function (item) {
          return console.error(item);
        });
        console.groupEnd();
      } else {
        console.error('[FATAL]' + name);
      }
    }
  }, {
    key: 'isAllowed',
    value: function isAllowed(logLevel) {
      return this.logLevel <= logLevel;
    }

    //$FlowIgnore

    //$FlowIgnore

    //$FlowIgnore

    //$FlowIgnore

    //$FlowIgnore

    //$FlowIgnore

    //$FlowIgnore

    //$FlowIgnore

  }]);

  return Logger;
})();

Logger.ALL = 0;
Logger.TRACE = 1;
Logger.DEBUG = 2;
Logger.INFO = 3;
Logger.WARN = 4;
Logger.ERROR = 5;
Logger.FATAL = 6;
Logger.OFF = 100;

var logger = undefined;

function getLogger() {
  var logLevel = arguments.length <= 0 || arguments[0] === undefined ? Logger.WARN : arguments[0];

  if (logger == null) {
    logger = new Logger(logLevel);
    return logger;
  } else {
    return logger;
  }
}