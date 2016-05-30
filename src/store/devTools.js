/**@flow*/
import type {DispatchExtender} from '../../flow/types'

/*istanbul ignore next*/
export function devTools(name: string): DispatchExtender {
  if (process.env.NODE_ENV !== 'production') {
    // Prevent production application from console related bugs of IE and eating memory by caching console outputs
    return () => next => next
  } else {
    return ({dispatch, getState}) => next => event => {
      const execute = data => {
        const
          initialState = getState(),
          result = next(data),
          finalState = getState()
        console.groupCollapsed('Dispatch event ' + data.type + ' in ' + name)
        console.log('Original State:', initialState)
        console.log('New state:', finalState)
        console.groupEnd()
        return result
      }
      if (event instanceof Function) {
        return event(execute, getState)
      } else {
        return execute(event)
      }
    }
  }
}
