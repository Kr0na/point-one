import {concatReducers} from '../index'

let foo = (value, event) => {
    switch (event.type) {
        case 'foo':
            return 'bar'
        case 'bar':
            return undefined
        default:
            return value
    }
}

let bar = (value, event) => {
    switch (event.type) {
        case 'foo':
            return undefined
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
            .not.have.property('bar')

        obj = reducer(state, {type: "bar"})
        obj.should
            .have.property('name', 'Alex')
        obj.should
            .have.property('bar', 'foo')
        obj.should
            .not.have.property('foo')
        obj = reducer(state, {type: "nothing"})
        obj.should
            .be.equal(state)
    })
})
