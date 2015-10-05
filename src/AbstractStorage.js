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
        if (!this.options.cache) {
            info(SUGGEST_CACHE.replace(':name', this.key).replace(':type', 'storage'));
        }
    }

    getInitialState() {
        return [];
    }

    init() {

    }

    find(id) {
        var found = this.state.filter(data => data[this.idProperty] == id)
        if (found.length) {
            return Promise.resolve(found.shift());
        } else {
            return Promise.reject(id)
        }
    }

    findOneBy(criteria) {
        return this.findBy(criteria).then(
            found => {
                return found.shift()
            }
        )
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
        if (found.length) {
            return Promise.resolve(found)
        } else {
            return Promise.reject(criteria)
        }
    }

    commit(data) {
        if (!data[this.idProperty]) {
            data[this.idProperty] = this.idFormatter(this.state.length + 1)
        }
        this.state.push(data)
        return Promise.resolve(data)
    }

    delete(data) {
        if (data[this.idProperty]) {
            this.state.slice(this.state.indexOf(data), 1)
            return Promise.resolve(data)
        } else {
            return Promise.resolve(data)
        }
    }
}