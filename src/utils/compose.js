/**@flow*/

export function compose(...funcs: Array<Function>): Function {
  return arg => funcs.reduceRight((composed, f) => f(composed), arg)
}
