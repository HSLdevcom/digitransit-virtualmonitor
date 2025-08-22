/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import MonitorRow, { IDeparture } from "./MonitorRow";
import cx from "classnames";
import { formatDate, setDate, formattedDateTimeFromSeconds } from "../time";
import { getLayout } from "../util/getResources";
import { IClosedStop } from "../util/Interfaces";
import { useTranslation } from "react-i18next";
import { stoptimeSpecificDepartureId } from "../util/monitorUtils";
import { departure } from "../test/data/monitor";

interface IProps {
  viewId: number;
  departuresLeft: Array<IDeparture>;
  departuresRight: Array<IDeparture>;
  rightStops: Array<any>;
  leftStops: Array<any>;
  currentLang: string;
  layout: any;
  isLandscape: boolean;
  alertState: number;
  alertComponent: any;
  alertRowSpan: number;
  showMinutes?: number;
  closedStopViews: Array<IClosedStop>;
  preview: boolean;
}
const hasColumn = (value) => value === false;

const isSameDate = (departure: IDeparture, nextDay) => {
  if (!departure) {
    return false;
  }
  const depDate = new Date(
    (departure.realtimeDeparture + departure.serviceDay) * 1000
  );

  return depDate.getDate() === nextDay.getDate();
};

/*
  Formats rows for a single column
  Returns a list of rows, date of last row and the index of remaining departures
*/
const singleCol = (
  departures: IDeparture[],
  nRows: number,
  date: number,
  departuresIndex: number,
  currentLang: string
) => {
  const rows = Array(nRows)
    .fill(null)
    .map((_, rowIndex) => {
      const departure = departures[departuresIndex];
      if (departure) {
        if (isSameDate(departure, setDate(date))) {
          departuresIndex++;
          return { departure, dayDivider: null, empty: false };
        } else {
          // if next departure is on a different day, add day divider
          // unless it's the last row of the column
          if (!(rowIndex === nRows - 1)) {
            date++;
            return {
              departure: null,
              dayDivider: formatDate(setDate(date), currentLang),
              empty: false,
            };
          } else {
            return {
              departure: null,
              dayDivider: null,
              empty: true,
            };
          }
        }
      } else {
        // if no more departures, return empty rows
        return { departure: null, dayDivider: null, empty: true };
      }
    });
  return { rows, date, departuresIndex };
};

// Processess rows for a monitor containing a single stop display
const formatSingleDisplay = (
  departures: IDeparture[],
  leftColumnSize: number,
  rightColumnSize: number,
  currentLang: string
) => {
  const {
    rows: leftRows,
    date,
    departuresIndex,
  } = singleCol(departures, leftColumnSize, 0, 0, currentLang);
  //console.log(date, index)
  const { rows: rightRows } = singleCol(
    departures,
    rightColumnSize,
    date as number,
    departuresIndex as number,
    currentLang
  );
  //console.log(rightRows)

  return [leftRows, rightRows];
};

// Processes rows for a multi display monitor (where right side has dedicated departures)
const formatMultiDisplay = (
  departuresLeft: IDeparture[],
  departuresRight: IDeparture[],
  leftColumnSize: number,
  rightColumnSize: number,
  currentLang: string
) => {
  const { rows: leftRows } = singleCol(
    departuresLeft,
    leftColumnSize,
    0,
    0,
    currentLang,
  );
  const { rows: rightRows } = singleCol(
    departuresRight,
    rightColumnSize,
    0,
    0,
    currentLang,
  );
  return [leftRows, rightRows];
};

