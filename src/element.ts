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
    public mount: (() => () => void) | boolean = false
    public unmount: (() => void) | undefined

    public connectedCallback () {
      if (!this.mount) {
        const [content, mount] = template(this.props)
        this.mount = mount || true
        if (content) appendChild(this, content)
      }

      if (typeof this.mount === 'function') this.unmount = this.mount()
    }

    public disconnectedCallback () {
      if (this.unmount) {
        this.unmount()
        this.unmount = undefined
      }
    }
  })

  return Object.assign(template, { [stickKey]: meta })
}