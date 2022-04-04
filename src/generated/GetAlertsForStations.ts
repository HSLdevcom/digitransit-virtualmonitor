/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlertSeverityLevelType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAlertsForStations
// ====================================================

export interface GetAlertsForStations_stations_stops_routes_alerts_alertHeaderTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStations_stations_stops_routes_alerts_alertDescriptionTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStations_stations_stops_routes_alerts_stop {
  __typename: "Stop";
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
  /**
   * Stop code which is visible at the stop
   */
  code: string | null;
}

export interface GetAlertsForStations_stations_stops_routes_alerts {
  __typename: "Alert";
  /**
   * Alert severity level
   */
  alertSeverityLevel: AlertSeverityLevelType | null;
  /**
   * Header of the alert, if available
   */
  alertHeaderText: string | null;
  /**
   * Header of the alert in all different available languages
   */
  alertHeaderTextTranslations: GetAlertsForStations_stations_stops_routes_alerts_alertHeaderTextTranslations[];
  /**
   * Long descriptions of the alert in all different available languages
   */
  alertDescriptionTextTranslations: GetAlertsForStations_stations_stops_routes_alerts_alertDescriptionTextTranslations[];
  /**
   * Time when this alert is not in effect anymore. Format: Unix timestamp in seconds
   */
  effectiveEndDate: any | null;
  /**
   * Time when this alert comes into effect. Format: Unix timestamp in seconds
   */
  effectiveStartDate: any | null;
  /**
   * Stop affected by the disruption
   */
  stop: GetAlertsForStations_stations_stops_routes_alerts_stop | null;
}

export interface GetAlertsForStations_stations_stops_routes {
  __typename: "Route";
  /**
   * List of alerts which have an effect on the route
   */
  alerts: (GetAlertsForStations_stations_stops_routes_alerts | null)[] | null;
}

export interface GetAlertsForStations_stations_stops_alerts_alertHeaderTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStations_stations_stops_alerts_alertDescriptionTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStations_stations_stops_alerts_stop {
  __typename: "Stop";
  /**
   * ÌD of the stop in format `FeedId:StopId`
   */
  gtfsId: string;
  /**
   * Stop code which is visible at the stop
   */
  code: string | null;
}

export interface GetAlertsForStations_stations_stops_alerts {
  __typename: "Alert";
  /**
   * Alert severity level
   */
  alertSeverityLevel: AlertSeverityLevelType | null;
  /**
   * Header of the alert, if available
   */
  alertHeaderText: string | null;
  /**
   * Header of the alert in all different available languages
   */
  alertHeaderTextTranslations: GetAlertsForStations_stations_stops_alerts_alertHeaderTextTranslations[];
  /**
   * Long descriptions of the alert in all different available languages
   */
  alertDescriptionTextTranslations: GetAlertsForStations_stations_stops_alerts_alertDescriptionTextTranslations[];
  /**
   * Time when this alert is not in effect anymore. Format: Unix timestamp in seconds
   */
  effectiveEndDate: any | null;
  /**
   * Time when this alert comes into effect. Format: Unix timestamp in seconds
   */
  effectiveStartDate: any | null;
  /**
   * Stop affected by the disruption
   */
  stop: GetAlertsForStations_stations_stops_alerts_stop | null;
}

export interface GetAlertsForStations_stations_stops {
  __typename: "Stop";
  /**
   * Routes which pass through this stop
   */
  routes: GetAlertsForStations_stations_stops_routes[] | null;
  /**
   * List of alerts which have an effect on this stop
   */
  alerts: (GetAlertsForStations_stations_stops_alerts | null)[] | null;
}

export interface GetAlertsForStations_stations {
  __typename: "Stop";
  /**
   * Longitude of the stop (WGS 84)
   */
  lon: number | null;
  /**
   * Latitude of the stop (WGS 84)
   */
  lat: number | null;
  /**
   * Returns all stops that are children of this station (Only applicable for stations)
   */
  stops: (GetAlertsForStations_stations_stops | null)[] | null;
}

export interface GetAlertsForStations {
  /**
   * Get all stations
   */
  stations: (GetAlertsForStations_stations | null)[] | null;
}

export interface GetAlertsForStationsVariables {
  ids: string[];
}
