import { Displayed } from './definitions';
export declare const createElement: (tagName: string) => HTMLElement;
export declare const createTextNode: (text: string) => Text;
export declare const createComment: (comment?: string) => Comment;
export declare const createFragment: () => DocumentFragment;
export declare const createContainer: () => HTMLElement;
export declare const on: (target: EventTarget, eventType: string, handler: (e: Event) => boolean | undefined | void, options?: EventListenerOptions | undefined) => () => void;
export declare const setAttr: (target: Element, key: string, value: Displayed) => void;
export declare const appendChild: (target: Node, child: Node) => Node;
