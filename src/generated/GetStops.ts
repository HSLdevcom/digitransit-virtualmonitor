/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LocationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetStops
// ====================================================

export interface GetStops_stops {
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
   * Identifies whether this stop represents a stop or station.
   */
  locationType: LocationType | null;
  /**
   * Latitude of the stop (WGS 84)
   */
  lat: number | null;
  /**
   * Longitude of the stop (WGS 84)
   */
  lon: number | null;
}

export interface GetStops {
  /**
   * Get all stops
   */
  stops: (GetStops_stops | null)[] | null;
}

export interface GetStopsVariables {
  ids: string[];
}
