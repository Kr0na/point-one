import {TODO_ADD, TODO_DELETE} from './constants'

export function addTodo(data) {
    return {
        name: TODO_ADD,
        data
    }
}

export function deleteTodo(id) {
    return {
        name: TODO_DELETE,
        id
    }
}