import {concatEventReducers, arrayAppend, arrayReplace, arrayRemove} from 'point-one'
import {TODO_CREATE, TODO_DONE, TODO_DELETE, TODO_UPDATE} from '../constants'

function createTodo(state, event) {
  const todo = {id: state.length, ...event}
  return arrayAppend(state, todo)
}

function doneTodo(state, event) {
  const
    todoIndex = state.findIndex(item => item.id == event.id),
    todo = state[todoIndex]
  return arrayReplace(
    state,
    todoIndex,
    {
      ...todo,
      status: 'done'
    }
  )
}

function deleteTodo(state, event) {
  const
    todoIndex = state.findIndex(item => item.id == event.id)
    console.log(todoIndex, state, event)
  return arrayRemove(state, todoIndex)
}

function updateTodo(state, event) {
  const
    todoIndex = state.findIndex(item => item.id == event.id),
    todo = state[todoIndex]
  return arrayReplace(
    state,
    todoIndex,
    {
      ...todo,
      value: event.value
    }
  )
}

export let todo = concatEventReducers({
  [TODO_CREATE]: createTodo,
  [TODO_DONE]: doneTodo,
  [TODO_DELETE]: deleteTodo,
  [TODO_UPDATE]: updateTodo
})
