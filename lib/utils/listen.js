'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.listen = listen;

var _makeFieldsGetter = require('./makeFieldsGetter');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function makeWrapper() {
  var providedStore = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var stateGetter = arguments[1];

  var name = 'store' + parseInt("" + Math.random() * 1000);
  return function (Component) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      _inherits(WrappedComponent, _Component);

      function WrappedComponent(props, context, updater) {
        _classCallCheck(this, WrappedComponent);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WrappedComponent).call(this, props, context, updater));

        if (!_this.state) {
          _this.state = {};
        }
        _this[name] = providedStore || context.store;
        var _storeState = stateGetter(_this[name].getState());
        _this.state = _extends({}, _this.state, _storeState, _defineProperty({}, name, _storeState));
        if (!_this._listeners) {
          _this._listeners = [];
        }
        return _this;
      }

      _createClass(WrappedComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          _get(Object.getPrototypeOf(WrappedComponent.prototype), 'componentDidMount', this) && _get(Object.getPrototypeOf(WrappedComponent.prototype), 'componentDidMount', this).call(this);
          this._listeners.push(this[name].listen(function (state) {
            state = stateGetter(state);
            if (_this2.state[name] !== state) {
              //Optimization to prevent Component rerender when using makeFieldsGetter
              var hasChanges = Object.keys(state).length != Object.keys(_this2.state[name]).length || Object.keys(state).reduce(function (result, key) {
                return result || !Object.is(state[key], _this2.state[name][key]);
              }, false);
              hasChanges && _this2.setState(_extends({}, state, _defineProperty({}, name, state)));
            }
          }));
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          _get(Object.getPrototypeOf(WrappedComponent.prototype), 'componentWillUnmount', this) && _get(Object.getPrototypeOf(WrappedComponent.prototype), 'componentWillUnmount', this).call(this);
          this._listeners.forEach(function (listener) {
            return listener();
          });
          this._listeners = [];
          delete this[name];
        }
      }]);

      return WrappedComponent;
    }(Component), _class.contextTypes = _extends({}, Component.contextTypes || {}, {
      store: function store(_ref) {
        var _store = _ref.store;

        if (_store && typeof _store.getState == 'function' && typeof _store.dispatch == 'function') {
          return null;
        }
        if (providedStore) return;
        throw new Error('Store must be in context please use Provider or make ChildContext');
      }
    }), _temp;
  };
}

function listen(store) {
  var stateGetter = arguments.length <= 1 || arguments[1] === undefined ? function (state) {
    return state;
  } : arguments[1];
  var deprecatedArg = arguments[2];

  if (Array.isArray(stateGetter)) {
    (function () {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('fields argument is deprecated and will be removed in next versions. Please change your code to use makeFieldsGetter() if you want');
      }
      var fields = [].concat(_toConsumableArray(stateGetter));
      stateGetter = function stateGetter(state) {
        state = deprecatedArg && deprecatedArg(state) || state;
        return (0, _makeFieldsGetter.makeFieldsGetter)(fields)(state);
      };
    })();
  }
  if (store instanceof Function || !store) {
    return makeWrapper(null, store || function (state) {
      return state;
    });
  } else {
    return makeWrapper(store, stateGetter || function (state) {
      return state;
    });
  }
}