/**@flow */

export function listen(store:{listen:Function, getState:Function}, fields:Array<string>):Function {
  return (Component) => {
    return class WrappedComponent extends Component {
      constructor(...options) {
        super(...options)
        if (!this.state) {
          this.state = {}
        }
        this.state = fields.reduce((state:Object, key:string) => {
          state[key] = store.getState()[key]
        }, this.state)
        if (!this._listeners) {
          this._listeners = []
        }
      }

      componentDidMount() {
        super.componentDidMount()
        this.listeners.push(store.listen(state => {
          let
            newState = {},
            hasChanges = false
          fields.forEach(key => {
            if (this.state[key] !== state[key]) {
              newState[key] = state[key]
              hasChanges = true
            }
          })
          hasChanges && this.setState(newState)
        }))
      }

      componentWillUnmout() {
        super.componentWillUnmout()
        this._listeners.forEach(listener => listener())
      }
    }
  }
}
