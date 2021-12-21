export const stickKey = Symbol('Stick')

export type StickOptions = {
    tagName?: string
    reflect?: Record<string, unknown>
}

export interface StickBuilder {
    tagName: string;
}

export type StickElement = Function & { [stickKey]: StickBuilder }

export type Renderable = (keyof HTMLElementTagNameMap) | StickElement;

export type Renderer = (parent: Element) => void;
