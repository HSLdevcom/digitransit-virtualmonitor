import { gql } from '@apollo/client';

export const GET_STOP_ALERTS = gql`
  query GetDepartures($ids: [String!]!) {
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
  query GetDeparturesForStations($ids: [String!]!) {
    stations: stations(ids: $ids) {
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
