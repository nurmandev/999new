import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { Star1 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey, LANGUAGE_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { setIsLoading, updateSetting, updateViewInFiat } from '@/base/redux/reducers/auth.reducer';
import { changeMultiLanguageTab } from '@/base/redux/reducers/modal.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

import CommonModal from '../commonModal/commonModal';

type ModalFiatProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export enum MultiLanguageTabEnum {
  LANGUAGE = 'LANGUAGE',
  FIAT = 'FIAT',
}

export default function ModalMultiLanguage({ show, onClose }: ModalFiatProps) {
  const router = useRouter();

  const { multiLanguageTab, isLogin, viewInFiat, fiatSymbols, localFiat, settings, isLoading } = useSelector(
    (state: AppState) => ({
      multiLanguageTab: state.modal.multiLanguageTab,
      fiatArray: state.common.fiatArray,
      // localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLogin: state.auth.isLogin,
      settings: state.auth.user.generalSetting,

      fiatSymbols: state.wallet.fiatSymbols,
      localFiat: state.wallet.localFiat,
      isLoading: state.auth.isLoading,
    }),
    shallowEqual,
  );

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('');

  const handleChangeLang = (item: any) => {
    i18n.changeLanguage(item.key);
    CookiesStorage.setCookieData(CookieKey.lang, item.key);
    if (isLogin) {
      dispatch(setIsLoading({ ...isLoading, isLanguage: true }));
      dispatch(updateSetting({ ...settings, settingLanguage: item.key }));
    }
  };

  const usdFiat = useMemo(() => {
    const usd = fiatSymbols.find((item) => item.name.toLowerCase() === 'usd');
    if (usd) return usd;
    return null;
  }, [fiatSymbols]);

  const handleChangeLocaleFiat = (item: CurrencyType) => {
    if (isLogin) {
      dispatch(setIsLoading({ ...isLoading, isCurrency: true }));
      dispatch(updateSetting({ ...settings, settingCurrency: item.id, settingViewInFiat: true }));
    } else {
      dispatch(updateViewInFiat(true));

      dispatch(setLocalFiat(item));
    }
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        header={
          <div className="flex w-full">
            <div
              onClick={() => dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE))}
              className={cn(
                'min-w-[150px] text-black dark:text-[#C2C2C2] flex-1 flex items-center justify-center border-b-2 border-solid dark:border-color-border-primary border-color-light-border-primary pb-[10px] pt-[25px]',
                {
                  '!border-color-primary text-black dark:text-white font-[700]':
                    multiLanguageTab === MultiLanguageTabEnum.LANGUAGE,
                },
              )}
              role="button"
            >
              <div className="sm:text-[16px] text-default">{t('language:language')}</div>
            </div>
            <div
              onClick={() => dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT))}
              className={cn(
                'min-w-[150px] text-black dark:text-[#C2C2C2] flex-1 flex items-center justify-center border-b-2 border-solid dark:border-color-border-primary border-color-light-border-primary  pb-[10px] pt-[25px]',
                {
                  '!border-color-primary text-black dark:text-white font-[700]':
                    multiLanguageTab === MultiLanguageTabEnum.FIAT,
                },
              )}
              role="button"
            >
              <div className="sm:text-[16px] text-default">{t('language:viewInFiat')}</div>
            </div>
          </div>
        }
      >
        <div className="h-full pb-4 overflow-y-auto overflow-hidden">
          <div className="h-full overflow-y-auto text-black dark:text-white">
            <div>
              <div className="p-5 py-5 overflow-y-auto border">
                <div
                  className={`grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2 ${multiLanguageTab === MultiLanguageTabEnum.LANGUAGE ? 'block' : 'hidden'
                    }`}
                >
                  {LANGUAGE_DATA.map((item, key) => (
                    <button
                      key={key}
                      className={cn(
                        'sm:py-[15px] py-[10px] rounded-default text-left ps-5 dark:hover:text-white text-default ',
                        {
                          'bg-gradient-btn-play shadow-bs-btn text-white': item.key === i18n.language,
                          'hover:bg-gray-200 hover:text-black dark:hover:bg-gray-600 dark:text-white text-black':
                            item.key !== i18n.language,
                        },
                      )}
                      onClick={() => {
                        handleChangeLang(item);
                        onClose();
                      }}
                    >
                      {item.language}
                    </button>
                  ))}
                </div>
                <div
                  className={cn('grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2', {
                    grid: multiLanguageTab === MultiLanguageTabEnum.FIAT,
                    block: multiLanguageTab === MultiLanguageTabEnum.FIAT,
                    hidden: multiLanguageTab !== MultiLanguageTabEnum.FIAT,
                  })}
                >
                  <>
                    <div
                      role="button"
                      className={cn(
                        'sm:py-[12px] py-[10px] rounded-default text-left px-5 flex items-center justify-between dark:hover:text-white w-full text-default',
                        {
                          'bg-gradient-btn-play shadow-bs-btn': !viewInFiat,
                          'hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-black': viewInFiat,
                        },
                      )}
                      onClick={() => {
                        if (isLogin) {
                          dispatch(setIsLoading({ ...isLoading, isCurrency: true }));
                          dispatch(
                            updateSetting({ ...settings, settingCurrency: usdFiat?.id || '', settingViewInFiat: false }),
                          );
                        } else {
                          dispatch(updateViewInFiat(false));
                          dispatch(setLocalFiat(usdFiat));
                        }

                        onClose();
                      }}
                    >
                      <div className="flex items-center w-full gap-3">
                        <div className="w-[30px] h-[30px] rounded-full bg-gray-300 flex items-center justify-center">
                          <Star1 size={15} className="text-gray-700" />
                        </div>
                        <div>{t('language:none')}</div>
                      </div>
                    </div>
                  </>
                  <div className="col-span-1 md:col-span-3 sm:col-span-2"></div>
                  {fiatSymbols.map((item: CurrencyType, key: number) => (
                    <div
                      key={key}
                      role="button"
                      className={cn(
                        'sm:py-[12px] py-[10px] rounded-default text-left px-5 flex items-center justify-between dark:hover:text-white w-full text-default',
                        {
                          'bg-gradient-btn-play shadow-bs-btn text-white': viewInFiat && item.id === localFiat?.id,
                          'hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-black': item.id !== localFiat?.id,
                        },
                      )}
                      onClick={() => {
                        handleChangeLocaleFiat(item);
                        onClose();
                      }}
                    >
                      <div className="flex items-center w-full gap-3">
                        <Image
                          height={30}
                          width={30}
                          src={item.logo ? item.logo : '/img/fiats/USD.png'}
                          alt="currency"
                          onError={(e) => {
                            e.currentTarget.src = '/img/fiats/USD.png';
                          }}
                        />
                        <div>{item.name}</div>
                        <div
                          className={cn('text-[12px] truncate w-full dark:text-[#C2C2C2] text-gray-500', {
                            '!text-gray-200': viewInFiat && item.id === localFiat?.id,
                          })}
                        >
                          {item.alias}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
