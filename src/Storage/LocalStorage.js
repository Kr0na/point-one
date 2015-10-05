import AbstractStorage from '../AbstractStorage'

export default class LocalStorage extends AbstractStorage {

    constructor(key, options) {
        super(key, options)
        this.options = options
    }
}