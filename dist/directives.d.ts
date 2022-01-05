import { RenderResult } from './definitions';
import { O } from './o';
declare const match: <T>(observe: O<T>, renderer: (value: T) => RenderResult) => RenderResult;
declare const repeat: <ItemType>(observe: O<ItemType[]>, renderer: (value: O<ItemType>) => RenderResult) => RenderResult;
export { match, repeat };
