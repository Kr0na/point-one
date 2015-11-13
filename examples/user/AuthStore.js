import {createStore} from '../../index'
import {userReducer} from 'reducers'

var AuthStore = createStore(userReducer)
export let {dispatch, getState, listen} = AuthStore

export function hasIdentity() {
    return !!AuthStore.getState().user
}