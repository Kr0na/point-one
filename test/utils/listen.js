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
      @listen(store, ['name', 'foo'])
      class Test {
        constructor() {

        }
      }
      const test = new Test
      test.should
        .have.property('state')
        .and.have.property('name', 'Alex')
    })
  })
})
