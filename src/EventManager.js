/**@flow*/
let sharedEventManager

let managers = {}

export class EventManager {
  key:string;
  feed:Object;
  globals:Array<Function>;
  dispatch:Function;

  constructor(key:string) {
    this.globals = [];
    this.dispatch = this.dispatch.bind(this)
  }

  register(callback:Function):Function {
    this.globals.push(callback);
    return () => {
      let index = this.globals.indexOf(callback);
      if (index != -1) {
        this.globals.splice(index, 1);
      }
    }
  }

  dispatch(event:{type:string}):{type:string} {
    this.globals.forEach(item => item(event))

    return event
  }
}

export function getEventManager(name:string):EventManager {
  if (!managers.hasOwnProperty(name)) {
    managers[name] = new EventManager(name)
  }

  return managers[name]
}

export function getSharedEventManager():EventManager {
  if (!sharedEventManager) {
    sharedEventManager = new EventManager('shared')
  }

  return sharedEventManager
}

export function dispatch(event:{type:string}):Promise {
  return getSharedEventManager().dispatch(event)
}

export function register(callback:Function):Function {
  return getSharedEventManager().register(callback)
}
