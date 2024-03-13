export enum PropertiesLayer {
  STOP = 'stop',
  FAVORITE_STOP = 'favouriteStop',
  STATION = 'station',
  FAVORITE_STATION = 'favouriteStation',
}

export enum ColumnSideEnum {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface IResult {
  geometry: {
    coordinates: number[];
    type: string;
  };
  properties: {
    accuracy: string;
    addendum: {
      GTFS: {
        code: string;
        modes: string[];
        platform: string;
      };
    };
    confidence: number;
    gid: string;
    id: string;
    gtfsId?: string;
    label: string;
    layer: PropertiesLayer;
    localadmin: string;
    localadmin_gid: string;
    locality: string;
    locality_gid: string;
    name: string;
    neighbourhood?: string;
    neighbourhood_gid?: string;
    postalcode: string;
    postalcode_gid: string;
    region: string;
    region_gid: string;
    source: string;
    source_id: string;
  };
  type: string;
}

export interface IPattern {
  code: string;
  headsign: string;
  __typename: string;
  route: IPatternRoute;
}

export interface IPatternRoute {
  gtfsId: string;
  mode: string;
  shortName: string;
  type: number;
  __typename: string;
}

export interface IRoute {
  gtfsId: string;
  shortName: string;
  longName?: string;
  __typename: string;
}

export interface IStoptimesForPattersPatternRoute extends IRoute {
  mode: string;
  type: number;
}

export interface IStoptimesForPatternsPattern {
  code: string;
  headsign: string;
  originalTripPattern: string | null;
  route: IStoptimesForPattersPatternRoute[];
}

export interface IStoptimesForPatternsStoptimes {
  headsign: string;
  __typename: string;
}

export interface IStoptimesForPatterns {
  pattern: IStoptimesForPatternsPattern;
  stoptimes: IStoptimesForPatternsStoptimes[];
  __typename: string;
}

export interface IDataStop {
  code: string | null;
  desc: string;
  gtfsId: string;
  id: string;
  lat: number;
  locationType: string;
  lon: number;
  name: string;
  parentStation: {
    gtfsId: string;
    __typename: string;
  };
  patterns: IPattern[];
  routes: IRoute[];
  stoptimesForPatterns: IStoptimesForPatterns[];
  vehicleMode: string;
  __typename: string;
}

export interface IDataStationStop {
  code: string;
  desc: string;
  patterns: IStoptimesForPatternsPattern[];
  routes: IRoute[];
  stoptimesForPatterns: IStoptimesForPatternsPattern[];
}

export interface IDataStation {
  code: string | null;
  desc: string | null;
  gtfsId: string;
  id: string;
  lat: number;
  locationType: string;
  lon: number;
  name: string;
  platformCode: string | number | null;
  stops: IDataStationStop[];
  vehicleMode: string;
  __typename: string;
}

export interface IResponseData {
  stop?: IDataStop[];
  station?: IDataStation[];
}
