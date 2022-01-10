declare type Displayed = string | {
    toString(): string;
};
declare const stickKey: unique symbol;
declare type Nothing = null | undefined | void;
declare type Maybe<T> = T | Nothing;
declare type StickOptions = {
    tagName?: string;
    reflect?: Record<string, boolean>;
};
declare type StickMeta = {
    tagName: string;
    reflect: Record<string, boolean>;
};
interface StickElement<T = object> extends HTMLElement {
    [stickKey]: StickMeta;
    props: T;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare type RenderResult = HTMLElement | DocumentFragment;
declare type AnyProps = {
    [key: string]: any;
};
declare type Template<Props extends AnyProps> = (props: Props, element: HTMLElement) => RenderResult;
declare type StickTemplate<Props extends AnyProps> = Template<Props> & {
    [stickKey]: StickMeta;
};
declare const Fragment: unique symbol;
declare type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickTemplate<AnyProps>;
declare type Renderer = (tag: Renderable, props: AnyProps) => RenderResult;
export { type Displayed, type Nothing, type Maybe, type StickOptions, type StickMeta, type StickElement, type RenderResult, type AnyProps, type Template, type StickTemplate, type Renderable, type Renderer, Fragment, stickKey };
