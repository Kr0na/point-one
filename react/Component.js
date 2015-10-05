import {Component as Base} from 'react'
import EventManager from '../src/EventManager'

export default class Component extends Base {

    constructor(props, context) {
        super(props, context)
        this.listeners = []
    }

    componentWillUnmout() {
        this.listeners.forEach(listener => listener())
    }

    listenTo(eventType, callback) {
        this.listeners.push(EventManager.getSharedEventManager().subscribe(eventType, callback))
    }

    listenStore(store, callback) {
        this.listeners.push(store.subscribe('change', callback))
    }

    when(expression, whenTrue, whenFalse = null) {
        return expression ? whenTrue : whenFalse
    }
}