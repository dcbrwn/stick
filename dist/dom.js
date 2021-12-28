import { toString } from './util';
export const createElement = (tagName) => document.createElement(tagName);
export const createTextNode = (text) => document.createTextNode(text);
export const createComment = (comment = '') => document.createComment(comment);
export const createFragment = () => document.createDocumentFragment();
const CONTAINER_TAG = 's-container';
customElements.define(CONTAINER_TAG, class extends HTMLElement {
    constructor() {
        super();
        this.style.display = 'contents';
    }
});
export const createContainer = () => createElement(CONTAINER_TAG);
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