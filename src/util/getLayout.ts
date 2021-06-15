export const getLayout = (layout: number) => {
  switch (layout) {
    case 1:
      return [4, 0, false];
    case 2:
      return [8, 0, false];
    case 3:
      return [12, 0, false];
    case 4:
      return [4, 4, false];
    case 5:
      return [8, 8, false];
    case 6:
      return [12, 12, false];
    case 7:
      return [4, 8, false];
    case 8:
      return [8, 12, false];
    case 9:
      return [4, 4, true];
    case 10:
      return [8, 8, true];
    case 11:
      return [12, 12, true];
  }
};
