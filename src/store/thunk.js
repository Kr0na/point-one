/**@flow*/

/**
 * Please use this middleware when you want to use other middlewares
 */
 /*istanbul ignore next*/
export function thunk(api:{dispatch:Function, getState:Function}):Function {
  return next => event => {
    if (event instanceof Function) {
      return event(next, api.getState)
    } else {
      return next(event)
    }
  }
}
