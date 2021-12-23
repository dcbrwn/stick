export const stickKey = Symbol('Stick')

export type StickOptions = {
    tagName?: string
    reflect?: Record<string, boolean>
}

export interface StickBuilder {
    tagName: string;
    reflect: Record<string, boolean>
}

export type StickElement = Function & { [stickKey]: StickBuilder }

export type Renderable = (keyof HTMLElementTagNameMap) | StickElement;

export class RenderResult {
  public readonly rootElement: Node | null
  public readonly attach: (() => () => void) | null

  constructor (
    rootElement: Node | null,
    init: (() => () => void) | null
  ) {
    this.rootElement = rootElement
    this.attach = init
  }
}

export type Renderer = (tag: Renderable, props: Record<string, any>) => RenderResult
