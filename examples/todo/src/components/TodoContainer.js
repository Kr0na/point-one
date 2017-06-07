import React, {Component} from 'react'
import {listen} from 'point-one'
import {AppStore, dispatch} from '../AppStore'
import TodoItem from './TodoItem'
import {doneTodo, reopenTodo, deleteTodo, updateTodo, createTodo} from '../actions'

@listen()
class TodoContainer extends Component {

  toggleRedux() {
    if (localStorage.getItem('emulateRedux')) {
      localStorage.removeItem('emulateRedux')
    } else {
      localStorage.setItem('emulateRedux', 1)
    }
    location.reload()
  }

  createTodo(e) {
    if (e.keyCode == 13 && e.target.value.trim().length > 1) {
      dispatch(createTodo(e.target.value))
      e.target.value = ""
    }
  }

  render() {
    const {todo} = this.state
    const redux = localStorage.getItem('emulateRedux')
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
                onDone={e => dispatch(item.status == 'done' ? reopenTodo(item.id) : doneTodo(item.id))}
                onDelete={e => dispatch(deleteTodo(item.id))}
                onUpdate={value => dispatch(updateTodo(item.id, value))}
                key={item.id}
                {...item}
              />
            ))}
          </ul>
        </section>
        <footer className="footer">
          <button className="clear-completed" onClick={e => this.toggleRedux()}>{redux ? 'Disable Redux DevTools' : 'Enable Redux DevTools'}</button>
        </footer>
      </div>
    )
  }
}

export default TodoContainer
