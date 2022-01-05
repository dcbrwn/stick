import { O, Observer } from './o';
import { Maybe } from './definitions';
declare type RenderingContext = {
    mountFns: (() => Maybe<VoidFunction>)[];
};
declare const withRenderingContext: (fn: VoidFunction) => RenderingContext;
declare const onMount: (fn: () => Maybe<VoidFunction>) => void;
declare const observe: <T>(observable: O<T>, observer?: Observer<T>) => void;
declare const getMount: () => () => () => void;
export { type RenderingContext, withRenderingContext, onMount, observe, getMount };
