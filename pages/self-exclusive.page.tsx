import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';

import { api_setSelfExclusion } from '@/api/auth';

import { TOAST_ENUM } from '../constants/common';
import { formatDate } from '../libs/utils';
import { getErrorMessage } from '../libs/utils/notificationToast';

function SelfExclusive() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const { query } = useRouter();

  const setSelfExclusion = async (token: string, disabledTo: number) => {
    try {
      setLoading(true);
      const _res = await api_setSelfExclusion(token, disabledTo);
      setIsSuccess(true);
      setLoading(false);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setIsSuccess(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.token && query.disabledTo) {
      setSelfExclusion(String(query.token), Number(query.disabledTo));
    }
  }, [query.token, query.disabledTo]);

  return (
    <>
      <div className="bg-color-bg-primary">
        <div className="h-screen flex flex-col items-center gap-[45px] w-full bg-center bg-cover justify-center items-center">
          {loading && <ReactLoading type="bubbles" color="#00AAE6" />}
          {!loading && isSuccess && (
            <p className="text-white text-[32px]">
              {Number(query.disabledTo) === -1
                ? t('exclusion:permanentlyDisabled')
                : t('exclusion:disabledPeriod', {
                  date: formatDate(new Date(Number(query.disabledTo) * 1000), 'LL/dd/yyyy'),
                })}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default SelfExclusive;
