import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import CommonModal from '../../commonModal/commonModal';
import styles from './index.module.scss';

type ModalReferralRewardRules = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ReferralRewardRules({ show, onClose }: ModalReferralRewardRules) {
  const { t } = useTranslation('');
  const referralRewardList = [
    {
      number: '1',
      title: 'Share to friends',
      content: 'Share your referral link or code to your friends',
      className: 'cardFriend',
    },
    { number: '2', title: 'Get $1000', content: 'Your awards will be locked for now', className: 'cardAward' },
    {
      number: '3',
      title: 'Level Up & Receive!',
      content: 'Your friend’s VIP level will unlock your awards (see rules below)',
      className: 'cardLevelUp',
    },
  ];

  const titleColumn = ['Friend’s Level', 'Total Wager', 'Unlock Amount'];

  const tableUnlockRules = [
    {
      friendLevel: 'VIP 04',
      totalWager: '1000',
      amount: '0.50',
    },
    {
      friendLevel: 'VIP 08',
      totalWager: '5000',
      amount: '2.50',
    },
    {
      friendLevel: 'VIP 14',
      totalWager: '17000',
      amount: '5.00',
    },
    {
      friendLevel: 'VIP 22',
      totalWager: '49000',
      amount: '12.00',
    },
    {
      friendLevel: 'VIP 30',
      totalWager: '129000',
      amount: '25.00',
    },
    {
      friendLevel: 'VIP 38',
      totalWager: '321000',
      amount: '50.00',
    },
    {
      friendLevel: 'VIP 46',
      totalWager: '769000',
      amount: '80.00',
    },
    {
      friendLevel: 'VIP 54',
      totalWager: '1793000',
      amount: '120.00',
    },
    {
      friendLevel: 'VIP 62',
      totalWager: '4097000',
      amount: '205.00',
    },
    {
      friendLevel: 'VIP 70',
      totalWager: '9217000',
      amount: '500.00',
    },
  ];
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      panelClass="rounded sm:max-w-[464px] sm:!h-[90vh]"
      header={
        <div className="modal-header">
          <div className="text-title font-semibold">{t('affiliate:referralRewardRules')}</div>
        </div>
      }
    >
      <div className="pb-7 text-[#94a9bf] max-sm:h-full text-[13px] bg-color-modal-bg-primary overflow-y-auto">
        <div className="flex pt-5 justify-center pb-4 max-sm:bg-[#17191b]">{t('affiliate:getReferral')}</div>
        <div className="px-5 grid grid-cols-1 sm:grid-cols-3 gap-[16px] max-sm:bg-[#17191b] max-sm:pb-6">
          {referralRewardList.map((item, index) => (
            <div key={index} className={`h-[160px] relative max-sm:bg-[#24262b]`}>
              <div className={cn(styles[item.className], 'absolute inset-0 bg-center')}></div>

              <div className="ml-2 w-[140px] absolute tracking-tighter">
                <div className="text-[#3bc117] text-[40px] sm:text-[35px] font-bold">{item.number}</div>
                <div className="text-white font-weight-500 text-[18px] sm:text-[14px] max-sm:mt-2 mb-4 sm:mb-2 leading-4">
                  {item.title}
                </div>
                <div className="leading-4 text-[16px] sm:text-[14px]">{item.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 flex pt-6 flex-col items-center w-[100%] bg-bg-color-modal-bg-primary">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-28 h-[2px] bg-gradient-to-r from-white via-transparent to-transparent transform scale-x-[-1]"></div>
            <span>{t('affiliate:unlockRules')}</span>
            <div className="w-28 h-[2px] bg-gradient-to-r from-white via-transparent to-transparent transform -scale-x-1"></div>
          </div>
          <div className="w-full bg-color-modal-bg-primary">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full text-base text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-[#94a9bf] bg-[#FFFFFF11]">
                  <tr>
                    {titleColumn.map((item, index) => (
                      <th
                        scope="col"
                        key={index}
                        className={`px-3 py-3 ${index === 2 ? 'text-right' : index === 1 ? 'text-center' : ''}`}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[15px]">
                  {tableUnlockRules.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? 'bg-white border-b dark:bg-[#3333]' : 'border-b bg-gray-50 dark:bg-[#1113]'
                      }`}
                    >
                      <th
                        scope="row"
                        className="px-2 py-2 font-medium text-gray-900 sm:px-6 sm:py-4 whitespace-nowrap dark:text-white"
                      >
                        {item.friendLevel}
                      </th>
                      <td className="sm:px-6 sm:py-4 px-2 py-2 sm:min-w-[180px] min-w-[120px] text-center">
                        {item.totalWager}
                      </td>
                      <td className="sm:px-6 sm:py-4 px-2 py-2 font-bold text-[#ffbf39] flex justify-between">
                        <span className="w-5 h-5 bg-[#ffbf39] text-[#17191b] rounded-full flex items-center justify-center">
                          $
                        </span>
                        + {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
