import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import isNil from 'lodash.isnil';
import { GetServerSidePropsContext } from 'next';

import { ObjectLiteral } from '@/base/types/common';
import { stringifyParams } from '@/libs/utils';

const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: process.env.API_URL,
  timeout: 30000,
  paramsSerializer: {
    serialize: (params) =>
      stringifyParams({
        params: decamelizeKeys({ ...params }),
        option: {
          encode: !isNil(params?.tags) || false,
        },
      }),
  },
};

let cookieData: ObjectLiteral;
export const setupAxiosSSR = (context: GetServerSidePropsContext) => {
  cookieData = context.req.cookies;
};

export const getAccessToken = () => `Bearer ${cookieData.accessToken}`;
export const getRefreshToken = () => cookieData.refreshToken;
export const getCompanyId = () => cookieData.refreshToken.companyId;

const transformResponse = (response: AxiosResponse) => {
  if (response?.data) {
    return { ...response, data: camelizeKeys(response.data) };
  }
  return response;
};

/* eslint-enable */
/* eslint-disable no-param-reassign, @typescript-eslint/no-non-null-assertion */
const apiSSR = axios.create({
  ...defaultAxiosConfig,
  headers: {
    ...defaultAxiosConfig.headers,
  },
});
apiSSR.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  if (config.data) {
    config.data = decamelizeKeys(config.data);
  }
  if (config.params) {
    config.params = decamelizeKeys(config.params);
  }
  return config;
});
apiSSR.interceptors.response.use(transformResponse);

export default apiSSR;
