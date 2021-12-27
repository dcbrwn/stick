import { Displayed } from './definitions';
declare type Tag<Constraint extends object> = [
    tag: <T extends Constraint>(obj: T) => T,
    isTagged: (obj: unknown) => obj is Constraint
];
export declare function createTag<Constraint extends object = object>(description?: string): Tag<Constraint>;
declare type Tuple<Constraint extends unknown[]> = [
    create: <T extends Constraint>(...items: T) => T,
    isInstance: (obj: unknown) => obj is Constraint
];
export declare function tuple<Constraint extends unknown[]>(description?: string): Tuple<Constraint>;
export declare function toString(value: Displayed): string;
export declare function camelToKebab(value: string): string;
export declare const noop: (...args: unknown[]) => void;
export declare const identity: <T>(input: T) => T;
export {};
