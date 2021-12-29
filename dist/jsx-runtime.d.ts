import { Renderer, Displayed, Fragment } from './definitions';
import { EventSource } from './eventSource';
import { O } from './o';
declare type AttrValue<T> = T | O<T>;
declare type EventHandler<E extends Event> = ((event: E) => boolean | undefined | void) | EventSource<E>;
export declare namespace JSX {
    interface ElementProps {
        children?: (string | O<any> | Renderer)[];
    }
    interface HTMLAttributes extends ElementProps {
        class?: AttrValue<Displayed>;
        title?: AttrValue<Displayed>;
        style?: AttrValue<Displayed>;
        onClick?: EventHandler<MouseEvent>;
    }
    export interface IntrinsicElements {
        [tagName: string]: HTMLAttributes;
    }
    export {};
}
export declare const jsx: Renderer;
export declare const jsxs: Renderer;
export { Fragment };
