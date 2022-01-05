import { getMount, withRenderingContext } from './context';
import { stickKey } from './definitions';
import { appendChild } from './dom';
const element = (tagName, template, options = {}) => {
    var _a, _b;
    const meta = {
        tagName,
        reflect: options.reflect || {}
    };
    customElements.define(tagName, (_b = class extends HTMLElement {
            constructor() {
                super(...arguments);
                this[_a] = meta;
            }
            connectedCallback() {
                if (!this.mount) {
                    withRenderingContext(() => {
                        const content = template(this.props, this);
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
        },
        _a = stickKey,
        _b));
    return Object.assign(template, { [stickKey]: meta });
};
export { element };
//# sourceMappingURL=element.js.map