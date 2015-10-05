import AbstractStorage from '../AbstractStorage'

export default class RestStorage extends AbstractStorage {

    constructor(key, options) {
        super(key, options)
        this.options = options
        this.injectCache()
    }

    fetch() {

    }
}