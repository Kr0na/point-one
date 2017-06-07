import {createStore, concatReducers, compose, useDispatchers, devTools, localStorageCache} from 'point-one'
import {reduxConverter} from 'point-one/lib/redux/reduxConverter'
import {restoreListen} from 'point-one/lib/redux/restoreListen'
// import {todo} from './reducers/todo'
import todo from './reducers/index'

const
  reducer = concatReducers({
    todo
  }),
  emulateRedux = localStorage.getItem('emulateRedux') || false,
  redux = some => emulateRedux ? some : next => next,
  point = some => !emulateRedux ? some : next => next

export const AppStore = createStore(
  reducer,
  {},
  compose(
    point(useDispatchers(
      devTools('AppStore')
    )),
    redux(restoreListen),
    localStorageCache('todo'),
    redux(window.devToolsExtension ? devToolsExtension(): next => next),
    redux(reduxConverter)
  )
)
export let dispatch = AppStore.dispatch
