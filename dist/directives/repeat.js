import { onMount, getMount, withRenderingContext } from '../context';
import { createContainer, ensureElement } from '../dom';
import { broadcast, observable } from '../o';
const repeat = (observe, renderer) => {
    const container = createContainer();
    const items = [];
    let visibleCount = 0;
    const createItems = (itemsToCreate) => {
        for (let i = 0; i < itemsToCreate; i += 1) {
            withRenderingContext(() => {
                const [observe, notify] = observable();
                const element = renderer(broadcast(observe), items.length);
                items.push({ element: ensureElement(element), notify, mount: getMount() });
            });
        }
    };
    const expand = (itemsToAppend) => {
        const cachedItems = Math.min(itemsToAppend, items.length - visibleCount);
        const itemsToCreate = itemsToAppend - cachedItems;
        createItems(itemsToCreate);
        for (let i = visibleCount, len = visibleCount + itemsToAppend; i < len; i += 1) {
            const item = items[i];
            container.appendChild(item.element);
            if (item.mount)
                item.unmount = item.mount();
        }
        visibleCount += itemsToAppend;
    };
    const shrink = (itemsToRemove) => {
        const oldVisibleCount = visibleCount;
        visibleCount -= itemsToRemove;
        for (let i = oldVisibleCount; i > visibleCount; i -= 1) {
            const item = items[i - 1];
            item.unmount();
            item.unmount = undefined;
            container.removeChild(item.element);
        }
    };
    const notifyVisibleChildren = (items, collection) => {
        for (let i = 0, len = collection.length; i < len; i += 1) {
            items[i].notify(collection[i]);
        }
    };
    const handleCollectionUpdates = (collection) => {
        const difference = collection.length - visibleCount;
        if (difference > 0) {
            expand(difference);
        }
        else if (difference < 0) {
            shrink(-difference);
        }
        notifyVisibleChildren(items, collection);
    };
    const mountVisibleItems = () => {
        for (let i = 0; i < visibleCount; i += 1) {
            const item = items[i];
            if (item.mount)
                item.unmount = item.mount();
        }
    };
    const unmountVisibleItems = () => {
        for (let i = 0, len = visibleCount; i < len; i += 1) {
            items[i].unmount();
        }
    };
    onMount(() => {
        mountVisibleItems();
        const forgetCollection = observe(handleCollectionUpdates);
        return () => {
            forgetCollection();
            unmountVisibleItems();
        };
    });
    return container;
};
export { repeat };
//# sourceMappingURL=repeat.js.map