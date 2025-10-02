import { toZonedTime } from 'date-fns-tz';

const ZONE = 'Africa/Lagos';

export function toLagosTime(date: string | Date) {
  return toZonedTime(date, ZONE);
}
