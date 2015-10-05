import {AbstractStore} from '../../../../index'
import * as Constants from '../actions/constants'

export default new class TodoStore extends AbstractStore {

    init() {
        this.listenTo(Constants.TODO_CREATE, this.save)
        this.listenTo(Constants.TODO_UPDATE, this.save)
        this.listenTo(Constants.TODO_DELETE, this.delete)
    }

}('TodoStore')