import EventManager from './EventManager'
import AuthStore from './AuthStore'
import {PROVIDE_KEY, TWICE_INIT, warn, err} from './messages'

let stores = {}

/**
 * @deprecated
 */
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
        this.relations = {
            one: {},
            many: {}
        }
        this.eagerRelations = []
        this.eventManager = EventManager.get(key)
        this.idProperty = idProperty
        this.idFormatter = idFormatter
        this.init()
        this.state = this.getInitialState()
        this.rehash()
    }

    init() {

    }

    fetch() {
        if (this.storage) {
            this.fetcher = this.storage.fetch()
            if (this.eagerRelations.length) {
                this.fetcher = this.fetcher.then(data => {
                    let promises = []
                    this.eagerRelations.forEach(column => {
                        let store = AbstractStore.get(this.relations.one[column].store)
                        if (typeof data[column] === 'object') {
                            store._put(data[column], false)
                        } else {
                            promises.push(
                                store.find(data[column])
                            );
                        }
                    })
                    return Promise.all(promises)
                })
            }
            this.fetcher.then(data => {
                delete this.fetcher
                this.setState(data)
                this.emit('fetched')
            })
            return this.fetcher
        } else {
            return Promise.resolve(this.state)
        }
    }

    getState() {
        return this.state
    }

    /**
     * Method for simplify loading some data from storage
     * @param id
     * @param refresh
     * @returns {Promise}
     */
    find(id, refresh = false) {
        if(!refresh && this.has(id)) {
            return Promise.resolve(this.get(id))
        } else if(this.storage) {
            return this.storage.find(id).then(data => {
                this._update(data[this.idProperty], data)
            })
        } else {
            return Promise.reject(id)
        }
    }

    findBy(criteria, updateState = false) {
        if (this.storage) {
            return this.storage.findBy(criteria).then(data => {
                if (updateState) {
                    this.setState(data)
                }
                return data
            }, err => {
                if (updateState) {
                    this.setState([])
                }
                throw err
            })
        } else {
            let data =  this.state.filter(data => {
                var use = true
                Object.keys(criteria).forEach(key => {
                    if (!use) return
                    if (Array.isArray(criteria[key])) {
                        use = criteria[key].indexOf(data[key]) !== -1
                    } else {
                        use = criteria[key] == data[key]
                    }
                })
                return use
            })
            if (updateState) {
                this.setState(data)
            }
            return Promise.resolve(data)
        }
    }

    delete(data) {
        if (this.storage) {
            return this.storage
        } else {
            if (data[this.idProperty]) {
                this.state.slice(this.state.indexOf(data), 1)
                return Promise.resolve(data)
            } else {
                return Promise.resolve(data)
            }
        }
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

    setState(state) {
        this.state = state
        this.rehash()
        this.emit('change')
    }

    /**
     * Save data to store and/or Storage
     * @param data
     * @returns {*}
     */
    save(data) {
        if (this.storage) {
            return this.storage.save(data).then(result => {
                this._put(result)
                return result
            })
        } else {
            this._put(data)
            return Promise.resolve(data)
        }
    }

    /**
     * Simple get
     * @param id
     * @param defaultValue
     * @returns {*}
     */
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

    listenTo(event, callback, bind = true) {
        callback = bind ? callback.bind(this) : callback
        EventManager.getSharedEventManager().subscribe(event, callback)
        return () => {
            EventManager.getSharedEventManager().unsubscribe(event, callback)
        }
    }

    _update(id, data) {
        if (this.has(id)) {
            var obj = this.get(id)
            Object.assign(obj, data)
        }
    }

    _put(data, notify = true) {
        this.state.push(data)
        this.hash[this.idFormatter(data[this.idProperty])] = this.state.length - 1
        notify && this.emit('change')
    }

    setRelationOne(store, innerColumn, lazy = true) {
        this.relations.one[innerColumn] = {
            store
        }
        if (!lazy) {
            this.eagerRelations.push(innerColumn)
        }
    }

    setRelationMany(store, name, outerColumn) {
        this.relations.many[name] = {
            store,
            name,
            outerColumn
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

    static create(name, proto) {
        return new (AbstractStore.createClass(name, proto));
    }

    static createClass(name, proto) {
        let MultiStore = class extends AbstractStore {
            constructor(key, idProperty, idFormatter) {
                super(name + key, idProperty, idFormatter)
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