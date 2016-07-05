/**@flow*/
import type {StoreInitializer} from '../../flow/types'

function wrapReducer(reducer) {
  return (state, event, ...other) => {
    //Redux DevTools subscribe INIT event so we convert it to redux
    if (event.type == '@@point/INIT') {
      event.type = '@@redux/INIT'
    }
    return reducer(state, event)
  }
}
/**
 * Fix main differences between point-one and redux
 */
export function reduxConverter(next: StoreInitializer): StoreInitializer {
  return (reducer, initialState, extenders) => {
    const store = next(wrapReducer(reducer), initialState, extenders)
    return {
      ...store,
      subscribe(callback) {
        //Redux doesn't populate store state as argument, so we remove it in subscribe
        return store.listen(() => callback())
      },
      dangerously: {
        replaceReducer: (reducer, safe) => store.dangerously.replaceReducer(wrapReducer(reducer), safe)
      },
      //Hot reloading should not trigger warnings
      replaceReducer: reducer => store.dangerously.replaceReducer(wrapReducer(reducer), true)
    }
  }
}
