/**@flow*/
import type {HandlerThunkAction} from '../../flow/types'

/**
 * Converts some handler result Promise filling to event for dispatching.
 * For example:
 * function checkUserExists(userId) {
 *   return fetch('some/url/' + userId).then(resp => resp.json())
 * }
 * let checkFromUser = createPromiseAction(checkUserExists, FROM_FOUND)
 * let checkToUser = createPromiseAction(checkUserExists, TO_FOUND)
 */
export function createPromiseAction(handler: Function, onSuccess: string, onFail: ?string = null): HandlerThunkAction {
    if (!onFail) {
        onFail = onSuccess + '_FAIL'
    }

    return (...props) => dispatch => handler(...props)
      .then(
          data => (dispatch({
              ...data,
              type: onSuccess
          })),
          err => (dispatch({
              ...err,
              type: onFail
          }))
      )

}
