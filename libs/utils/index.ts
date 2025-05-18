import { format } from 'date-fns';
import { getParamByParam } from 'iso-country-currency';
import { pickBy } from 'lodash';
import qs from 'qs';

import { DATE_TIME_FORMAT_DEFAULT } from '@/base/constants/common';
import { DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER } from '@/base/constants/validation';
import { RolloverStatus } from '@/base/types/common';
import { TransactionStatus } from '@/types/common';

import { isIsoFormat, isValidDate } from './validate';

export * from './copyClipboard';
export * from './pageTitle';
export * from './validate';

const customPredicate = (value: any, key: string) => {
  return value !== undefined || value === 0;
};

export const stringifyParams = (data: any) => {
  const { params, option } = data;
  const newParams = pickBy(params, customPredicate);
  return qs.stringify(newParams, {
    encode: false,
    skipNulls: true,
    strictNullHandling: true,
    ...option,
  });
};

export function createDate(date: Date | number | string) {
  if (typeof date === 'string' && isIsoFormat(date)) {
    return new Date(date);
  }
  return new Date(typeof date === 'string' ? date.replace(DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER) : date);
}

export function formatDate(date: Date | number | string | undefined, dateFormat = DATE_TIME_FORMAT_DEFAULT) {
  if (!date || !isValidDate(date)) return '';
  const newDate: Date = createDate(date);
  return format(newDate, dateFormat).toString();
}

