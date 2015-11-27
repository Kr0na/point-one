/**@flow*/
import {STORE_METHOD_NOT_FOUND, warn} from './messages'
import {register} from './EventManager'
import {ActionSource} from './Action'

export class Store {
  state: any;
  reducer: Function;
  listeners: Object;
  index: number;
  dispatch: Function;
  listen: Function;
  trigger: Function;

  constructor(options:{state:Object, reducer: Function}) {
    this.state = this.getInitialState()
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
    this.listen = this.listen.bind(this)
    this.trigger = this.trigger.bind(this)
    register(this.dispatch)
    this.init()
  }

  init() {

  }

  getInitialState():Object {
      return {}
  }

  dispatch(event:ActionSource|Promise|{type:String}):Promise {
    if (event instanceof ActionSource) {
      return event.injectDispatcher(this.dispatch)
    } else if (event.then) {
      return event.then(
        this.dispatch,
        this.dispatch
      )
    } else {
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

export function createStore(reducer:Function, state:Object = {}):Store {
    return new Store({reducer, state})
}

export function logEvents(logger:{debug:Function}, key:string):Function {
  return next => (reducer:Function, state:Object = {}) => {
    let
      store:Store = next(reducer, state),
      originalDispatch = store.dispatch
    store.dispatch = (event:{type:string}) => {
      if (event instanceof ActionSource) {
        return event.injectDispatcher(store.dispatch)
      } else if (event.then) {
        return event.then(store.dispatch, store.dispatch)
      }
      let result = originalDispatch(event)
      result.then(
        data => {
          logger.debug(
            'Project Store Dispatched event:' + event.type,
            event,
            'Store data:',
            JSON.parse(JSON.stringify(data))
          )
        }
      )
      return result
    }
  }
}
