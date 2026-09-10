import { MqttClient } from 'mqtt';
import type { MutableRefObject } from 'react';
import { DateTime } from 'luxon';

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
  vehicleMode?: string;
  locality?: string;
  routes?: Array<IRoute>;
  parentStation?: {
    gtfsId: string;
  };
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
  hiddenRoutes: Array<string>;
  showStopNumber: boolean;
  showEndOfLine: boolean;
  timeShift: number;
  renamedDestinations: Array<IDestinations>;
  showVia: boolean;
  showRouteColumn?: boolean;
  allRoutesHidden?: boolean;
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
  longName?: string;
}
export interface IPattern {
  code: string;
  headsign: string;
  route: IRoute;
  originalTripPattern?: IPattern;
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
  id?: number;
  columns: IColumn;
  title: ITitle;
  layout: number;
  duration: number;
  type?: string;
  stops?: Array<MapStop>;
}
export interface IMonitor {
  id?: string;
  cards: Array<IView>;
  languages: Array<string>;
  contenthash?: string;
  name?: string;
  url?: string;
  instance?: string;
  mapSettings?: IMapSettings;
}

export interface IUser {
  sub?: string;
  notLogged?: boolean;
}

export interface IFavourite {
  type: string;
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
  time: DateTime;
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
  parentStation: {
    gtfsId: string;
  };
  hiddenRoutes: Array<string>;
}
export interface ICardInfo {
  index: number;
  id?: number;
  layout?: number;
  duration?: number;
  title?: ITitle;
  possibleToMove?: boolean;
  columns?: IColumn;
}
export type Coordinate = [number, number];
export type BoundingBox = [Coordinate, Coordinate];
export type MapStop = {
  coords: Coordinate;
  gtfsId: string;
  mode: string;
  name: string;
};
export interface IMapSettings {
  bounds?: BoundingBox;
  center?: Coordinate;
  zoom?: number;
  showMap?: boolean;
  hideTimeTable?: boolean;
  stops?: [MapStop];
  userSet?: boolean;
}

export interface IMessage {
  id: string;
  route: 'string';
  direction: number;
  tripStartTime: 'string';
  operatingDay: 'string';
  mode: 'string';
  next_stop: 'string';
  timestamp: number;
  lat: number;
  long: number;
  heading: number;
  headsign: 'string';
  tripId: 'string';
  geoHash: [string, string, string, string];
  shortName: 'string';
  color: 'string';
  topicString: 'string';
}

export interface IMqttState {
  client: MqttClient;
  topics: string[];
  messages: [IMessage];
}

export interface IVehiclePosition {
  id: string;
  route: string;
  direction: number;
  tripStartTime: string;
  operatingDay: string;
  mode: string;
  next_stop: string;
  timestamp: number;
  lat: number;
  long: number;
  shortName: string;
  heading: number | undefined;
  headsign: undefined;
}

export interface IVehicleMarkerInfo {
  id?: string;
  nextStop?: boolean;
  passed?: boolean;
  expire?: number;
}

export interface IMqttProps {
  messages?: Array<IMessage>;
  clientRef: MutableRefObject<MqttClient | null>;
  newTopics?: Array<string>;
  topicRef: MutableRefObject<Array<string> | null>;
  vehicleMarkerState?: Map<string, IVehicleMarkerInfo>;
  setVehicleMarkerState?: (markers: Map<string, IVehicleMarkerInfo>) => void;
}

// setQueryError props always toggle a boolean error flag — see WithDatabaseConnection's errorHandler
export type SetQueryError = (hasError: boolean) => void;
