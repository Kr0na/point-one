/**@flow*/
import {register} from './EventManager'
import isPlainObject from 'is-plain-object'

declare class Store {
  getState():any;
  listen(callback:Function):Function;
  dispatch(event:{type:string}):Object;
}

export const POINT_INIT = '@@point/INIT'

export function createStore(reducer:Function, state:any = {}):Store {
  if (!reducer instanceof Function) {
    throw new Error('Reducer must be a function')
  }
  let
    currentReducer = reducer,
    currentState = state,
    listeners = new Map,
    currentIndex = 0

  function getState():any {
    return currentState
  }

  function listen(callback:Function):Function {
    if (!callback instanceof Function) {
      throw new Error('Listen callback must be a function')
    }
    const index = ++currentIndex
    listeners.set(index, callback)

    return () => {
      listeners.delete(index)
    }
  }

  function dispatch(event:{type:string}):{type:string} {
    if (event instanceof Function) {
      return event(dispatch, getState)
    } else if (!isPlainObject(event)) {
      throw new Error('event must be a Plain Object or Function. Maybe you forgot to compose createStore with some dispatch extender?')
    }
    let
      result = currentReducer(currentState, event)
    if (!Object.is(currentState, result)) {
      currentState = result
      listeners.forEach(callback => callback(currentState))
    }

    return event
  }

  //Register store to global dispatcher
  register(dispatch)

  dispatch({type: POINT_INIT})

  return {
    getState,
    listen,
    dispatch
  }
}
