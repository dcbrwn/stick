import { stickKey } from './definitions';
import { appendChild } from './dom';
export function element(tagName, template, options = {}) {
    const meta = {
        tagName,
        reflect: options.reflect || {}
    };
    customElements.define(tagName, class extends HTMLElement {
        [stickKey] = meta;
        props;
        mount = false;
        unmount;
        connectedCallback() {
            if (!this.mount) {
                const [content, mount] = template(this.props);
                this.mount = mount || true;
                if (content)
                    appendChild(this, content);
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
    });
    return Object.assign(template, { [stickKey]: meta });
}
//# sourceMappingURL=element.js.map