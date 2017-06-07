/**@flow*/
import type {StoreInitializer} from '../../flow/types'

/**
 * Redux DevTools change format of store state so we need call getState callback
 */
export function restoreListen(next: StoreInitializer): StoreInitializer {
  return (reducer, initialState, extenders) => {
    const store = next(reducer, initialState, extenders)
    return {
      ...store,
      listen: callback => store.listen(() => callback(store.getState()))
    }
  }
}
