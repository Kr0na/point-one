import {TODO_ADD, TODO_DELETE} from './constants'
import {useArrayHash, concatReducers, arrayRemove, arrayAppend} from '../../index'

let todos = useArrayHash((state, event, hash) => {
    switch (event.type) {
        case TODO_ADD:
            let todo = Object.create(event.data)
            todo.id = state.length
            return arrayAppend(state, todo)
        case TODO_DELETE:
            return arrayRemove(state, hash[event.id])
    }
})

export var todoReducer = concatReducers({
    todos
})
