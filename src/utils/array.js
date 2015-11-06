
export function arrayRemove(state:Array, index:Number):Array {
    return [
        ...state.slice(0, index),
        ...state.slice(index + 1, state.length)
    ]
}

export function arrayReplace(state:Array, index:Number, newItem:Object):Array {
    return [
        ...state.slice(0, index - 1),
        newItem,
        ...state.slice(index + 1, state.length)
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