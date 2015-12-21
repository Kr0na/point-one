# Point One - Is a powerful implementation of Flux/Redux to start your application with easy
[![Build Status](https://travis-ci.org/Kr0na/point-one.svg?branch=master)](https://travis-ci.org/Kr0na/point-one)
[![codecov.io](https://codecov.io/github/Kr0na/point-one/coverage.svg?branch=master)](https://codecov.io/github/Kr0na/point-one?branch=master)

## Actions
Actions is a simple function that produce some event that can be used for dispatching. Event must be a plain object and contains type variable.

For example:
```js
import {TODO_CREATE} from 'path/to/constants'

export function createTodo(value) {
  return {
    type: TODO_CREATE,
    value
  }
}
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
