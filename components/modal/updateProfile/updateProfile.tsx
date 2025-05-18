import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_editUserName } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, TOAST_ENUM } from '@/base/constants/common';
import { convertUserInfo } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import {
  changeIsShowInformation,
  changeIsShowUpdateAvatar,
  changeIsShowUpdateInformation,
  changeSelectedAvatar,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { EnumTypeInput } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import InputText from '@/components/input/typing/InputText';

import CommonModal from '../commonModal/commonModal';

type ModalUpdateProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type UpdateProfileFormType = {
  username: string;
};

export default function ModalUpdateProfile({ show, onClose }: ModalUpdateProfileProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File>();

  const { userName, avatar } = useSelector(
    (state: AppState) => ({
      userName: state.auth.user.userName,
      avatar: state.auth.user.avatar,
    }),
    shallowEqual,
  );
  const schema = yup.object().shape({
    username: yup
      .string()
      .required(String(t('authentication:usernameRequired')))
      .trim(),
  });

  const { handleSubmit, control, reset } = useForm<UpdateProfileFormType>({
    resolver: yupResolver(schema),
    defaultValues: { username: userName },
  });

  useEffect(() => {
    reset({ username: userName });
  }, [userName, show]);

  const goBackProfile = () => {
    dispatch(changeIsShowInformation(true));
    dispatch(changeIsShowUpdateInformation(false));
  };

  const handleUpdateProfile = async (formUpdateProfile: UpdateProfileFormType) => {
    try {
      setIsLoading(true);
      const _res = await api_editUserName(formUpdateProfile.username);
      dispatch(
        saveUserInfo({
          ...convertUserInfo(_res.data),
        }),
      );
      goBackProfile();
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      dispatch(changeSelectedAvatar(URL.createObjectURL(selectedFile)));
      dispatch(changeIsShowUpdateAvatar(true));
      dispatch(changeIsShowUpdateInformation(false));
    }
  }, [selectedFile]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded !max-w-[464px]"
        header={
          <div className="modal-header">
            <div
              className="flex items-center text-black dark:text-white gap-[10px] hover:cursor-pointer"
              onClick={() => goBackProfile()}
            >
              <ChevronLeftIcon width={20} role="button" />
              <div className="text-[18px] font-[600]">{t('profile:updateInformation')}</div>
            </div>
          </div>
        }
      >
        <div className="flex-1 flex gap-[10px] justify-center sm:items-center items-start p-[20px] bg-color-light-bg-primary dark:bg-color-modal-bg-primary">
          {isLoading && <Loader />}
          <div className="flex flex-col items-center gap-[10px] w-full">
            <div className="relative flex flex-col items-center gap-[10px] w-full">
              <div className="h-[150px] w-[150px] rounded-full overflow-hidden">
                <Image
                  height={150}
                  width={150}
                  src={avatar ? `${API_AVATAR}/${avatar}` : '/img/avatar-1.png'}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                />
              </div>
              <label
                className="rounded-[5px] text-[14px] font-[400] text-black dark:text-white px-[10px] py-[5px] cursor-pointer dark:bg-[#2e333a99] bg-[#eceef4] dark:hover:bg-gray-600 hover:bg-gray-200 relative top-[-30px]"
                onClick={() => {
                  dispatch(changeIsShowUpdateAvatar(true));
                  dispatch(changeIsShowUpdateInformation(false));
                }}
              >
                {t('profile:editAvatar')}
              </label>
            </div>
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="flex flex-col items-center gap-[10px] sm:max-w-[500px] w-full"
            >
              <div className="w-full">
                <label htmlFor="username" className="dark:text-white ml-[10px]">
                  {t('profile:username')}
                </label>
                <InputText
                  customClass="px-[20px] py-[10px] my-[10px] rounded-default"
                  control={control}
                  typeInput={EnumTypeInput.EMAIL}
                  placeholder={String(t('profile:username'))}
                  name="username"
                  id="username"
                />
                <div className="text-[14px] dark:text-[#939699] ml-[10px]">{t('profile:usernameNotice')}</div>
              </div>
              <button
                type="submit"
                className="bg-gradient-btn-play shadow-bs-btn w-full rounded-default flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-5 mt-3"
              >
                <div />
                <div className="text-[14px] text-white">{t('profile:modify')}</div>
                <div className="p-[10px] flex items-center justify-center rounded-[3px] bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="arrow right" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
