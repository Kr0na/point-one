import {PROVIDE_KEY, TWICE_INIT, SUGGEST_CACHE, warn, err, info} from './messages'
import EventManager from './EventManager'

let storages = {}

export default class AbstractStorage {

    constructor(key, options) {
        if (!key) {
            key = this.constructor.name
            warn(PROVIDE_KEY.replace(':name', key).replace(':type', 'store'))
        }
        this.key = key
        if (storages.hasOwnProperty(key)) {
            err(TWICE_INIT.replace(':name', key).replace(':type', 'store'))
        } else {
            storages[key] = this
        }
        this.eventManager = EventManager.get(key)
        this.idProperty = options.idProperty || 'id'
        this.idFormatter = options.idFormatter || (id=>id)
    }

    injectCache() {
        if (!this.hasCache()) {
            info(SUGGEST_CACHE.replace(':name', this.key).replace(':type', 'storage'));
        }
    }

    hasCache() {
        return !!this.options.cache
    }

    getCache() {
        throw new Error('Unimplemented method getCache call for ' + this.key)
    }

    cacheExpired() {
        throw new Error('Unimplemented method cacheExpired call for ' + this.key)
    }

    getInitialState() {
        return [];
    }

    init() {

    }

    find(id) {
        return this.state.filter(data => data[this.idProperty] == id).shift()
    }

    findOneBy(criteria) {
        return this.findBy(criteria).shift()
    }

    findBy(criteria) {
        var found = this.state.filter(data => {
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
        return found
    }

    commit(data) {
        if (!data[this.idProperty]) {
            data[this.idProperty] = this.idFormatter(this.state.length + 1)
        }
        this.state.push(data)
    }

    delete(id) {
        throw new Error('Trying to call unimplemented method delete on ' + this.key)
    }
}