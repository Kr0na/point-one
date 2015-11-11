let sharedEventManager

let managers = {}

export class EventManager {

    static getSharedEventManager() {
        if (!sharedEventManager) {
            sharedEventManager = new EventManager
        }

        return sharedEventManager
    }

    static get(name) {
        if (!managers.hasOwnProperty(name)) {
            managers[name] = new EventManager(name)
        }
        return managers[name]
    }

    constructor(key) {
        this.key = key
        this.feed = {};
        this.globals = [];
    }

    register(callback) {
        return this.globals.push(callback);
    }

    subscribe(eventName, callback) {
        if (!this.feed.hasOwnProperty(eventName)) {
            this.feed[eventName] = [];
        }
        this.feed[eventName].push(callback);

        return () => {1
            this.unsubscribe(eventName, callback)
        }
    }

    /**
     * @param eventName
     * @param callback
     */
    unsubscribe(eventName, callback) {
        if (!this.feed[eventName]) {
            return;
        }
        let index = this.feed[eventName].indexOf(callback);
        if (index != -1) {
            this.feed[eventName].splice(index, 1);
        }
    }

    unregister(callback) {
        let index = this.globals.indexOf(callback);
        if (index != -1) {
            this.globals.splice(index, 1);
        }
    }

    /**
     * @param {Object} data
     * @returns {Promise}
     */
    dispatch(data) {
        let eventName = data.eventType;

        this.globals.forEach((item, index) => {
            item(data)
        });
        if (!this.feed.hasOwnProperty(eventName)) {
            return Promise.resolve([])
        }
        var listeners = [];
        this.feed[eventName].forEach((item, index) => {
            listeners.push(new Promise((resolve, reject) => {
                let event = Object.create(data);
                event.resolve = resolve;
                event.reject = reject;
                let result = item(event);
                if (result != null && result.then) {
                    result.then(resolve, reject);
                } else {
                    resolve(result || true)
                }
            }))
        })
        return Promise.all(listeners);
    }
}
