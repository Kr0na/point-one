/**@flow*/
import type {
  Store,
  PointReducer,
  Listener,
  ListenerRemover,
  PointAction,
  ThunkAction,
  StoreExtender
} from '../flow/types'
import {register} from './EventManager'
import isPlainObject from 'is-plain-object'

export const POINT_INIT = '@@point/INIT'

export function createStore(reducer: PointReducer, state: ?any|StoreExtender, extenders: ?StoreExtender): Store {
  if (typeof state === 'function' && typeof extenders === 'undefined') {
    extenders = state
    state = undefined
  }
  //Add ability to use extenders
  if (extenders instanceof Function) {
    return extenders(createStore)(reducer, state)
  }

  if (!reducer instanceof Function) {
    throw new Error('Reducer must be a function')
  }
  let
    currentReducer = reducer,
    currentState = state,
    listeners = new Map,
    currentIndex = 0

  function getState(): any {
    return currentState
  }

  function listen(callback: Listener): ListenerRemover {
    if (!callback instanceof Function) {
      throw new Error('Listen callback must be a function')
    }
    const index = ++currentIndex
    listeners.set(index, callback)

    return () => {
      listeners.delete(index)
    }
  }

  function dispatch(event: PointAction|ThunkAction): any {
    //Thunk functionallity
    if (typeof event == 'function') {
      return event(dispatch, getState)
    } else if (!isPlainObject(event) || !event.hasOwnProperty('type')) {
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
    dispatch,
    //While using dangerous actions user must understand what he want to do
    dangerously: {
      replaceReducer(reducer: PointReducer, safe: bool = false): void {
        if (!safe) {
          console.warn('Unsafe replacing reducer. Please check that replacing reducer is really needed')
        }
        currentReducer = reducer
        dispatch({type: POINT_INIT})
      }
    }
  }
}
