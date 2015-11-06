import {createStore, Store} from '../index'

describe('Store', () => {
    let reducer = (event, state) => {
        switch (event.name) {
            case 'foo':
                return {
                    foo: 'bar'
                }
            case 'bar':
                return {
                    bar: 'foo'
                }
            case 'nothing':
                return state
        }
    }
    it('should create new instance', () => {
        let instance = createStore(() => {

        })
        instance.should
            .be.instanceOf(Store)
            .and.have.property('state')
    })
    it('should change state correctly', () => {
        let instance = createStore(reducer)
        instance.dispatch({
            name: 'foo'
        })
        instance.state.should
            .have.property('foo', 'bar')
        instance.state.should
            .not.have.property('bar')
        instance.dispatch({
            name: 'bar'
        })
        instance.state.should
            .have.property('bar', 'foo')
        instance.state.should
            .not.have.property('foo')
    })
    it('should trigger listeners', () => {
        let
            instance = createStore(reducer),
            calledFoo = false,
            calledBar = false,
            unsubscribe = instance.listen((state) => {
                if (!calledFoo) {
                    state.should
                        .have.property('foo', 'bar')
                    state.should
                        .not.have.property('bar')
                    calledFoo = true
                } else if (!calledBar) {
                    state.should
                        .have.property('bar', 'foo')
                    state.should
                        .not.have.property('foo')
                    calledBar = true
                } else {
                    throw new Error('this case must be unreachable')
                }
            })
        instance.dispatch({
            name: 'foo'
        })
        instance.dispatch({
            name: 'bar'
        })
        calledFoo.should.be.true
        calledBar.should.be.true
        instance.listen((state) => {
            throw new Error('this case must be unreachable')
        })
        instance.dispatch({
            name: 'nothing'
        })
    })
    it('should listen to promise', () => {
        let
            instance = createStore(reducer),
            promises = []

        promises.push(new Promise((resolve, reject) => {
            let unsubscribe = instance.listen((state) => {
                state.should
                    .have.property('foo', 'bar')
                state.should
                    .not.have.property('bar')
                unsubscribe()
                resolve()
            })
            instance.dispatch(Promise.resolve({
                name: 'foo'
            }))
        }))
        promises.push(new Promise((resolve, reject) => {
            let unsubscribe = instance.listen((state) => {
                state.should
                    .have.property('bar', 'foo')
                state.should
                    .not.have.property('foo')
                unsubscribe()
                resolve()
            })
            instance.dispatch(Promise.reject({
                name: 'bar'
            }))
        }))

        return Promise.all(promises)
    })
})