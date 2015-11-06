export function creacteReducer(eventName:String, callback:Function):Function {
    return (event, state) => {
        switch (event.name) {
            case eventName:
                return callback(event, state)
            default:
                return state
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
export function useReselect(callback:Function, resetEventName:String = 'LOAD', cacher:Object = null):Function {
    if (!cacher) {
        var data = undefined
        cacher = {
            store(raw) {
                data = raw
            },
            get() {
                return data
            }
        }
    }
    let
        loaded = false
    return (event, ...props) => {
        if (event.name == resetEventName) {
            cacher.store(event)
            loaded = true
        }
        let data = cacher.get()
        return callback(event, ...props, data)
    }
}

export function useArrayHash(callback, idProperty = 'id') {
    let
        hasHash = false,
        hash = {},
        rehash = (state) => {
            hash = {}
            if (Array.isArray(state)) {
                state.forEach((item, index) => hash[item[idProperty]] = index)
            }
        }
    return (event, state) => {
        let result = callback(event, state, hash)
        if (!Object.is(state, result) || !hasHash) {
            rehash(result)
        }
        return result
    }
}

export function concatReducers(reducers:Object):Object {
    return (event:Object, state = {}) => {
        let
            hasChanges = false,
            finalState = {}
        Object.keys(reducers).forEach(key => {
            let
                reducer = reducers[key],
                value = state[key],
                newValue = undefined
            if (reducer instanceof Function) {
                newValue = reducer(event, value)
            } else {
                //Inner Object
                newValue = concatReducers(reducer)(event, value)
            }
            if (value !== undefined || newValue !== undefined) {
                finalState[key] = newValue
            }
            hasChanges = hasChanges || !Object.is(value, newValue)
        })

        return hasChanges ? {...state, ...finalState} : state
    }
}