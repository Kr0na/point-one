import React from 'react'
import Component from './Component'

export default class LoadingComponent extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            loaded: !!this.props.store.fetcher
        }
    }

    setUp() {
        let callback = this.setState.bind(this, {loaded: true})
        if (!this.props.store.fetcher) {
            callback()
        } else {
            this.listenStore(this.props.store, callback, 'fetched')
        }
    }

    render() {
        if (this.state.loaded) {
            return (
                this.props.children
            )
        } else {
            return (
                this.props.spinner
            )
        }
    }
}