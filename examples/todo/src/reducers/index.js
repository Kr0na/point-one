import {select, events, event, init, project, append, update, remove, set} from 'point-reducer-builder'
import {TODO_CREATE, TODO_DONE, TODO_REOPEN, TODO_DELETE, TODO_UPDATE} from '../constants'

export default events(
  init([]),
  event(
    TODO_CREATE,
    project(
      ({value}) => ({value, id: parseInt("" +Math.random() * 1000)}),
      append()
    )
  ),
  event(TODO_UPDATE, select('id', project(({value}) => ({value}), update()))),
  event(TODO_DONE, select('id', set('status', 'done'))),
  event(TODO_REOPEN, select('id', set('status', 'reopen'))),
  event(TODO_DELETE, remove('id'))
)
