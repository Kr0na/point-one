import {createStore} from '../src/index'

describe('Store', () => {
    let reducer = (state, event) => {
        switch (event.type) {
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
    it('should change state correctly', () => {
        let instance = createStore(reducer)
        instance.dispatch({
            type: 'foo'
        })
        instance.getState().should
            .have.property('foo', 'bar')
        instance.getState().should
            .not.have.property('bar')
        instance.dispatch({
            type: 'bar'
        })
        instance.getState().should
            .have.property('bar', 'foo')
        instance.getState().should
            .not.have.property('foo')
    })
    it('should trigger listeners', () => {
        let
            instance = createStore(reducer),
            calledFoo = false,
            calledBar = false,
            unsubscribe = instance.listen(state => {
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
            type: 'foo'
        })
        instance.dispatch({
            type: 'bar'
        })
        calledFoo.should.be.true
        calledBar.should.be.true
        instance.listen((state) => {
            throw new Error('this case must be unreachable')
        })
        instance.dispatch({
            type: 'nothing'
        })
    })
    it('should work with extenders', () => {
      return new Promise((resolve, reject) => {
        createStore(
          reducer,
          {},
          next => (reducer, initialState) => {
            resolve()
          }
        )
      })
    })
})
