import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState, useAppDispatch } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';
import { changeIsShowDepositModal, changeIsShowDepositRule } from '@/base/redux/reducers/modal.reducer';

type ModalDepositBonusRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDepositBonusRules({ show, onClose }: ModalDepositBonusRulesProps) {
  const { t } = useTranslation('');
  const exchangeRate = useExchange();
  const dispatch = useAppDispatch();
  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const depositBonus = [
    {
      id: 1,
      title: t('bonus:1stDeposit'),
      img: '/img/deposit_rules1.png',
      percent: '180%',
      depositAmount: 10,
      upto: '20,000',
    },
    {
      id: 2,
      title: t('bonus:2ndDeposit'),
      img: '/img/deposit_rules2.png',
      percent: '240%',
      depositAmount: 50,
      upto: '40,000',
    },
    {
      id: 3,
      title: t('bonus:3rdDeposit'),
      img: '/img/deposit_rules3.png',
      percent: '300%',
      depositAmount: 100,
      upto: '60,000',
    },
    {
      id: 4,
      title: t('bonus:4thDeposit'),
      img: '/img/deposit_rules4.png',
      percent: '360%',
      depositAmount: 200,
      upto: '100,000',
    },
  ];

  const showDepositModal = () => {
    dispatch(changeIsShowDepositRule(false));
    dispatch(changeIsShowDepositModal(true));
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[530px] sm:!h-[90vh] sm:min-h-[80vh] sm:my-0"
        header={
          <>
            <div className="modal-header">
              <div className="text-[16px] dark:text-white text-black">{t('bonus:depositBonusRules')}</div>
            </div>
          </>
        }
      >
        <div className="overflow-y-auto sm:p-5 p-3 pb-[80px]">
          <div className="">
            <div className="text-[14px]">{t('bonus:depositBonusRulesContent')}</div>
            <div className="text-color-text-primary grid grid-cols-2 gap-4 text-[14px] font-bold mb-2 mt-5">
              {depositBonus.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2D3035] rounded-[10px] relative cursor-pointer"
                  onClick={showDepositModal}
                >
                  <div className="relative text-white dark:text-black">
                    <Image
                      src={item.img}
                      className="w-full h-auto object-cover"
                      width={100}
                      height={100}
                      alt="deposit bonus logo"
                    />
                    <div className="absolute font-bold text-[14px] sm:text-[16px] max-[600px]:top-[10px] top-[16px] left-0 w-full text-center">
                      {item.title}
                    </div>
                  </div>
                  <div className="absolute w-full text-white dark:text-black top-1/2 -translate-y-2/4">
                    <p className="text-[24px] sm:text-[32px] font-bold text-center">{item.percent}</p>
                    <p className="text-[16px] sm:text-[18px] font-bold text-center">{t('bonus:Bonus')}</p>
                  </div>
                  <div className="p-[10px] max-[400px]:text-[12px] sm:text-[14px]">
                    <div className="flex item-center justify-between dark:text-color-text-primary text-[#31373d]">
                      <p>{t('bonus:minimum')}</p>
                      <p className="dark:text-white text-black font-semibold">
                        {viewInFiat ? (
                          <>{currencyFormat1(item.depositAmount * exchangeRate, 2, String(localFiat?.name || 'USD'))}</>
                        ) : (
                          currencyFormat1(item.depositAmount, 2, 'USD')
                        )}
                      </p>
                    </div>
                    <div className="flex item-center justify-between dark:text-color-text-primary text-[#31373d]">
                      <p>{t('bonus:deposit')}</p>
                      <p className="dark:text-white text-black font-semibold"></p>
                    </div>
                    <div className="flex item-center justify-between dark:text-color-text-primary text-[#31373d]">
                      <p>{t('bonus:getUpTo')}</p>
                      <p className="dark:text-white text-black font-semibold">{item.upto} USDT</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
