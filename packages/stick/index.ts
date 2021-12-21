import { stickKey, StickBuilder, StickOptions } from './definitions'

export function stick<T extends Function> (
  template: T,
  options: StickOptions = {}
): T & { [stickKey]: StickBuilder } {
  const startName = options.tagName || 'x-stick'
  let tagName = startName
  const counter = 0
  while (customElements.get(tagName)) {
    tagName = `${startName}-${counter}`
  }
  const element = template as (T & { [stickKey]: StickBuilder })

  const elClass = class extends HTMLElement {
    public connectedCallback () {
      if (options.reflect) {
        for (const key of Object.keys(options.reflect)) {
          // @ts-ignore
          this[key] = this.getAttribute(key)
        }
      }
      const renderer = template(this)
      const fragment = document.createDocumentFragment()
      renderer(fragment)
      this.appendChild(fragment)
    }
  }

  customElements.define(tagName, elClass)

  element[stickKey] = { tagName }

  return element
}
