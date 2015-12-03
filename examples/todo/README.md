# Example of Point One usage with TODO application
## Execute
1. ```npm install```
2. ```webpack```
3. node server.js

## Structure
Reducers placed in ```src/reducers/todo.js``` - this file contains reducers for todo variable in store

Store placed in ```src/AppStore.js``` - you can see that It's composes createStore with localStorageCache for storing todos
in localStorage. Also you can see concatReducers method for build final reducer.

Actions placed in ```src/actions.js``` - it's just very simple functions.

The most interesting Component is ```src/components/TodoContainer.js``` you can see how easily variables from store can be
putted to Component using listen decorator. Also it's contains sample of how to use Actions and dispatch it.
