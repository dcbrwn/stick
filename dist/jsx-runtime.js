import { onMount, observe } from './context';
import { stickKey, Fragment } from './definitions';
import { createElement, on, setAttr, createTextNode, createFragment, appendChild } from './dom';
import { intoInlet, isInlet } from './inlet';
import { isObservable, broadcast, isBroadcast, fromEvent } from './o';
import { camelToKebab, toString } from './util';
const eventHandlerKey = /^on[A-Z]/;
const bindEventHandler = (element, key, handler) => {
    const eventType = camelToKebab(key.slice(2));
    if (isInlet(handler)) {
        intoInlet(fromEvent(element, eventType), handler);
    }
    else {
        onMount(() => on(element, eventType, handler));
    }
};
const bindProp = (element, key, value, meta) => {
    const needsReflect = !meta || key in meta.reflect;
    if (needsReflect) {
        if (isObservable(value)) {
            observe(value, (nextValue) => setAttr(element, key, nextValue));
        }
        else {
            setAttr(element, key, value);
        }
    }
    if (meta) {
        let propValue = value;
        if (isObservable(propValue) && !isInlet(value)) {
            propValue = isBroadcast(value) ? value : broadcast(value);
        }
        // @ts-expect-error
        if (!element.props)
            element.props = {};
        // @ts-expect-error
        // We don't know what element we actually dealing with here
        // All the typechecking will happen in the template
        element.props[key] = propValue;
    }
};
const createElementFromTag = (tag) => {
    if (tag === Fragment)
        return createFragment();
    return createElement(typeof tag === 'string' ? tag : tag[stickKey].tagName);
};
const jsx = (tag, props) => {
    const element = createElementFromTag(tag);
    const { children, ...properties } = props;
    for (const [key, value] of Object.entries(properties)) {
        if (key.startsWith('_'))
            continue;
        else if (eventHandlerKey.test(key)) {
            bindEventHandler(element, key, value);
        }
        else {
            bindProp(element, key, value, Reflect.get(element, stickKey));
        }
    }
    if (children) {
        const c = Array.isArray(children) ? children : [children];
        for (const child of c) {
            let childElement;
            if (child instanceof HTMLElement) {
                childElement = child;
            }
            else if (isObservable(child)) {
                const textNode = childElement = createTextNode('');
                observe(child, (value) => {
                    textNode.data = toString(value);
                });
            }
            else {
                childElement = createTextNode(toString(child));
            }
            if (childElement) {
                appendChild(element, childElement);
            }
        }
    }
    return element;
};
const jsxs = jsx;
export { jsx, jsxs, Fragment };
//# sourceMappingURL=jsx-runtime.js.map