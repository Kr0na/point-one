'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observeChange = observeChange;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Method will call on{your state field name}Cahnge method if it's changed
 * For example:
 * ```js
 * @observeChange(['success'])
 * @listen(AuthStore, ['success', 'error'])
 * class Login extends Component {
 *   onSuccessChange(success) {
 *     success && this.context.router.transitionTo('some-page')
 *   }
 *
 *   render() {
 *      return (
 *        //...
 *      )
 *   }
 * }
 * ```
 */
function observeChange(fields) {
  return function (Component) {
    return (function (_Component) {
      _inherits(ObservableComponent, _Component);

      function ObservableComponent() {
        _classCallCheck(this, ObservableComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableComponent).apply(this, arguments));
      }

      _createClass(ObservableComponent, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
          var _this2 = this;

          _get(Object.getPrototypeOf(ObservableComponent.prototype), 'componentDidUpdate', this) && _get(Object.getPrototypeOf(ObservableComponent.prototype), 'componentDidUpdate', this).call(this, prevProps, prevState);
          fields.forEach(function (key) {
            if (!Object.is(_this2.state[key], prevState[key])) {
              var methodName = 'on' + key.replace(/^([\w])/, function (_) {
                return _.toUpperCase();
              }) + 'Change';
              if (_this2[methodName]) {
                _this2[methodName](_this2.state[key], prevState[key]);
              }
            }
          });
        }
      }]);

      return ObservableComponent;
    })(Component);
  };
}