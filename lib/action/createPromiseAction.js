'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPromiseAction = createPromiseAction;

/**
 * Converts some handler result Promise filling to event for dispatching.
 * For example:
 * function checkUserExists(userId) {
 *   return fetch('some/url/' + userId).then(resp => resp.json())
 * }
 * let checkFromUser = createPromiseAction(checkUserExists, FROM_FOUND)
 * let checkToUser = createPromiseAction(checkUserExists, TO_FOUND)
 */
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