import React from 'react'
import EventManager from '../src/EventManager'

export default class Component extends React.Component {

    constructor(props, context) {
        super(props, context)
        this.listeners = []
    }

    componentDidMount() {
        this.setUp()
    }

    setUp() {

    }

    tearDown() {

    }

    componentWillUnmout() {
        this.listeners.forEach(listener => listener())
        this.tearDown()
    }

    listenTo(eventType, callback) {
        this.listeners.push(EventManager.getSharedEventManager().subscribe(eventType, callback))
    }

    listenStore(store, callback, event = 'change') {
        this.listeners.push(store.subscribe(event, callback))
    }

    when(expression, whenTrue, whenFalse = null) {
        return expression ? whenTrue : whenFalse
    }

    assignToStore(variable, store) {
        this.listenStore(store, () => {
            this.setState({
                [variable]: store.getState()
            })
        })
    }
}