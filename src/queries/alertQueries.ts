import { gql } from '@apollo/client';

export const GET_STOP_ALERTS = gql`
  query GetAlertsForStops($ids: [String!]!) @api(contextKey: "clientName") {
    stops: stops(ids: $ids) {
      alerts {
        alertSeverityLevel
        alertHeaderText
        alertHeaderTextTranslations {
          text
          language
        }
        alertDescriptionTextTranslations {
          text
          language
        }
        effectiveEndDate
        effectiveStartDate
        stop {
          gtfsId
          code
        }
      }
      lat
      lon
      routes {
        alerts {
          alertSeverityLevel
          alertHeaderText
          alertHeaderTextTranslations {
            text
            language
          }
          alertDescriptionTextTranslations {
            text
            language
          }
          effectiveEndDate
          effectiveStartDate
          stop {
            gtfsId
            code
          }
        }
      }
    }
  }
`;

export const GET_STATION_ALERTS = gql`
  query GetAlertsForStations($ids: [String!]!) @api(contextKey: "clientName") {
    stations: stations(ids: $ids) {
      lon
      lat
      stops {
        routes {
          alerts {
            alertSeverityLevel
            alertHeaderText
            alertHeaderTextTranslations {
              text
              language
            }
            alertDescriptionTextTranslations {
              text
              language
            }
            effectiveEndDate
            effectiveStartDate
            stop {
              gtfsId
              code
            }
          }
        }
        alerts {
          alertSeverityLevel
          alertHeaderText
          alertHeaderTextTranslations {
            text
            language
          }
          alertDescriptionTextTranslations {
            text
            language
          }
          effectiveEndDate
          effectiveStartDate
          stop {
            gtfsId
            code
          }
        }
      }
    }
  }
`;
