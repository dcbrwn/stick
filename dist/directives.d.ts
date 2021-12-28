import { RenderResult } from './definitions';
import { O } from './o';
export declare const match: <T>(observe: O<T>, renderer: (value: T) => RenderResult) => RenderResult;
