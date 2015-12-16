/**@flow*/

export function devTools(key:string):Function {
  return next => (reducer:Function, initialState:Object = {}) => {
    let
      store = next(reducer, initialState),
      originalDispatch = store._dispatch
    store._dispatch = event => {
      const
        originState = JSON.parse(JSON.stringify(store.state)),
        resultState = originalDispatch(event)
      console.groupCollapsed('Dispatch event ' + event.type + ' in ' + key)
      console.log('Event', event)
      console.log('Original State:', originState)
      console.log('New state:', resultState)
      console.groupEnd()
      return resultState
    }
    return store
  }
}
