export interface ICardInfo {
  feedIds: Array<string>;
  index: number;
  id: number;
  layout?: number;
  duration?: number;
  title?: string;
  possibleToMove: boolean;
}
