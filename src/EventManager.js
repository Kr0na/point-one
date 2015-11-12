/**@flow*/
let sharedEventManager

let managers = {}

export class EventManager {
  key:string;
  feed:Object;
  globals:Array<Function>;

    static getSharedEventManager() {
        if (!sharedEventManager) {
            sharedEventManager = new EventManager('shared')
        }

        return sharedEventManager
    }

    static get(name) {
        if (!managers.hasOwnProperty(name)) {
            managers[name] = new EventManager(name)
        }
        return managers[name]
    }

    constructor(key:string) {
        this.key = key
        this.feed = {};
        this.globals = [];
    }

    register(callback:Function):Function {
        this.globals.push(callback);
        return () => {
          this.unregister(callback);
        }
    }

    subscribe(eventName:string, callback:Function):Function {
        if (!this.feed.hasOwnProperty(eventName)) {
            this.feed[eventName] = [];
        }
        this.feed[eventName].push(callback);

        return () => {
            this.unsubscribe(eventName, callback)
        }
    }

    /**
     * @param eventName
     * @param callback
     */
    unsubscribe(eventName:string, callback:Function) {
        if (!this.feed[eventName]) {
            return;
        }
        let index = this.feed[eventName].indexOf(callback);
        if (index != -1) {
            this.feed[eventName].splice(index, 1);
        }
    }

    unregister(callback:Function) {
        let index = this.globals.indexOf(callback);
        if (index != -1) {
            this.globals.splice(index, 1);
        }
    }

    /**
     * @param {Object} data
     * @returns {Promise}
     */
    dispatch(data:{type:string}):Promise {
        let eventName = data.type;

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