const MonitorRowContainer: FC<IProps> = ({
  viewId,
  departuresLeft,
  departuresRight,
  rightStops,
  leftStops,
  currentLang,
  layout,
  isLandscape,
  alertState,
  alertComponent,
  alertRowSpan,
  showMinutes,
  closedStopViews,
  preview,
}) => {
  const [t] = useTranslation();
  const DATE_FORMAT = "dd.MM.yyyy HH:mm";
  const { leftColumnCount, rightColumnCount, isMultiDisplay, tighten } =
    getLayout(layout);

  const isTighten = tighten !== undefined;
  const hasRouteColumn = [];
  leftStops.forEach((s) => {
    if (s.settings && s.settings.showRouteColumn !== undefined) {
      hasRouteColumn.push(s.settings.showRouteColumn);
    } else {
      hasRouteColumn.push(true);
    }
  });
  const withoutRouteColumn = hasRouteColumn.every(hasColumn);
  const withTwoColumns = isLandscape && rightColumnCount > 0;
  let leftColumnCountWithAlerts = leftColumnCount;
  if (alertComponent && layout < 12) {
    leftColumnCountWithAlerts -= alertRowSpan;
  }
  //console.log(departuresLeft);
  const [leftRows, rightRows] = isMultiDisplay
    ? formatMultiDisplay(
        departuresLeft,
        departuresRight,
        leftColumnCount,
        rightColumnCount,
        currentLang
      )
    : formatSingleDisplay(
        departuresLeft,
        leftColumnCount,
        rightColumnCount,
        currentLang
      );
  //console.log(leftRows, rightRows);

  const leftColumn = leftRows.map(({ departure, dayDivider, empty }, i) => (
    <MonitorRow
      key={departure ? stoptimeSpecificDepartureId(departure) : `row_l${i}`}
      departure={departure}
      isFirst={i === 0}
      showVia={
        layout < 4 ||
        layout === 12 ||
        (layout === 16 && i < 4) ||
        leftColumnCount === 4
      }
      isTwoRow={
        leftColumnCount === 4 || layout === 12 || (layout === 16 && i < 4)
      }
      withTwoColumns={withTwoColumns}
      alertState={alertState}
      stops={leftStops}
      currentLang={currentLang}
      dayForDivider={dayDivider}
      showMinutes={showMinutes || 0}
      withoutRouteColumn={withoutRouteColumn}
    />
  ));

  const rightColumn = rightRows.map(({ departure, dayDivider, empty }, i) => (
    <MonitorRow
      key={departure ? stoptimeSpecificDepartureId(departure) : `row_r${i}`}
      departure={departure}
      isFirst={i === 0}
      showVia={
        layout < 4 ||
        layout === 12 ||
        (layout === 16 && i < 4) ||
        leftColumnCount === 4
      }
      isTwoRow={
        leftColumnCount === 4 || layout === 12 || (layout === 16 && i < 4)
      }
      withTwoColumns={withTwoColumns}
      alertState={alertState}
      stops={leftStops}
      currentLang={currentLang}
      dayForDivider={dayDivider}
      showMinutes={showMinutes || 0}
      withoutRouteColumn={withoutRouteColumn}
    />
  ));
  const headers = (columns, stops) => {
    let withStopCode = false;
    stops.forEach((s) => {
      if (s.settings?.showStopNumber) {
        withStopCode = true;
      }
    });

    const hasRouteColumn = [];
    stops.forEach((s) => {
      if (s.settings && s.settings.showRouteColumn !== undefined) {
        hasRouteColumn.push(s.settings.showRouteColumn);
      } else {
        hasRouteColumn.push(true);
      }
    });

    if (stops.length === 0 && hasRouteColumn.length === 0) {
      hasRouteColumn.push(true);
    }

    const withoutRouteColumn = hasRouteColumn.every(hasColumn);
    return (
      <div
        className={cx(
          "grid-headers",
          `rows${isTighten ? tighten[0] : columns}`,
          {
            tightened: isTighten,
            portrait: !isLandscape,
            "two-cols": withTwoColumns,
          }
        )}
      >
        <div
          className={cx(
            "grid-row",
            { "with-stop-code": withStopCode },
            { "without-route-column": withoutRouteColumn }
          )}
        >
          {!withoutRouteColumn && (
            <div className={cx("grid-header", "line")}>
              {t("lineId", { lng: currentLang })}
            </div>
          )}
          <div className={cx("grid-header", "destination")}>
            {t("destination", { lng: currentLang })}
          </div>
          {withStopCode && (
            <div className={cx("grid-header", "platform-code")}>
              {t("platform-or-stop", { lng: currentLang })}
            </div>
          )}
          <div className={cx("grid-header", "time")}>
            {t("departureTime", { lng: currentLang })}
          </div>
        </div>
      </div>
    );
  };

  const closedStopIndex = closedStopViews.findIndex((s) => s.viewId === viewId);
  const isClosedStopOnLeft =
    closedStopIndex !== -1 &&
    closedStopViews[closedStopIndex].column === "left";
  const isClosedStopOnRight =
    closedStopIndex !== -1 &&
    closedStopViews[closedStopIndex].column === "right";

  const noKnownDeparturesLeft =
    !departuresLeft.length &&
    !leftStops.every((s) => s.settings?.allRoutesHidden);
  const noKnownDeparturesRight =
    !departuresRight.length &&
    !rightStops.every((s) => s.settings?.allRoutesHidden);

  return (
    <div
      className={cx("monitor-container", {
        preview: preview,
        portrait: !isLandscape,
        "two-cols": withTwoColumns,
        tightened: isTighten,
      })}
    >
      <div
        className={cx("grid", {
          portrait: !isLandscape,
          "two-cols": withTwoColumns,
        })}
      >
        {headers(leftColumnCount, leftStops)}
        {isTighten && departuresLeft.length > 0 && (
          <div
            className={cx("grid-rows portrait tightened", `rows${tighten[0]}`)}
          >
            {leftColumn.slice(0, tighten[0])}
          </div>
        )}
        <div
          className={cx(
            "grid-rows",
            `rows${isTighten ? tighten[1] : leftColumnCount}`,
            {
              portrait: !isLandscape,
              "two-cols": withTwoColumns,
              tightened: isTighten,
              "no-departures": isClosedStopOnLeft || noKnownDeparturesLeft,
            }
          )}
        >
          {!isClosedStopOnLeft && !noKnownDeparturesLeft ? (
            <>{isTighten ? leftColumn.slice(tighten[0]) : leftColumn}</>
          ) : (
            <div className="no-departures-text-container">
              <div
                className={cx("no-departures-text", {
                  "closed-stop": isClosedStopOnLeft,
                })}
              >
                {isClosedStopOnLeft
                  ? t("closedStopWithRange", {
                      lng: currentLang,
                      name: closedStopViews[closedStopIndex].name,
                      code: closedStopViews[closedStopIndex].code,
                      startTime: formattedDateTimeFromSeconds(
                        closedStopViews[closedStopIndex].startTime,
                        DATE_FORMAT
                      ),
                      endTime: formattedDateTimeFromSeconds(
                        closedStopViews[closedStopIndex].endTime,
                        DATE_FORMAT
                      ),
                    })
                  : t("no-departures", { lng: currentLang })}
              </div>
            </div>
          )}
          {alertComponent}
        </div>
      </div>
      {isLandscape && rightColumnCount > 0 && (
        <>
          <div className="divider" />
          {true && (
            <div className={cx("grid", { "two-cols": withTwoColumns })}>
              {headers(
                rightColumnCount,
                isMultiDisplay ? rightStops : leftStops
              )}
              <div
                className={cx("grid-rows", `rows${rightColumnCount}`, {
                  "two-cols": withTwoColumns,
                  "no-departures":
                    isClosedStopOnRight || noKnownDeparturesRight,
                })}
              >
                {isClosedStopOnRight || noKnownDeparturesRight ? (
                  <>
                    <div className="no-departures-text-container">
                      <div
                        className={cx("no-departures-text", {
                          "closed-stop": isClosedStopOnRight,
                        })}
                      >
                        {isClosedStopOnRight
                          ? t("closedStopWithRange", {
                              lng: currentLang,
                              name: closedStopViews[closedStopIndex].name,
                              code: closedStopViews[closedStopIndex].code,
                              startTime: formattedDateTimeFromSeconds(
                                closedStopViews[closedStopIndex].startTime,
                                DATE_FORMAT
                              ),
                              endTime: formattedDateTimeFromSeconds(
                                closedStopViews[closedStopIndex].endTime,
                                DATE_FORMAT
                              ),
                            })
                          : t("no-departures", { lng: currentLang })}
                      </div>
                    </div>
                    {alertComponent && <div className="alert-padding"></div>}
                  </>
                ) : (
                  <>{rightColumn}</>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MonitorRowContainer;
