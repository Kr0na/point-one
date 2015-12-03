import React, {Component} from 'react'
import {listen} from 'point-one'
import {AppStore, dispatch} from '../AppStore'
import TodoItem from './TodoItem'
import {doneTodo, deleteTodo} from '../actions'

@listen(AppStore, ['todo'])
class TodoContainer extends Component {

  constructor(...options) {
    super(...options)
    this.state = {
      todo: []
    }
    console.log(this)
  }

  render() {
    console.log(this)
    const {todo} = this.state
    return (
      <div className="container">
        {todo.map(item => (
          <TodoItem
            onDone={e => dispatch(doneTodo(item.id))}
            onDelete={e => dispatch(deleteTodo(item.id))}
            key={item.id}
            {...item}
          />
        ))}
      </div>
    )
  }
}

export default TodoContainer
