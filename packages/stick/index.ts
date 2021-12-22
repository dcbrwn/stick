import { stickKey, StickBuilder as StickMeta, StickOptions } from './definitions'

export function element<T extends Function> (
  tagName: string,
  template: T,
  options: StickOptions = {}
): T & { [stickKey]: StickMeta } {
  const element = template as (T & { [stickKey]: StickMeta })

  const elClass = class extends HTMLElement {
    protected init: (() => () => void) | undefined

    protected deinit: (() => void) | undefined

    protected renderContent (): void {
      if (this.init) {
        return
      }

      const result = template(this)

      this.appendChild(result.rootElement)
      this.init = result.init
    }

    public connectedCallback () {
      this.renderContent()
      this.deinit = this.init!()
    }

    public disconnectedCallback () {
      if (this.deinit) {
        this.deinit()
        this.deinit = undefined
      }
    }
  }

  customElements.define(tagName, elClass)

  element[stickKey] = {
    tagName,
    reflect: options.reflect || {}
  }

  return element
}
