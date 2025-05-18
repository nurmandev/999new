import { DialogProps, Disclosure, TransitionRootProps } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { ArrowLeft2 } from 'iconsax-react';
import { ElementType } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

import CommonModal from '../../commonModal/commonModal';

type ModalRakeBackDetailProps = {
  onClose: () => void;
  show: boolean;
  setShowModalRakeBack: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

const fiatDecimals = 4;
const cryptoDecimals = 8;

export default function ModalRakeBackDetail({ show, onClose, setShowModalRakeBack }: ModalRakeBackDetailProps) {
  const usdtPrice = useUSDTPrice();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const { lockedAmount, viewInFiat, localFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      activeFiat: state.common.activeFiat,
      lockedAmount: state.wallet.lockedAmount,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const getWagerAmount = (): string => {
    return `${
      viewInFiat
        ? currencyFormat1((lockedAmount * usdtPrice * exchangeRate) / (0.01 * 0.2), fiatDecimals, localFiat?.name)
        : currencyFormat1(lockedAmount / (0.01 * 0.2), cryptoDecimals, '', false)
    } USDT`;
  };

  const handleClickCLose = () => {
    onClose();
    setShowModalRakeBack();
  };
  return (
    <>
      <CommonModal
        show={show}
        onClose={handleClickCLose}
        panelClass="sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] sm:my-0"
        header={
          <div
            className="modal-header flex !flex-row items-start gap-[10px] hover:cursor-pointer"
            onClick={handleClickCLose}
          >
            <ArrowLeft2 className="w-[16px] text-[#67707B] stroke-4" />
            <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:rakeback')}</div>
          </div>
        }
      >
        <div className="dark:text-color-text-primary text-color-light-text-primary flex-col flex gap-[10px] h-[calc(100%-60px)] p-[12px] pt-0 pb-[30px] overflow-auto">
          {/* <div className="bg-[url('/img/reBackDetail.png')] min-h-[200px] bg-cover h-[200px] w-full bg-no-repeat relative">
            <div className="flex flex-col items-start justify-center h-full gap-[10px] pl-8">
              <div className="w-[190px] rounded-[5px] h-[36px] text-color-primary bg-color-primary-1/20 flex items-center justify-center gap-2">
                <p className="text-[16px] font-bold">1 USDT ($) = 1 USD ($)</p>
              </div>
              <div>
                <div className="text-[10px] mt-[2px] flex items-center justify-center text-color-text-primary">
                  <p className="text-white cursor-pointer text-[12px]">{t('rakeBackDetail:viewContract')}</p>
                </div>
              </div>
            </div>
          </div> */}
          <div className="mt-2 mb-5 px-2 gap-2 flex flex-col items-center justify-between">
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full h-[40px] justify-between items-center py-2 px-2 text-left text-sm font-medium rounded dark:bg-color-input-primary bg-color-light-bg-primary hover:dark:bg-color-active-primary focus:outline-none">
                    <span className="text-white text-[14px] flex items-center gap-1 font-medium">
                      {t('rakeBackDetail:howUnlockClaim', { currency: 'USDT' })}
                    </span>
                    <ChevronUpIcon className={`${open ? '' : 'rotate-180 transform'} h-5 w-5 text-[#939699]`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-[12px] px-3 py-5 text-sm dark:text-color-text-primary text-color-light-text-primary rounded">
                    <div className="text-white mb-4">{t('rakeBackDetail:howUnlock', { currency: 'USDT' })}</div>
                    <div className="flex flex-col gap-3">
                      <p>{t('rakeBackDetail:howToUnlock1', { currency: 'USDT' })}</p>
                      <p>{t('rakeBackDetail:howToUnlock2', { currency: 'USDT' })}</p>
                      <p className="bg-[#FFFFFF15] pl-2 font-semibold h-7 flex items-center text-white rounded">
                        {t('rakeBackDetail:howToUnlock3')}
                      </p>
                      {t('rakeBackDetail:howToUnlock4', {
                        amount: currencyFormat1(lockedAmount, cryptoDecimals, '', false),
                        currency: 'USDT',
                        wagerAmount: getWagerAmount(),
                      })}
                      <div className="text-white">{t('rakeBackDetail:howClaim', { currency: 'USDT' })}</div>
                      <p dangerouslySetInnerHTML={{ __html: String(t('rakeBackDetail:howToClaim1')) }}></p>{' '}
                      <p>{t('rakeBackDetail:howToClaim2', { currency: 'USDT' })}</p>{' '}
                      <p>{t('rakeBackDetail:howToClaim3', { currency: 'USDT' })}</p>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full h-[40px] justify-between items-center py-2 px-2 text-left text-sm font-medium rounded dark:bg-color-input-primary bg-color-light-bg-primary hover:dark:bg-color-hover-primary focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span className="text-white text-[14px] flex items-center gap-1 font-medium">
                      {t('rakeBackDetail:aboutCurrency', { currency: 'USDT' })}
                    </span>
                    <ChevronUpIcon className={`${open ? '' : 'rotate-180 transform'} h-5 w-5 text-[#939699]`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-[12px] px-3 py-5 text-sm dark:text-color-text-primary text-color-light-text-primary rounded">
                    <div className="text-white mb-4">{t('rakeBackDetail:canBeExchange', { currency: 'USDT' })}</div>
                    <div className="flex flex-col gap-3">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: String(t('rakeBackDetail:canBeExchange1', { currency: 'USDT' })),
                        }}
                      ></span>
                      {/* <p className="text-white mb-4">{t('rakeBackDetail:whatSpecialAbout', { currency: 'USDT' })}</p>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: String(t('rakeBackDetail:whatSpecialAbout1', { currency: 'USDT' })),
                        }}
                      ></p> */}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
