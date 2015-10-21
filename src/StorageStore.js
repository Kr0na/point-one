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
            this.storage.insert(data).then(result => {
                super.insert(result, notifyAll)
            })
        } else {
            !this.raw && this.storage.insert(data).then(
                result => {
                    super.insert(result, notifyAll)
                },
                err => {
                    if (data[this.idProperty]) {
                        this.beginRaw()
                        this.delete(data[this.idProperty])
                        this.endRaw()
                    } else {
                        //Remove element
                    }
                }
            )
            super.insert(data, notifyAll)
        }
    }

    update(id, data, notify) {
        if (!this.raw && this.behavior == StorageStore.STORE_AFTER) {
            this.storage.update(id, data).then(result => {
                super.update(id, result, notify)
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
            this.storage.delete(id).then(result => {
                super.delete(id)
            })
        } else {
            if (!this.raw) {
                this.storage.delete(id)
            }
            super.delete(id)
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