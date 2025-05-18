import { Switch } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { ArrowDown2 } from 'iconsax-react';
import { useTheme } from 'next-themes';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey, LANGUAGE_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { changeIsShowMultiLanguageModal, changeMultiLanguageTab } from '@/base/redux/reducers/modal.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { FiatType, UserSettingGeneralType } from '@/base/types/common';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';
import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';
import SelectFiat from '@/components/selectFiat/SelectFiat';

import styles from '../../balance/index.module.scss';

type DepositFiatForm = {
  amount: number;
  currency: FiatType;
};

const GeneralPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setTheme, theme } = useTheme();

  const { viewInFiat, settings, defaultCurrencyId, fiatSymbols } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      settings: state.auth.user.generalSetting,
      fiatSymbols: state.wallet.fiatSymbols,
      defaultCurrencyId: state.auth.user.generalSetting.settingCurrency,
    }),
    shallowEqual,
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ?? 'dark';
    // setMode(savedTheme);
    setTheme(savedTheme);
  }, []);

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    currency: yup
      .object()
      .required(String(t('deposit:currencyRequired')))
      .nullable(String(t('deposit:currencyRequired'))),
    amount: yup.number().required(String(t('deposit:amountRequired'))),
  });

  const {
    control,
    formState: { errors },
  } = useForm<DepositFiatForm>({
    resolver: yupResolver(schema),
  });

  const defaultCurrency = useMemo(() => {
    const currency = [...fiatSymbols].find((item) => item.id === defaultCurrencyId);
    return currency ?? null;
  }, [fiatSymbols, defaultCurrencyId]);

  const { i18n } = useTranslation('');

  const handleChangeLang = (item: any) => {
    i18n.changeLanguage(item.key);
    CookiesStorage.setCookieData(CookieKey.lang, item.key);
  };

  const handleChangeLocaleFiat = (item: CurrencyType) => {
    try {
      dispatch(setLocalFiat(item));

      dispatch(updateSetting({ ...settings, settingCurrency: item.id }));
      // CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
    } catch (error) {}
  };

  const handleUpdateSetting = async (setting: UserSettingGeneralType) => {
    dispatch(updateSetting(setting));
  };

  return (
    <div className={`${styles.cardContent}`}>
      {isLoading && <Loader />}
      <div className="w-full h-1/3 px-[12px] py-[24px] sm:p-0 md:mt-0 dark:text-white text-black">
        <div className="flex justify-between border-b border-solid dark:border-color-border-primary border-color-light-border-primary pb-[8px]">
          <div
            className="flex-1 dark:text-color-text-primary text-color-light-text-primary text-default text-start"
            role="button"
          >
            {t('setting:showFullNameOfCurrencyInCryptoList')}
          </div>
          <Switch
            checked={settings.settingShowFullNameCrypto}
            onChange={(value) => handleUpdateSetting({ ...settings, settingShowFullNameCrypto: value })}
            className={cn('relative inline-flex h-[24px] w-[44px] items-center rounded-full', {
              'bg-[#3bc11733]': settings.settingShowFullNameCrypto,
              'dark:bg-color-toggle-primary bg-gray-200': !settings.settingShowFullNameCrypto,
            })}
          >
            <span
              className={cn('inline-block h-[20px] w-[20px] transform rounded-full transition', {
                'translate-x-[20px] bg-color-primary': settings.settingShowFullNameCrypto,
                'translate-x-1 bg-gray-400': !settings.settingShowFullNameCrypto,
              })}
            />
          </Switch>
        </div>
        <div className="flex justify-between border-b border-solid dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <div
            className="flex-1 dark:text-color-text-primary text-color-light-text-primary text-default text-start"
            role="button"
          >
            {t('setting:receiveMarketingPromotions')}
          </div>
          <Switch
            checked={settings.settingReceiveMarketPromotion}
            onChange={(value) => handleUpdateSetting({ ...settings, settingReceiveMarketPromotion: value })}
            className={cn('relative inline-flex h-[24px] w-[44px] items-center rounded-full', {
              'bg-[#3bc11733]': settings.settingReceiveMarketPromotion,
              'dark:bg-color-toggle-primary bg-gray-200': !settings.settingReceiveMarketPromotion,
            })}
          >
            <span
              className={cn('inline-block h-[20px] w-[20px] transform rounded-full transition', {
                'translate-x-[20px] bg-color-primary': settings.settingReceiveMarketPromotion,
                'translate-x-1 bg-gray-400': !settings.settingReceiveMarketPromotion,
              })}
            />
          </Switch>
        </div>
        <div className="flex justify-between items-center border-b border-solid dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <div>
            <div className="flex-1 dark:text-color-text-primary text-color-light-text-primary text-default text-start">
              {t('setting:currencySetting')}
            </div>
            <div className="mt-[10px]">
              <SelectFiat onChangeMoonpayFiat={handleChangeLocaleFiat} />
            </div>
          </div>
          <Switch
            checked={viewInFiat}
            onChange={(value) => {
              dispatch(setLocalFiat(defaultCurrency));
              dispatch(updateSetting({ ...settings, settingViewInFiat: value }));
            }}
            className={cn('relative inline-flex h-[24px] w-[44px] items-center rounded-full', {
              'bg-[#3bc11733]': viewInFiat,
              'dark:bg-color-toggle-primary bg-gray-200': !viewInFiat,
            })}
          >
            <span
              className={cn('inline-block h-[20px] w-[20px] transform rounded-full transition', {
                'translate-x-[20px] bg-color-primary': viewInFiat,
                'translate-x-1 bg-gray-400': !viewInFiat,
              })}
            />
          </Switch>
        </div>
        {/* Hiding dark & light mode button */}
        {/*
        <div className="border-b border-solid dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <div className="flex-1 dark:text-color-text-primary text-color-light-text-primary text-default text-start">
            {t('setting:displayMode')}
          </div>
          <div className="mt-[10px] dark:bg-[#2D3035] bg-color-light-bg-primary rounded-default flex p-[3px] max-w-[70px]">
            <div
              role="button"
              className={cn('w-[32px] h-[32px] p-[8px] rounded-default', {
                'dark:bg-color-bg-primary bg-white': theme === 'dark',
              })}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Moon className="dark:text-white text-color-light-text-primary" size={16} />
            </div>
            <div
              role="button"
              className={cn('w-[32px] h-[32px] p-[8px] rounded-default', {
                'dark:bg-color-bg-primary bg-white': theme === 'light',
              })}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Sun1 className="dark:text-white text-color-light-text-primary" size={16} />
            </div>
          </div>
        </div>
            */}
        <div className="pt-[13px]">
          <div className="dark:text-color-text-primary text-color-light-text-primary text-default flex-1 text-start mb-[10px]">
            {t('setting:language')}
          </div>
          <div
            role="button"
            className="flex items-center justify-between dark:bg-color-menu-primary bg-color-light-bg-primary gap-2 py-2 px-2 rounded-default w-[146px]"
            onClick={() => {
              dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
              dispatch(changeIsShowMultiLanguageModal(true));
            }}
          >
            <div className="font-semibold text-black dark:text-white text-default">
              {LANGUAGE_DATA.find((item) => item.key == settings.settingLanguage)?.language}
            </div>
            <div className="dark:text-white text-black truncate text-right min-w-[15px]">
              <ArrowDown2 className="dark:text-white textx-black" size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralPageAuth = withAuth(GeneralPage);

GeneralPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default GeneralPageAuth;
