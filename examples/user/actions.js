import {USER_AUTH, USER_LOGOUT} from './constants'
import {createPromiseAction} from '../../index'
import UserResource from 'UserResource'

export var auth = createPromiseAction(UserResource.create, USER_AUTH)
export var logout = createPromiseAction(UserResource.delete, USER_LOGOUT)