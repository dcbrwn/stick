import { stickKey, StickOptions, Template, StickElement, AnyProps } from './definitions'
import { appendChild } from './dom'

export function element<Props extends AnyProps> (
  tagName: string,
  template: Template<Props>,
  options: StickOptions = {}
): StickElement<Props> {
  const meta = {
    tagName,
    reflect: options.reflect || {}
  }

  customElements.define(tagName, class extends HTMLElement {
    public [stickKey] = meta
    public props!: Props
    public attach: (() => () => void) | boolean = false
    public detach: (() => void) | undefined

    public connectedCallback () {
      if (!this.attach) {
        const [content, attach] = template(this.props)
        this.attach = attach || true
        if (content) appendChild(this, content)
      }

      if (typeof this.attach === 'function') this.detach = this.attach()
    }

    public disconnectedCallback () {
      if (this.detach) {
        this.detach()
        this.detach = undefined
      }
    }
  })

  return Object.assign(template, { [stickKey]: meta })
}

export * as o from './o'

export * from './eventSource'
