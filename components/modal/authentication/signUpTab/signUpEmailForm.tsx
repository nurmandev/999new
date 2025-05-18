import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowDown2 } from 'iconsax-react';
import { useRouter } from 'next/router';
import { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { REGEX_EMAIL } from '@/base/constants/validation';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { SignUpEmailFormRef } from '@/base/types/common';
import { SignUpEmailRequest } from '@/base/types/requestTypes';
import InputEmailAuthentication from '@/components/input/typing/InputEmailAuthentication';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import InputText from '@/components/input/typing/InputText';

type SignUpEmailFormProps = {
  onSubmit: (data: SignUpEmailRequest) => void;
};

const SignUpEmailForm = (props: SignUpEmailFormProps, ref: Ref<SignUpEmailFormRef>) => {
  const { onSubmit } = props;
  const [isEnterReferral, setCheckIsReferral] = useState<boolean>(false);
  const { query } = useRouter();
  const { referral } = query;

  const { t } = useTranslation('');

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(String(t('authentication:emailRequired')))
      .email(String(t('authentication:emailWrong')))
      .matches(REGEX_EMAIL, String(t('authentication:emailWrong')))
      .trim(),
    password: yup
      .string()
      .required(String(t('authentication:passwordRequired')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignUpEmailRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      referralCode: referral ? String(referral) : '',
    },
  });

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  useImperativeHandle(ref, () => ({
    emitData: handleSubmitForm,
  }));

  useEffect(() => {
    if (referral) {
      setValue('referralCode', String(referral));
      setCheckIsReferral(true);
    }
  }, [referral]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="user-detail-form"
        autoComplete="new-password"
        className="w-full"
      >
        <div className="sm:mt-5 mt-0 flex flex-col items-start gap-[5px] sm:gap-[13px]">
          <InputEmailAuthentication
            control={control}
            name="email"
            placeholder={String(t('authentication:email'))}
            type="email"
            autoComplete="off"
          />
          <InputPassAuthentication
            control={control}
            name="password"
            placeholder={String(t('authentication:password'))}
            type="password"
            autoComplete="off"
          />
        </div>
        <div
          className="flex items-center text-color-text-primary text-[12px] sm:text-default gap-[4px] cursor-pointer mt-2"
          onClick={() => {
            setCheckIsReferral(!isEnterReferral);
          }}
        >
          <div>{t('authentication:enterReferral')}</div>
          <div>
            <ArrowDown2 className={`w-[14px] ${isEnterReferral ? '-rotate-180' : ''}`} />
          </div>
        </div>
        {isEnterReferral && (
          <InputText
            control={control}
            name="referralCode"
            customClass="dark:bg-color-bg-primary bg-white focus:outline-none rounded-default w-full h-[46px] px-[15px] placeholder:text-default dark:text-white mt-1"
            placeholder={String(t('authentication:referral'))}
            autoComplete="off"
          />
        )}
      </form>
    </>
  );
};

export default forwardRef(SignUpEmailForm);
