import {createStore} from '../../index'
import {todoReducer} from './reducers'

var TodoStore = createStore(todoReducer)

export default TodoStore