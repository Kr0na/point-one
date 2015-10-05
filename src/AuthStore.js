import {TWICE_INIT, err} from './messages'
let instance = null

export default class AuthStore {

    constructor() {
        if (instance) {
            err(TWICE_INIT.replace(':name', 'Auth').replace(':type', 'store'))
        } else {
            instance = this
        }
        this.data = {}
        this.init()
    }

    static get() {
        return instance
    }

    init() {

    }

    setData(data) {
        this.data = {}
    }

    user() {
        return this.data
    }

    hasIdentity() {
        return !!this.user().id
    }
}