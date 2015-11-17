/**@flow*/
export function createPromiseAction(handler:Function, onSuccess:string, onFail:?string = null):Function {
    if (!onFail) {
        onFail = onSuccess + '_FAIL'
    }
    return (...props) => {
        return handler(...props)
            .then(
                data => ({
                    ...data,
                    type: onSuccess
                }),
                err => ({
                    ...err,
                    type: onFail
                })
            )
    }
}

export class ActionSource {
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

export function createMemoizeAction(handler:Function):Function {
  let
    result:?Object = null,
    promise:?Promise = null

    return (...props) => {
      if (result) {
        return result
      } else if (promise) {
        return promise
      } else {
        let event = handler(...props)
        if (event.then) {
          promise = event
          event.then(
            data => {
              result = data
              //Remove link to promise to prevent Memory leak
              promise = null
            },
            err => {
              result = err
              //Remove link to promise to prevent Memory leak
              promise = null
            }
          )
        } else {
          result = event
        }
        return event
      }
    }
}
