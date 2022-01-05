import { Renderer, Displayed, Fragment } from './definitions';
import { Inlet } from './inlet';
import { O } from './o';
declare type AttrValue<T> = T | O<T>;
declare type EventHandler<E extends Event> = ((event: E) => void) | Inlet<E>;
declare namespace JSX {
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
declare const jsx: Renderer;
declare const jsxs: Renderer;
export { type JSX, jsx, jsxs, Fragment };
