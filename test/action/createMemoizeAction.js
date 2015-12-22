import {createMemoizeAction, createStore, concatReducers, concatEventReducers} from '../../src/index'

describe('Actions', () => {
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
    it('should remember value from promise and unwrap it', () => {
      let
        promise = Promise.resolve({
          type: 'SOME'
        }),
        callCounter = 0,
        action = createMemoizeAction(() => {
          callCounter++
          return promise
        })
        let result = action()(e => e)
        // result.should.be.instanceOf(Function)
        return new Promise((resolve, reject) => {
          //After promise is fullfilled action will returns needed data w/t promise
          action()(event => {
            event.should.have.property('type', 'SOME')
            callCounter.should.equal(1)
            resolve()
          })
        })
    })
  })
})
