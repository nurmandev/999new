import { AxiosError } from 'axios';
import { ParsedUrlQuery } from 'querystring';
import React, { createContext, useState } from 'react';

import { STATUS_CODE_NOTFOUND } from '@/base/constants/common';
import { ErrorResponse } from '@/base/types/api';

const INITIAL_INFO_404 = { isOpen: false, info: {} };

type RouteReload404Type = {
  pathname?: string;
  query?: ParsedUrlQuery;
};

type InfoModal404Type = {
  isOpen: boolean;
  info: { title?: string; description?: string; router?: RouteReload404Type };
};

export type ErrorContextType = {
  infoModal404: InfoModal404Type;
  setInfoModal404: (value: InfoModal404Type) => void;
  handleNotFound: (payload: {
    error: unknown;
    router: RouteReload404Type;
    preShowPopupCallback?: VoidFunction;
  }) => boolean;
};

export const ErrorContext = createContext<ErrorContextType>({
  infoModal404: INITIAL_INFO_404,
  setInfoModal404: () => {},
  handleNotFound: () => false,
});

const ErrorProvider = ({ children }: { children?: React.ReactNode }) => {
  const [infoModal404, setInfoModal404] = useState<InfoModal404Type>(INITIAL_INFO_404);

  const handleNotFound = (payload: {
    error: unknown;
    router: RouteReload404Type;
    preShowPopupCallback?: VoidFunction;
  }) => {
    const { error, router, preShowPopupCallback } = payload;
    const errorData = (error as AxiosError<ErrorResponse>)?.response?.data;
    const statusCode = errorData?.status_code;

    if (statusCode === STATUS_CODE_NOTFOUND) {
      preShowPopupCallback?.();
      setInfoModal404({
        isOpen: true,
        info: {
          description: errorData?.error?.message,
          router,
        },
      });
      return true;
    }
    return false;
  };

  return (
    <ErrorContext.Provider value={{ infoModal404, setInfoModal404, handleNotFound }}>{children}</ErrorContext.Provider>
  );
};

export default ErrorProvider;
