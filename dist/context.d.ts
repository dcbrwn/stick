import { O, Observer } from './o';
import { Maybe, RenderResult } from './definitions';
declare type RenderingContext = {
    mountFns: (() => Maybe<VoidFunction>)[];
    mount: (this: RenderingContext) => () => void;
};
declare const withRenderingContext: (fn: VoidFunction) => RenderingContext;
declare const render: <T extends RenderResult>(template: () => T) => [T, RenderingContext];
declare const onMount: (fn: () => Maybe<VoidFunction>) => void;
declare const observe: <T>(observable: O<T>, observer?: Observer<T>) => void;
declare const getMount: () => () => () => void;
export { type RenderingContext, withRenderingContext, render, onMount, observe, getMount };
