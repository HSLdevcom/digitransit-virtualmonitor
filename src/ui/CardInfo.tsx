import { ITitle } from '../util/Interfaces';

export interface ICardInfo {
  feedIds: Array<string>;
  index: number;
  id: number;
  layout?: number;
  duration?: number;
  title?: ITitle;
  possibleToMove: boolean;
}
