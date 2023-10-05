interface ILayout {
  leftColumnCount: number;
  rightColumnCount: number;
  isMultiDisplay?: boolean;
  isPortrait?: boolean;
  tighten?: Array<number>;
  alertSpan?: number;
}

export const getLayout = (layout: number): ILayout => {
  switch (layout) {
    case 1:
      return {
        leftColumnCount: 4,
        rightColumnCount: 0,
        alertSpan: 1,
      };
    case 2:
      return {
        leftColumnCount: 8,
        rightColumnCount: 0,
        alertSpan: 2,
      };
    case 3:
      return {
        leftColumnCount: 12,
        rightColumnCount: 0,
        alertSpan: 3,
      };
    case 4:
      return {
        leftColumnCount: 4,
        rightColumnCount: 4,
        alertSpan: 1,
      };
    case 5:
      return {
        leftColumnCount: 8,
        rightColumnCount: 8,
        alertSpan: 2,
      };
    case 6:
      return {
        leftColumnCount: 12,
        rightColumnCount: 12,
        alertSpan: 3,
      };
    case 7:
      return {
        leftColumnCount: 4,
        rightColumnCount: 8,
        alertSpan: 1,
      };
    case 8:
      return {
        leftColumnCount: 8,
        rightColumnCount: 12,
        alertSpan: 2,
      };
    case 9:
      return {
        leftColumnCount: 4,
        rightColumnCount: 4,
        isMultiDisplay: true,
        alertSpan: 1,
      };
    case 10:
      return {
        leftColumnCount: 8,
        rightColumnCount: 8,
        isMultiDisplay: true,
        alertSpan: 2,
      };
    case 11:
      return {
        leftColumnCount: 12,
        rightColumnCount: 12,
        isMultiDisplay: true,
        alertSpan: 3,
      };
    case 12:
      return {
        leftColumnCount: 8,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
      };
    case 13:
      return {
        leftColumnCount: 12,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
      };
    case 14:
      return {
        leftColumnCount: 16,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
      };
    case 15:
      return {
        leftColumnCount: 24,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
      };
    case 16:
      return {
        leftColumnCount: 10,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        tighten: [4, 6],
        alertSpan: 1,
      };
    case 17:
      return {
        leftColumnCount: 18,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        tighten: [6, 12],
        alertSpan: 1,
      };
    case 18:
      return {
        leftColumnCount: 0,
        rightColumnCount: 0,
      };
    case 19:
      return {
        leftColumnCount: 0,
        rightColumnCount: 0,
        isPortrait: true,
      };
    case 20:
      return {
        leftColumnCount: 0,
        rightColumnCount: 0,
      };
    case 21:
      return {
        leftColumnCount: 0,
        rightColumnCount: 0,
        isPortrait: true,
      };
  }
};

export const getAlertRowSpanForLayouts = (views, current) => {
  const alertRowSpans = views.map(view => {
    const { leftColumnCount, rightColumnCount } = getLayout(view.layout);
    let alertRowSpan = 1;
    if (leftColumnCount === 8 && rightColumnCount === 12) {
      alertRowSpan = 2;
    } else if (leftColumnCount > 10) {
      alertRowSpan = 2;
    }
    return alertRowSpan;
  });
  return Math.max(...alertRowSpans);
};

export function getLoginUri(configName) {
  switch (configName) {
    case 'tampere':
    case 'jyvaskyla':
    case 'vaasa':
    case 'oulu':
      return 'waltti-login';
    case 'hsl':
      return 'hsl-login?url=/&';
    default:
      return '';
  }
}

export const getRouteCodeColumnWidth = (departures, view, windowHeight) => {
  const { leftColumnCount, rightColumnCount } = getLayout(view.layout);

  const departuresOnScreen = departures[0]
    .slice(0, 8)
    .concat(departures[1].slice(0, leftColumnCount + rightColumnCount));
  const longestRouteCodeLength = departuresOnScreen.reduce((a, b) => {
    return a.trip?.route.shortName?.length > b.trip?.route.shortName?.length
      ? a
      : b;
  }, departuresOnScreen[0]).trip?.route.shortName?.length;

  const routeCodeLength =
    longestRouteCodeLength < 2 ? 2 : longestRouteCodeLength; // Allow space for column titles when the code itself is too short.
  const nonDepartureRowHeight = windowHeight * 0.1; // 10% of the view space is not departure rows but logos and titles.
  const rowHeight = (windowHeight - nonDepartureRowHeight) / leftColumnCount;
  const minRowsBeforeNoMargin = 15; // Larger views have little to no space between text and line.

  // Magical 25% base margin multiplied by how many times the rows would fit into the biggest view that still has margins = smaller views get more margin.
  const marginPercentage = 0.25 * (minRowsBeforeNoMargin / leftColumnCount);

  // No margin in large views, smaller views have margin by percentage.
  const nonTextSpaceHeightInRow =
    leftColumnCount > minRowsBeforeNoMargin ? 0 : rowHeight * marginPercentage;

  const pixelsPerCharacter = (rowHeight - nonTextSpaceHeightInRow) / 2; // divided by two because font is taller than wide.
  return routeCodeLength * pixelsPerCharacter;
};