export function titleCase(text: string) {
  var splitStr = text.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

export function getMessageMetamask(account: string) {
  let message = `Welcome to Bonenza.com!
        This request will not trigger a blockchain transaction or cost any gas fees.
        Your authentication status will reset after 24 hours.
        Wallet address:${account}`;
  return message;
}

export const transformWalletAddress = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^([a-zA-Z0-9]{7})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

export const transformUUID = (id: string, dots = 3) => {
  if (!id) return 'NO Account';
  return `${id.slice(0, 7)}${' .'.repeat(dots)}${id.slice(-4)}`;
};

export function removeTrailingZeros(str: string) {
  let num = parseFloat(str); // Convert the string to a number
  let formattedString = num.toString(); // Convert the number back to a string

  // Check if the string contains a decimal point
  if (formattedString.includes('.')) {
    // Remove trailing zeros after the decimal point
    formattedString = formattedString.replace(/(\.\d*?[1-9])0+$/g, '$1');
  }
  return formattedString.slice(1);
}

export function currencyFormat(num: number, fixedNumber: number = 4) {
  if (!num) return Number(0).toFixed(fixedNumber);
  if (Number(num) < 0.01) {
    let numFixed = Number(Number(num)?.toFixed(fixedNumber));
    let integer = Math.abs(Math.trunc(numFixed));
    let decimal = Math.abs(numFixed) - Math.floor(Math.abs(numFixed));
    let decimalString = removeTrailingZeros(String(Number(decimal).toFixed(fixedNumber)).slice(1));
    if (decimal === 0) {
      for (let i = fixedNumber; i <= 8; i++) {
        numFixed = Number(Number(num)?.toFixed(i));
        integer = Math.abs(Math.trunc(numFixed));
        decimal = Math.abs(numFixed) - Math.floor(Math.abs(numFixed));
        decimalString = removeTrailingZeros(String(Number(decimal).toFixed(i)).slice(1));
        if (decimal !== 0) {
          break;
        }
      }
    }

    const minusSymbol = numFixed < 0 ? '-' : '';
    return minusSymbol + String(integer).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + decimalString;
  }
  const numFixed = Number(Number(num)?.toFixed(fixedNumber));
  const integer = Math.abs(Math.trunc(numFixed));
  const decimal = Math.abs(numFixed) - Math.floor(Math.abs(numFixed));
  const minusSymbol = numFixed < 0 ? '-' : '';
  return (
    minusSymbol +
    String(integer).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
    String(Number(decimal).toFixed(fixedNumber)).slice(1)
  );
}

export const handleLocaleSymbol = (givenParamValue: string) => {
  try {
    if (!givenParamValue) return '$';
    if (givenParamValue === 'RUB') return '₽';
    if (givenParamValue === 'MAD') return 'د.م.';
    if (givenParamValue === 'IRR') return '﷼';
    return getParamByParam('currency', givenParamValue, 'symbol');
  } catch (error) {
    return '';
  }
};

export const formatLengthNumber = (num: number | string, length?: number) => {
  if (!length) length = 9;
  if (!num) return Number(0).toFixed(length);
  let zeroCount = -Math.floor(Math.log10(Number(num)));
  if (zeroCount > length / 2 && Number(num) > 0) {
    let nonZeros = '';
    let numberString = new Intl.NumberFormat('en', { maximumFractionDigits: length, minimumFractionDigits: 2 })
      .format(Number(num))
      .toString();
    for (let i = zeroCount + 1; i < (numberString.length > zeroCount + 5 ? zeroCount + 5 : numberString.length); i++) {
      nonZeros += numberString[i];
    }
    const res = `0.(${zeroCount - 1})${nonZeros}`;
    return res;
  }
  // const integerNumber = Math.abs(Number(num)).toString().split('.')[0];
  // if (integerNumber.length > 9) return Math.abs(Number(num));
  // console.log('-----390', integerNumber.length);
  // const missLength = length - integerNumber.length > 0 ? length - integerNumber.length : length;
  // console.log(missLength, '------392');
  return formatCompactNumber(Number(num), {
    maximumFractionDigits: length,
    minimumFractionDigits: 2,
  });
};

export const snakeCaseToString = (str?: string) => {
  try {
    return String(str)
      .split('_')
      .filter((x) => x.length > 0)
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
      .join(' ');
  } catch (error) {
    return '';
  }
};

export const convertUserInfo = (userData: any) => {
  return {
    userId: userData?.id,
    userName: userData?.name,
    email: userData?.email,
    phone: userData?.phone,
    wallet: userData?.wallet,
    avatar: userData?.avatar,
    betCount: userData?.betCount,
    winCount: userData?.winCount,
    totalWager: userData?.totalWager,
    referralCode: userData?.referralCode,
    isKyc: userData.kyc || 1,
    // isKyc: KYC_ENUM.REQUIRED,
    tfa: userData?.tfa,
    createdAt: userData?.createdAt,
    updatedAt: userData?.updatedAt,
    restrictedTo: userData?.restrictedTo,
    disabledWithdraw: userData?.disabledWithdraw,
    generalSetting: {
      settingShowFullNameCrypto: userData?.settingShowFullNameCrypto,
      settingReceiveMarketPromotion: userData?.settingReceiveMarketPromotion,
      settingLanguage: userData?.settingLanguage,
      settingCurrency: userData?.settingFiatCurrency?.id ?? '',
      settingViewInFiat: userData?.settingViewInFiat,
    },
    privacySetting: {
      settingHideUserName: userData?.settingHideUserName,
      settingHideGamingData: userData?.settingHideGamingData,
      settingRefuseTipFromStrangers: userData?.settingRefuseTipFromStrangers,
    },
    verifiedSetting: {
      emailVerified: userData?.emailVerified,
      phoneVerified: userData?.phoneVerified,
    },
  };
};

export function formatCompactNumber(number: number, setting: any) {
  try {
    const res = Intl.NumberFormat('en', setting).format(number);
    return res;
  } catch (error) {
    return 0;
  }
}

export function currencyFormat1(
  value: number,
  zeroNum: number,
  currency: string = 'USD',
  flag: boolean = true,
  notation = false,
) {
  try {
    let i = 0,
      pow = 1;
    for (i = 0; i < zeroNum; i++) pow = pow * 10;
    const number = Math.floor(value * pow) / pow;
    let res = '';
    const symbol = flag ? handleLocaleSymbol(currency) : '';
    if (!number && number === 0) {
      res = new Array(2).fill('0').join('');
      res = `${symbol} 0.` + res;
      return res;
    }
    let zeroCount = -Math.floor(Math.log10(number));
    if (zeroNum < 5) {
      res = formatCompactNumber(
        number,
        notation
          ? {
              maximumFractionDigits: zeroNum,
              minimumFractionDigits: 2,
              notation: 'compact',
            }
          : {
              maximumFractionDigits: zeroNum,
              minimumFractionDigits: 2,
            },
      ).toString();
      return `${symbol} ${res}`;
    }
    if (zeroCount < zeroNum) {
      res = formatCompactNumber(
        number,
        notation
          ? {
              maximumFractionDigits: zeroNum,
              minimumFractionDigits: 2,
              notation: 'compact',
            }
          : {
              maximumFractionDigits: zeroNum,
              minimumFractionDigits: 2,
            },
      ).toString();
      return `${symbol} ${res}`;
    }
    const miniZeroNum = zeroNum > 5 ? zeroNum : 5;
    let numberString = new Intl.NumberFormat('en', { maximumFractionDigits: miniZeroNum - 1 })
      .format(number)
      .toString();
    if (zeroCount > miniZeroNum) {
      let nonZeros = '';
      for (
        let i = zeroCount + 1;
        i < (numberString.length > zeroCount + 5 ? zeroCount + 5 : numberString.length);
        i++
      ) {
        nonZeros += numberString[i];
      }
      res = `0.(${zeroCount - 1})${nonZeros}`;
    } else {
      res = formatCompactNumber(
        number,
        notation
          ? {
              maximumFractionDigits: zeroNum,
              minimumFractionDigits: 2,
              notation: 'compact',
            }
          : {
              maximumFractionDigits: zeroNum,
              minimumFractionDigits: 2,
            },
      ).toString();
    }
    return `${symbol} ${res}`;
  } catch (error) {
    return '';
  }
}

export function numberWithRounding(number: number, zeroNum: number) {
  try {
    const res = formatCompactNumber(number, {
      minimumFractionDigits: 2,
      maximumFractionDigits: zeroNum,
      roundingPriority: 'morePrecision',
      roundingMode: 'ceil',
    });
    return res;
  } catch (error) {
    return 0;
  }
}

export const getColorByStatus = (status: TransactionStatus | RolloverStatus) => {
  let bgColor = '';
  switch (status) {
    case 'processing':
      bgColor = 'bg-[#efef19]';
      break;
    case 'pending':
      bgColor = 'bg-[#efef19]';
      break;
    case 'refunding':
      bgColor = 'bg-[#efef19]';
      break;
    case 'rejected':
      bgColor = 'bg-[#c31414]';
      break;
    case 'failed':
      bgColor = 'bg-[#c31414]';
      break;
    case 'ongoing':
      bgColor = 'bg-[#efef19]';
      break;
    case 'not_started':
      bgColor = 'bg-[#c31414]';
      break;
    default:
      bgColor = 'bg-[#3BC117]';
      break;
  }
  return bgColor;
};
export const convertStatus = (status: TransactionStatus) => {
  let newStatus = '';
  switch (status) {
    case 'processing':
      newStatus = 'processing';
      break;
    case 'pending':
      newStatus = 'pending';
      break;
    case 'refunding':
      newStatus = 'processing';
      break;
    case 'failed':
      newStatus = 'failed';
      break;
    case 'rejected':
      newStatus = 'rejected';
      break;
    case 'approved':
      newStatus = 'success';
      break;
    default:
      newStatus = status;
      break;
  }
  return newStatus?.charAt(0)?.toUpperCase() + newStatus?.slice(1);
};

export const getDuration = (time: string) => {
  const before = new Date().getTime() - new Date(time).getTime();
  if (before > 24 * 60 * 60 * 1000) {
    const _d_res = Math.floor(before / (24 * 60 * 60 * 1000));
    return `${_d_res}d`;
  }
  if (before > 60 * 60 * 1000) {
    const _h_res = Math.floor(before / (60 * 60 * 1000));
    return `${_h_res}h`;
  }
  if (before > 60 * 1000) {
    const _m_res = Math.floor(before / (60 * 1000));
    return `${_m_res}m`;
  }
  return 'now';
};

export const roundDeciamls = (val: number, decimals: number) => {
  const roundedVal = Math.floor(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return roundedVal;
};

export const checkFiletypes = (type: string, avaTypes: string[]) => {
  return avaTypes.includes(type);
};

export const getSizeOfFileByMega = (size: number) => {
  return size / 1024 / 1024;
};
