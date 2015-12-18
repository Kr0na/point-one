/**@flow*/
import {concatReducers, concatEventReducers} from '../../src/index'

describe('Reducer', () => {
  it('should work with Event Reducers', () => {
    const
      eventReducers = concatEventReducers({
        'foo': () => 'foo',
        'bar': () => 'bar'
      }),
      reducer = concatReducers({
        foo: eventReducers
      }),
      state = {name: 'Alex'}
    let
      obj = {}
    obj = reducer(state, {type: "foo"})
    obj.should
        .have.property('name', 'Alex')
    obj.should
        .have.property('foo', 'foo')

    obj = reducer(state, {type: "bar"})
    obj.should
        .have.property('name', 'Alex')
    obj.should
        .have.property('foo', 'bar')
    obj = reducer(state, {type: "nothing"})
    obj.should
        .be.equal(state)
  })
})
