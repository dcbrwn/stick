import { RenderResult } from '../definitions';
import { O } from '../o';
declare const repeat: <ItemType>(observe: O<ItemType[]>, renderer: (value: O<ItemType>, index: number) => RenderResult) => RenderResult;
export { repeat };
