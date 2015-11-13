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
            },
            err => {
              result = err
            }
          )
        } else {
          result = event
        }
        return event
      }
    }
}
