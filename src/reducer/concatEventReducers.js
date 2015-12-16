/**@flow*/

export function concatEventReducers(reducers:Object):Function {
  return (state, event:{type:string}) => {
    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event)
    } else if (reducers.hasOwnProperty('default')) {
      return reducers.default(state, event)
    } else {
      return state
    }
  }
}
