/**@flow */
import type {
  Store
} from '../../flow/types'
import {makeFieldsGetter} from './makeFieldsGetter'

function makeWrapper(providedStore: ?Store = null, stateGetter: Function): ReactClass<*> {
  const name = 'store' + parseInt("" + Math.random() * 1000)
  return (Component: ReactClass<*>) => class WrappedComponent extends Component {

    static displayName = `Listen(${Component.displayName || Component.name || Component.prototype.constructor.name})`

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
      if (!this.state) {
        this.state = {}
      }
      this[name] = providedStore || context.store
      const _storeState = stateGetter(this[name].getState())
      this.state = {
        ...this.state,
        ..._storeState,
        [name]:_storeState
      }
      if (!this._listeners) {
        this._listeners = []
      }
    }

    componentDidMount() {
      super.componentDidMount && super.componentDidMount()
      this._listeners.push(this[name].listen(state => {
        state = stateGetter(state)
        if (
          this.state[name] !== state
        ) {
          //Optimization to prevent Component rerender when using makeFieldsGetter
          const hasChanges = Object.keys(state).length != Object.keys(this.state[name]).length
            || Object.keys(state).reduce((result, key) => result || !Object.is(state[key], this.state[name][key]), false)
          hasChanges && this.setState({
            ...state,
            [name]: state
          })
        }
      }))
    }

    componentWillUnmount() {
      super.componentWillUnmount && super.componentWillUnmount()
      this._listeners.forEach(listener => listener())
      this._listeners = []
      delete this[name]
    }
  }
}

export function listen(store: ?Store|Function, stateGetter: ?Function = (state => state), deprecatedArg: ?Function): ReactClass<*> {
  if (Array.isArray(stateGetter)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('fields argument is deprecated and will be removed in next versions. Please change your code to use makeFieldsGetter() if you want')
    }
    const fields = [...stateGetter]
    stateGetter = state => {
      state = deprecatedArg && deprecatedArg(state) || state
      return makeFieldsGetter(fields)(state)
    }
  }
  if (store instanceof Function || !store) {
    return makeWrapper(null, store || (state => state))
  } else {
    return makeWrapper(store, stateGetter || (state => state))
  }
}
