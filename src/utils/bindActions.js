/**@flow*/
import type {ThunkAction} from '../../flow/types'

export function bindActions(actions: {[key: string]: ThunkAction}): ReactClass {
  return (Component: ReactClass) => class ActionComponent extends Component {
    static contextTypes = {
      ...(Component.contextTypes || {}),
      store: ({store}) => {
        if (
          store
          && typeof store.getState == 'function'
          && typeof store.dispatch == 'function'
        ) {
          return null
        }
        if (providedStore) return
        throw new Error('Store must be in context please use Provider or make ChildContext')
      }
    };

    constructor(props, context, updater) {
      super(props, context, updater)
      const dispatch = context.store.dispatch
      this.actions = Object.keys(actions).reduce((result: Object, key: string) => {
        return {
          ...result,
          [key]: (...opts) => dispatch(actions[key](...opts))
        }
      }, {})
    }
  }
}
