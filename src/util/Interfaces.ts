export interface IStop {
  code: string;
  desc: string;
  gtfsId: string;
  locationType: string;
  name: string;
  settings: ISettings;
}
export interface ISettings {
  hiddenRoutes: Array<IHiddenRoute>;
  showStopNumber: boolean;
  showEndOfLine: boolean;
  timeShift: number;
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
  title: string;
}
export interface IColumn {
  left: ISides;
  right: ISides;
}

export interface IView {
  columns: IColumn;
  title: string;
  layout: number;
  duration: number;
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
