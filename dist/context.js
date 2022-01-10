import { noop } from './util';
const contextStack = [];
let currentContext;
const createRenderingContext = () => {
    return {
        mountFns: [],
        mount() {
            const unmountFns = this.mountFns.reduce((memo, mount) => {
                const unmount = mount();
                if (unmount)
                    memo.push(unmount);
                return memo;
            }, []);
            return () => unmountFns.forEach((unmount) => unmount());
        }
    };
};
const withRenderingContext = (fn) => {
    const ctx = createRenderingContext();
    currentContext = ctx;
    contextStack.push(ctx);
    fn();
    contextStack.pop();
    currentContext = contextStack[contextStack.length - 1];
    return ctx;
};
const render = (template) => {
    let result;
    const ctx = withRenderingContext(() => {
        result = template();
    });
    return [result, ctx];
};
const getRenderingContext = () => {
    if (!currentContext)
        throw new Error('Outside of rendering context');
    return currentContext;
};
const onMount = (fn) => {
    getRenderingContext().mountFns.push(fn);
};
const observe = (observable, observer = noop) => {
    onMount(() => observable(observer));
};
const getMount = () => {
    const ctx = getRenderingContext();
    return () => ctx.mount();
};
export { withRenderingContext, render, onMount, observe, getMount };
//# sourceMappingURL=context.js.map