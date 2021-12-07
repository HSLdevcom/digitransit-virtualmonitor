/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AlertSeverityLevelType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAlertsForStops
// ====================================================

export interface GetAlertsForStops_stops_alerts_alertHeaderTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStops_stops_alerts_alertDescriptionTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStops_stops_alerts_stop {
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

export interface GetAlertsForStops_stops_alerts {
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
  alertHeaderTextTranslations: GetAlertsForStops_stops_alerts_alertHeaderTextTranslations[];
  /**
   * Long descriptions of the alert in all different available languages
   */
  alertDescriptionTextTranslations: GetAlertsForStops_stops_alerts_alertDescriptionTextTranslations[];
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
  stop: GetAlertsForStops_stops_alerts_stop | null;
}

export interface GetAlertsForStops_stops_routes_alerts_alertHeaderTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStops_stops_routes_alerts_alertDescriptionTextTranslations {
  __typename: "TranslatedString";
  text: string | null;
  /**
   * Two-letter language code (ISO 639-1)
   */
  language: string | null;
}

export interface GetAlertsForStops_stops_routes_alerts_stop {
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

export interface GetAlertsForStops_stops_routes_alerts {
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
  alertHeaderTextTranslations: GetAlertsForStops_stops_routes_alerts_alertHeaderTextTranslations[];
  /**
   * Long descriptions of the alert in all different available languages
   */
  alertDescriptionTextTranslations: GetAlertsForStops_stops_routes_alerts_alertDescriptionTextTranslations[];
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
  stop: GetAlertsForStops_stops_routes_alerts_stop | null;
}

export interface GetAlertsForStops_stops_routes {
  __typename: "Route";
  /**
   * List of alerts which have an effect on the route
   */
  alerts: (GetAlertsForStops_stops_routes_alerts | null)[] | null;
}

export interface GetAlertsForStops_stops {
  __typename: "Stop";
  /**
   * List of alerts which have an effect on this stop
   */
  alerts: (GetAlertsForStops_stops_alerts | null)[] | null;
  /**
   * Routes which pass through this stop
   */
  routes: GetAlertsForStops_stops_routes[] | null;
}

export interface GetAlertsForStops {
  /**
   * Get all stops
   */
  stops: (GetAlertsForStops_stops | null)[] | null;
}

export interface GetAlertsForStopsVariables {
  ids: string[];
}
