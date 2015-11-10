
export function arrayRemove(state:Array, index:Number):Array {
    return [
        ...state.slice(0, index),
        ...state.slice(index + 1, state.length)
    ]
}

export function arrayReplace(state:Array, index:Number, newItem:Object):Array {
    return [
        ...state.slice(0, index),
        newItem,
        ...state.slice(index + 1, state.length)
    ]
}

export function arrayPlace(state:Array, item:Object, after:Number):Array {
    return [
        ...state.slice(0, after),
        item,
        ...state.slice(after, state.length)
    ]
}

export function arrayAppend(state:Array, item:Object):Array {
    return [
        ...state,
        item
    ]
}

export function arrayPrepend(state:Array, item:Object):Array {
    return [
        item,
        ...state
    ]
}