/**@flow*/
import {compose} from './compose'

export function useDispatchers(...dispatchers:Array<Function>):Function {
  return next => (reducer, initialState) => {
    let
      store = next(reducer, initialState),
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
