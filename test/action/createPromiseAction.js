import {createPromiseAction} from '../../src/index'

describe('Actions', () => {
  describe('createPromiseAction', () => {

    it('should work with resolved data', () => {
      let action = createPromiseAction(() => {
        return Promise.resolve({
          name: 'Alex'
        })
      }, 'SOME')
      return action()(data => {
        data.should.have.property('type', 'SOME')
        data.should.have.property('name', 'Alex')
        return true
      })
    })

    it('should work with rejected data', () => {
      let action = createPromiseAction(() => {
        return Promise.reject({
          name: 'Alex'
        })
      }, 'SOME')
      return action()(data => {
        data.should.have.property('type', 'SOME_FAIL')
        data.should.have.property('name', 'Alex')
        return true
      })
    })
  })
})
