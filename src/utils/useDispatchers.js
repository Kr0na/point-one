/**@flow*/
import type {
  DispatchExtender,
  StoreExtender
} from '../../flow/types'
import {compose} from './compose'

export function useDispatchers(...dispatchers: Array<DispatchExtender>): StoreExtender {
  return next => (reducer, initialState, extenders) => {
    let
      store = next(reducer, initialState, extenders),
      dispatch = store.dispatch,
      api = {
        getState: store.getState,
        dispatch: event => dispatch(event)
      }

    dispatch = compose(...dispatchers.map(callback => callback(api)))(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
