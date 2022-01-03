import { tuple } from './util'

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

interface StickBuilder {
    tagName: string;
    reflect: Record<string, boolean>
}

type RenderResult = [
  rootElement: Maybe<Element | DocumentFragment>,
  mount: Maybe<() => () => void>
]

const [renderResult, isRenderResult] = tuple<RenderResult>()

type AnyProps = { [key: string]: any }

type Template<Props extends AnyProps> = (props: Props) => RenderResult

type StickElement<Props extends AnyProps> = Template<Props> & { [stickKey]: StickBuilder }

const Fragment = Symbol('Fragment')

type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickElement<AnyProps>

type Renderer = (tag: Renderable, props: AnyProps) => RenderResult

export {
  type Displayed,
  type Nothing,
  type Maybe,
  type StickOptions,
  type StickBuilder,
  type RenderResult,
  type AnyProps,
  type Template,
  type StickElement,
  type Renderable,
  type Renderer,
  Fragment,
  stickKey,
  renderResult,
  isRenderResult
}
