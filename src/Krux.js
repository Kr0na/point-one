import EventManager from './EventManager'
import AbstractStore from './AbstractStore'
import ActionProvider from './ActionProvider'
import AuthStore from './AuthStore'

export default class Krux {

    constructor() {
        this.init()
    }

    init() {

    }

    user() {
        if (AuthStore.get()) {
            return AuthStore.get().user()
        } else {
            throw new Error('Initialize AuthStore before')
        }
    }

    store(name) {
        return AbstractStore.get(name)
    }

    sharedEventManager() {
        return EventManager.getSharedEventManager()
    }

    eventManager(name) {
        return EventManager.get(name)
    }

    actions(name) {
        return ActionProvider.get(name)
    }
}