import { StickOptions, RenderResult } from './definitions';
declare const element: <T extends (props: any, element: HTMLElement) => RenderResult>(tagName: string, template: T, options?: StickOptions) => T;
export { element };
