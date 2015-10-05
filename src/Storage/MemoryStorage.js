import AbstractStorage from '../AbstractStorage'

export default class MemoryStorage extends AbstractStorage {

    constructor(key, options) {
        super(key, options)
        this.options = options
        this.init()
        this.state = this.getInitialState()
    }

    fetch() {

    }
}