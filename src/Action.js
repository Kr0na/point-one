
export function createPromiseAction(handler:Function, onSuccess:String, onFail:?String = null):Function {
    if (!onFail) {
        onFail = onSuccess + '_FAIL'
    }
    return (...props) => {
        handler(...props)
            .then(
                data => ({
                    ...data,
                    name: onSuccess
                }),
                err => ({
                    ...err,
                    name: onFail
                })
            )
    }
}