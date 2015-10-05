import AbstractStorage from '../AbstractStorage'

export default class SessionStorage extends AbstractStorage {

    constructor(key, options) {
        super(key, options)
        this.options = options
    }
}