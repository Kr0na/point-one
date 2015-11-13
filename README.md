# Krux - Is a simple but powerful Flux replacements
[![Build Status](https://travis-ci.org/Kr0na/krux.svg)](https://travis-ci.org/Kr0na/krux)
## Actions
Action is any function that can return event or promise

```js
import {createPromiseAction} from 'krux'
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
import {createStore} from 'krux'
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
