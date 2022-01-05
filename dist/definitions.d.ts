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
interface StickBuilder {
    tagName: string;
    reflect: Record<string, boolean>;
}
declare type RenderResult = HTMLElement | DocumentFragment;
declare type AnyProps = {
    [key: string]: any;
};
declare type Template<Props extends AnyProps> = (props: Props, element: HTMLElement) => RenderResult;
declare type StickElement<Props extends AnyProps> = Template<Props> & {
    [stickKey]: StickBuilder;
};
declare const Fragment: unique symbol;
declare type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickElement<AnyProps>;
declare type Renderer = (tag: Renderable, props: AnyProps) => RenderResult;
export { type Displayed, type Nothing, type Maybe, type StickOptions, type StickBuilder, type RenderResult, type AnyProps, type Template, type StickElement, type Renderable, type Renderer, Fragment, stickKey };
