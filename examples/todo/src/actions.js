import {TODO_CREATE, TODO_DONE, TODO_DELETE} from './constants'

export function createTodo(value) {
  return {
    type: TODO_CREATE,
    value,
    status: 'pending'
  }
}

export function doneTodo(id) {
  return {
    type: TODO_DONE,
    id
  }
}

export function deleteTodo(id) {
  return {
    type: TODO_DELETE,
    id
  }
}
