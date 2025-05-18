import { COLOR_CODE_REGEX } from '@/base/constants/validation';

function hexToRgbStr(hex: string) {
  const result = COLOR_CODE_REGEX.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '';
}

function changeBasicColor(bgColor: string, color: string) {
  const basicColorRgb = hexToRgbStr(bgColor);
  document.documentElement.style.setProperty('--rgb-basic-color', basicColorRgb);
  document.documentElement.style.setProperty('--basic-color', bgColor);
  document.documentElement.style.setProperty('--text-in-basic-color', color);
}

export { hexToRgbStr, changeBasicColor };
