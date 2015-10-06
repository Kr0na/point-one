import {STORAGE_EMPTY_CONFIG, STORAGE_NOT_FOUND, STORAGE_TYPE_NOT_FOUND, warn, err} from '../messages'
import IndexedDB from './IndexedDBStorage'
import Local from './LocalStorage'
import Memory from './MemoryStorage'
import Mongoose from './MongooseStorage'
import Rest from './RestStorage'
import Session from './SessionStorage'

let types = (!window) ?
{
    indexedDB: IndexedDB,
    local: Local,
    memory: Memory,
    collection: Mongoose,
    rest: Rest,
    session: Session
} :
{
    local: Local,
    memory: Memory,
    collection: Rest,
    rest: Rest,
    session: Session
}

let initializers = []

export default new class Manager {

    constructor(config) {
        if (!config || Object.keys(config).length < 1) {
            warn(STORAGE_EMPTY_CONFIG)
        }
        this.config = config
        this.instances = {}
        this.isNode = !window
    }

    getManager(name) {
        if (this.instances.hasOwnProperty(name)) {
            return this.instances[name]
        }
        if (!this.config.hasOwnProperty(name)) {
            warn(STORAGE_NOT_FOUND.replace(':name', name))
            this.config[name] = {
                type: 'memory'
            }
        }
        let config = this.config[name]
        if (!types.hasOwnProperty(config.type)) {
            err(STORAGE_TYPE_NOT_FOUND.replace(':type', config.type).replace(':all', Object.keys(types).join(',')))
            return false
        }
        let type = new types[config.type](config)
        initializers.forEach(init => init(type))

        return type
    }

    registerType(name, type) {
        types[name] = type
    }

    registerInitializer(initializer) {
        initializers.push(initializer)
    }
}