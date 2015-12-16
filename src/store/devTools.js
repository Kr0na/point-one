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
      resultState.then(state => {
        console.groupCollapsed('Dispatch event ' + event.type + ' in ' + key)
        console.log('Original State:', originState)
        console.log('New state:', state)
        console.groupEnd()
      })
      return resultState
    }
    return store
  }
}
