
export const PROVIDE_KEY =  'Your :name :type initialize without key, please key to constructor to prevent errors with build by uglify or something like that. Just for test we set key as class name'
export const TWICE_INIT = 'Your :name :type initializes twice. Please, check your code for prevent this. For now we not replace original one.'
export const SUGGEST_CACHE = 'We suggest to use some cache for :name :type. This can help stores to be unloaded from memory when it\s not uses'
export const STORAGE_EMPTY_CONFIG = 'You try to initialize Storage manager with empty config, please make sure, that you don\'t forget something'
export const STORAGE_NOT_FOUND = 'You try to get :name storage that doesn\'t have config. For now we use MemoryStorage for it. For future use please check your config'
export const STORAGE_TYPE_NOT_FOUND = 'You request an storage with type :type, but we doesn\'t found it in all registered types: :all'
export const STORAGE_NOT_PROVIDED = 'You must provide storage to use :what.'
export const STORAGE_WITHOUT_ID = 'You try to insert data without id. For now we generate id, but we are not sure that it\'s unique. Data json: :data'

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

export function info(message) {
    if (process.env.NODE_ENV === "development") {
        console.info(message)
    }
}