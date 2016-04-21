import {createStore, compose, useDispatchers, asyncDispatcher} from '../../src/index'

describe('Utils', () => {
  describe('useDispatchers', () => {
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

    it('should call method', () => {
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
            instance.dispatch(dispatch => dispatch({
                type: 'foo'
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
            instance.dispatch(dispatch => dispatch({
                type: 'bar'
            }))
        }))

        return Promise.all(promises)
    })
  })
})
