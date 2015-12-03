# Point One - Is a powerful implementation of Flux/Redux to start your application with easy
[![Build Status](https://travis-ci.org/Kr0na/point-one.svg?branch=master)](https://travis-ci.org/Kr0na/point-one)
[![codecov.io](https://codecov.io/github/Kr0na/point-one/coverage.svg?branch=master)](https://codecov.io/github/Kr0na/point-one?branch=master)
## Actions
Action is any function that can return event or promise

```js
import {createPromiseAction} from 'point-one'
import Resource from 'path/to/resource'
import {TODO_CREATE, TODO_LOAD} from 'path/to/constants'

export function loadTodo(id) {
  return {
    type: TODO_LOAD,
    id
  }
}

export let createTodo = createPromiseAction(Resource.create, TODO_CREATE)
```

## Stores
Store is a container that can contain any data that needed for render

```js
import {createStore} from 'point-one'
import todoReducer from 'path/to/reducer'

let todoStore = createStore(todoReducer)
export default todoStore
```

## Todo

1. implement resources
2. implement more reducer helpers
3. add tests for EventManager
4. make docs
5. make examples
