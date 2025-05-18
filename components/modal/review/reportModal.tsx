import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { copyClipBoard, currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalReportProps = {
  onClose: () => void;
  show: boolean;
  onReport: (reason: string) => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

const reportContents = [
  {
    key: 'inappropriate',
    content: 'gameReview:reportReason1',
    originalContent: 'Inappropriate content (spam, ad, reflinks, etc. )',
  },
  { key: 'insults', content: 'gameReview:reportReason2', originalContent: 'Insults, provocations, cursing' },
  { key: 'begging', content: 'gameReview:reportReason3', originalContent: 'Begging' },
  { key: 'scam', content: 'gameReview:reportReason4', originalContent: 'Scam attempt' },
];

export default function ModalReport({ show, onClose, onReport }: ModalReportProps) {
  const { t } = useTranslation('');
  const [selectedReason, setSelectedReason] = useState('inappropriate');

  const handleReportComment = async () => {
    const report = reportContents.find((item) => item.key === selectedReason);
    if (report) {
      onReport(report?.originalContent);
    }
  };

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:!max-w-[530px]">
        <div className="flex flex-col gap-[12px] overflow-y-auto sm:px-[30px] px-[20px] py-[40px]">
          <p className="text-[16px]">{t('gameReview:reportReasonHeader')}</p>
          {reportContents.map((item: any, index: number) => (
            <div
              className="flex gap-[10px] items-center cursor-pointer"
              key={index}
              onClick={() => setSelectedReason(item.key)}
            >
              {item.key === selectedReason && (
                <input
                  id={String(item.key)}
                  type="radio"
                  checked={true}
                  name="default-radio"
                  className="w-4 h-4 accent-color-primary bg-gray-100 border-gray-300 ring-none outline-none"
                />
              )}
              {item.key !== selectedReason && (
                <div className="w-4 h-4 border border-solid dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-gray-200 rounded-full"></div>
              )}
              <div className="text-default">{String(t(item.content))}</div>
            </div>
          ))}
          <div className="flex gap-[10px] justify-end">
            <button
              type="button"
              className="truncate dark:text-color-text-primary rounded-large py-[9px] px-5 text-default font-bold text-color-light-text-primary  dark:hover:bg-color-hover-primary"
              onClick={onClose}
            >
              {t('gameReview:cancel')}
            </button>

            <button
              type="button"
              className="truncate text-white rounded-large py-[9px] bg-gradient-btn-play shadow-bs-btn px-5 text-default font-bold"
              onClick={() => handleReportComment()}
            >
              {t('gameReview:confirm')}
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
