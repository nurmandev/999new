import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_getSpinAvailableCount, api_getSpinData, api_postSpinTry } from '@/api/spin';
import { api_getProfile } from '@/api/user';
import { api_getClaims } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, TOAST_ENUM } from '@/base/constants/common';
import { useHeight } from '@/base/hooks/useHeight';
import { currencyFormat1 } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowSpin,
  changeIsShowSpinClaim,
} from '@/base/redux/reducers/modal.reducer';
import { setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';
import ModalLatestSpins from './latestSpin';
import ModalSpinClaim from './luckySpinClaim';

type ModalSpinProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

// const speed = 2; // deg per millisecond
const duration = 9500; // milli second

interface SpinItem {
  symbol: string;
  symbolLogo: string;
  amount: number;
  amountUsd: number;
  id: string;
  claimable?: boolean;
}

type SpinDataType = {
  userName: string;
  userAvatar: string;
  amount: number;
  amountUsd: number;
  symbol: string;
  symbolLogo: string;
  type: string;
};

export default function ModalSpin({ show, onClose }: ModalSpinProps) {
  const { t } = useTranslation('');
  const [rotate, setRotate] = useState(0);
  const dispatch = useDispatch();
  const [isRotating, setIsRotating] = useState(false);
  const [isShowLatestSpins, setisShowLatestSpins] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const height = useHeight();

  const [spinTab, setSpinTab] = useState<'lucky' | 'super' | 'mega'>('lucky');
  const spins: Array<'lucky' | 'super' | 'mega'> = ['lucky', 'super', 'mega'];

  const [spinItems, setSpinItems] = useState<{ lucky: SpinItem[]; super: SpinItem[]; mega: SpinItem[] }>({
    lucky: [],
    super: [],
    mega: [],
  });
  const [currentSpin, setCurrentSpin] = useState<SpinItem>();
  const [spinBonusTotal, setSpinBonusTotal] = useState<number>(0);
  const [latestSpin, setLatestSpin] = useState<SpinDataType>();
  const [spinAvailable, setSpinAvailable] = useState<boolean>(true);
  const [currentVipLevel, setCurrentViplevel] = useState<number>(0);
  const [spinAvailableCount, setSpinAvailableCount] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const { isLogin, isShowSpinClaim, user, isShowSpin, localFiat } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isShowSpinClaim: state.modal.isShowSpinClaim,
      isShowSpin: state.modal.isShowSpin,
      user: state.auth.user,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  const timeOut = useRef<any>(null);

  const getSpinAvailableCount = async () => {
    try {
      if (!user.userId) return;
      const res = await api_getSpinAvailableCount();
      const tempAvailableCount = res.data?.availableSpinCount || 0;
      setSpinAvailableCount(tempAvailableCount);

      const profileResponse = await api_getProfile(user.userId || '');
      const vipLevel = Number(profileResponse.data?.currentVipLevel || 0);
      if (vipLevel >= 70) setSpinTab('mega');
      else if (vipLevel >= 22) setSpinTab('super');
      else setSpinTab('lucky');
      setCurrentViplevel(vipLevel);

      checkSpinAvailable(vipLevel, spinTab, tempAvailableCount);
    } catch (error) {
      setSpinAvailable(false);
      setCurrentViplevel(0);
    }
  };

  const getSpinData = async () => {
    try {
      const res = await api_getSpinData();
      const tempLuckyData = res.data.data['lucky'].map((item: any) => ({
        symbol: item.symbol || '',
        symbolLogo: item.symbolLogo || '',
        amount: item.amount || 0,
        amountUsd: item.amountUsd || 0,
        id: item.id || 0,
      }));
      const tempSuperData = res.data.data['super'].map((item: any) => ({
        symbol: item.symbol || '',
        symbolLogo: item.symbolLogo || '',
        amount: item.amount || 0,
        amountUsd: item.amountUsd || 0,
        id: item.id || 0,
      }));
      const tempMegaData = res.data.data['mega'].map((item: any) => ({
        symbol: item.symbol || '',
        symbolLogo: item.symbolLogo || '',
        amount: item.amount || 0,
        amountUsd: item.amountUsd || 0,
        id: item.id || 0,
      }));
      if (res.data.lastSpinner) {
        const tempLatestSpin: SpinDataType = {
          amount: res.data.lastSpinner.amount || 0,
          amountUsd: res.data.lastSpinner.amountUsd || 0,
          symbol: res.data.lastSpinner.symbol || '',
          symbolLogo: res.data.lastSpinner.symbolLogo || '',
          type: res.data.lastSpinner.type || '',
          userAvatar: res.data.lastSpinner.userAvatar || '',
          userName: res.data.lastSpinner.userName || '',
        };
        setLatestSpin(tempLatestSpin);
      }
      setSpinBonusTotal(res.data.totalBonusUsd || 0);
      setSpinItems({ lucky: tempLuckyData, super: tempSuperData, mega: tempMegaData });
    } catch (error) {
      setSpinItems({ lucky: [], super: [], mega: [] });
      setSpinBonusTotal(0);
    } finally {
    }
  };

  useEffect(() => {
    if (isLogin && isShowSpin) {
      getSpinAvailableCount();
    }
    getSpinData();
  }, [isShowSpinClaim, isShowSpin, isLogin]);

  const spinPlay = async () => {
    if (isSpinning) return;
    if (!isLogin) {
      dispatch(changeIsShowSpin(false));
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
      return;
    }
    if (!spinAvailable || isRotating) {
      return;
    }
    setIsSpinning(true);
    let deltaAngle = 0;
    try {
      const res = await api_postSpinTry(spins.indexOf(spinTab));
      const spinId = (res.data.spinId || 1) - 1;
      const claimable = res.data.availableClaim || false;
      const id = res.data.bonusId || '';
      const spin = spinItems?.[spinTab]?.at(spinId);
      setCurrentSpin({
        symbol: spin?.symbol || '',
        symbolLogo: spin?.symbolLogo || '',
        amount: spin?.amount || 0,
        amountUsd: spin?.amountUsd || 0,
        id: id,
        claimable: claimable || false,
      });
      deltaAngle = 22.5 * spinId;
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setIsSpinning(false);
      return;
    }
    audio?.play();
    const initRotate = rotate;
    const deltaD = 360 * 20 - deltaAngle - (initRotate % 360);
    const maxSpeed = deltaD / duration;
    const acceleration = (maxSpeed / duration) * 2;
    const currentTime = new Date();
    setIsRotating(true);
    let timer = setInterval(() => {
      const time = new Date();
      const dT = time.getTime() - currentTime.getTime();

      let updateRotate = 0;
      if (dT < duration / 2) {
        updateRotate = initRotate + (acceleration * dT * dT) / 2;
      } else {
        updateRotate = initRotate + maxSpeed * duration - (acceleration * (duration - dT) * (duration - dT)) / 2;
      }
      setRotate(updateRotate);
    }, 1);
    timeOut.current = setTimeout(async () => {
      clearInterval(timer);
      setIsSpinning(false);
      // setRotate(deltaD);
      setIsRotating(false);
      const _resBonus = await api_getClaims();
      const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);

      dispatch(setLockedAmount(tempLockedAmount));

      onClose();
      dispatch(changeIsShowSpinClaim(true));
    }, duration);
  };

  useEffect(() => {
    return () => {
      setRotate(0);
      clearTimeout(timeOut.current);
    };
  }, []);

  useEffect(() => {
    setAudio(new Audio('/audio/spin.mp3'));
    setRotate(0);
  }, [show]);

  const onSpinTabChange = (spin: 'lucky' | 'super' | 'mega') => {
    if (isRotating === true) return;
    setSpinTab(spin);
    checkSpinAvailable(currentVipLevel, spin, spinAvailableCount);
  };

  const checkSpinAvailable = (vipLevel: number, spin: 'lucky' | 'super' | 'mega', spinCount: number) => {
    const minimumLevel = spin === 'super' ? 22 : spin === 'mega' ? 70 : 0;
    setSpinAvailable(vipLevel >= minimumLevel && spinCount > 0);
  };
  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass={cn('sm:rounded max-w-full sm:max-w-[430px] sm:!h-auto !bg-transparent', {
          'sm:py-[10px] sm:!max-h-[calc(100vh_-_20px)]': isMobile,
        })}
        position="flex-col justify-center items-center"
        isScrollableInRotate
      >
        <div className={`max-w-full sm:w-[430px] overflow-hidden overflow-y-scroll h-full bg-cover ${styles[spinTab]}`}>
          <div
            className={`sm:rounded-large h-full flex flex-col items-center sm:justify-between relative mb-5 justify-start`}
          >
            <div className={`${height > 660 ? 'pt-9' : 'pt-2'} flex justify-between px-5 w-full pb-0 items-center`}>
              <div className="relative flex gap-0">
                {spins.map((spin) => (
                  <Image
                    key={`${spin}-tab`}
                    width={150}
                    height={151}
                    className={`w-[60px] h-[60px] z-[5] ${isRotating ? 'cursor-not-allowed' : 'cursor-pointer '}`}
                    src={spin === spinTab ? `/img/spin/${spin}-spin.png` : `/img/spin/disabled-${spin}-spin.png`}
                    alt="spin"
                    onClick={() => onSpinTabChange(spin)}
                  />
                ))}
                <div
                  className={cn('rounded-large absolute w-[33%] h-[100%] transition-all bg-[#7777]', {
                    'translate-x-[0%]': spinTab === 'lucky',
                    'translate-x-[101%]': spinTab === 'super',
                    'translate-x-[204%]': spinTab === 'mega',
                  })}
                />
              </div>
              <Image
                width={150}
                height={151}
                className="object-contain h-[70px]"
                src={`/img/spin/${spinTab}-level.png`}
                alt="spin-level"
              />
            </div>

            <div className="relative sm:min-w-[350px] sm:min-h-[430px] px-[30px] sm:p-3">
              <div>
                <div className="relative flex flex-col items-center justify-center">
                  <div>
                    <Image
                      width={781}
                      height={781}
                      src={`/img/spin/${spinTab}-ring.png`}
                      alt="spin-ring"
                      className={`absolute p-1 ${styles['ring-rotation']}`}
                    />
                    <div
                      className="w-[full] h-full relative origin-center overflow-hidden"
                      style={{ transform: `rotate(${rotate}deg)` }}
                    >
                      <Image
                        width={781}
                        height={781}
                        src={'/img/spin/spin-wheel.png'}
                        alt="spin wheel"
                        className="w-full h-full p-10"
                      />
                      {spinItems?.[spinTab].map((item, index) => (
                        <div
                          key={index}
                          className="absolute flex gap-[2px] justify-end items-center top-[50%] left-[50%] right-[48px] text-[14px] leading-[20px] -mt-[10px]"
                          style={{ transform: `rotate(${22.5 * index}deg)`, transformOrigin: 'left' }}
                        >
                          <span className="font-bold text-[12px]">{currencyFormat1(item.amount, 9, '', false).slice(0, 10)}</span>
                          <Image width={14} height={14} className="w-[16px] h-[16px]" src={item.symbolLogo} alt="symbol" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute w-[30%] top-[28.7%] z-[6] cursor-pointer">
                    <div
                      className={cn(
                        styles.spin,
                        `${spinAvailable ? styles.spin_button : ''}`,
                        'relative overflow-hidden rounded-full',
                        {
                          'cursor-not-allowed': isRotating || !spinAvailable,
                        },
                      )}
                      onClick={spinPlay}
                    >
                      <Image
                        width={230}
                        height={233}
                        className={cn('w-full h-auto object-cover')}
                        alt="spin tab"
                        src={`/img/spin/${spinTab}-spin-button.png`}
                      />
                    </div>
                  </div>
                  <div
                    className="absolute top-[33.6%] left-[62%] right-[2%] z-[5]"
                    style={{ transform: 'rotate(0deg)', transformOrigin: 'left center' }}
                  >
                    <Image width={353} height={193} src={`/img/spin/${spinTab}-select-spin.png`} alt="spin tab" />
                  </div>
                  <div className="-mt-[27px] z-[2] mx-[10px]">
                    <Image
                      width={856}
                      height={402}
                      className="w-[80%] m-auto"
                      alt="spin ribbon"
                      src={`/img/spin/${spinTab}-spin-ribbon.png`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`mb-${height > 660 ? 5 : 3
                } bg-[#121519] w-[calc(100%-40px)] rounded-large px-5 h-full min-h-[95px] max-h-[100px] flex`}
            >
              <div className="flex-1 flex flex-col justify-center border-solid border-r-[1px] border-r-[#222] text-m_default sm:text-default">
                <div className="font-bold uppercase">{t('bonus:spinBonusTotal')}</div>
                <div className="font-bold text-color-primary">
                  {/* {`$ `}
                  {spinBonusTotal} */}
                  {currencyFormat1(spinBonusTotal, 4, localFiat?.name)}
                </div>
              </div>
              <div
                className="flex items-center justify-between flex-1 gap-2 pl-2 text-default hover:cursor-pointer"
                onClick={() => {
                  setisShowLatestSpins(true);
                }}
              >
                <Image
                  height={25}
                  width={25}
                  src={latestSpin?.userAvatar ? `${API_AVATAR}/${latestSpin?.userAvatar}` : '/img/avatar-1.png'}
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                  alt="avatar"
                  className="object-cover rounded-full h-[25px] w-[25px]"
                />
                <div className="w-full text-m_default sm:text-default">
                  <div>{latestSpin?.userName || ''}</div>
                  <div className="flex gap-1">
                    <div className="flex gap-1 font-bold text-color-primary">
                      {latestSpin?.amount || 0}
                      <Image
                        width={25}
                        height={25}
                        className="w-[20px]"
                        src={latestSpin?.symbolLogo || '/img/fiats/USD.png'}
                        alt="currency"
                      />
                    </div>
                  </div>
                  <div className="uppercase">{`${latestSpin?.type || ''} SPIN`}</div>
                </div>
                <ArrowRight2 className="-mr-3" />
              </div>
            </div>
          </div>
        </div>
      </CommonModal>

      <ModalSpinClaim
        show={isShowSpinClaim || false}
        onClose={() => dispatch(changeIsShowSpinClaim(false))}
        amount={currentSpin?.amount || 0}
        symbolLogo={currentSpin?.symbolLogo || ''}
        symbol={currentSpin?.symbol || ''}
        spinType={spinTab}
        claimable={currentSpin?.claimable || false}
        bonusId={currentSpin?.id || ''}
      />
      <ModalLatestSpins show={isShowLatestSpins} onClose={() => setisShowLatestSpins(false)} />
    </>
  );
}
