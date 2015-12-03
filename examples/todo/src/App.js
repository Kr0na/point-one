import React, {Component} from 'react'
import {render} from 'react-dom'
import TodoContainer from './components/TodoContainer'

class App extends Component {

  render() {
    return (
      <TodoContainer />
    )
  }
}

render(<App />, document.getElementById('wrapper'))
