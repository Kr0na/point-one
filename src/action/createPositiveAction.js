/**@flow*/

class ActionSource {
  dispatcher:?Function;
  promise:Promise;
  callEvent:Object;
  onFail:Object;

  constructor(promise:Promise, callEvent:{type:string}, onFail:{type:string}) {
    this.promise = promise
    this.callEvent = callEvent;
    this.onFail = onFail
  }

  emit(event:{type:string}) {
    if (this.dispatcher == null) {
      throw new Error('Please provide dispatcher')
    } else {
      this.dispatcher(event)
    }
  }

  injectDispatcher(dispatcher:Function):Promise {
    this.dispatcher = dispatcher
    this.dispatcher(this.callEvent)
    return this.promise.catch(
      err => {
        dispatcher({
          ...this.onFail,
          ...err
        })
      }
    )
  }
}

export function createPositiveAction(handler:Function, onCall:string, onFail:string):Function {
  if (onFail == null) {
      onFail = onCall + '_FAIL'
  }
  return (...props) => {
    return new ActionSource(handler(...props), {type: onCall, ...props[0]}, {type: onFail, ...props[0]})
  }
}
