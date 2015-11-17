import {createPromiseAction, createMemoizeAction, createPositiveAction} from '../index'

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
        let result = action()
        result.should.be.instanceOf(Promise)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            //After promise is fullfilled action will returns needed data w/t promise
            result = action()
            result.should.have.property('type', 'SOME')
            callCounter.should.equal(1)
            resolve()
          })
        })
    })
  })

  describe('Positive Actions', () => {
    it('should send event before promise resolved', () => {
      let
        resolve = null,
        reject = null,
        resolved = false,
        callCounter = 0,
        action = createPositiveAction((id) => {
          return new Promise((res, rej) => {
            resolve = res
            reject = rej
          })
        }, 'SOME_ACTION'),
        dispatcher = (event) => {
          callCounter++
          resolved.should.be.false
          resolve.should.be.instanceOf(Function)
          event.should.have.property('id', 5)
          event.should.have.property('type', 'SOME_ACTION')
        },
        source = action({id: 5})
      source.injectDispatcher(dispatcher)
      callCounter.should.be.equal(1)
      resolve({id: 6})
      callCounter.should.be.equal(1)
    })
    it('should send event after promise rejeted', () => {
      let
        resolve = null,
        reject = null,
        resolved = false,
        callCounter = 0,
        action = createPositiveAction((id) => {
          return new Promise((res, rej) => {
            resolve = res
            reject = rej
          })
        }, 'SOME_ACTION'),
        dispatcher = (event) => {
          callCounter++
          if (callCounter == 1) {
            resolved.should.be.false
            resolve.should.be.instanceOf(Function)
            event.should.have.property('id', 5)
            event.should.have.property('type', 'SOME_ACTION')
          } else if (callCounter == 2) {
            event.should.have.property('id', 5)
            event.should.have.property('message', 'text')
            event.should.have.property('type', 'SOME_ACTION_FAIL')
          }
        },
        source = action({id: 5})
      source.injectDispatcher(dispatcher)
      callCounter.should.be.equal(1)
      reject({message: 'text'})
      return new Promise(res => {
        setTimeout(() => {
          callCounter.should.be.equal(2)
          res()
        })
      })
    })
  })
})
