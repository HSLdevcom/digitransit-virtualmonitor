import { gql } from '@apollo/client';

export const GET_STOP_DEPARTURES = gql`
  query GetDeparturesForStops($ids: [String!]!, $numberOfDepartures: Int!)
  @api(contextKey: "clientName") {
    stops: stops(ids: $ids) {
      name
      code
      gtfsId
      lat
      lon
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
          scheduledDeparture
          realtimeDeparture
          realtimeState
          headsign
          trip {
            tripHeadsign
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
  query GetDeparturesForStations($ids: [String!]!, $numberOfDepartures: Int!)
  @api(contextKey: "clientName") {
    stations: stations(ids: $ids) {
      name
      code
      lat
      lon
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
          scheduledDeparture
          realtimeDeparture
          realtimeState
          headsign
          trip {
            tripHeadsign
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
