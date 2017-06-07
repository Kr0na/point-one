/**@flow*/
import type {HandlerThunkAction} from '../../flow/types'

/**
 * Remember Action result after first call and use it after
 * For example:
 *   let getSessionId = createMemoizeAction(function() {
 *     return Math.round((Math.random() * 10000).toString(16));
 *   })
 * After first execution will return the same result
 */
export function createMemoizeAction(handler: () => any | Promise<any>): HandlerThunkAction {
  let
    result:?any = null,
    promise:?Promise<any> = null

    return (...props) => {
      if (result != null) {
        return result
      } else if (promise != null) {
        //$FlowIgnore
        return dispatch => promise.then(dispatch, dispatch)
      } else {
        let event = handler(...props)
        if (event instanceof Promise) {
          promise = event
          //$FlowIgnore
          return dispatch => promise
            .then(
              data => {
                result = data
                //Remove link to promise to prevent Memory leak
                promise = null
                dispatch(result)
              },
              err => {
                result = err
                //Remove link to promise to prevent Memory leak
                promise = null
                dispatch(result)
              }
            )
        } else {
          result = event
        }
        return event
      }
    }
}
