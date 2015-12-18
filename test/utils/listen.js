import {createStore, concatReducers, concatEventReducers, listen} from '../../src/index'

describe('Utils', () => {
  describe('Listen', () => {
    let foo = concatEventReducers({
      'foo': () => 'foo',
      'bar': () => 'bar'
    })
    let reducer = concatReducers({
      foo
    })
    let store = createStore(reducer, {name: 'Alex'})
    it('should use initial state', () => {

      let Test = listen(store, ['name', 'foo'])(class Test {
        constructor() {

        }

        setState(state) {
          this.state = {
            ...this.state,
            ...state
          }
        }
      })
      const test = new Test
      test.should
        .have.property('state')
        .and.have.property('name', 'Alex')
        test.componentDidMount()
      store.dispatch({type: 'foo'})
      test.should
        .have.property('state')
        .and.have.property('name', 'Alex')
      test.should
        .have.property('state')
        .and.have.property('foo', 'foo')
    })
  })
})
