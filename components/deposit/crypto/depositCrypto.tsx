import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { InfoCircle } from 'iconsax-react';
import { useQRCode } from 'next-qrcode';
import { useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { DEPOSIT_BONUS } from '@/base/constants/common';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { copyClipBoard, currencyFormat1 } from '@/base/libs/utils';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';
import { DepositAddressComponent } from '@/components/depositAddress/depositAddress';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';
import { changeIsShowAddressConfirm } from '@/base/redux/reducers/modal.reducer';
import cn from 'classnames';

const DepositCryptoComponent = () => {
  const usdtPrice = useUSDTPrice();
  const dispatch = useAppDispatch();
  const [activeCoin, setActiveCoin] = useState<CurrencyType>({
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    availableNetworks: [],
    iso_decimals: 0,
    price: 0,
    type: 'crypto',
    favorite: false,
  });
  const [activeNetwork, setActiveNetwork] = useState<CryptoNetWorkType>({
    id: '',
    name: '',
    type: 1,
  });
  const { Canvas } = useQRCode();
  const { t } = useTranslation('');

  const { wallets, currentDepositTime } = useSelector(
    (state: AppState) => ({
      wallets: state.wallet.depositAddress,
      currentDepositTime: state.wallet.depositTime,
    }),
    shallowEqual,
  );

  const depositDetail = useMemo(() => {
    const nextDeposit = currentDepositTime + 1;
    let rankReturn: any = '';
    let depositData: any = null;
    if (nextDeposit > 4) {
      rankReturn = 4;
    } else {
      switch (nextDeposit) {
        case 1:
          rankReturn = '1st';
          depositData = DEPOSIT_BONUS[0];
          break;
        case 2:
          rankReturn = '2nd';
          depositData = DEPOSIT_BONUS[1];
          break;
        case 3:
          rankReturn = '3rd';
          depositData = DEPOSIT_BONUS[2];
          break;
        case 4:
          rankReturn = '4th';
          depositData = DEPOSIT_BONUS[3];
          break;
      }
    }

    return {
      rankReturn,
      percent: depositData ? depositData.percent : 0,
      minAmount: depositData ? depositData.minAmount : 0,
      uptoAmount: depositData ? depositData.maxAmount : 0,
    };
  }, [currentDepositTime]);

  return (
    <>
      <div className="md:max-w-[492px]">
        <div>
          <SelectCurrency
            activeCoin={activeCoin}
            activeNetwork={activeNetwork}
            onChangeNetwork={setActiveNetwork}
            onChangeCoin={setActiveCoin}
          />
        </div>

        <div className="flex flex-col items-start w-full gap-2 mt-[20px]">
          {currentDepositTime <= 3 && (
            <div className="flex items-center gap-[5px]">
              <div
                className="text-start text-m_default sm:text-default dark:text-[#C2C2C2] text-color-light-text-primary"
                dangerouslySetInnerHTML={{
                  __html: String(
                    t('deposit:getExtra', {
                      percent: `${depositDetail.percent}%`,
                      value: `${currencyFormat1(depositDetail.minAmount / activeCoin.price, 4, '', false).padEnd(
                        10,
                        '0',
                      )} ${activeCoin.name}`,
                    }),
                  ),
                }}
              ></div>
              <InfoCircle
                width={17}
                height={17}
                className="text-color-primary w-[18px] h-[18px]"
                role="button"
                data-tooltip-id={'deposit-tooltip'}
              />
              <Tooltip id={'deposit-tooltip'} place="bottom" className="dark:bg-black bg-white">
                <div>
                  <p className="text-white">
                    {depositDetail.rankReturn}&nbsp;{t('deposit:depositBonus')}
                  </p>
                  <p className="text-color-text-primary">{`${depositDetail.percent}% ${t(
                    'deposit:upTo',
                  )} ${currencyFormat1((depositDetail.uptoAmount * usdtPrice) / activeCoin.price, 8, '', false)} ${activeCoin.name
                    }`}</p>
                  <p className="text-color-text-primary">
                    {t('deposit:minimumDeposit')}{' '}
                    {`${currencyFormat1(depositDetail.minAmount / activeCoin.price, 4, '', false)} ${activeCoin.name}`}
                  </p>
                </div>
              </Tooltip>
            </div>
          )}

          {wallets.findIndex((wallet) => wallet.networkId === activeNetwork?.id) != -1 && (
            <div className={cn("flex sm:flex-row flex-col items-center",
              "dark:text-white text-color-light-text-primary dark:bg-color-canvas-bg-primary bg-color-light-bg-primary",
              "rounded-default w-full gap-[20px] py-[13px] px-[20px]")}>
              <div className="rounded-[16px]">
                <Canvas
                  text={String(wallets.find((wallet) => wallet.networkId === activeNetwork.id)?.address)}
                  options={{
                    margin: 3,
                    scale: 4,
                    width: 120,
                    color: {
                      dark: '#000',
                      light: '#FFF',
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-[10px] items-start">
                <>
                  <div className="text-[12px] dark:text-color-text-primary text-color-light-text-primary">
                    {t('deposit:depositAddress')}
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-[20px] dark:bg-[#FFF2] bg-[#E7EAF0] p-[10px] rounded-default">
                    <DepositAddressComponent
                      className="rounded-default text-[14px] text-start"
                      address={String(wallets.find((wallet) => wallet.networkId === activeNetwork.id)?.address)}
                    />
                    <div
                      className="bg-color-primary hover:opacity-[0.9] rounded-[5px] cursor-pointer flex items-center gap-[5px] p-2 text-[12px] text-white"
                      onClick={() => {
                        dispatch(changeIsShowAddressConfirm(true));
                        copyClipBoard(
                          String(String(wallets.find((wallet) => wallet.networkId === activeNetwork.id)?.address)), false
                        );
                      }}
                    >
                      <DocumentDuplicateIcon width={18} height={18} />
                      {t('deposit:copy')}
                    </div>
                  </div>
                </>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-large mt-[20px] w-full px-[20px] py-[10px] dark:text-white text-color-light-text-primary dark:bg-color-notice-primary bg-color-light-notice-primary/10 text-start">
          <p className="text-[14px]">
            <span className="text-color-primary me-1 inline text-[16px]">{t('deposit:notice')}</span>{' '}
            {t('deposit:doNotDeposit', { crypto: String(activeCoin.name) })}
          </p>
        </div>
      </div>
    </>
  );
};

export default DepositCryptoComponent;
