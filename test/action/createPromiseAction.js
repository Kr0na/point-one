import {createPromiseAction} from '../../src/index'

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
})
