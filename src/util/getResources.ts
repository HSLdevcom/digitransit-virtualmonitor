interface ILayout {
  leftColumnCount: number;
  rightColumnCount: number;
  isMultiDisplay?: boolean;
  isPortrait?: boolean;
  tighten?: Array<number>;
  alertSpan?: number;
  fontSizeDivider?: number;
  tightenedFontSizeDivider?: number;
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
        fontSizeDivider: 15,
      };
    case 13:
      return {
        leftColumnCount: 12,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
        fontSizeDivider: 18,
      };
    case 14:
      return {
        leftColumnCount: 16,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
        fontSizeDivider: 18,
      };
    case 15:
      return {
        leftColumnCount: 24,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        alertSpan: 1,
        fontSizeDivider: 26,
      };
    case 16:
      return {
        leftColumnCount: 10,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        tighten: [4, 6],
        alertSpan: 1,
        fontSizeDivider: 15,
      };
    case 17:
      return {
        leftColumnCount: 18,
        rightColumnCount: 0,
        isMultiDisplay: false,
        isPortrait: true,
        tighten: [6, 12],
        alertSpan: 1,
        fontSizeDivider: 16,
        tightenedFontSizeDivider: 26,
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

export const getRouteCodeColumnWidth = (departures, view, fontSize) => {
  const { leftColumnCount, rightColumnCount } = getLayout(view.layout);

  const departuresOnScreen = departures[0]
    .slice(0, 8)
    .concat(departures[1].slice(0, leftColumnCount + rightColumnCount));

  const shortestRouteCodeLength = 3;
  const longestRouteCodeLength =
    departuresOnScreen?.reduce((a, b) => {
      const aLengthValue = a?.trip?.route?.shortName?.length;
      const aLength =
        aLengthValue !== undefined && aLengthValue !== null ? aLengthValue : a;
      const bLength = b?.trip?.route?.shortName?.length;
      return bLength === undefined || aLength > bLength ? aLength : bLength;
    }, shortestRouteCodeLength) || shortestRouteCodeLength; // Minimum length to allow space for the column title.

  // How much taller letters are compared to width
  const fontHeightWidthRatio = 1.6;
  return (fontSize / fontHeightWidthRatio) * longestRouteCodeLength;
};
