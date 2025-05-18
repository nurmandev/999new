import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';

import { api_bonusClaim } from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import { TOAST_ENUM } from '@/base/constants/common';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { getBalance, setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalSpinClaimProps = {
  onClose: () => void;
  show: boolean;
  amount: number;
  symbol: string;
  symbolLogo: string;
  spinType: string;
  bonusId: string;
  claimable: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalSpinClaim({
  amount,
  symbol,
  symbolLogo,
  spinType,
  bonusId,
  claimable,
  show,
  onClose,
}: ModalSpinClaimProps) {
  const { t } = useTranslation('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const dispatch = useAppDispatch();
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const onClickClaim = async () => {
    if (claimable) {
      try {
        setIsClaiming(true);
        await api_bonusClaim(bonusId, 'lucky_spin');

        const _resBonus = await api_getClaims();
        const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);

        dispatch(getBalance());
        dispatch(setLockedAmount(tempLockedAmount));
        toast.success(t('success:bonusClaimed'), { containerId: TOAST_ENUM.COMMON });
      } catch (error: any) {
        const errType = error.response?.data?.message ?? '';
        const errMessage = getErrorMessage(errType);
        toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      } finally {
        setIsClaiming(false);
      }
    }
    onClose();
  };

  useEffect(() => {
    setTimeout(() => {
      setCurrentAmount('0');
    }, 300);
    new Array(20).fill(0).map((_, index) => {
      setTimeout(() => {
        setCurrentAmount(((amount * index) / 20).toFixed(3));
      }, 300 + 40 * (index + 1));
    });
    setTimeout(() => {
      setCurrentAmount(`${amount}`);
    }, 300 + 40 * 21);
  }, [show, amount]);
  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded-default sm:!max-w-[400px] !max-w-[300px] !mx-[10px] !h-auto"
        position="flex-col justify-center items-center"
        isCongrat
      >
        <div className="relative flex flex-col items-center justify-center px-5 py-8 overflow-y-auto">
          <Image width={400} height={600} src={`/img/spin/${spinType}-popup.png`} alt="spin-popup" className="w-[80%] m-auto" />
          <div className="flex items-center text-2xl sm:text-3xl text-[#FFE600] font-bold mt-8">
            <span className="mr-1">{`+ `}</span>
            <span className="font-bold">{currentAmount}</span>
            <span className="ml-1">{`${symbol}`}</span>
            {symbolLogo && (
              <Image width={25} height={25} className="ml-2 w-[30px] sm:w-[40px]" src={symbolLogo} alt="symbol" />
            )}
          </div>
          {claimable && (
            <div
              className="bg-gradient-btn-play shadow-bs-btn w-full min-h-[40px] sm:min-h-[50px] text-default text-center mt-5 rounded-large hover:cursor-pointer flex justify-center items-center"
              onClick={onClickClaim}
            >
              {isClaiming ? (
                <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-8 !h-8" />
              ) : (
                <div>{t(`bonus:spinClaim`)}</div>
              )}
            </div>
          )}
        </div>
      </CommonModal>
    </>
  );
}
