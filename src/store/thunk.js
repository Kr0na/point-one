/**@flow*/
import type {DispatchPlugin, DispatcherAPI} from '../../flow/types'

/**
 * Please use this middleware when you want to use other middlewares
 */
 /*istanbul ignore next*/
export function thunk(api:DispatcherAPI):DispatchPlugin {
  return next => event => {
    if (event instanceof Function) {
      return event(next, api.getState)
    } else {
      return next(event)
    }
  }
}
