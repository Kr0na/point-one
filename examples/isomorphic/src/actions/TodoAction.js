import {ActionProvider} from '../../../../index'
import * as Constants from './constants'

export default new class TodoAction extends ActionProvider {

    create(data) {
        this.emit(Constants.TODO_CREATE, data)
    }

    update(data) {
        this.emit(Constants.TODO_UPDATE, data)
    }

    delete(data) {
        this.emit(Constants.TODO_DELETE, data)
    }

}('TodoAction')