import {createPromiseAction, createMemoizeAction} from '../index'

describe('Actions', () => {
  it('should work Promise Action', () => {
    let action = createPromiseAction(() => {
      return Promise.resolve({
        name: 'Alex'
      })
    }, 'SOME')
    return action().then(data => {
      data.should.have.property('type', 'SOME')
      data.should.have.property('name', 'Alex')
      return true
    })
  })
  describe('Memoize', () => {
    it('should remember object value', () => {
      let
        callCounter = 0,
        action = createMemoizeAction(() => {
          callCounter++
          return {
            type: 'SOME'
          }
        })
        let result = action()
        result.should.have.property('type', 'SOME')
        callCounter.should.equal(1)
        result = action()
        result.should.have.property('type', 'SOME')
        callCounter.should.equal(1)
    })
  })
})
