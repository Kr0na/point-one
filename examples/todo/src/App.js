import React, {Component} from 'react'
import {render} from 'react-dom'
import TodoContainer from './components/TodoContainer'
import {AppStore} from './AppStore'

class App extends Component {

  static childContextTypes = {
    store: React.PropTypes.any
  }

  getChildContext() {
    return {
      store: AppStore
    }
  }

  render() {
    return (
      <TodoContainer />
    )
  }
}

render(<App />, document.getElementById('wrapper'))
