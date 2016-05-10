/**@flow*/
import type {PointReducer, PointAction} from '../../flow/types'

export function concatEventReducers(reducers: {[key: string]: PointReducer}, initialState: ?any): PointReducer {
  return (state = initialState, event) => {
    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event)
    } else if (reducers.hasOwnProperty('default')) {
      return reducers.default(state, event)
    } else {
      return state
    }
  }
}
