import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Add, ArrowRotateLeft, ArrowRotateRight, Camera, Minus } from 'iconsax-react';
import NextImage from 'next/image';
import { ElementType, useCallback, useMemo, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_uploadAvatar } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, TOAST_ENUM } from '@/base/constants/common';
import { convertUserInfo, getSizeOfFileByMega } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import {
  changeIsShowInformation,
  changeIsShowUpdateAvatar,
  changeIsShowUpdateInformation,
} from '@/base/redux/reducers/modal.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import getCroppedImg from './cropImage';

type ModalUpdateAvatarProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalUpdateAvatar({ show, onClose }: ModalUpdateAvatarProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [avatarFile, setAvatarFile] = useState<File>();
  const [selectedAvatar, setSelectedAvatar] = useState<string>();
  const [isErrorAvatar, setIsErrorAvatar] = useState(false);

  const { avatar } = useSelector(
    (state: AppState) => ({
      avatar: state.auth.user.avatar,
    }),
    shallowEqual,
  );

  const handleZoomIn = () => {
    if (zoom < 10) {
      setZoom(zoom + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      const zoomValue = zoom - 0.1 < 0 ? 1 : zoom - 0.1;
      setZoom(zoomValue);
    }
  };

  const handleRotationLeft = () => {
    setRotation(rotation + 45);
  };

  const handleRotationRight = () => {
    setRotation(rotation - 45);
  };

  const goBackUpdateProfile = () => {
    dispatch(changeIsShowUpdateInformation(true));
    dispatch(changeIsShowUpdateAvatar(false));
  };

  const onCropComplete = useCallback(
    async (croppedArea: Area, croppedAreaPixels: Area) => {
      if (!selectedAvatar) return;
      const croppedImage = await getCroppedImg(selectedAvatar, croppedAreaPixels, 0);
      const myFile = new File([croppedImage], 'avatar.png', {
        type: 'image/png',
      });
      setAvatarFile(myFile);
    },
    [selectedAvatar],
  );

  const avatarCropper = useMemo(() => {
    if (selectedAvatar) {
      return selectedAvatar;
    }
    if (!isErrorAvatar) {
      return `${API_AVATAR}/${avatar}`;
    } else return 'img/avatar-1.png';
  }, [isErrorAvatar, avatar, selectedAvatar]);

  const handleUpdateProfile = async () => {
    try {
      if (avatarFile) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', avatarFile);
        if (getSizeOfFileByMega(avatarFile.size) > 0.5) {
          toast.error(String(t('setting:fileSizeLimit')), { containerId: TOAST_ENUM.COMMON });
          return;
        }
        const _res = await api_uploadAvatar(formData);
        const localFiat: CurrencyType = {
          id: _res.data.settingFiatCurrency.id ?? '',
          name: _res.data.settingFiatCurrency.symbol ?? '',
          alias: _res.data.settingFiatCurrency.name ?? '',
          logo: `/img/fiats/${_res.data.settingFiatCurrency.symbol}.png`,
          iso_currency: _res.data.settingFiatCurrency.iso_currency,
          iso_decimals: _res.data.settingFiatCurrency.iso_decimals,
          availableNetworks: [],
          price: Number(_res.data.settingFiatCurrency.price),
          type: 'fiat',
          favorite: _res.data.settingFiatCurrency.favorite,
        };
        dispatch(saveUserInfo({ ...convertUserInfo(_res.data) }));
        dispatch(setLocalFiat(localFiat));
        dispatch(changeIsShowInformation(true));
        dispatch(changeIsShowUpdateAvatar(false));
      }
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded !max-w-[464px] !h-[calc(100vh - 200px)]"
        header={
          <div className="modal-header">
            <div className="flex items-center dark:text-white text-black gap-[10px]">
              <ChevronLeftIcon width={20} role="button" onClick={() => goBackUpdateProfile()} />
              <div className="text-[18px] font-[600]">{t('profile:updateAvatar')}</div>
            </div>
          </div>
        }
      >
        <div className="flex-1 p-[20px] bg-[#f5f6fa] dark:bg-color-modal-bg-primary flex flex-col gap-[20px] h-full overflow-scroll">
          {isLoading && <Loader />}
          <div className="flex flex-col gap-[20px]">
            <div className="relative h-[300px] w-auto ">
              <Cropper
                image={avatarCropper}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                objectFit="vertical-cover"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{
                  mediaClassName: 'cropped-image dark:bg-transparent bg-red',
                  containerClassName: 'crop-container h-full w-fit m-auto rounded-[5px]',
                  cropAreaClassName: 'w-full h-full',
                }}
                rotation={rotation}
                onRotationChange={setRotation}
              />
              <label htmlFor="avatar" className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Camera role="button" size={30} />
              </label>
              <input
                className="hidden"
                name="avatar"
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files?.[0]) {
                    setSelectedAvatar(URL.createObjectURL(event.target.files?.[0]));
                  }
                }}
              ></input>
            </div>
            <div className="flex dark:bg-color-slider-primary bg-black/20 rounded gap-[10px]">
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleZoomOut}
              >
                <Minus width={18} height={18} />
              </button>
              <div className="relative flex items-center flex-1">
                <input
                  id="medium-range"
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(Number(e.target.value));
                  }}
                  className="w-full h-1 m-auto bg-gray-500 rounded-lg appearance-none cursor-pointer accent-amber-600"
                ></input>
              </div>
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleZoomIn}
              >
                <Add width={18} height={18} />
              </button>
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleRotationLeft}
              >
                <ArrowRotateLeft width={18} height={18} />
              </button>
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleRotationRight}
              >
                <ArrowRotateRight width={18} height={18} />
              </button>
            </div>
          </div>
          <div>
            <div className="dark:text-gray-500 text-gray-700 mb-[10px] text-[14px]">
              {t('updateAvatar:defaultAvatar')}
            </div>
            <div className="flex gap-[10px] items-center justify-center">
              <NextImage
                role="button"
                src={'img/avatar-1.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-1.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-2.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-2.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-3.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-3.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-4.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-4.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-5.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-5.png');
                }}
              />
              <label
                htmlFor="avatar"
                role="button"
                className="w-[49px] h-[49px] rounded-full border border-solid border-color-primary flex items-center justify-center"
              >
                <Add />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-btn-play shadow-bs-btn w-full rounded-default flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-2 mt-1"
            onClick={() => handleUpdateProfile()}
          >
            <div />
            <div className="text-[14px] text-white">{t('profile:modify')}</div>
            <div className="px-[10px] py-[5px] flex items-center justify-center rounded-[3px] bg-white/20">
              <NextImage height={14} width={14} src="/img/icon/arrow-right.png" alt="arrow right" />
            </div>
          </button>
          {!isErrorAvatar && avatar && (
            <NextImage
              role="button"
              src={avatar ? `${API_AVATAR}/${avatar}` : '/img/avatar-1.png'}
              alt="avatar"
              height={50}
              width={50}
              className="hidden"
              onError={(e) => {
                setIsErrorAvatar(true);
              }}
            />
          )}
        </div>
      </CommonModal>
    </>
  );
}
