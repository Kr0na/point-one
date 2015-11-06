import {STORE_METHOD_NOT_FOUND, warn} from './messages'

function makeActionName({name:String}):String {
    return name.toLowerCase().replace(/_[\w]/, (found, match) => match.toUpperCase())
}

export class Store {

    constructor(options:{state: ?Object, reducer: ?Function}) {
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
        this.reducer = options.reducer || this.defaultReducer.bind(this)
        this.listeners = {}
        this.index = 10
        this.dispatch = this.dispatch.bind(this)
        this.listen = this.listen.bind(this)
        this.trigger = this.trigger.bind(this)
        this.init()
    }

    defaultReducer(event:{name: String}, state: Object):Object {
        let methodName = makeActionName(event)
        if (this.hasOwnProperty(methodName)) {
            return this[methodName](event, state)
        } else {
            warn(STORE_METHOD_NOT_FOUND, methodName, 'event', this.constructor.name)
            return state
        }
    }

    init() {

    }

    getInitialState():Object {
        return {}
    }

    dispatch(event:Promise|{name:String}):void {
        if (event.then) {
            event.then(
                this.dispatch,
                this.dispatch
            )
        } else {
            let
                result = this.reducer(event, this.state)
            if (!Object.is(this.state, result)) {
                this.state = result
                this.trigger()
            } else {
                //Nothing to do. Reducer returns the same object
            }
        }
    }

    getState() {
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