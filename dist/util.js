const createTag = (description) => {
    // Using set to store tags, is not the most efficient solution,
    // but it works for immutable objects and non-invasive
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
};
const tuple = (description) => {
    const [tag, isTagged] = createTag(description);
    return [
        function create(...items) {
            tag(items);
            return items;
        },
        isTagged
    ];
};
const toString = (value) => {
    return typeof value === 'string' ? value : value.toString();
};
const re = /([a-z0-9])([A-Z])/g;
const camelToKebab = (value) => {
    return value[0].toLowerCase() + value.slice(1).replace(re, (match, tail, head) => `${tail}-${head.toLowerCase()}`);
};
const noop = (...args) => { };
const identity = (input) => input;
export { createTag, tuple, toString, camelToKebab, noop, identity };
//# sourceMappingURL=util.js.map