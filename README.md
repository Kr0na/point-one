# Krux - Just another Flux Implementation for work with pleasure

## Actions
Actions must extends from ActionProvider class and send it's name to constructor

```js
import {ActionProvider} from 'krux'
import constants from 'path/to/constants'

export defaul new class MyAction extends ActionProvider {

    init() {
        this.repeatEvery(this.systemAction, 5000)
    }

    /**
     * Just for example:
     * System action to refresh auth details, and clear stores.
     * Additionaly if user is not logged, we stop it temporary,
     *   and enable it when he's login
     */
    systemAction(management) {
        this
            .emit(constants.CHECK_AUTH)
            .emit(constants.DUMP_CACHE)
            //Because this is just a promise with additional metods. You can also use then
            .catch(err => {
                management.unregister()
                this.listenTo(constants.AUTH, management.register)
            })
    }

    create(data) {
        this
            .emit(constants.MY_CREATE, data)
            //Executes after successful execution of above event
            .emit(constants.MY_ADD)
            //Executes only if promise from emit is fails
            .fail(constrants.MY_CREATE_FAIL)
    }

    remove(id) {
        this.emit(constants.MY_REMOVE, id)
    }

    edit(data) {
        this.emit(constants.MY_EDIT, data)
    }

}('MyAction')
```

## Stores
Stores must extends from AbstractStore class and send it's name to constructor

```js
import {AbstractStore} from 'krux'
import constants from 'path/to/constants'

export defaul new class MyStore extends AbstractStore {

    init() {
        this.listenTo(constants.MY_ADD, this.add)
        this.listenTo(constants.MY_REMOVE, this.remove)
        this.listenTo(constants.MY_EDIT, this.edit)
    }

    edit(data) {
        this.save(data)
    }

}('MyStore')
```

This is very simple example of Store

Stores also supports relations between Stores, so you can simple notify about changes
when some related Store is updated

```js
class FooStore extends AbstractStore {

    init() {
        //Second argument is a field inside model
        this.setRelationOne('BarStore', 'barField')
        //Second argument is a field from BarStore models
        this.setRelationMany('BarStore', 'quz', 'fooId')
    }
    //...
}

```
In this example if you subscribed to FooStore changes you receive update when BarStore
is updated. Additionally after call setRelation you receive method in store, that helps
to get related info
```js
var foo = FooStore.get(1)
var bar = FooStore.getBarField(foo)
var quzes = FooStore.getQuzField(foo)
```


## Todo

1. implement storages
2. implement stores
3. implement server-side isomorphic render
4. make unit tests
5. make examples