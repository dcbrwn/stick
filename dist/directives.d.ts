import { RenderResult } from './definitions';
import { O } from './o';
export declare function match<T>(observe: O<T>, renderer: (value: T) => RenderResult): RenderResult;
