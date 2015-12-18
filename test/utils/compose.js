import {compose} from '../../src/index'

describe('Utils', () => {
  describe('compose', () => {
    it('should be right side', () => {
      let
        counter = 0,
        first = next => () => {
          counter++
          counter.should.be.equal(1)
          next()
        },
        second = next => () => {
          counter++
          counter.should.be.equal(2)
          next()
          return
        },
        main = () => {
          counter.should.be.equal(2)
        },
        composed = compose(first, second)(main)
      counter.should.be.equal(0)
      composed()
    })
  })
})
