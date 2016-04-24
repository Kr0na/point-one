/**@flow*/

/*istanbul ignore next*/
export function devTools(name:string):Function {
  return ({dispatch, getState}) => next => event => {
    const execute = data => {
      const
        initialState = getState(),
        result = next(data),
        finalState = getState()
      console.groupCollapsed('Dispatch event ' + data.type + ' in ' + name)
      console.log('Original State:', initialState)
      console.log('New state:', finalState)
      console.groupEnd()
      return result
    }
    if (event instanceof Function) {
      return event(execute, getState)
    } else {
      return execute(event)
    }
  }
}
