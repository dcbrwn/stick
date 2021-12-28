export function createTag(description) {
    const tags = new WeakSet();
    return [
        function tag(obj) {
            tags.add(obj);
            return obj;
        },
        function isTagged(obj) {
            return tags.has(obj);
        }
    ];
}
export function tuple(description) {
    const [tag, isTagged] = createTag(description);
    return [
        function create(...items) {
            tag(items);
            return items;
        },
        isTagged
    ];
}
export function toString(value) {
    return typeof value === 'string' ? value : value.toString();
}
const re = /([a-z0-9])([A-Z])/g;
export function camelToKebab(value) {
    return value[0].toLowerCase() + value.slice(1).replace(re, (match, tail, head) => `${tail}-${head.toLowerCase()}`);
}
export const noop = (...args) => { };
export const identity = (input) => input;
