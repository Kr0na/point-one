/**@flow*/
import {createStore, concatReducers, compose, useDispatchers, devTools, localStorageCache} from 'point-one'
import {todo} from './reducers/todo'

const reducer = concatReducers({
  todo
})

export const AppStore = createStore(
  reducer,
  {},
  compose(
    localStorageCache('todo'),
    useDispatchers(
      devTools('AppStore')
    )
  )
)
export let dispatch = AppStore.dispatch
