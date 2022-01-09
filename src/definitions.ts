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

type RenderResult = HTMLElement | DocumentFragment

type AnyProps = { [key: string]: any }

type Template<Props extends AnyProps> = (props: Props, element: HTMLElement) => RenderResult

type StickElement<Props extends AnyProps> = Template<Props> & { [stickKey]: StickMeta }

const Fragment = Symbol('Fragment')

type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickElement<AnyProps>

type Renderer = (tag: Renderable, props: AnyProps) => RenderResult

export {
  type Displayed,
  type Nothing,
  type Maybe,
  type StickOptions,
  type StickMeta,
  type RenderResult,
  type AnyProps,
  type Template,
  type StickElement,
  type Renderable,
  type Renderer,
  Fragment,
  stickKey
}
