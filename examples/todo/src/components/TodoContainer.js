/**@flow*/
import React, {Component} from 'react'
import {listen} from 'point-one'
import {AppStore, dispatch} from '../AppStore'
import TodoItem from './TodoItem'
import {doneTodo, deleteTodo, createTodo} from '../actions'

@listen(AppStore)
class TodoContainer extends Component {

  createTodo(e) {
    if (e.keyCode == 13 && e.target.value.trim().length > 1) {
      dispatch(createTodo(e.target.value))
      e.target.value = ""
    }
  }

  render() {
    const {todo} = this.state
    return (
      <div className="container">
        <header className="header">
          <h1>Todos</h1>
          <input className="new-todo" onKeyUp={e => this.createTodo(e)} placeholder="What needs to be done?"/>
        </header>
        <section className="main">
          <ul className="todo-list">
            {todo.map(item => (
              <TodoItem
                onDone={e => dispatch(doneTodo(item.id))}
                onDelete={e => dispatch(deleteTodo(item.id))}
                key={item.id}
                {...item}
              />
            ))}
          </ul>
        </section>
      </div>
    )
  }
}

export default TodoContainer
