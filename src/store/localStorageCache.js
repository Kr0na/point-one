/**@flow*/

export function localStorageCache(name:string, fields:Array<string> = []):Function {
  return next => (reducer:Function, initialState:Object = {}) => {
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
    const store = next(reducer, initialState)
    store.listen(state => {
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
