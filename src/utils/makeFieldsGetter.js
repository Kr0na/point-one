/**@flow*/

export function makeFieldsGetter(fields: Array<string>):Function {
  return (state = {}) => fields.reduce((target, field) => ({
    ...target,
    [field]: state[field]
  }), {})
}
