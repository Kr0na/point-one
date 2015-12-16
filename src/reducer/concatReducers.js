/**@flow*/
export function concatReducers(reducers:Object):Function {
  return (state, event:{type:string}) => {
    let hasChanges = false
    const newState = Object.keys(reducers).reduce(
      (rawState, key) => {
        let
          reducer = reducers[key],
          value = state[key],
          newValue = reducer(value, event)
        if (value !== undefined || newValue !== undefined) {
          rawState[key] = newValue
        }
        hasChanges = hasChanges || !Object.is(value, newValue)
        return rawState
      },
      {}
    )
    return hasChanges ? {...state, ...newState} : state
  }
}
