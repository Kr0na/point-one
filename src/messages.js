
export const PROVIDE_KEY =  'Your :name :type initialize without key, please key to constructor to prevent errors with build by uglify or something like that. Just for test we set key as class name'
export const TWICE_INIT = 'Your :name :type initializes twice. Please, check your code for prevent this. For now we not replace original one.'

export function warn(message) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[WARN]:' + message)
    }
}

export function err(message) {
    if (process.env.NODE_ENV !== 'production') {
        console.error('[ERR]:' + message)
    }
}