import { onMount, getMount, withRenderingContext } from './context';
import { createContainer } from './dom';
import { observable } from './o';
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
const match = (observe, renderer) => {
    const cache = new Map();
    let unmount;
    let currentElement = createContainer();
    onMount(() => {
        const forget = observe((value) => {
            if (unmount)
                unmount();
            let next = cache.get(value);
            if (!next) {
                withRenderingContext(() => {
                    const rootElement = renderer(value);
                    next = [ensureElement(rootElement), getMount()];
                    cache.set(value, next);
                });
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
    return currentElement;
};
const repeat = (observe, renderer) => {
    const container = createContainer();
    const items = [];
    let visibleItems = 0;
    onMount(() => {
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
                        withRenderingContext(() => {
                            const [observe, notify] = observable();
                            const element = renderer(observe);
                            items.push({ element: ensureElement(element), notify, mount: getMount() });
                        });
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
    return container;
};
export { match, repeat };
//# sourceMappingURL=directives.js.map