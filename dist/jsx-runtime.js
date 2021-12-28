import { stickKey, isRenderResult, renderResult, Fragment } from './definitions';
import { createElement, on, setAttr, createTextNode, createFragment } from './dom';
import { isEventSource } from './eventSource';
import { isObservable } from './o';
import { camelToKebab, toString } from './util';
const eventHandlerKey = /^on[A-Z]/;
const bindEventHandler = (element, key, handler) => {
    const eventType = camelToKebab(key.slice(2));
    return () => on(element, eventType, isEventSource(handler) ? handler.dispatchEvent : handler);
};
const bindProp = (element, key, value, meta) => {
    const needsReflect = !meta || key in meta.reflect;
    let mount;
    if (needsReflect) {
        if (isObservable(value)) {
            mount = () => value((nextValue) => setAttr(element, key, nextValue));
        }
        else {
            setAttr(element, key, value);
        }
    }
    if (meta) {
        // @ts-expect-error
        if (!element.props)
            element.props = {};
        // @ts-expect-error
        // We don't know what element we actually dealing with here
        // All the typechecking will happen in the template
        element.props[key] = value;
    }
    return mount;
};
const createRoot = (tag) => {
    if (tag === Fragment)
        return createFragment();
    return createElement(typeof tag === 'string' ? tag : tag[stickKey].tagName);
};
export const jsx = (tag, props) => {
    const element = createRoot(tag);
    const { children, ...properties } = props;
    const mountFns = [];
    for (const [key, value] of Object.entries(properties)) {
        if (key.startsWith('_'))
            continue;
        else if (eventHandlerKey.test(key)) {
            mountFns.push(bindEventHandler(element, key, value));
        }
        else {
            bindProp(element, key, value, Reflect.get(element, stickKey));
        }
    }
    if (children) {
        const c = Array.isArray(children) && !isRenderResult(children) ? children : [children];
        for (const child of c) {
            let childElement;
            if (isRenderResult(child)) {
                const [rootElement, mount] = child;
                childElement = rootElement;
                if (mount)
                    mountFns.push(mount);
            }
            else if (isObservable(child)) {
                const textNode = createTextNode('');
                mountFns.push(() => child((value) => {
                    textNode.data = toString(value);
                }));
                childElement = textNode;
            }
            else {
                childElement = createTextNode(toString(child));
            }
            if (childElement) {
                element.append(childElement);
            }
        }
    }
    return renderResult(element, () => {
        const unmountFns = mountFns.map((init) => init());
        return () => unmountFns.forEach((unmount) => unmount());
    });
};
export const jsxs = jsx;
export { Fragment };
//# sourceMappingURL=jsx-runtime.js.map