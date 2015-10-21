import MemoryStorage from './Storage/MemoryStorage'
import EventManager from './EventManager'

let stores = []

export default class MemoryStore extends MemoryStorage {

    constructor(key, options) {
        super(key, options)
        this.eventManager = EventManager.get(key)
        stores[key] = this
    }

    insert(data, notify = true) {
        super.insert(data)
        notify && this.emit('change')
    }

    update(id, callback, notify = true) {
        super.update(id, callback)
        notify && this.emit('change')
    }

    setState(...props) {
        super.setState(...props)
        this.emit('change')
    }

    listenTo(event, callback, bind = true) {
        callback = bind ? callback.bind(this) : callback
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

    static create(name, proto, options = {}) {
        return new (this.createClass(name, proto))('', options);
    }

    static createClass(name, proto) {
        let MultiStore = class extends this {
            constructor(key, options) {
                super(name + key, options)
            }

            init() {
                Object.keys(proto).forEach(key => {
                    this[key] = this[key].bind(this)
                })
                super.init()
            }
        }
        Object.keys(proto).forEach(key => {
            MultiStore.prototype[key] = proto[key]
        })
        return MultiStore
    }
}