import {createStore, concatReducers, compose, localStorageCache} from 'point-one'
import {todo} from './reducers/todo'

//We just add ability to store data to localStorage
let finalCreateStore = compose(
  localStorageCache('todo')
)(createStore)

export let AppStore = finalCreateStore(
  concatReducers({
    todo
  }),
  {todo: []}
)
export let dispatch = AppStore.dispatch
