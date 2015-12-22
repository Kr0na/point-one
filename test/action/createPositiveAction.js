import {createPositiveAction} from '../../src/index'

describe('Actions', () => {

    describe('Positive Actions', () => {
      it('should send event before promise resolved', () => {
        let
          resolve = false,
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
            resolve.should.be.false
            event.should.have.property('id', 5)
            event.should.have.property('type', 'SOME_ACTION')
          },
          source = action({id: 5})(dispatcher)
        callCounter.should.be.equal(1)
        resolve({id: 6})
        callCounter.should.be.equal(1)
      })
      it('should send event after promise rejeted', () => {
        let
          resolve = false,
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
              resolve.should.be.false
              event.should.have.property('id', 5)
              event.should.have.property('type', 'SOME_ACTION')
            } else if (callCounter == 2) {
              event.should.have.property('id', 5)
              event.should.have.property('message', 'text')
              event.should.have.property('type', 'SOME_ACTION_FAIL')
            }
          },
          source = action({id: 5})(dispatcher)
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
