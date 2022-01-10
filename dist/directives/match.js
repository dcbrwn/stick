import { onMount, render } from '../context';
import { createContainer, ensureElement } from '../dom';
const match = (observe, renderer, isEqual = (a, b) => a === b) => {
    const cache = new Map();
    let lastValue;
    let unmount;
    let currentElement = createContainer();
    const createCacheEntry = (value) => {
        const [element, ctx] = render(() => renderer(value));
        const entry = [ensureElement(element), () => ctx.mount()];
        cache.set(value, entry);
        return entry;
    };
    const updateContents = (value) => {
        if (unmount)
            unmount();
        const [element, mount] = cache.get(value) || createCacheEntry(value);
        currentElement.replaceWith(element);
        currentElement = element;
        if (mount)
            unmount = mount();
    };
    onMount(() => {
        const forget = observe((value) => {
            if (!isEqual(lastValue, value)) {
                lastValue = value;
                updateContents(value);
            }
        });
        return () => {
            if (unmount)
                unmount();
            forget();
        };
    });
    return currentElement;
};
export { match };
//# sourceMappingURL=match.js.map