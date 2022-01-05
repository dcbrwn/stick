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
if (typeof window !== 'undefined') {
    customElements.define(CONTAINER_TAG, class extends HTMLElement {
    });
}
export { createElement, createTextNode, createComment, createFragment, createContainer, on, setAttr, appendChild };
//# sourceMappingURL=dom.js.map