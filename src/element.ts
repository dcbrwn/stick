import { getMount, withRenderingContext } from './context'
import { stickKey, StickOptions, Maybe, RenderResult, Template, AnyProps, StickMeta } from './definitions'
import { appendChild } from './dom'

type PropsOf<T> = T extends (props: infer Props, element: HTMLElement) => RenderResult
  ? Props
  : never

abstract class BaseElementClass<T extends AnyProps> extends HTMLElement {
  protected abstract template: Template<T>
  public abstract [stickKey]: StickMeta

  public props!: T
  public mount: Maybe<() => () => void>
  public unmount: Maybe<() => void>

  public connectedCallback () {
    if (!this.mount) {
      withRenderingContext(() => {
        const content = this.template(this.props, this)
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
}

const element = <T extends (props: any, element: HTMLElement) => RenderResult> (
  tagName: string,
  template: T,
  options: StickOptions = {}
): T => {
  const meta = {
    tagName,
    reflect: options.reflect || {}
  }

  class CustomElement extends BaseElementClass<PropsOf<T>> {
    protected template = template
    public [stickKey] = meta
  }

  customElements.define(tagName, CustomElement)

  return Object.assign(template, { [stickKey]: meta })
}

export {
  element
}
