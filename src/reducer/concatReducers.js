/**@flow*/
import type {PointReducer, PointAction} from '../../flow/types'

export function concatReducers(reducers: {[key: string]: PointReducer}): PointReducer {
  return (state = {}, event:PointAction) => {
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
        if (process.env.NODE_ENV !== 'production') {
          if (value === undefined && newValue === undefined) {
            console.warn(`Reducer for field ${key} returns undefined and there's no initialState in Store. Please try to make initialState for this field`)
          }
        }
        hasChanges = hasChanges || !Object.is(value, newValue)
        return rawState
      },
      {}
    )
    return hasChanges ? {...state, ...newState} : state
  }
}
