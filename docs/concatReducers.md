# concatReducers

concatReducers is used for compose reducers for fields inside some object. So
for example you have some obejct with structure:

```js
{
  title: 'Some Page',
  identity: {
    id: 0,
    login: 'Some'
  },
  users: [{id: 0, ...}],
  some: {},
  foo: {}
}
```

Typically you can make something like:
```js
function reducer(event, state) {
  switch(event.type) {
    case 'CHANGE_TITLE':
      return {
        ...state,
        title: event.title
      }
    case 'LOGIN':
      return {
        ...state,
        identity: event.data
      }
    case 'SOME':
      return {
        ...state,
        some: event.data
      }
    //....
  }
}
```

But can you imagine something like this in real project? Imagine some event that can change some inner object. Looks not good?

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
