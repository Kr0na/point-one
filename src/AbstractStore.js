import EventManager from './EventManager'
import AuthStore from './AuthStore'
import {PROVIDE_KEY, TWICE_INIT, warn, err} from './messages'

let stores = {}

export default class AbstractStore {

    constructor(key, idProperty = 'id', idFormatter = id => id) {
        if (!key) {
            key = this.constructor.name
            warn(PROVIDE_KEY.replace(':name', key).replace(':type', 'store'))
        }
        this.key = key
        if (stores.hasOwnProperty(key)) {
            err(TWICE_INIT.replace(':name', key).replace(':type', 'store'))
        } else {
            stores[key] = this
        }
        this.eventManager = EventManager.get(key)
        this.idProperty = idProperty
        this.idFormatter = idFormatter
        this.init()
        this.state = this.getInitialState()
        this.rehash()
    }

    init() {

    }

    user() {
        if (AuthStore.get()) {
            return AuthStore.get().user()
        } else {
            throw new Error('Initialize AuthStore before')
        }
    }

    getInitialState() {
        return []
    }

    add(data) {
        this.state.push(data)
        this.hash[this.idFormatter(data[this.idProperty])] = this.state.length - 1

        this.emit('change')

        return this
    }

    get(id, defaultValue = null) {
        if (this.has(id)) {
            return this.state[this.idFormatter(this.hash[id])]
        } else {
            return defaultValue
        }
    }

    has(id) {
        return this.hash.hasOwnProperty(this.idFormatter(id))
    }

    rehash() {
        this.hash = {}
        this.state.forEach((item, index) => {
            this.hash[this.idFormatter(item[this.idProperty])] = index
        })
    }

    listenTo(event, callback) {
        EventManager.getSharedEventManager().subscribe(event, callback)
        return () => {
            EventManager.getSharedEventManager().unsubscribe(event, callback)
        }
    }

    emit(eventType, data) {
        return this.eventManager.dispatch(Object.assign({}, data, {eventType}))
    }

    subscribe(event, callback) {
        this.eventManager.subscribe(event, callback)
        return () => {
            this.eventManager.unsubscribe(event, callback)
        }
    }

    unsubscribe(event, callback) {
        this.eventManager.unsubscribe(event, callback)
    }

    static get(name) {
        if (!stores.hasOwnProperty(name)) {
            throw new Error(name + ' should be initialized')
        }
        return stores[name]
    }

    static create(name, child) {
        let store = new AbstractStore(name)

        return store
    }
}