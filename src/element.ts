import { getMount, withRenderingContext } from './context'
import { stickKey, StickOptions, Maybe, RenderResult } from './definitions'
import { appendChild } from './dom'

type PropsOf<T> = T extends (props: infer Props, element: HTMLElement) => RenderResult
  ? Props
  : never

const element = <T extends (props: any, element: HTMLElement) => RenderResult> (
  tagName: string,
  template: T,
  options: StickOptions = {}
): T => {
  const meta = {
    tagName,
    reflect: options.reflect || {}
  }

  customElements.define(tagName, class extends HTMLElement {
    public [stickKey] = meta
    public props!: PropsOf<T>
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
