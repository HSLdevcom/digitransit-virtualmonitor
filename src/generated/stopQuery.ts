/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LocationType, Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: stopQuery
// ====================================================

export interface stopQuery_stop_parentStation {
  __typename: "Stop";
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
}

export interface stopQuery_stop_stoptimesForPatterns_pattern_route {
  __typename: "Route";
  /**
   * Transport mode of this route, e.g. `BUS`
   */
  mode: Mode | null;
  /**
   * Short name of the route, usually a line number, e.g. 550
   */
  shortName: string | null;
  /**
   * ID of the route in format `FeedId:RouteId`
   */
  gtfsId: string;
}

export interface stopQuery_stop_stoptimesForPatterns_pattern {
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
  route: stopQuery_stop_stoptimesForPatterns_pattern_route;
}

export interface stopQuery_stop_stoptimesForPatterns {
  __typename: "StoptimesInPattern";
  pattern: stopQuery_stop_stoptimesForPatterns_pattern | null;
}

export interface stopQuery_stop_routes {
  __typename: "Route";
  /**
   * Short name of the route, usually a line number, e.g. 550
   */
  shortName: string | null;
  /**
   * ID of the route in format `FeedId:RouteId`
   */
  gtfsId: string;
}

export interface stopQuery_stop {
  __typename: "Stop";
  /**
   * Global object ID provided by Relay. This value can be used to refetch this object using **node** query.
   */
  id: string;
  /**
   * Name of the stop, e.g. Pasilan asema
   */
  name: string;
  /**
   * Stop code which is visible at the stop
   */
  code: string | null;
  /**
   * Description of the stop, usually a street name
   */
  desc: string | null;
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
  /**
   * Identifier of the platform, usually a number. This value is only present for stops that are part of a station
   */
  platformCode: string | null;
  /**
   * Identifies whether this stop represents a stop or station.
   */
  locationType: LocationType | null;
  /**
   * Transport mode (e.g. `BUS`) used by routes which pass through this stop or
   * `null` if mode cannot be determined, e.g. in case no routes pass through the stop.  
   *  Note that also other types of vehicles may use the stop, e.g. tram replacement
   * buses might use stops which have `TRAM` as their mode.
   */
  vehicleMode: Mode | null;
  /**
   * The station which this stop is part of (or null if this stop is not part of a station)
   */
  parentStation: stopQuery_stop_parentStation | null;
  /**
   * Returns list of stoptimes (arrivals and departures) at this stop, grouped by patterns
   */
  stoptimesForPatterns: (stopQuery_stop_stoptimesForPatterns | null)[] | null;
  /**
   * Routes which pass through this stop
   */
  routes: stopQuery_stop_routes[] | null;
}

export interface stopQuery {
  /**
   * Get all stops
   */
  stop: (stopQuery_stop | null)[] | null;
}

export interface stopQueryVariables {
  ids?: (string | null)[] | null;
}
