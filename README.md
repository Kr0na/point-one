# Point One - Is a powerful implementation of Flux/Redux to start your application with easy
[![Build Status](https://travis-ci.org/Kr0na/point-one.svg?branch=master)](https://travis-ci.org/Kr0na/point-one)
[![codecov.io](https://codecov.io/github/Kr0na/point-one/coverage.svg?branch=master)](https://codecov.io/github/Kr0na/point-one?branch=master)

point-one is an state container for any kind of application. It can be used on client and server sides.
It's built with a lot of ready to use helpers and extenders.

>**Example skeleton appliation from creator:
>[Isomorphic Todo](https://github.com/Kr0na/point-two)

## Installation

```
npm install point-one --save
```

## Stores
>point-one not require to use only one store for application but for comfortable development please make independent stores only when you have some big scopes with a lot of reducers that can decrease performance of application

```js
import {createStore, concatReducers, concatEventReducers} from 'point-one'
/**
 * this reducer provide structure and default values:
 * {
 *   auth: {
 *     authenticated: false,
 *     error: false,
 *     identity: null
 *   },
 *   notifications: {
 *     counter: 0
 *   }
 * }
 */
const reducer = concatReducers({
  auth: concatReducers({
    authenticated: concatEventReducers({
      'AUTH_SUCCESS': () => true,
      'AUTH_LOGOUT': () => false
    }, false),
    error: concatEventReducers({
      'AUTH_FAIL': (state, {data}) => data.message,
      'AUTH_SUCCESS': () => false
    }, false),
    identity: concatEventReducers({
      'AUTH_SUCCESS': (state, {data}) => data,
      'USER_UPDATE': (state, {data}) => ({...state, ...data}),
      'AUTH_LOGOUT': () => null
    }, null)
  }),
  notifications: concatReducers({
    counter: concatEventReducers({
      'RECEIVE_NOTIFICATION': state => state + 1,
      'AUTH_SUCCESS': (state, {data: {notifications}}) => notifications.length,
      'READ_NOTIFICATION': state => state - 1,
      'AUTH_LOGOUT': () => 0
    }, 0)
  })
})

const store = createStore(reducer)
store.listen(state => console.log('This will be triggered when something was changed in store', state))
//getState will return current state of store
console.log(store.getState())
//We dispatch event with type 'AUTH_SUCCESS' and some data. type field is required
store.dispatch({
  type: 'AUTH_SUCCESS',
  data: {
    id: 0,
    email: 'some',
    notifications: []
  }
})
```

This is not real-world example but as you can see, we make a lot of work with authentication and even with notifications.
So when something dispatch authentication event 'AUTH_SUCCESS' we anytime know what part of our store will change, and also
we understand how it should be.

In example code we use two helpers from point-one: `concatReducers` and `concatEventReducers`:

`concatReducers` - is useful to make independent reducers for each field inside object So your reducers will be more readable

`concatEventReducers` - is useful to make more readable reducers for field to see event => action without a lot of code inside switch-cases

### Thunk
point-one store have built-in thunk functionality but if you use any of extenders please attach thunk dispatcher to not write strange checks for event as a function that repeats thunk.

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

## Built-in utils

### listen

listen is an decorator for React Components that will provide some data from store to your Component state like connect from react-redux

```js
import React, {Component} from 'react'
import {authenticate} from './actions'
import {listen, compose, bindActions} from 'point-one'

class LoginForm extends Component {

  onLogin(e) {
    e.preventDefault()
    this.actions.authenticate({
      login: this.refs.login.value,
      password: this.refs.password.value
    })
  }

  render() {
    if (this.state.authenticated) {
      return (
        <div>
          You are already authenticated
        </div>
      )
    }
    return (
      <form className="login-form" onSubmit={e => this.onLogin(e)}>
        <div className="form-error" hidden={!!this.state.error}>
          {this.state.error}
        </div>
        ...fields
      </form>
    )
  }
}

export default compose(
  listen(state => state.auth),
  bindActions({authenticate})
)(LoginForm)
```

This is really simple component but as you can see you don't need to write code for sync state between store and component

Syntax:

```js
listen(Store, stateGetter:?Function = state => state)
//or it can get store form context if you provide store field
listen(stateGetter:?Function = state => state)
```
