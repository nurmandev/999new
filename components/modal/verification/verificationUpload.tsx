import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Folder2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_uploadIdCards } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { checkFiletypes, convertUserInfo, getSizeOfFileByMega } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';

type ModalVerificationUploadCardProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type VerifyForm = {
  frontCard: File;
  backCard: File;
};

export default function ModalVerificationUploadCard({ show, onClose }: ModalVerificationUploadCardProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const schema = yup.object().shape({});

  const { control, handleSubmit, watch } = useForm<VerifyForm>({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data: VerifyForm) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('files', data.frontCard);
      formData.append('files', data.backCard);
      const frontendCard = data.frontCard;
      const backendCard = data.backCard;
      const avaTypes = ['image/jpeg', 'image/png'];
      if (!checkFiletypes(frontendCard.type, avaTypes) || !checkFiletypes(backendCard.type, avaTypes)) {
        toast.error(String(t('setting:fileSizeLimit')), { containerId: TOAST_ENUM.COMMON, toastId: 'file-error' });
        return;
      }

      if (getSizeOfFileByMega(frontendCard.size) > 1 || getSizeOfFileByMega(backendCard.size) > 1) {
        toast.error(String(t('setting:fileSizeLimit')), { containerId: TOAST_ENUM.COMMON, toastId: 'file-error' });
        return;
      }
      const _res = await api_uploadIdCards(formData);
      dispatch(
        saveUserInfo({
          ...convertUserInfo(_res.data),
        }),
      );
      onClose();
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUrl = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    return objectUrl;
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        isShowCloseButton={false}
        panelClass="rounded sm:max-w-[700px] p-6"
        header={
          <div className=" mb-6">
            Upload Id card
            <div className="text-start text-[12px] text-[#C2C2C2]">{t('setting:pleaseUploadAValid')}</div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col items-center">
          {isLoading && <Loader />}
          <div className="flex sm:flex-row flex-col items-center gap-[20px] justify-between w-full ">
            <Controller
              control={control}
              name={'frontCard'}
              rules={{ required: 'Recipe picture is required' }}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <div className="flex flex-col items-start gap-[10px] flex-1">
                    <div className="text-[#C2C2C2] text-[12px]">{t('setting:frontSide')}</div>
                    <div className="flex flex-col items-center gap-[10px] w-full">
                      {!Boolean(watch('frontCard')) && (
                        <Image width={316} height={193.5} src={'/img/front-card.png'} alt="front" />
                      )}
                      {Boolean(watch('frontCard')) && (
                        <div className="h-[193.5px] w-[316px]">
                          <Image
                            width={316}
                            height={193.5}
                            src={handleImageUrl(watch('frontCard'))}
                            alt="front"
                            className="object-cover w-full h-full rounded-default"
                          />
                        </div>
                      )}
                      <span className="text-start text-[12px] text-[#C2C2C2]">{t('setting:frontFileSizeLimit')}</span>
                      <input
                        type="file"
                        {...field}
                        accept=".jpg, .jpeg, .png"
                        id="frontCard"
                        className="hidden"
                        onChange={(event) => {
                          onChange(event.target.files?.[0]);
                        }}
                      />
                      <label
                        htmlFor="frontCard"
                        role="button"
                        className="bg-[#272C33] hover:bg-gray-700 px-[20px] py-[8px] flex items-center text-[12px] gap-[5px] rounded-default"
                      >
                        <Folder2 size={14} />
                        {t('setting:chooseFile')}
                      </label>
                    </div>
                  </div>
                );
              }}
            />
            <Controller
              control={control}
              name={'backCard'}
              rules={{ required: 'Recipe picture is required' }}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <div className="flex flex-col items-start gap-[10px] flex-1">
                    <div className="text-[#C2C2C2] text-[12px]">{t('setting:backSide')}</div>
                    <div className="flex flex-col items-center gap-[10px] w-full">
                      {!Boolean(watch('backCard')) && (
                        <Image
                          width={316}
                          height={193.5}
                          src={'/img/back-card.png'}
                          alt="front"
                          className="w-full h-auto"
                        />
                      )}
                      {Boolean(watch('backCard')) && (
                        <div className="h-[193.5px] w-[316px]">
                          <Image
                            width={316}
                            height={193.5}
                            src={handleImageUrl(watch('backCard'))}
                            alt="front"
                            className="object-cover w-full h-full rounded-default"
                          />
                        </div>
                      )}

                      <span className="text-start text-[12px] text-[#C2C2C2]">{t('setting:backFileSizeLimit')}</span>
                      <input
                        type="file"
                        {...field}
                        id="backCard"
                        className="hidden"
                        accept=".jpg, .jpeg, .png"
                        onChange={(event) => {
                          onChange(event.target.files?.[0]);
                        }}
                      />
                      <label
                        htmlFor="backCard"
                        role="button"
                        className="bg-[#272C33] hover:bg-gray-700 px-[20px] py-[8px] flex items-center text-[12px] gap-[5px] rounded-default"
                      >
                        <Folder2 size={14} />
                        {t('setting:chooseFile')}
                      </label>
                    </div>
                  </div>
                );
              }}
            />
          </div>
          <button
            role="button"
            type="submit"
            className="bg-gradient-btn-play shadow-bs-btn hover:opacity-[0.9] rounded-default text-white text-[12px] sm:text-[14px] px-[30px] py-[10px] m-auto mt-[20px] w-fit"
          >
            Next
          </button>
        </form>
      </CommonModal>
    </>
  );
}
