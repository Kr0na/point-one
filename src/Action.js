/**@flow*/
export function createPromiseAction(handler:Function, onSuccess:string, onFail:?string = null):Function {
    if (!onFail) {
        onFail = onSuccess + '_FAIL'
    }
    return (...props) => {
        handler(...props)
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
