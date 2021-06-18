export type DaySeconds = number;
export type Hours = number;
export type Minutes = number;
export type Seconds = number;
export type Milliseconds = number;
export type EpochMilliseconds = Milliseconds;
export type EpochSecondsLocal = Milliseconds;

export interface ITimeOfDay {
  hours: Hours;
  minutes: Minutes;
  seconds: Seconds;
}

export const parseDaySeconds = (daySeconds: DaySeconds): ITimeOfDay => ({
  hours: Math.floor(daySeconds / (60 * 60)),
  minutes: Math.floor(daySeconds / 60) % 60,
  seconds: daySeconds % 60,
});

const doubleDigit = (num: string | number) => num.toString().padStart(2, '0');

export interface IFormatTimeOptions {
  showSeconds?: boolean;
}

export const formatTime = (
  timeOfDay: ITimeOfDay,
  options: IFormatTimeOptions = {},
): string =>
  `${doubleDigit(timeOfDay.hours)}:${doubleDigit(timeOfDay.minutes)}${
    options.showSeconds ? `:${doubleDigit(timeOfDay.seconds)}` : ''
  }`;

export const getStartTimeWithColon = time => {
  const hours = `0${Math.floor((time / 60 / 60) % 24)}`.slice(-2);
  const mins = `0${Math.floor(time / 60) % 60}`.slice(-2);
  if (hours !== 'aN' || mins !== 'aN') {
    return `${hours}:${mins}`;
  }
  return null;
};
