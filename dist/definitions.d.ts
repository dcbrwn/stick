export declare type Displayed = string | {
    toString(): string;
};
export declare const stickKey: unique symbol;
export declare type Nothing = null | undefined | void;
export declare type Maybe<T> = T | Nothing;
export declare type StickOptions = {
    tagName?: string;
    reflect?: Record<string, boolean>;
};
export interface StickBuilder {
    tagName: string;
    reflect: Record<string, boolean>;
}
export declare type RenderResult = [
    rootElement: Maybe<Element | DocumentFragment>,
    mount: Maybe<() => () => void>
];
export declare const renderResult: <T extends RenderResult>(...items: T) => T, isRenderResult: (obj: unknown) => obj is RenderResult;
export declare type AnyProps = {
    [key: string]: any;
};
export declare type Template<Props extends AnyProps> = (props: Props) => RenderResult;
export declare type StickElement<Props extends AnyProps> = Template<Props> & {
    [stickKey]: StickBuilder;
};
export declare const Fragment: unique symbol;
export declare type Renderable = typeof Fragment | (keyof HTMLElementTagNameMap) | StickElement<AnyProps>;
export declare type Renderer = (tag: Renderable, props: AnyProps) => RenderResult;
