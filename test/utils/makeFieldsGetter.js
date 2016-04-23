/**@flow*/
import {makeFieldsGetter} from '../../src/index'

describe('Utils', () => {
  describe('makeFieldsGetter', () => {
    it('should return an object with needed data', () => {
      const
        state = {
          a: 'a',
          b: 'b',
          c: 'c'
        },
        getter = makeFieldsGetter(['a', 'c', 'd']),
        resultState = getter(state)
      resultState.should
        .have.property('a', 'a')
      resultState.should
        .not.have.property('b')
      resultState.should
        .have.property('c', 'c')
      resultState.should
        .have.property('d', undefined)
    })
  })
})
