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

    listen(store, fields) {
        this.listeners.push(store.listen((state) => {
            let
                newState = {},
                hasChanges = false
            Object.keys(fields).forEach(key => {
                if (this.state[key] !== state[key]) {
                    newState[key] = state[key]
                    hasChanges = true
                }
            })
            hasChanges && this.setState(newState)
        }))
    }

    when(expression, whenTrue, whenFalse = null) {
        return expression ? whenTrue : whenFalse
    }
}