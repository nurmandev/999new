
import { CookieKey } from '@/base/constants/common';

export const CookiesStorage = {
  getCookieData(key: string) {
    return localStorage.getItem(key);
  },

  setCookieData(key: string, data: string) {
    localStorage.setItem(key, data);
  },

  clearCookieData(key: string) {
    localStorage.removeItem(key);
  },

  getCompanyId() {
    return localStorage.getItem(CookieKey.companyId);
  },

  getAccessToken() {
    return localStorage.getItem(CookieKey.accessToken);
  },

  getRefreshToken() {
    return localStorage.getItem(CookieKey.refreshToken);
  },

  setAccessToken(accessToken: string) {
    localStorage.setItem(CookieKey.accessToken, accessToken);
  },

  setRefreshToken(refreshToken: string) {
    localStorage.setItem(CookieKey.refreshToken, refreshToken);
  },

  clearAccessToken() {
    localStorage.removeItem(CookieKey.accessToken);
  },

  authenticated() {
    const accessToken = localStorage.getItem(CookieKey.accessToken);
    return accessToken !== undefined;
  },

  logout() {
    localStorage.removeItem(CookieKey.accessToken);
    localStorage.removeItem(CookieKey.refreshToken);
    localStorage.removeItem(CookieKey.currentRoles);
    localStorage.removeItem(CookieKey.companyId);
    localStorage.removeItem(CookieKey.email);
    localStorage.removeItem(CookieKey.user);
    localStorage.removeItem(CookieKey.activeFiat);
    sessionStorage.clear();
  },

  setAccountInvalidCode(code: string) {
    localStorage.setItem(CookieKey.accountInvalidCode, code);
  },

  clearAccountInvalidCode() {
    localStorage.removeItem(CookieKey.accountInvalidCode);
  },

  getAccountInvalidCode() {
    return localStorage.getItem(CookieKey.accountInvalidCode);
  },
};
