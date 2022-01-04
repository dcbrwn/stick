import { getMount, withRenderingContext } from './context'
import { stickKey, StickOptions, Template, StickElement, AnyProps, Maybe } from './definitions'
import { appendChild } from './dom'

const element = <Props extends AnyProps> (
  tagName: string,
  template: Template<Props>,
  options: StickOptions = {}
): StickElement<Props> => {
  const meta = {
    tagName,
    reflect: options.reflect || {}
  }

  customElements.define(tagName, class extends HTMLElement {
    public [stickKey] = meta
    public props!: Props
    public mount: Maybe<() => () => void>
    public unmount: Maybe<() => void>

    public connectedCallback () {
      if (!this.mount) {
        withRenderingContext(() => {
          const content = template(this.props, this)
          this.mount = getMount()
          if (content) appendChild(this, content)
        })
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

export {
  element
}
