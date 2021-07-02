import { gql } from '@apollo/client';

export const GET_STOP = gql`
  query stopQuery($ids: [String]) {
    stop: stops(ids: $ids) {
      id
      name
      code
      desc
      gtfsId
      platformCode
      locationType
      vehicleMode
      stoptimesForPatterns {
        pattern {
          code
          headsign
          route {
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
  query stationQuery($ids: [String]) {
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
