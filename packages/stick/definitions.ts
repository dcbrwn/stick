import { tuple } from './util'

export type Displayed = string | {
  toString(): string;
}

export const stickKey = Symbol('Stick')

export type StickOptions = {
    tagName?: string
    reflect?: Record<string, boolean>
}

export interface StickBuilder {
    tagName: string;
    reflect: Record<string, boolean>
}

export type RenderResult = [
  rootElement: Node | null,
  attach: (() => () => void) | null
]

export const [renderResult, isRenderResult] = tuple<RenderResult>()

export type AnyProps = { [key: string]: any }

export type Template<Props extends AnyProps> = (props: Props) => RenderResult

export type StickElement<Props extends AnyProps> = Template<Props> & { [stickKey]: StickBuilder }

export const Fragment = Symbol('Fragment')

export type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickElement<AnyProps>

export type Renderer = (tag: Renderable, props: AnyProps) => RenderResult
