import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { AUTH_KEY, CookieKey } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import InputText from '@/components/input/typing/InputText';
import styles from '@/styles/dashboard/index.module.scss';
import { api_checkAuthKey } from '@/api/auth';
import Head from 'next/head';

type AuthForm = {
  authKey: string;
};

function AuthPage() {
  const { t } = useTranslation('');
  const router = useRouter();

  const schema = yup.object().shape({
    authKey: yup.string().required('Key is required'),
  });

  const { control, setValue, handleSubmit, setError } = useForm<AuthForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: AuthForm) => {
    try {
      const res = await api_checkAuthKey(data.authKey);
      if (!res.data?.success) {
        setError('authKey', { message: 'Error key' });
      } else {
        const authToken = res.data?.token || '';
        CookiesStorage.setCookieData(CookieKey.auth, authToken);
        router.push('/');
      }
    } catch (error) {
      setError('authKey', { message: 'Error key' });
    }
  };

  return (
    <>
      <div className="bg-[#2c2f33]">
        <div className="bg-[url('/img/bg-coming-soon.png')] h-screen flex flex-col items-center gap-[45px] w-full bg-center bg-cover">
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`${styles.textGradient} bg-primary text-[30px] sm:text-[48px] lg:text-[100px] font-normal sm:font-semibold text-center mt-20`}
            >
              {/* {t('error:comingSoon')} */}
              Login
            </div>
            <InputText
              customClass="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
              name="authKey"
              placeholder={'Enter auth key'}
              control={control}
            />
            <button
              type="submit"
              className="flex items-center dark:bg-[#292C33] bg-[#f5f6fa] w-fit p-[10px] rounded mt-2"
            >
              <span className="text-[#3BC117] text-[14px] font-bold">{t('setting:verified')}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
