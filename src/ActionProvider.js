import EventManager from './EventManager'
import {PROVIDE_KEY, TWICE_INIT, warn, err} from './messages'
let actions = {}

export default class ActionProvider {

    constructor(key) {
        if (!key) {
            key = this.constructor.name
            warn(PROVIDE_KEY.replace(':name', key).replace(':type', 'action provider'))
        }
        this.key = key
        if (actions.hasOwnProperty(key)) {
            err(TWICE_INIT.replace(':name', key).replace(':type', 'action provider'))
        } else  {
            actions[key] = this
        }

        this.init()
    }

    init() {

    }

    repeatEvery(callback, timeout = 1000) {
        var
            interval = null,
            unregister = () => {
                clearInterval(interval)
            },
            register = null
            register = (timeout) => {
                interval = setInterval(() => {
                    callback({register, unregister})
                }, timeout)
            }
            ;

        return register(timeout)
    }

    /**
     * @param {String} eventType
     * @param {Object} data
     * @return {Promise}
     */
    emit(eventType, data = {}) {
        var promise =  EventManager.getSharedEventManager().dispatch(Object.assign({}, data, {eventType}))
        promise.emit = (eventType, data) => {
            promise.then(() => {
                return this.emit(eventType, data)
            })
        };
        promise.fail = (eventType, data) => {
            promise.catch(() => {
                return this.emit(eventType, data)
            })
        }

        return promise
    }

    static get(name) {
        return actions[name]
    }

    static create(name, proto) {
        return new (ActionProvider.createClass(name, proto));
    }

    static createClass(name, proto) {
        let MultiAction = class extends ActionProvider {
            constructor(key) {
                super(name + key)
            }

            init() {
                Object.keys(proto).forEach(key => {
                    this[key] = this[key].bind(this)
                })
                super.init()
            }
        }
        Object.keys(proto).forEach(key => {
            MultiAction.prototype[key] = proto[key]
        })
        return MultiAction
    }
}