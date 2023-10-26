export enum PropertiesLayer {
  STOP = 'stop',
  FAVORITE_STOP = 'favouriteStop',
  STATION = 'station',
  FAVORITE_STATION = 'favouriteStation',
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
