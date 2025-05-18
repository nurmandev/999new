import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../../commonModal/commonModal';
import styles from './index.module.scss';
type ModalCommissionReward = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function CommissionReward({ show, onClose }: ModalCommissionReward) {
  const { t } = useTranslation('');
  const commissionDetail = [
    {
      rate: '7%',
      wager: 'Of 1% wager',
      game: 'The Original Games',
      className: 'cardGame',
    },
    {
      rate: '15%',
      wager: 'Of 1% wager',
      game: 'The Slot Games',
      className: 'cardSport',
    },
  ];
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      panelClass="rounded sm:max-w-[464px] sm:!h-[90vh]"
      header={
        <div className="modal-header">
          {t('affiliate:commissionRewardRules')}
        </div>
      }
    >
      <div className="p-5 text-[#94a9bf] bg-color-modal-bg-primary text-[13px] overflow-y-auto">
        <div className="my-4 text-[14px] font-thin">
          <span className="">&#8226;&nbsp; {t('affiliate:commissionDependsDifferent')}</span>
        </div>
        {commissionDetail.map((item, index) => (
          <div
            key={index}
            className={cn(styles[item.className], 'h-120px rounded-sm p-4 flex flex-col justify-center mb-4')}
          >
            <div className="flex items-center gap-3">
              <span className="text-[40px] text-white font-semibold">{item.rate}</span>
              <span className="w-4 h-4 bg-[#656B74] font-bold text-[#24262B] rounded-full flex items-center justify-center text-[16px]">
                ?
              </span>
              <span>{item.wager}</span>
            </div>
            <div>
              <span className="opacity-75 mr-4 !font-thin text-[14px]">{t('affiliate:game')}:</span>
              <span>{item.game}</span>
            </div>
          </div>
        ))}
        {/* <div className="h-70px bg-[#FFFFFF11] rounded-sm p-4 flex justify-center items-center mb-4 gap-2">
          <div>
            <span className="w-5 h-5 bg-[#656B74] font-bold text-[#24262B] rounded-full flex items-center justify-center text-[16px]">
              !
            </span>
          </div>
          <span>
            <span>{t('affiliate:customizedYourCommission')}</span>
            <span>
              <a className="font-semibold text-lime-400 cursor-pointer pl-1">{t('affiliate:viewMyCommission')}</a>
            </span>
          </span>
        </div> */}
        <div className="text-left light:bg-white px-5 pt-4 pb-8">
          <ul>
            <li className="">&#8226;&nbsp;{t('affiliate:commissionRewardRules1')}</li>
            <li className="mt-4">&#8226;&nbsp;{t('affiliate:commissionRewardRules2')}</li>
            <li className="mt-4">&#8226;&nbsp;{t('affiliate:commissionRewardRules3')}</li>
            <li className="mt-4">&#8226;&nbsp;{t('affiliate:commissionRewardRules4')}</li>
            <li className="mt-4">&#8226;&nbsp;{t('affiliate:commissionRewardRules5')}</li>
          </ul>
        </div>
        <div className="text-center light:bg-white px-8 py-3 border-[0.3px] rounded-md border-solid">
          <span>{t('affiliate:textQuestion')}</span>
          <a className="!font-semibold text-lime-400 cursor-pointer lowercase" href="https://t.me/skyearth008">
            &nbsp;{t('affiliate:contactUs')}
          </a>
        </div>
      </div>
    </CommonModal>
  );
}
