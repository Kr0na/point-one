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

    /**
     *
     * @param {Function} callback
     * @param {Integer} timeout
     * @returns {{register: *, unregister: unregister}}
     */
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

        register(timeout)
        return {
            register,
            unregister
        }
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

    /**
     * Method for functional use of Actions that additionally bind this for methods
     * @param {String} name
     * @param {Object} proto
     * @returns {{init: {(), ()}, emit: (function(String, Object=): Promise), repeatEvery: (function(*=, *=))}}
     */
    static create(name, proto) {
        return new (ActionProvider.createClass(name, proto));
    }

    /**
     * Method for functional use of Actions that additionally bind this for methods
     * @param {String} name
     * @param {Object} proto
     * @returns {{new(*): {init: {(), ()}, emit: (function(String, Object=): Promise), repeatEvery: (function(*=, *=))}, create: (function(*=, *=)), get: (function(*)), new(*=): {init: {(), ()}, emit: (function(String, Object=): Promise), repeatEvery: (function(*=, *=))}, createClass: (function(*, *=))}}
     */
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