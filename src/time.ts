import { DateTime } from 'luxon';

export type DaySeconds = number;
export type Hours = number;
export type Minutes = number;
export type Seconds = number;
export type Milliseconds = number;
export type EpochMilliseconds = Milliseconds;
export type EpochSecondsLocal = Seconds;

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

export const getDepartureTime = (time, minutesThreshold) => {
  const secondsFromMidnight = new Date().setHours(0,0,0,0)
  if ((time-(getCurrentSeconds()- (secondsFromMidnight / 1000) )) < minutesThreshold) {
    const diffInMinutes = Math.floor((time-(getCurrentSeconds()- (secondsFromMidnight / 1000) )) / 60);
    return (diffInMinutes < 0 ? 0 : diffInMinutes).toString();
  }
  const hours = `0${Math.floor((time / 60 / 60) % 24)}`.slice(-2);
  const mins = `0${Math.floor(time / 60) % 60}`.slice(-2);
  if (hours !== 'aN' || mins !== 'aN') {
    return `${hours}:${mins}`;
  }
  return null;
};

export const formatDate = date => {
  const newDate = DateTime.fromISO(date.toISOString())
    .setLocale('fi')
    .toFormat('EEEE d.M.yyyy');
  return newDate.charAt(0).toUpperCase() + newDate.slice(1);
};

export const getCurrentSeconds = () => {
  return Number(DateTime.now().toSeconds().toFixed(0));
};

export const setDate = daysToAdd => {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + daysToAdd);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};
