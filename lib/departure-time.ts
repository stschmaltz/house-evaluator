import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import {
  isWeekend,
  addDays,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from 'date-fns';

const MOUNTAIN_TIMEZONE = 'America/Denver';

/**
 * Gets the next weekday at the specified Mountain Time and returns it as a UTC ISO timestamp.
 * @param time - Time in "HH:mm" format (Mountain Time)
 * @returns ISO timestamp string in UTC (e.g., "2023-12-07T15:00:00.000Z")
 */
export function getNextWeekdayTime(time: string): string {
  const now = new Date();
  const nowInMountain = toZonedTime(now, MOUNTAIN_TIMEZONE);

  // Parse the input time (format: "HH:mm")
  const [hours, minutes] = time.split(':').map(Number);

  // Create target time for today in Mountain time
  let targetDate = setMilliseconds(
    setSeconds(setMinutes(setHours(nowInMountain, hours), minutes), 0),
    0,
  );

  // If target time hasn't passed today and today is a weekday, use today
  if (!isAfter(nowInMountain, targetDate) && !isWeekend(targetDate)) {
    // Convert Mountain Time to UTC and return ISO timestamp
    const utcDate = fromZonedTime(targetDate, MOUNTAIN_TIMEZONE);
    return utcDate.toISOString();
  }

  // Otherwise, find the next upcoming weekday
  do {
    targetDate = addDays(targetDate, 1);
  } while (isWeekend(targetDate));

  // Set the correct time for the next weekday
  targetDate = setMilliseconds(
    setSeconds(setMinutes(setHours(targetDate, hours), minutes), 0),
    0,
  );

  // Convert Mountain Time to UTC and return ISO timestamp
  const utcDate = fromZonedTime(targetDate, MOUNTAIN_TIMEZONE);
  return utcDate.toISOString();
}

/**
 * Gets the next weekday at 8:00 AM Mountain Time as a UTC ISO timestamp.
 * @returns ISO timestamp string in UTC
 */
export function getNextWeekday8AM(): string {
  return getNextWeekdayTime('08:00');
}
