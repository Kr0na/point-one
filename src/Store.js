/**@flow*/
import {register} from './EventManager'

declare class ActionSource {
  injectDispatcher: Function;
}

declare class PromiseLike {
  then:Function;
  catch:Function;
}

export class Store {
  state: any;
  reducer: Function;
  listeners: Object;
  index: number;
  dispatch: Function;
  getState: Function;
  listen: Function;
  trigger: Function;

  constructor(options:{state:Object, reducer: Function}) {
    this.state = {}
    if (options.state) {
      if (typeof options.state  == "object") {
        Object.keys(options.state).forEach(key => {
          this.state[key] = options.state[key]
        })
      } else {
        this.state = options.state
      }
    }
    this.reducer = options.reducer
    this.listeners = {}
    this.index = 10
    this.dispatch = this.dispatch.bind(this)
    this.getState = this.getState.bind(this)
    this.listen = this.listen.bind(this)
    this.trigger = this.trigger.bind(this)
    register(this.dispatch)
  }

  dispatch(event:ActionSource|Promise|{type:string}):Promise {
    if (event instanceof ActionSource) {
      return event.injectDispatcher(this.dispatch)
    } else if (event instanceof Promise || event.then) {
      //$FlowIgnore
      return event.then(
        this.dispatch,
        this.dispatch
      )
    } else if (event.type) {
      return this._dispatch(event)
    } else {
      throw new Error('Wrong event')
    }
  }

  _dispatch(event:{type:string}):Promise {
    let
      result = this.reducer(this.state, event)
    if (!Object.is(this.state, result)) {
      this.state = result
      this.trigger()
    } else {
      //Nothing to do. Reducer returns the same object
    }
    return Promise.resolve(this.state)
  }

  getState():any {
    return this.state
  }

  listen(callback:Function):Function {
    var index = ++this.index
    this.listeners[index] = callback
    return () => {
      delete this.listeners[index]
    }
  }

  trigger() {
    Object.keys(this.listeners).forEach(key => this.listeners[key](this.state))
  }
}

export function localStorageCache(key:string):Function {
  return next => (reducer:Function, initialState:Object = {}) => {
    let content:?string = localStorage.getItem(key)
    if (localStorage.hasOwnProperty(key) && content != null) {
      try {
        initialState = JSON.parse(content)
      } catch (e) {

      }
    }
    const store = next(reducer, initialState)
    store.listen(state => {
      localStorage.setItem(key, JSON.stringify(state))
    })
    return store
  }
}

export function createStore(reducer:Function, state:Object = {}):Store {
  return new Store({reducer, state})
}
