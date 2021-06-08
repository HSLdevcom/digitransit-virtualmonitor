// import gql from "graphql-tag";
// import * as React from "react";
// import { Query, QueryResult } from "react-apollo";

// import {
//   DaySeconds,
//   EpochSecondsLocal,
//   formatTime,
//   parseDaySeconds,
//   Seconds
// } from "src/time";

// // const STOP_SCHEDULE_QUERY = gql`
// //   query GetStop($stopId: String!) {
// //     stop(id: $stopId) {
// //       name
// //     }
// //   }
// // `;

// const FULL_STOP_SCHEDULE_QUERY = gql`
// query GetStop($stopId: String!) {
//   stop(id: $stopId) {
//     name,
//     stoptimesForServiceDate(date: "20180612") {
//       stoptimes {
//         scheduledArrival
//         realtimeArrival
//         arrivalDelay
//         scheduledDeparture
//         realtimeDeparture
//         departureDelay
//         timepoint
//         realtime
//         realtimeState
//         pickupType
//         dropoffType
//         serviceDay
//         stopHeadsign
//         headsign,
//       }
//       pattern {
//         name,
//         directionId,
//         code,
//         headsign,
//         semanticHash,
//         alerts {
//           alertHeaderText
//         },
//         tripsForDate(serviceDate: "20180611") {
//           gtfsId,
//           serviceId,
//           activeDates,
//           routeShortName,
//           tripShortName,
//           tripHeadsign,
//           directionId,
//           blockId,
//           shapeId,
//         }
//         route {
//           shortName,
//           longName,
//           agency {
//             gtfsId,
//             name,
//             url,
//             timezone,
//             lang,
//             fareUrl,
//           },
//           mode,
//           type,
//           desc,
//           url,
//           color,
//           textColor,
//           bikesAllowed,
//         },
//       }
//     },
//   }
// }
// `;

// // interface IStop {
// //   name: string,
// // };

// interface IFullStop {
//   name: string,
//   stoptimesForServiceDate: Array<{
//     stoptimes: Array<{
//       scheduledArrival: DaySeconds,
//       realtimeArrival: DaySeconds,
//       arrivalDelay: Seconds,
//       scheduledDeparture: DaySeconds,
//       realtimeDeparture: DaySeconds,
//       departureDelay: Seconds,
//       timepoint: boolean,
//       realtime: boolean,
//       realtimeState: "SCHEDULED" | "UPDATED" | "CANCELED" | "ADDED" | "MODIFIED",
//       pickupType: "SCHEDULED" | "NONE" | "CALL_AGENCY" | "COORDINATE_WITH_DRIVER",
//       dropoffType: "SCHEDULED" | "NONE" | "CALL_AGENCY" | "COORDINATE_WITH_DRIVER",
//       serviceDay: EpochSecondsLocal,
//       stopHeadsign: string,
//       headsign: string,
//     }>,
//     pattern: {
//       name: string,
//     },
//   }>
// };

// // interface IStopResponse {
// //   stop: IStop
// // };

// interface IFullStopResponse {
//   stop: IFullStop
// }

// type StopId = string

// interface IStopQuery {
//   stopId: StopId
// };

// // {(loading: boolean, error: ApolloError, data: IData | undefined): React.ReactNode => {

// class StopQuery2 extends Query<IFullStopResponse, IStopQuery> {}
// const StopRetriever2 = (props: any) => (
//   <StopQuery2
//     query={FULL_STOP_SCHEDULE_QUERY}
//     variables={{ stopId: props.stopId}}
//   >
//     {(result: QueryResult<IFullStopResponse, IStopQuery>): React.ReactNode => {
//       if (result.loading) {
//         return (<div>Loading</div>);
//       }
//       if (!result || !result.data) {
//         return (<div>Wat</div>);
//       }
//       return (
//         <div>
//           {`Pysäkinnimi: ${result.data.stop.name}`}
//           <div>
//             {result.data.stop.stoptimesForServiceDate.map(({ pattern, stoptimes }) => (
//               <div>
//                 {pattern.name}
//                 <div>
//                   {stoptimes.map(stoptime => (
//                     <div>Klo {formatTime(parseDaySeconds(stoptime.scheduledArrival))}</div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }}
//   </StopQuery2>
// );

// // class StopQuery extends Query<IStopResponse, IStopQuery> {}
// // const StopRetriever = (props: any) => (
// //   <StopQuery
// //     query={STOP_SCHEDULE_QUERY}
// //     variables={{ stopId: props.stopIexport d}}
// //   >
// //     {(result: QueryResult<IStopResponse, IStopQuery>): React.ReactNode => {
// //       if (result.loading) {
// //         return (<div>Loading</div>);
// //       }
// //       if (!result || !result.data) {
// //         return (<div>Wat</div>);
// //       }
// //       return (
// //         <div>{`Pysäkinnimi: ${result.data.stop.name}`}</div>
// //       );
// //     }}
// //   </StopQuery>
// // );
// // export { StopRetriever }
// export default StopRetriever2;

// // (<StopRetriever2 stopId={''} mapResultToProp={'stopInfo'}>
// //   <StopDisplay />
// // </StopRetriever2>)
