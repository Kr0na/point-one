/**@flow*/

/**
 * Promise that some async action will be resolved and trigger action just on call.
 * Helpful for readCounters and/or some unrelevant data and we don't need details from action result
 * If Action will be rejected it's fires Fail event
 */
export function createPositiveAction(handler:Function, onCall:string, onFail:string):Function {
  if (onFail == null) {
      onFail = onCall + '_FAIL'
  }
  return (...props) => dispatch => {
    dispatch({type: onCall, ...props[0]})
    return handler(...props)
    .catch(
      err => (dispatch({
        type: onFail,
        ...props[0],
        ...err
      }))
    )
  }
}
