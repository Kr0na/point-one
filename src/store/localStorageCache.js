/**@flow*/
import type {StoreExtender} from '../../flow/types'

/*istanbul ignore next*/
export function localStorageCache(name:string, fields:Array<string> = []):StoreExtender {
  return next => (reducer, initialState, extenders) => {
    let content:?string = localStorage.getItem(name)
    if (localStorage.hasOwnProperty(name) && content != null) {
      try {
        initialState = {
          ...initialState,
          ...JSON.parse(content)
        }
      } catch (e) {

      }
    }
    const store = next(reducer, initialState, extenders)
    store.listen(() => {
      const state = store.getState()
      if (fields.length) {
        const data = fields.reduce((st, key) => {
          st[key] = state[key]
          return st
        }, {})
        localStorage.setItem(name, JSON.stringify(data))
      } else {
        localStorage.setItem(name, JSON.stringify(state))
      }
    })
    return store
  }
}
