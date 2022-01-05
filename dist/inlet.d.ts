import { O, Observer } from './o';
import { Maybe } from './definitions';
declare type Inlet<T> = O<T> & {
    observer$: O<Maybe<Observer<T>>>;
};
declare const isInlet: (obj: unknown) => obj is Inlet<unknown>;
declare const inlet: <T>() => Inlet<T>;
declare const intoInlet: <T>(input: O<T>, inlet: Inlet<T>) => void;
export { type Inlet, isInlet, inlet, intoInlet };
