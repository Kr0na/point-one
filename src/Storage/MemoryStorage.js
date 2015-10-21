import AbstractStorage from '../AbstractStorage'
import {warn, STORAGE_WITHOUT_ID} from '../messages'

export default class MemoryStorage extends AbstractStorage {

    constructor(key, options) {
        super(key, options)
        this.options = options
        this.init()
        this.state = this.getInitialState()
        this.rehash()
    }

    fetch() {

    }

    getState() {
        return this.state
    }

    setState(data) {
        this.state = data
        this.rehash()
    }

    find(id, defaultValue = null) {
        if (this.has(id)) {
            return this.state[this.hash[id]]
        } else {
            return defaultValue
        }
    }

    has(id) {
        return this.hash.hasOwnProperty(id)
    }

    update(id, callback) {
        if (this.has(id)) {
            callback(this.find(id))
        }
    }

    insert(data) {
        if (!data[this.idProperty]) {
            warn(STORAGE_WITHOUT_ID.replace(':data', JSON.stringify(data)))
            data[this.idProperty] = this.state.length
        }
        this.state.push(data)
        this.register(data, this.state.length - 1)
    }

    register(data, index) {
        this.hash[data[this.idProperty]] = index
    }

    commit(data) {
        if (this.has(data[this.idProperty])) {
            this.update(data[this.idProperty], row => {
                Object.assign(row, data)
            })
        } else {
            this.insert(data)
        }
    }

    delete(id) {
        if (this.has(id)) {
            this.state.slice(this.hash[id], 1)
        }
    }

    rehash() {
        this.hash = {}
        this.state.forEach((item, index) => {
            this.hash[item[this.idProperty]] = index
        })
    }
}