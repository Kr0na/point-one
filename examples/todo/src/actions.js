import {TODO_CREATE, TODO_DONE, TODO_DELETE, TODO_REOPEN, TODO_UPDATE} from './constants'

export function createTodo(value) {
  return {
    type: TODO_CREATE,
    value
  }
}

export function doneTodo(id) {
  return {
    type: TODO_DONE,
    id
  }
}

export function reopenTodo(id) {
  return {
    type: TODO_REOPEN,
    id
  }
}

export function deleteTodo(id) {
  return {
    type: TODO_DELETE,
    id
  }
}

export function updateTodo(id, value) {
  return {
    type: TODO_UPDATE,
    id,
    value
  }
}
