/**@flow */
export function creacteReducer(eventType:string, callback:Function):Function {
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

/**
 * Changing Filtering/Ordering based on original setup event with cache for one time loaded things
 * Example:
 * Store item structure:
 *   my_item: {
 *     filter: SOME_FILTER,
 *     order: SOME_ORDER,
 *     limit: 10,
 *     items: [] //this 10 items will be used for render
  *  }
 * @param callback
 * @param resetEventName
 * @param cacher
 * @returns {*}
 */
export function useReselect(callback:Function, resetEventType:string = 'LOAD', cacher:{store:Function, get:Function} = getCacher()):Function {
  let
    loaded = false
  return (state, event) => {
    if (event.type == resetEventType) {
      cacher.store(event)
      loaded = true
    }
    let data = cacher.get()
    return callback(state, event, data)
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
