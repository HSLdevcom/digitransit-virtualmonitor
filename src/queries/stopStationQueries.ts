import { gql } from '@apollo/client';

export const GET_STOP = gql`
  query stopQuery($ids: [String]) @api(contextKey: "clientName") {
    stop: stops(ids: $ids) {
      id
      name
      code
      desc
      gtfsId
      platformCode
      locationType
      vehicleMode
      parentStation {
        gtfsId
      }
      stoptimesForPatterns {
        pattern {
          code
          headsign
          route {
            mode
            type
            shortName
            gtfsId
          }
        }
      }
      routes {
        shortName
        gtfsId
      }
    }
  }
`;

export const GET_STATION = gql`
  query stationQuery($ids: [String]) @api(contextKey: "clientName") {
    station: stations(ids: $ids) {
      id
      name
      code
      desc
      gtfsId
      platformCode
      locationType
      vehicleMode
      stops {
        desc
        stoptimesForPatterns {
          pattern {
            code
            headsign
            route {
              mode
              type
              shortName
              gtfsId
            }
          }
        }
        routes {
          shortName
          gtfsId
        }
      }
    }
  }
`;
