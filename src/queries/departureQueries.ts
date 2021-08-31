import { gql } from '@apollo/client';

export const GET_STOP_DEPARTURES = gql`
  query GetDepartures($ids: [String!]!, $numberOfDepartures: Int!) {
    stops: stops(ids: $ids) {
      name
      code
      gtfsId
      patterns {
        headsign
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
        longName
        id
      }
      stoptimesForPatterns(
        numberOfDepartures: $numberOfDepartures
        omitCanceled: false
      ) {
        pattern {
          code
          directionId
          headsign
          route {
            gtfsId
            shortName
          }
        }
        stoptimes {
          stop {
            gtfsId
            code
            platformCode
            parentStation {
              gtfsId
            }
          }
          realtime
          pickupType
          serviceDay
          scheduledArrival
          realtimeArrival
          arrivalDelay
          scheduledDeparture
          realtimeDeparture
          departureDelay
          realtimeState
          headsign
          trip {
            gtfsId
            route {
              shortName
            }
          }
        }
      }
    }
  }
`;

export const GET_STATION_DEPARTURES = gql`
  query GetDeparturesForStations($ids: [String!]!, $numberOfDepartures: Int!) {
    stations: stations(ids: $ids) {
      name
      code
      gtfsId
      stops {
        patterns {
          headsign
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
          longName
          id
        }
        gtfsId
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
      stoptimesForPatterns(
        numberOfDepartures: $numberOfDepartures
        omitCanceled: false
      ) {
        pattern {
          code
          directionId
          headsign
          route {
            gtfsId
            shortName
          }
        }
        stoptimes {
          stop {
            gtfsId
            code
            platformCode
            parentStation {
              gtfsId
            }
          }
          realtime
          pickupType
          serviceDay
          scheduledArrival
          realtimeArrival
          arrivalDelay
          scheduledDeparture
          realtimeDeparture
          realtimeState
          departureDelay
          headsign
          trip {
            gtfsId
            route {
              gtfsId
              shortName
            }
          }
        }
      }
    }
  }
`;
