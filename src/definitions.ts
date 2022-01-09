type Displayed = string | {
  toString(): string;
}

const stickKey = Symbol('Stick')

type Nothing = null | undefined | void

type Maybe<T> = T | Nothing

type StickOptions = {
    tagName?: string
    reflect?: Record<string, boolean>
}

type StickMeta = {
    tagName: string;
    reflect: Record<string, boolean>
}

interface StickElement<T = object> extends HTMLElement {
  [stickKey]: StickMeta
  props: T
  connectedCallback(): void
  disconnectedCallback(): void
}

type RenderResult = HTMLElement | DocumentFragment

type AnyProps = { [key: string]: any }

type Template<Props extends AnyProps> = (props: Props, element: HTMLElement) => RenderResult

type StickTemplate<Props extends AnyProps> = Template<Props> & { [stickKey]: StickMeta }

const Fragment = Symbol('Fragment')

type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickTemplate<AnyProps>

type Renderer = (tag: Renderable, props: AnyProps) => RenderResult

export {
  type Displayed,
  type Nothing,
  type Maybe,
  type StickOptions,
  type StickMeta,
  type StickElement,
  type RenderResult,
  type AnyProps,
  type Template,
  type StickTemplate,
  type Renderable,
  type Renderer,
  Fragment,
  stickKey
}
