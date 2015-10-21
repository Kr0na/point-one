import MemoryStore from './MemoryStore'
import {err, STORAGE_NOT_PROVIDED} from './messages'

export default class StorageStore extends MemoryStore {

    constructor(key, options) {
        super(key, options)
        if (!options.storage) {
            throw new Error(STORAGE_NOT_PROVIDED.replace(':what', key))
        }
        this.storage = options.storage
        this.behavior = options.behavior || StorageStore.STORE_AFTER
    }

    fetch() {
        let loaded = false
        if (this.storage.hasCache()) {
            this.storage.getCache().then(docs => {
                !loaded && this.setState(docs)
            })
        }
        if (!this.storage.hasCache() || this.storage.cacheExpired()) {
            this.storage.fetch().then(
                docs => {
                    loaded = true
                    this.setState(docs)
                }
            )
        }
    }

    find(id, defaultValue = null, request = true) {
        let result = super.find(id)
        if (result) {
            return result
        }
        if (!result && !request) {
            return defaultValue
        } else {
            return this.storage.find(id).then(
                doc => {
                    this.beginRaw()
                    this.insert(doc)
                    this.endRaw()
                    return doc
                }
            )
        }
    }

    insert(data, notifyAll) {
        if (!this.raw && this.behavior == StorageStore.STORE_AFTER) {
            return this.storage.insert(data).then(result => {
                super.insert(result, notifyAll)
                return result
            })
        } else {
            super.insert(data, notifyAll)
            if (!this.raw) {
                return this.storage.insert(data).then(
                    result => {
                        super.insert(result, notifyAll)
                        return result
                    },
                    err => {
                        if (data[this.idProperty]) {
                            this.beginRaw()
                            this.delete(data[this.idProperty])
                            this.endRaw()
                        } else {
                            //Remove element
                        }
                        throw err
                    }
                )
            } else {
                return Promise.resolve(data)
            }
        }
    }

    update(id, data, notify) {
        if (!this.raw && this.behavior == StorageStore.STORE_AFTER) {
            return this.storage.update(id, data).then(result => {
                super.update(id, result, notify)
                return result
            })
        } else {
            !this.raw && this.storage.update(id, data).then(
                result => {
                    super.update(id, result)
                }
            )
            super.update(id, data, notify)
        }
    }

    /**
     * @param {Object}  criteria
     * @param {Boolean} request
     * @param {Boolean} replaceState
     * @returns {*}
     */
    findBy(criteria, request = true, replaceState = true) {
        if (request) {
            return this.storage.findBy(criteria).then(
                docs => {
                    if (replaceState) {
                        this.setState(docs)
                    } else {
                        this.beginRaw()
                        docs.forEach(this.commit.bind(this))
                        this.endRaw()
                    }
                    return docs
                }
            )
        } else {
            return super.findBy(criteria)
        }
    }

    delete(id) {
        if (!this.raw && this.behavior == StorageStore.STORE_AFTER) {
            return this.storage.delete(id).then(result => {
                super.delete(id)
                return result
            })
        } else {
            super.delete(id)
            if (!this.raw) {
                return this.storage.delete(id)
            } else {
                return Promise.resolve()
            }
        }
    }

    beginRaw() {
        this.raw = true
    }

    endRaw() {
        this.raw = false
    }
}

StorageStore.STORE_ASYNC = 'async'
StorageStore.STORE_AFTER = 'after'