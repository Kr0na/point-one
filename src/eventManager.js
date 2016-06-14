/**@flow*/
import type {EventManager, PointAction} from '../flow/types'
let sharedEventManager

let managers = {}

export function createEventManager():EventManager {
  let feed = []
  function register(callback:Function):Function {
    feed.push(callback);
    return () => {
      let index = feed.indexOf(callback);
      if (index != -1) {
        feed.splice(index, 1);
      }
    }
  }

  function dispatch(event:PointAction):PointAction {
    feed.forEach(item => item(event))

    return event
  }

  return {
    register,
    dispatch
  }
}

export function getEventManager(name:string):EventManager {
  if (!managers.hasOwnProperty(name)) {
    managers[name] = createEventManager()
  }

  return managers[name]
}

export function getSharedEventManager():EventManager {
  if (!sharedEventManager) {
    sharedEventManager = getEventManager('shared')
  }

  return sharedEventManager
}

export function dispatch(event:PointAction):PointAction {
  return getSharedEventManager().dispatch(event)
}

export function register(callback:Function):Function {
  return getSharedEventManager().register(callback)
}
