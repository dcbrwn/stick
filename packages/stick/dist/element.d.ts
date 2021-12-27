import { StickOptions, Template, StickElement, AnyProps } from './definitions';
export declare function element<Props extends AnyProps>(tagName: string, template: Template<Props>, options?: StickOptions): StickElement<Props>;
