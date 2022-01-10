import { Displayed } from './definitions';
declare type Tag<Constraint extends object> = [
    tag: <T extends Constraint>(obj: T) => T,
    isTagged: (obj: unknown) => obj is Constraint
];
declare const createTag: <Constraint extends object = object>(description?: string | undefined) => Tag<Constraint>;
declare const toString: (value: Displayed) => string;
declare const camelToKebab: (value: string) => string;
declare const noop: (...args: unknown[]) => void;
declare const identity: <T>(input: T) => T;
export { createTag, toString, camelToKebab, noop, identity };
