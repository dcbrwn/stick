import { StickOptions, Template, StickElement, AnyProps } from './definitions';
declare const element: <Props extends AnyProps>(tagName: string, template: Template<Props>, options?: StickOptions) => StickElement<Props>;
export { element };
