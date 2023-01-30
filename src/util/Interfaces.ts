export interface IStop {
  id?: string;
  code?: string;
  desc?: string;
  gtfsId?: string;
  locationType?: string;
  lat?: number;
  lon?: number;
  name?: string;
  settings?: ISettings;
  mode?: string;
  routes?: Array<any>;
  parentStation?: string;
}
export interface IStopInfoPlus extends IStop {
  cardId?: number;
  settings?: ISettings;
  layout?: number;
  locality?: string;
  patterns?: Array<IPattern>;
  id?: string;
  modes?: Array<string>;
}
export interface ISettings {
  hiddenRoutes: Array<IHiddenRoute>;
  showStopNumber: boolean;
  showEndOfLine: boolean;
  timeShift: number;
  renamedDestinations: Array<IDestinations>;
  showVia: boolean;
}

export interface IDestinations {
  pattern: string;
  en: string;
  fi: string;
  sv: string;
}

export interface IHiddenRoute {
  code: string;
  headsign: string;
  route: Array<IRoute>;
}

export interface IRoute {
  gtfsId: string;
  shortName: string;
}
export interface IPattern {
  code: string;
  headsign: string;
  route: IRoute;
}

export interface ISides {
  stops: Array<IStop>;
  title: ITitle;
}
export interface IColumn {
  left: ISides;
  right: ISides;
}

export interface IView {
  columns: IColumn;
  title: ITitle;
  layout: number;
  duration: number;
}
export interface IMonitor {
  cards: Array<IView>;
  languages: Array<string>;
  contenthash?: string;
  name?: string;
  url?: string;
  instance?: string;
}

export interface IAlertDescriptionTextTranslation {
  text: string;
  language?: string;
}
export interface IAlert {
  alertDescriptionTextTranslations: Array<IAlertDescriptionTextTranslation>;
  alertHeaderTextTranslations: Array<IAlertDescriptionTextTranslation>;
  alertHeaderText: string;
  alertSeverityLevel: string;
}

export interface IMonitorConfig {
  // feedIds?: Array<string>;
  uri?: string;
  // Texts for Help page
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
}

export interface ITitle {
  fi: string;
  sv: string;
  en: string;
}

export interface IClosedStop {
  viewId?: number;
  column?: string;
  gtfsId?: string;
  name?: string;
  lat?: number;
  lon?: number;
  code?: string;
  startTime?: number;
  endTime?: number;
}

export interface IWeatherData {
  temperature: number;
  windSpeed: number;
  time: any;
  iconId: string;
}

export interface ITrainData {
  lineId: string;
  time: string;
  timeInSecs: number;
  track: string;
}

export interface ICard {
  gtfsId: string;
  shortCode: string;
  source: string;
  parentStation: string;
  hiddenRoutes: any;
}
export interface ICardInfo {
  index: number;
  id: number;
  layout?: number;
  duration?: number;
  title?: ITitle;
  possibleToMove: boolean;
  columns?: IColumn;
}
