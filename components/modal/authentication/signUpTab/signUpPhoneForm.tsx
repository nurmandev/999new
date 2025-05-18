import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowDown2 } from 'iconsax-react';
import { Dispatch, forwardRef, Ref, SetStateAction, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { SignUpPhoneFormRef } from '@/base/types/common';
import { SignUpPhoneRequest } from '@/base/types/requestTypes';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import InputPhoneNumber from '@/components/input/typing/InputPhoneNumber';
import InputText from '@/components/input/typing/InputText';
import { useRouter } from 'next/router';

type SignUpPhoneFormProps = {
  onSubmit: (data: SignUpPhoneRequest) => void;
  setCountryCallingCode: Dispatch<
    SetStateAction<{ countryCode: string; countryCallingCode: string; country: string } | undefined>
  >;
};

const SignUpPhoneForm = (props: SignUpPhoneFormProps, ref: Ref<SignUpPhoneFormRef>) => {
  const { onSubmit } = props;
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();
  const [isEnterReferral, setCheckIsReferral] = useState<boolean>(false);
  const { query } = useRouter();
  const { referral } = query;

  const { t } = useTranslation('');

  const schema = yup.object().shape({
    phone: yup
      .string()
      .required(String(t('authentication:phoneRequired')))
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
  } = useForm<SignUpPhoneRequest>({
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
          <InputPhoneNumber
            control={control}
            onChangeCountryCallingCode={(value) => {
              setCountryCallingCode(value);
              props.setCountryCallingCode(value);
            }}
            customClass="dark:bg-color-bg-primary bg-white "
            name="phone"
            placeholder={String(t('setting:phonePlaceholder'))}
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
          className="flex items-center text-color-text-primary text-default gap-[4px] cursor-pointer mt-2"
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

export default forwardRef(SignUpPhoneForm);
