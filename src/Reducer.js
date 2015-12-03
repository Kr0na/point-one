/**@flow */
export function createReducer(eventType:string, callback:Function):Function {
    return (state, event) => {
        switch (event.type) {
            case eventType:
                return callback(state, event)
            default:
                return state
        }
    }
}

function getCacher():{store:Function, get:Function} {
  var data = undefined
  return {
    store(raw) {
      data = raw
    },
    get() {
      return data
    }
  }
}

export function useArrayHash(callback:Function, idProperty:?string = 'id'):Function {
  let
    hasHash = false,
    hash = {},
    rehash = (state:Array<Object>) => {
      hash = {}
      if (Array.isArray(state)) {
        state.forEach((item, index) => hash[item[idProperty]] = index)
      }
    }
  return (state:Array<Object>, event:{type:string}) => {
    if (!hasHash) {
      rehash(state)
    }
    let result = callback(state, event, hash)
    if (!Object.is(state, result) || !hasHash) {
      rehash(result)
    }
    return result
  }
}

export function concatEventReducers(reducers:Object):Function {
  return (state, event:{type:string}) => {
    if (reducers.hasOwnProperty(event.type)) {
      return reducers[event.type](state, event)
    } else {
      return state
    }
  }
}

export function concatReducers(reducers:Object):Function {
  return (state, event:{type:string}) => {
    let
      hasChanges = false,
      finalState = {}
    Object.keys(reducers).forEach(key => {
      let
        reducer = reducers[key],
        value = state[key],
        newValue = undefined
      if (reducer instanceof Function) {
        newValue = reducer(value, event)
      } else {
        //Inner Object
        newValue = concatReducers(reducer)(value, event)
      }
      if (value !== undefined || newValue !== undefined) {
        finalState[key] = newValue
      }
      hasChanges = hasChanges || !Object.is(value, newValue)
    })

    return hasChanges ? {...state, ...finalState} : state
  }
}
