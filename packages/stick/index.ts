import { stickKey, StickBuilder as StickMeta, StickOptions, RenderResult, Template, StickElement, AnyProps } from './definitions'
import { appendChild } from './dom'

export function element<Props extends AnyProps> (
  tagName: string,
  template: Template<Props>,
  options: StickOptions = {}
): StickElement<Props> {
  const element = template as ((props: Props) => RenderResult) & { [stickKey]: StickMeta }

  const elClass = class extends HTMLElement {
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
  }

  customElements.define(tagName, elClass)

  element[stickKey] = {
    tagName,
    reflect: options.reflect || {}
  }

  return element
}
