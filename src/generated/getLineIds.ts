/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLineIds
// ====================================================

export interface getLineIds_stations_stops_stoptimesForPatterns_pattern_route {
  __typename: "Route";
  /**
   * ID of the route in format `FeedId:RouteId`
   */
  gtfsId: string;
  /**
   * Short name of the route, usually a line number, e.g. 550
   */
  shortName: string | null;
}

export interface getLineIds_stations_stops_stoptimesForPatterns_pattern {
  __typename: "Pattern";
  /**
   * ID of the pattern
   */
  code: string;
  /**
   * Vehicle headsign used by trips of this pattern
   */
  headsign: string | null;
  /**
   * The route this pattern runs on
   */
  route: getLineIds_stations_stops_stoptimesForPatterns_pattern_route;
}

export interface getLineIds_stations_stops_stoptimesForPatterns {
  __typename: "StoptimesInPattern";
  pattern: getLineIds_stations_stops_stoptimesForPatterns_pattern | null;
}

export interface getLineIds_stations_stops {
  __typename: "Stop";
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
  /**
   * Name of the stop, e.g. Pasilan asema
   */
  name: string;
  /**
   * Returns list of stoptimes (arrivals and departures) at this stop, grouped by patterns
   */
  stoptimesForPatterns: (getLineIds_stations_stops_stoptimesForPatterns | null)[] | null;
}

export interface getLineIds_stations {
  __typename: "Stop";
  /**
   * Name of the stop, e.g. Pasilan asema
   */
  name: string;
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
  /**
   * Returns all stops that are children of this station (Only applicable for stations)
   */
  stops: (getLineIds_stations_stops | null)[] | null;
}

export interface getLineIds_stops_parentStation {
  __typename: "Stop";
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
}

export interface getLineIds_stops_stoptimesForPatterns_pattern_route {
  __typename: "Route";
  /**
   * ID of the route in format `FeedId:RouteId`
   */
  gtfsId: string;
  /**
   * Short name of the route, usually a line number, e.g. 550
   */
  shortName: string | null;
}

export interface getLineIds_stops_stoptimesForPatterns_pattern {
  __typename: "Pattern";
  /**
   * ID of the pattern
   */
  code: string;
  /**
   * Vehicle headsign used by trips of this pattern
   */
  headsign: string | null;
  /**
   * The route this pattern runs on
   */
  route: getLineIds_stops_stoptimesForPatterns_pattern_route;
}

export interface getLineIds_stops_stoptimesForPatterns {
  __typename: "StoptimesInPattern";
  pattern: getLineIds_stops_stoptimesForPatterns_pattern | null;
}

export interface getLineIds_stops {
  __typename: "Stop";
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
  /**
   * Name of the stop, e.g. Pasilan asema
   */
  name: string;
  /**
   * The station which this stop is part of (or null if this stop is not part of a station)
   */
  parentStation: getLineIds_stops_parentStation | null;
  /**
   * Returns list of stoptimes (arrivals and departures) at this stop, grouped by patterns
   */
  stoptimesForPatterns: (getLineIds_stops_stoptimesForPatterns | null)[] | null;
}

export interface getLineIds {
  /**
   * Get all stations
   */
  stations: (getLineIds_stations | null)[] | null;
  /**
   * Get all stops
   */
  stops: (getLineIds_stops | null)[] | null;
}

export interface getLineIdsVariables {
  stations: (string | null)[];
  stops: (string | null)[];
}
