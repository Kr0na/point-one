/**@flow*/

/**
 * Converts some handler result Promise filling to event for dispatching.
 * For example:
 * function checkUserExists(userId) {
 *   return fetch('some/url/' + userId).then(resp => resp.json())
 * }
 * let checkFromUser = createPromiseAction(checkUserExists, FROM_FOUND)
 * let checkToUser = createPromiseAction(checkUserExists, TO_FOUND)
 */
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
