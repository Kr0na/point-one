/**@flow*/
import {concatReducers, concatEventReducers} from '../../src/index'

let foo = (value = null, event) => {
  switch (event.type) {
    case 'foo':
      return 'bar'
    case 'bar':
      return null
    default:
      return value
  }
}

let bar = (value = null, event) => {
  switch (event.type) {
    case 'foo':
      return null
    case 'bar':
      return 'foo'
    default:
      return value
  }
}
describe('Reducer', () => {
  let reducer = concatReducers({foo, bar})
  it('should change state by event', () => {
    let
      state = {name: 'Alex'},
      obj = {}
    obj = reducer(state, {type: "foo"})
    obj.should
      .have.property('name', 'Alex')
    obj.should
      .have.property('foo', 'bar')
    obj.should
      .have.property('bar', null)

    obj = reducer(state, {type: "bar"})
    obj.should
      .have.property('name', 'Alex')
    obj.should
      .have.property('bar', 'foo')
    obj.should
      .have.property('foo', null)
    obj = reducer(state, {type: "nothing"})
  })
})
