import { renderResult } from './definitions';
import { createContainer } from './dom';
import { observable } from './o';
const ensureElement = (element) => {
    let result;
    if (element instanceof DocumentFragment) {
        result = createContainer();
        result.appendChild(element);
    }
    else if (element instanceof Element) {
        result = element;
    }
    else {
        result = createContainer();
    }
    return result;
};
export const match = (observe, renderer) => {
    const cache = new Map();
    let unmount;
    let currentElement = createContainer();
    return renderResult(currentElement, () => {
        const forget = observe((value) => {
            if (unmount)
                unmount();
            let next = cache.get(value);
            if (!next) {
                const [rootElement, mount] = renderer(value);
                next = [ensureElement(rootElement), mount];
                cache.set(value, next);
            }
            const [element, mount] = next;
            currentElement.replaceWith(element);
            currentElement = element;
            if (mount)
                unmount = mount();
        });
        return () => {
            if (unmount)
                unmount();
            forget();
        };
    });
};
export const repeat = (observe, renderer) => {
    const container = createContainer();
    const items = [];
    let visibleItems = 0;
    return renderResult(container, () => {
        const forget = observe((collection) => {
            var _a;
            const newLength = collection.length;
            const difference = newLength - visibleItems;
            if (difference < 0) {
                for (let i = newLength, len = items.length; i < len; i += 1) {
                    const item = items[i];
                    (_a = item.unmount) === null || _a === void 0 ? void 0 : _a.call(item);
                    item.unmount = undefined;
                    item.element.remove();
                }
            }
            else if (difference > 0) {
                const cachedItems = Math.min(difference, items.length - visibleItems);
                const itemsToCreate = difference - cachedItems;
                if (itemsToCreate > 0) {
                    for (let i = 0; i < itemsToCreate; i += 1) {
                        const [observe, notify] = observable();
                        const [element, mount] = renderer(observe);
                        items.push({ element: ensureElement(element), notify, mount });
                    }
                }
                for (let i = visibleItems, len = newLength; i < len; i += 1) {
                    const item = items[i];
                    container.appendChild(item.element);
                    if (item.mount)
                        item.unmount = item.mount();
                }
            }
            visibleItems = newLength;
            for (let i = 0, len = visibleItems; i < len; i += 1) {
                items[i].notify(collection[i]);
            }
        });
        return () => {
            var _a, _b;
            for (let i = 0, len = visibleItems; i < len; i += 1) {
                (_b = (_a = items[i]).unmount) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            forget();
        };
    });
};
//# sourceMappingURL=directives.js.map