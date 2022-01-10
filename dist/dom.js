import { toString } from './util';
const createElement = (tagName) => document.createElement(tagName);
const createTextNode = (text) => document.createTextNode(text);
const createComment = (comment = '') => document.createComment(comment);
const createFragment = () => document.createDocumentFragment();
const CONTAINER_TAG = 's-container';
const createContainer = () => createElement(CONTAINER_TAG);
const on = (target, eventType, handler, options) => {
    target.addEventListener(eventType, handler, options);
    return () => target.removeEventListener(eventType, handler, options);
};
const setAttr = (target, key, value) => {
    if (typeof value === 'boolean') {
        target.toggleAttribute(key, value);
    }
    else {
        target.setAttribute(key, toString(value));
    }
};
const appendChild = (target, child) => target.appendChild(child);
const ensureElement = (element) => {
    let result;
    if (element instanceof DocumentFragment) {
        result = createContainer();
        result.appendChild(element);
    }
    else if (element instanceof HTMLElement) {
        result = element;
    }
    else {
        result = createContainer();
    }
    return result;
};
if (typeof window !== 'undefined') {
    customElements.define(CONTAINER_TAG, class extends HTMLElement {
    });
}
export { createElement, createTextNode, createComment, createFragment, createContainer, on, setAttr, appendChild, ensureElement };
//# sourceMappingURL=dom.js.map