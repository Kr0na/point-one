# concatEventReducers

concatEventReducers is used for compose reducers for some field by event

Typically you can make something like this for field event:
```js
function reducer(event, state) {
  switch(event.type) {
    case 'LOGIN':
      return event.data
    case 'LOGOUT':
      return null
    case 'UPDATE_PROFILE':
      return {
        ...state,
        ...event.data
      }
    case 'FOO':
      //...
    default:
      return state
  }
}
```
This is simple reducer, but when you can some logic for each event type in result you have more than 200 lines of code for single reducer


concatReducers add ability to work with each field independent. With own events

```js
const title = concatEventReducers({
  'CHANGE_TITLE': ({title}) => title
})
const identity = concatEventReducers({
  'LOGIN': ({data}) => data,
  'LOGOUT': () => null
})
const reducer = concatReducers(
  title,
  identity
)
```

Looks much better? I think so.
