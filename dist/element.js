import { getMount, withRenderingContext } from './context';
import { stickKey } from './definitions';
import { appendChild } from './dom';
class BaseElementClass extends HTMLElement {
    connectedCallback() {
        if (!this.mount) {
            withRenderingContext(() => {
                const content = this.template(this.props, this);
                this.mount = getMount();
                if (content)
                    appendChild(this, content);
            });
        }
        if (typeof this.mount === 'function')
            this.unmount = this.mount();
    }
    disconnectedCallback() {
        if (this.unmount) {
            this.unmount();
            this.unmount = undefined;
        }
    }
}
const element = (tagName, template, options = {}) => {
    var _a;
    const meta = {
        tagName,
        reflect: options.reflect || {}
    };
    class CustomElement extends BaseElementClass {
        constructor() {
            super(...arguments);
            this.template = template;
            this[_a] = meta;
        }
    }
    _a = stickKey;
    customElements.define(tagName, CustomElement);
    return Object.assign(template, { [stickKey]: meta });
};
export { element };
//# sourceMappingURL=element.js.map