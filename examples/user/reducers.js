import {USER_AUTH, USER_LOGOUT, USER_AUTH_FAIL} from './constants'
import {concatReducers} from '../../index'

function user(state, event) {
    switch (event.type) {
        case USER_AUTH:
            return event.user
        case USER_LOGOUT:
            return undefined
        default:
            return state
    }
}

function errors(state, event) {
    switch (event.type) {
        case USER_AUTH:
            return undefined
        case USER_AUTH_FAIL:
            return event.errors
        default:
            return state
    }
}

export let userReducer = concatReducers({user, errors})
