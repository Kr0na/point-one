'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.bindActions = bindActions;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function bindActions(actions) {
  return function (Component) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      _inherits(ActionComponent, _Component);

      function ActionComponent(props, context, updater) {
        _classCallCheck(this, ActionComponent);

        var _this = _possibleConstructorReturn(this, (ActionComponent.__proto__ || Object.getPrototypeOf(ActionComponent)).call(this, props, context, updater));

        var dispatch = context.store.dispatch;
        _this.actions = Object.keys(actions).reduce(function (result, key) {
          return _extends({}, result, _defineProperty({}, key, function () {
            return dispatch(actions[key].apply(actions, arguments));
          }));
        }, {});
        return _this;
      }

      return ActionComponent;
    }(Component), _class.displayName = 'Actions(' + (Component.displayName || Component.name || Component.prototype.constructor.name) + ')', _class.contextTypes = _extends({}, Component.contextTypes || {}, {
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