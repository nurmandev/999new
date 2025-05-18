import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ElementType, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import Loader from '@/components/common/preloader/loader';
import { ArrowDown2 } from 'iconsax-react';
import CommonModal from '../commonModal/commonModal';
import { EnumVerificationDocumentType } from '@/base/types/common';

type ModalVerificationProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalVerification({ show, onClose }: ModalVerificationProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentType, setDocumentType] = useState<EnumVerificationDocumentType>();

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="rounded sm:max-w-[512px]">
        <div className="flex-1 flex flex-col gap-[10px] justify-center items-start px-[80px] my-[20px]">
          {isLoading && <Loader />}
          <div className="dark:text-white font-semibold text-center">{t('profile:selectType')}</div>
          <div className="w-full">
            <label className="text-[12px] font-[300] text-[#939699] mb-2 required">{t('profile:issuingCountry')}</label>
            <div className="rounded bg-[#1F2024] px-[10px] py-[5px] w-full flex items-center">
              <div className="flex-1 text-[14px] font-[300]">Vietnam</div>
              <div>
                <ArrowDown2 size={12} />
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="text-[12px] font-[300] text-[#939699] mb-2 required">Document type</label>
            <div
              className="rounded bg-[#292C33] px-[10px] py-[5px] w-full flex items-center mt-2"
              role="button"
              onClick={() => setDocumentType(EnumVerificationDocumentType.PASSPORT)}
            >
              <div className="flex-1 text-[14px] font-[300]">Passport</div>
              <div className={cn('w-[18px] h-[18px] rounded-full bg-[#0dfde540] flex items-center justify-center')}>
                {documentType === EnumVerificationDocumentType.PASSPORT && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0DFDE4]"></div>
                )}
              </div>
            </div>
            <div
              className="rounded bg-[#292C33] px-[10px] py-[5px] w-full flex items-center mt-2"
              role="button"
              onClick={() => setDocumentType(EnumVerificationDocumentType.DRIVING_LICENSE)}
            >
              <div className="flex-1 text-[14px] font-[300]">Driving license</div>
              <div className={cn('w-[18px] h-[18px] rounded-full bg-[#0dfde540] flex items-center justify-center')}>
                {documentType === EnumVerificationDocumentType.DRIVING_LICENSE && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0DFDE4]"></div>
                )}
              </div>
            </div>
            <div
              className="rounded bg-[#292C33] px-[10px] py-[5px] w-full flex items-center mt-2"
              role="button"
              onClick={() => setDocumentType(EnumVerificationDocumentType.ID_CARD)}
            >
              <div className="flex-1 text-[14px] font-[300]">ID Card</div>
              <div className={cn('w-[18px] h-[18px] rounded-full bg-[#0dfde540] flex items-center justify-center')}>
                {documentType === EnumVerificationDocumentType.ID_CARD && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0DFDE4]"></div>
                )}
              </div>
            </div>
            <div
              className="rounded bg-[#292C33] px-[10px] py-[5px] w-full flex items-center mt-2"
              role="button"
              onClick={() => setDocumentType(EnumVerificationDocumentType.RESIDENCE_PERMIT)}
            >
              <div className="flex-1 text-[14px] font-[300]">{t('profile:residencePermit')}</div>
              <div className={cn('w-[18px] h-[18px] rounded-full bg-[#0dfde540] flex items-center justify-center')}>
                {documentType === EnumVerificationDocumentType.RESIDENCE_PERMIT && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0DFDE4]"></div>
                )}
              </div>
            </div>
            <div
              className="rounded bg-[#292C33] px-[10px] py-[5px] w-full flex items-center mt-2"
              role="button"
              onClick={() => setDocumentType(EnumVerificationDocumentType.VISA)}
            >
              <div className="flex-1 text-[14px] font-[300]">Visa</div>
              <div className={cn('w-[18px] h-[18px] rounded-full bg-[#0dfde540] flex items-center justify-center')}>
                {documentType === EnumVerificationDocumentType.VISA && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0DFDE4]"></div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded w-full p-[7px] bg-[#F61B4F] text-[14px] text-center mt-4" role="button">
            {t('profile:next')}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
