import { renderResult } from './definitions';
export function match(observe, renderer) {
    const cache = new Map();
    const anchor = document.createElement('div');
    let unmount;
    return renderResult(anchor, () => {
        const forget = observe((value) => {
            if (unmount)
                unmount();
            let next = cache.get(value);
            if (!next) {
                next = renderer(value);
                cache.set(value, next);
            }
            const [element, mount] = next;
            if (element) {
                anchor.replaceChildren(element);
            }
            else {
                anchor.innerHTML = '';
            }
            if (mount)
                unmount = mount();
        });
        return () => {
            if (unmount)
                unmount();
            forget();
        };
    });
}
