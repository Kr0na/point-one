/**@flow*/
let variableRegex:RegExp = /(\[?[\w\-\/]*\$\{([\w]+)\}\]?)/g

export class Resource {
  variables:Object;
  url:string;

  constructor(url:string) {
    this.url = url
  }

  parse() {

  }
}

export function createResource(url:string, options:?Object = {}):Resource {
  return new Resource(url)
}
