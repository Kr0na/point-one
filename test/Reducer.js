import {concatReducers} from '../index'

let foo = (event, value) => {
    switch (event.name) {
        case 'foo':
            return 'bar'
        case 'bar':
            return undefined
        default:
            return value
    }
}

let bar = (event, value) => {
    switch (event.name) {
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
        obj = reducer({name: "foo"}, state)
        obj.should
            .have.property('name', 'Alex')
        obj.should
            .have.property('foo', 'bar')
        obj.should
            .not.have.property('bar')

        obj = reducer({name: "bar"}, state)
        obj.should
            .have.property('name', 'Alex')
        obj.should
            .have.property('bar', 'foo')
        obj.should
            .not.have.property('foo')
        obj = reducer({name: "nothing"}, state)
        obj.should
            .be.equal(state)
    })
})