import { stickKey, StickBuilder as StickMeta, StickOptions } from './definitions'

export function element<T extends Function> (
  tagName: string,
  template: T,
  options: StickOptions = {}
): T & { [stickKey]: StickMeta } {
  const element = template as (T & { [stickKey]: StickMeta })

  const elClass = class extends HTMLElement {
    protected attach: (() => () => void) | undefined

    protected detach: (() => void) | undefined

    protected renderContent (): void {
      if (this.attach) {
        return
      }

      const result = template(this)

      this.appendChild(result.rootElement)
      this.attach = result.attach
    }

    public connectedCallback () {
      this.renderContent()
      this.detach = this.attach!()
    }

    public disconnectedCallback () {
      if (this.detach) {
        this.detach()
        this.detach = undefined
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
