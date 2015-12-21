/**@flow*/

type Dispatcher = {dispatch: Function, getState:Function}

export function asyncDispatcher({dispatch, getState}:Dispatcher):Function {
  return next => event =>
    event instanceof Function ?
      event(dispatch, getState) :
      next(event)
}
