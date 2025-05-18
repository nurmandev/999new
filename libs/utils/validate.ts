import { isValid } from 'date-fns';

import { USER_ROLE_DEFAULT } from '@/base/constants/auth';
import { DATE_DASH_DELIMITER_REGEX, DATE_ISO_FORMAT, DATE_VALID_DELIMITER } from '@/base/constants/validation';

export const isDecimalNumber = (num: number | string) => {
  if (!num) return false;
  return !!Math.abs(Number(num)).toString().split('.')[1];
};

export const isEmail = (email: string = '') => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isPhone = (phone: string) => {
  const pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  return pattern.test(phone);
};

export function isIsoFormat(str: string) {
  return DATE_ISO_FORMAT.test(str);
}

export function isIsoDate(str: string) {
  if (!isIsoFormat(str)) return false;
  const d = new Date(str);
  const numSub = 19;
  return d instanceof Date && !Number.isNaN(d) && d.toISOString().substring(0, numSub) === str.substring(0, numSub);
}

export function isValidDate(date: Date | number | string | undefined, options?: { strictMode?: boolean }) {
  if (!date) return false;
  if (typeof date !== 'string') return isValid(date);

  // String format
  const newDateString = date.replace(DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER);
  if (!options?.strictMode) {
    if (isIsoFormat(date)) return isValid(date);
    return isValid(new Date(newDateString));
  }

  // Check strick mode
  if (isIsoFormat(date)) return isIsoDate(date);
  const [year, month, day] = newDateString.split(DATE_VALID_DELIMITER).map((val) => {
    const newVal = val.split(' ')[0];
    return Number(newVal);
  });
  const newDate = new Date(newDateString);
  return newDate.getFullYear() === year && newDate.getMonth() === month - 1 && newDate.getDate() === day;
}

export function isAdminOfCompany(role?: string) {
  return USER_ROLE_DEFAULT.SUPER_ADMIN === role;
}

export function isEmpty(data: any) {
  return data === '' || data === null || data === undefined || data === 'undefined';
}
