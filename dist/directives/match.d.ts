import { Maybe, RenderResult } from '../definitions';
import { O } from '../o';
declare const match: <T>(observe: O<T>, renderer: (value: T) => RenderResult, isEqual?: (a: Maybe<T>, b: T) => boolean) => RenderResult;
export { match };
