/**@flow*/

export function concatEventReducers(reducers:Object, initialState:?any):Function {
  return (state = initialState, event:{type:string}) => {
    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event)
    } else if (reducers.hasOwnProperty('default')) {
      return reducers.default(state, event)
    } else {
      return state
    }
  }
}
