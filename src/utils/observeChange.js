/**@flow*/

/**
 * Method will call on{your state field name}Cahnge method if it's changed
 * For example:
 * ```js
 * @observeChange(['success'])
 * @listen(AuthStore, ['success', 'error'])
 * class Login extends Component {
 *   onSuccessChange(success) {
 *     success && this.context.router.transitionTo('some-page')
 *   }
 *
 *   render() {
 *      return (
 *        //...
 *      )
 *   }
 * }
 * ```
 */
export function observeChange(fields:Array<string>):Function {
  return Component => (
    class ObservableComponent extends Component {

      componentDidUpdate(prevProps:Object, prevState:Object) {
        super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState)
        fields.forEach(key => {
          if (!Object.is(this.state[key], prevState[key])) {
            const methodName = 'on' + key.replace(/^([\w])/, _ => _.toUpperCase()) + 'Change'
            if (this[methodName]) {
              this[methodName](this.state[key], prevState[key])
            }
          }
        })
      }
    }
  )
}
