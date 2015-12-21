# Point One - Is a powerful implementation of Flux/Redux to start your application with easy
[![Build Status](https://travis-ci.org/Kr0na/point-one.svg?branch=master)](https://travis-ci.org/Kr0na/point-one)
[![codecov.io](https://codecov.io/github/Kr0na/point-one/coverage.svg?branch=master)](https://codecov.io/github/Kr0na/point-one?branch=master)

## Actions
Actions is a simple function that produce some event that can be used for dispatching.
Event must be a plain object and contains type variable or be a function that will
receive dispatcher for async things. Functionality of dispatcher can be extended by
composition.

Example of actions:
```js
import {TODO_CREATE} from 'path/to/constants'

export function createTodo(value) {
  return {
    type: TODO_CREATE,
    value
  }
}

export function shareTodo(id) {
  return dispatch => asyncActionWithPromise(id).then(dispatch, dispatch)
}
```

## Reducers
Reducer is a function that based on some Event make new state. For example you can
read about Array.reduce

Simple example of reducer

```js
export function counterReducer(state, event) {
  switch(event.type) {
    case 'increase':
      return state + 1
    case 'decrease':
      return state - 1
    default:
      return state
  }
}

var someState = 0;
someState = counterReducer(someState, {type:'increase'})//1
someState = counterReducer(someState, {type:'decrease'})//0
someState = counterReducer(someState, {type:'another'})//0
```

For store purposes you can use our helpers: concatReducers and concatEventReducers:
```js
concatReducers(reducers:Object):Function
```
Arguments:
- reducers - an object with key - field name in state, value - function reducer

```js
concatEventReducers(reducers:Object):Function
```
Arguments:
- reducers - an object with key - event type and value - function reducer for event

Example of usage:
```js
const counter = concatEventReducers({
  'INCREASE': state => state + 1,
  'DECREASE': state => state - 1,
  'RESET': () => 10
})
const name = concatEventReducers({
  'MAKE_UPPER': state => state.toUpperCase(),
  'MAKE_LOWER': state => state.toLowerCase(),
  'SET_NAME': (state, event) => event.name
  'RESET': () => 'John Doe'
})
const reducer = concatReducers({
  counter,
  name
})
let state = {
  counter: 10,
  name: 'John Doe'
}
state = reducer(state, {type: 'INCREASE'})//Will increase counter
state = reducer(state, {type: 'MAKE_UPPER'})//Name will be 'JOHN DOE'
state = reducer(state, {type: 'RESET'})//Will reset state to original state
```

## Stores
Store is a container that can contain any data

For demo just use reducer and initialState from previous example
```js
import {createStore} from 'point-one'

let todoStore = createStore(reducer, state)
todoStore.dispatch({type: 'INCREASE'})
todoStore.dispatch({type: 'MAKE_UPPER'})
todoStore.dispatch({type: 'RESET'})
```

## Todo
3. add tests for EventManager
4. make docs
5. make examples
