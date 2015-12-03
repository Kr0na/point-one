"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listen = listen;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function listen(store, fields) {
  return function (Component) {
    return (function (_Component) {
      _inherits(WrappedComponent, _Component);

      function WrappedComponent() {
        var _Object$getPrototypeO;

        _classCallCheck(this, WrappedComponent);

        for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
          options[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(WrappedComponent)).call.apply(_Object$getPrototypeO, [this].concat(options)));

        if (!_this.state) {
          _this.state = {};
        }
        _this.state = fields.reduce(function (state, key) {
          state[key] = store.getState()[key];
        }, _this.state);
        if (!_this._listeners) {
          _this._listeners = [];
        }
        return _this;
      }

      _createClass(WrappedComponent, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          _get(Object.getPrototypeOf(WrappedComponent.prototype), "componentDidMount", this).call(this);
          this.listeners.push(store.listen(function (state) {
            var newState = {},
                hasChanges = false;
            fields.forEach(function (key) {
              if (_this2.state[key] !== state[key]) {
                newState[key] = state[key];
                hasChanges = true;
              }
            });
            hasChanges && _this2.setState(newState);
          }));
        }
      }, {
        key: "componentWillUnmout",
        value: function componentWillUnmout() {
          _get(Object.getPrototypeOf(WrappedComponent.prototype), "componentWillUnmout", this).call(this);
          this._listeners.forEach(function (listener) {
            return listener();
          });
        }
      }]);

      return WrappedComponent;
    })(Component);
  };
}