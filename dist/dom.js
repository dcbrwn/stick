import { toString } from './util';
export const createElement = (tagName) => document.createElement(tagName);
export const createTextNode = (text) => document.createTextNode(text);
export const createComment = (comment = '') => document.createComment(comment);
export const createFragment = () => document.createDocumentFragment();
export const on = (target, eventType, handler, options) => {
    target.addEventListener(eventType, handler, options);
    return () => target.removeEventListener(eventType, handler, options);
};
export const setAttr = (target, key, value) => {
    if (typeof value === 'boolean') {
        target.toggleAttribute(key, value);
    }
    else {
        target.setAttribute(key, toString(value));
    }
};
export const appendChild = (target, child) => target.appendChild(child);
//# sourceMappingURL=dom.js.map