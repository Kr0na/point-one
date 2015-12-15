/**@flow*/

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
