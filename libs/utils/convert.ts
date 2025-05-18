import { EXTENSION_IMG_AFTER_CROP, TYPE_IMG_AFTER_CROP } from '@/base/constants/common';
import { camelize, decamelize } from 'humps';

const changeExtension = (fileName: string, extension: string) => {
  const ext = fileName.split('.').pop();
  const root = ext ? fileName.substring(0, fileName.length - ext.length) : '';
  return `${root}${extension}`;
};

export function canvasToBlob(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], changeExtension(fileName, EXTENSION_IMG_AFTER_CROP), {
          type: TYPE_IMG_AFTER_CROP,
        });
        resolve(file);
      }
    }, TYPE_IMG_AFTER_CROP);
  });
}

export function camelToSnake(value: string) {
  return value.replace(/[\w]([A-Z])/g, (m) => `${m[0]}_${m[1]}`).toLowerCase();
}

export function byteToMegabyte(input: number, numFixed?: number) {
  const result = input / 1024 / 1024;
  return numFixed || numFixed === 0 ? result.toFixed(numFixed) : result;
}

export function convertToUrlCase(str: string) {
  let url = str.replace(':', '-');
  url = url.toLowerCase();
  return url;
}

export function convertGameIdentifierToUrl(identifier: string) {
  if (!identifier) return '';
  const [provider, game] = identifier.split(':');
  const removedSpecialCharacterGame = game.replace(/[^\w\s]/g, '');
  const url = `${decamelize(removedSpecialCharacterGame, { separator: '-' })}-by-${decamelize(provider, {
    separator: '-',
  })}`;
  return encodeURIComponent(url);
}

export function convertUrlToGameIdentifier(url: string) {
  const _url = decodeURIComponent(url);
  const [game, provider] = _url.split('-by-');
  const providerIdentifier = provider.split('-').join('');
  const gameIdentifier = game.split('-').join('');
  const identifier = `${providerIdentifier}:${gameIdentifier}`;
  return identifier;
}

export function convertThemeToUrl(url: string) {
  const _url = url.toLowerCase().replaceAll(' ', '-');
  return _url;
}

export function convertUrlToTheme(url: string) {
  const _url = url.replaceAll('-', ' ');
  return _url;
}

export function convert2Url(str: string) {
  const urlString = str.toLowerCase().replace(/\s+/g, '-');
  return urlString;
}

export function convertNumber2String(value: number, floatLength: number) {
  return (Math.floor(value * Math.pow(10, floatLength)) / Math.pow(10, floatLength)).toFixed(floatLength);
}
