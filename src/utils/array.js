/**@flow*/
export function arrayRemove(state:Array<any>, index:number):Array<any> {
  return [
    ...state.slice(0, index),
    ...state.slice(index + 1, state.length)
  ]
}

export function arrayReplace(state:Array<any>, index:number, newItem:Object):Array<any> {
  return [
    ...state.slice(0, index),
    newItem,
    ...state.slice(index + 1, state.length)
  ]
}

export function arrayPlace(state:Array<any>, item:Object, after:number):Array<any> {
  return [
    ...state.slice(0, after),
    item,
    ...state.slice(after, state.length)
  ]
}

export function arrayAppend(state:Array<any>, item:Object):Array<any> {
  return [
    ...state,
    item
  ]
}

export function arrayPrepend(state:Array<any>, item:Object):Array<any> {
  return [
    item,
    ...state
  ]
}
