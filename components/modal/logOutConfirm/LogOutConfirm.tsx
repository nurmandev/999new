import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { googleLogout } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { ElementType, useState } from 'react';
import ReactLoading from 'react-loading';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { logoutState } from '@/base/redux/reducers/auth.reducer';
import { changeIsShowAccountPannel, changeIsShowLogOutConfirm } from '@/base/redux/reducers/modal.reducer';
import { logoutWallet } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';

import MobileModal from '../commonModal/mobileModal';

type ModalFiatProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalLogOutConfirm({ show, onClose }: ModalFiatProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { t } = useTranslation('');
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const onClikLogOut = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      CookiesStorage.logout();
      googleLogout();
      dispatch(logoutState());
      dispatch(logoutWallet());
      dispatch(changeIsShowAccountPannel(false));
      onClose();
    }, 500);
  };
  return (
    <>
      <MobileModal
        show={show}
        onClose={() => dispatch(changeIsShowLogOutConfirm(false))}
        panelClass="rounded"
        header={
          <div className="relative p-[20px]">
            <div className="flex items-center text-white gap-[10px]">
              <div className="text-[14px] font-[500]">{t('layout:logOut')}</div>
            </div>
          </div>
        }
      >
        <div className="p-5 pt-2 flex flex-col justify-center gap-4">
          <div className="text-default">{t('layout:logOutQuestion')}</div>
          <div className="flex justify-between gap-5">
            <button
              className={`${isLoggingOut ? 'py-0' : 'py-3'
                } bg-gradient-btn-play shadow-bs-btn w-[50%] rounded-large text-default flex justify-center`}
              onClick={onClikLogOut}
            >
              {isLoggingOut ? (
                <ReactLoading type="bubbles" color="#00AAE6" delay={50} height={45} width={45} />
              ) : (
                <span>{t('layout:logOut')}</span>
              )}
            </button>
            <button
              className="py-3 bg-gradient-btn-play shadow-bs-btn w-[50%] rounded-large text-default"
              onClick={() => dispatch(changeIsShowLogOutConfirm(false))}
            >
              {t('layout:cancel')}
            </button>
          </div>
        </div>
      </MobileModal>
    </>
  );
}
