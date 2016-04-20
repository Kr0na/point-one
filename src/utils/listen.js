/**@flow */

function makeWrapper(providedStore:?{listen:Function, dispatch: Function, getState: Function} = null, stateGetter:Function): Function {
  return Component => class WrappedComponent extends Component {
    static contextTypes = {
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
      this.store = providedStore || context.store
      const _storeState = stateGetter(this.store.getState())
      this.state = {
        ...this.state,
        ..._storeState,
        _storeState
      }
      if (!this._listeners) {
        this._listeners = []
      }
    }

    componentDidMount() {
      super.componentDidMount && super.componentDidMount()
      this._listeners.push(this.store.listen(state => {
        state = stateGetter(state)
        if (this.state._storeState !== state) {
          this.setState(state)
        }
      }))
    }

    componentWillUnmount() {
      super.componentWillUnmout && super.componentWillUnmout()
      this._listeners.forEach(listener => listener())
      this._listeners = []
    }
  }
}

export function listen(store:{listen:Function, dispatch:Function, getState:Function}|Function, stateGetter:Function = (state => state), deprecatedArg:?Function):Function {
  if (Array.isArray(stateGetter)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('fields argument is deprecated and will be removed in next versions. Please change your code to use stateGetter')
    }
    const fields = [...stateGetter]
    stateGetter = state => {
      state = deprecatedArg && deprecatedArg(state) || state
      return fields.reduce((target, key) => ({
        ...target,
        [key]: state[key]
      }), {})
    }
  }
  if (store instanceof Function) {
    return makeWrapper(null, stateGetter)
  } else {
    return makeWrapper(store, stateGetter)
  }
}
