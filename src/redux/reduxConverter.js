/**@flow*/
import type {StoreInitializer} from '../../flow/types'

/**
 * Fix main differences between point-one and redux
 */
export function reduxConverter(next:StoreInitializer):StoreInitializer {
  return (reducer, initialState, extenders) => {
    const store = next((state, event, ...other) => {
      //Redux DevTools subscribe INIT event so we convert it to redux
      if (event.type == '@@point/INIT') {
        event.type = '@@redux/INIT'
      }
      return reducer(state, event)
    }, initialState, extenders)
    return {
      ...store,
      subscribe: store.listen,
      //Hot reloading should not trigger warnings
      replaceReducer: reducer => store.dangerously.replaceReducer(reducer, true)
    }
  }
}
