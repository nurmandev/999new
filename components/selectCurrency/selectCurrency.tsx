import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { Lock } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';

import InputSearch from '../input/typing/InputSearch';

type SelectCurrencyProps = {
  activeCoin: CurrencyType;
  activeNetwork: CryptoNetWorkType;
  onChangeCoin: (coin: CurrencyType) => void;
  onChangeNetwork: (network: CryptoNetWorkType) => void;
  withDrawTab?: boolean;
  disabled?: boolean;
  isShowNetwork?: boolean;
  labelText?: string;
};

const fiatDecimals = 2;
const cryptoDecimals = 4;

const SelectCurrency = ({
  activeCoin,
  activeNetwork,
  onChangeCoin,
  onChangeNetwork,
  withDrawTab,
  disabled = false,
  isShowNetwork = true,
  labelText = '',
}: SelectCurrencyProps) => {
  const usdtPrice = useUSDTPrice();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const { query } = useRouter();
  const width = useWidth();

  const { symbols, balances, networks, localFiat, lockedAmount, viewInFiat, activeCurrency } = useSelector(
    (state: AppState) => ({
      symbols: state.wallet.symbols,
      balances: state.wallet.balances,
      networks: state.wallet.networks,
      localFiat: state.wallet.localFiat,
      lockedAmount: state.wallet.lockedAmount,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      activeCurrency: state.wallet.activeCurrency,
    }),
    shallowEqual,
  );

  const [availableNetworks, setAvailabeNetworks] = useState<CryptoNetWorkType[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  const filterListCoin = useMemo(() => {
    return symbols
      .filter((item) => String(item.name).toLowerCase().includes(searchInput.toLowerCase()))
      .sort(
        (a, b) =>
          (balances.find((item) => item.symbolId === b.id)?.amount || 0) * b.price -
          (balances.find((item) => item.symbolId === a.id)?.amount || 0) * a.price,
      );
  }, [symbols, searchInput, balances]);

  useEffect(() => {
    if (networks.length > 0) {
      /*****  SET BSC network as default network *****/
      const defaultNetwork = networks.find((item) => item.name.toLowerCase() === 'bsc');
      if (defaultNetwork) {
        onChangeNetwork(defaultNetwork);
        // USDT is exist in all networks....
        setAvailabeNetworks([...networks]);
      }
    }
  }, [networks]);

  useEffect(() => {
    if (symbols.length > 0) {
      /***** SET USDT as default symbol *****/
      if (activeCurrency?.id) {
        handleChangeCrypto(activeCurrency);
      }
      else {
        const defaultSymbol = symbols.find((item) => item.name.toLowerCase() === 'usdt');
        if (defaultSymbol) {
          handleChangeCrypto(defaultSymbol);
        }
      }
    }
  }, [symbols, activeCurrency]);

  const handleChangeCrypto = (symbol: CurrencyType) => {
    const availableNetworkIds = symbol.availableNetworks;

    const filteredNetworks: CryptoNetWorkType[] = networks.filter((item) => availableNetworkIds.indexOf(item.id) != -1);
    if (filteredNetworks.length > 0) {
      const defaultNetwork = filteredNetworks[0];
      onChangeNetwork(defaultNetwork);
    }

    setAvailabeNetworks([...filteredNetworks]);
    setSearchInput('');
    onChangeCoin(symbol);

  };

  const getBalanceBySymbol = (symbol: CurrencyType) => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === symbol.id);

    return selectedBalance?.amount || 0;
  };

  useEffect(() => {
    if (query.coin) {
      const coin = symbols.find((e) => e.name.toUpperCase() === String(query.coin).toUpperCase());
      if (coin) {
        handleChangeCrypto(coin);
      }
    }
  }, [query, symbols, networks]);

  return (
    <div className="flex flex-col items-start md:gap-[20px] gap-[15px] text-white">
      <div className="flex flex-col items-start w-full gap-2">
        {!withDrawTab && (
          <div className="text-default dark:text-color-text-primary text-color-light-text-primary">
            {labelText ? labelText : t('deposit:depositCurrency')}
          </div>
        )}
        {withDrawTab && (
          <div className="text-default dark:text-color-text-primary text-color-light-text-primary">
            {labelText ? labelText : t('withdraw:withdrawCurrency')}
          </div>
        )}
        <Menu as="div" className="relative block w-full ">
          {({ open }) => (
            <>
              {!withDrawTab && (
                <div className="flex w-full gap-1 overflow-hidden overflow-x-auto mb-3">
                  {symbols.slice(0, width >= 510 ? 4 : 3).map((symbol, index) => (
                    <button
                      className={cn(
                        'sm:min-w-[80px] pl-1 pr-3 pt-[2px] pb-[6px] dark:text-white text-color-light-text-primary rounded-full flex items-center gap-2 capitalize',
                        'hover:bg-color-primary', // Hover color
                        {
                          'border-2 border-color-primary': symbol.id === activeCoin.id, //Active Symbol
                          'border-2 border-color-light-border-primary dark:border-color-border-primary':
                            symbol.id !== activeCoin.id, //Not Active Symbol
                        },
                      )}
                      key={index}
                      onClick={() => handleChangeCrypto(symbol)}
                    >
                      <Image
                        width={24}
                        height={24}
                        src={symbol.logo ? symbol.logo : '/img/fiats/USDT.png'}
                        className="inline"
                        alt="symbol"
                        onError={(e) => {
                          e.currentTarget.src = '/img/fiats/USDT.png';
                        }}
                      />

                      <div className="text-default font-normal pt-[3px]">{symbol.name}</div>
                    </button>
                  ))}
                  <Menu.Button
                    className={cn(
                      'sm:min-w-[80px] pl-1 pr-3 py-1 dark:text-white text-color-light-text-primary rounded-full flex items-center gap-2 capitalize',
                      'hover:bg-color-primary border-2 border-color-light-border-primary dark:border-color-border-primary',
                    )}
                  >
                    <div className="flex pl-2">
                      {symbols.slice(width >= 510 ? 4 : 3, width >= 510 ? 7 : 6).map((symbol, index) => (
                        <Image
                          key={index}
                          width={24}
                          height={24}
                          src={symbol.logo ? symbol.logo : '/img/fiats/USD.png'}
                          className="w-6 h-6 -ml-2"
                          alt="symbol"
                          onError={(e) => {
                            e.currentTarget.src = '/img/fiats/USD.png';
                          }}
                        />
                      ))}
                    </div>
                    {t('deposit:more')}
                  </Menu.Button>
                </div>
              )}
              <Menu.Button className="w-full flex-1" disabled={disabled}>
                <div
                  className={cn(
                    'dark:bg-color-input-primary bg-color-light-input-primary rounded-default flex items-center justify-between w-full py-[13px] px-[20px]',
                  )}
                >
                  <div className="flex-1 flex items-center justify-start gap-[10px]">
                    <Image
                      width={30}
                      height={30}
                      src={activeCoin.logo ? activeCoin.logo : '/img/fiats/USD.png'}
                      onError={(e) => {
                        e.currentTarget.src = '/img/fiats/USD.png';
                      }}
                      className="inline"
                      alt="symbol"
                    />

                    <div
                      className={cn('flex-1 text-black dark:text-white text-start text-default', {
                        'dark:!text-gray-400': disabled,
                      })}
                    >
                      {activeCoin.name}
                      <span className={cn('ml-[5px] text-[10px] text-gray-400', { 'text-gray-500': disabled })}>
                        {activeCoin.alias}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <div className="flex items-center text-default dark:text-color-text-primary text-color-light-text-primary gap-[10px]">
                      {viewInFiat && currencyFormat1(getBalanceBySymbol(activeCoin), cryptoDecimals, '', false)}
                      <span
                        className={cn('font-semibold text-default dark:text-white text-color-light-text-primary', {
                          'dark:!text-gray-400': disabled,
                        })}
                      >
                        {viewInFiat
                          ? currencyFormat1(
                            getBalanceBySymbol(activeCoin) * activeCoin.price * exchangeRate,
                            fiatDecimals,
                            localFiat?.name,
                          )
                          : currencyFormat1(getBalanceBySymbol(activeCoin), cryptoDecimals, '', false)}
                      </span>
                    </div>
                    <ChevronDownIcon width={15} className="dark:text-white text-color-light-text-primary" />
                  </div>
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className={cn(
                    'absolute dark:text-white text-black rounded-default dark:!bg-color-input-primary bg-color-light-input-primary w-full origin-top-right right-0 z-[10] cursor-pointer shadow-bs-default',
                    {
                      'top-[110px]': !withDrawTab && !labelText,
                      'top-[80px]': withDrawTab && !labelText,
                      'top-[60px]': labelText,
                    },
                  )}
                >
                  <div className="py-[10px] px-[10px]">
                    <InputSearch
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="dark:text-white !bg-white dark:!bg-color-hover-default min-h-[40px] border border-solid border-transparent focus-within:border-color-primary"
                    />
                  </div>
                  <div className="py-1 max-h-[250px] overflow-y-auto p-2 scrollbar">
                    {filterListCoin.map((symbol, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              'flex items-center justify-start w-full dark:hover:bg-color-hover-default rounded-default hover:bg-color-light-hover-primary mb-2',
                              {
                                'border border-color-primary/50 border-solid': symbol.id === activeCoin.id,
                              },
                            )}
                            role="button"
                            onClick={() => handleChangeCrypto(symbol)}
                          >
                            <div className="flex-1 flex items-center justify-start py-[10px] px-[10px] gap-[10px]">
                              <Image
                                width={30}
                                height={30}
                                src={symbol.logo ? symbol.logo : '/img/fiats/USD.png'}
                                onError={(e) => {
                                  e.currentTarget.src = '/img/fiats/USD.png';
                                }}
                                className="inline"
                                alt="symbol"
                              />
                              <div className="flex-1 font-semibold text-black text-start text-default dark:text-white">
                                {symbol.name}
                              </div>
                            </div>
                            <div className="flex items-center justify-start gap-[10px] py-[10px]">
                              <div className="flex flex-col">
                                {viewInFiat && (
                                  <span className="font-semibold text-right text-black text-default dark:text-white">
                                    {currencyFormat1(
                                      getBalanceBySymbol(symbol) * symbol.price * exchangeRate,
                                      fiatDecimals,
                                      localFiat?.name || 'USD',
                                    )}
                                  </span>
                                )}

                                <span
                                  className={cn(' font-semibold text-right', {
                                    'text-[10px] text-gray-400 ': viewInFiat,
                                    'text-default dark:text-white text-black': !viewInFiat,
                                  })}
                                >
                                  {currencyFormat1(getBalanceBySymbol(symbol), cryptoDecimals, '', false)}
                                </span>
                                {symbol.name.toLowerCase() === 'usdt' && (
                                  <div className="w-full text-right text-black truncate text-default dark:text-white font-vietnam-bold">
                                    <div className="flex justify-end mt-1 text-color-secondary">
                                      <span className="w-fit flex items-center text-[10px] text-right justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2">
                                        <Lock size={12} variant="Bold" />{' '}
                                        {viewInFiat
                                          ? currencyFormat1(
                                            lockedAmount * usdtPrice * exchangeRate,
                                            fiatDecimals,
                                            localFiat?.name,
                                          )
                                          : currencyFormat1(lockedAmount, 2, '', false)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <ChevronDownIcon width={15} className="opacity-0" />
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
      {isShowNetwork && (
        <div className="flex flex-col items-start w-full gap-2">
          <div className="text-default dark:text-color-text-primary text-color-light-text-primary">
            {t('deposit:chooseNetwork')}
          </div>
          <Menu
            as="div"
            className="relative flex w-full dark:bg-color-input-primary bg-color-light-input-primary rounded-default"
          >
            <Menu.Button className="flex-1 py-[15px] px-[20px]" disabled={disabled}>
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px]">
                  <div
                    className={cn('flex-1 text-black text-start dark:text-white text-default', {
                      'dark:!text-gray-400': disabled,
                    })}
                  >
                    {activeNetwork.name}
                  </div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon width={15} className="dark:text-white text-color-light-text-primary" />
                </div>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute rounded-default dark:bg-color-input-primary bg-color-light-bg-primary w-full origin-top-right right-0 top-[60px] z-[10] cursor-pointer shadow-bs-default">
                <div className="max-h-[250px] overflow-y-auto p-2">
                  {availableNetworks.map((network, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={cn(
                            'flex items-center justify-start py-[10px] px-[10px] w-full dark:hover:bg-color-hover-default hover:bg-color-light-hover-primary rounded-default mb-2',
                            {
                              'border border-color-primary/50 border-solid': network.id === activeNetwork.id,
                            },
                          )}
                          role="button"
                          onClick={() => onChangeNetwork(network)}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px]">
                            {network && (
                              <div className="flex-1 font-semibold dark:text-white text-color-light-text-primary text-start text-default">
                                {network.name}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-start gap-[10px]">
                            <ChevronDownIcon width={15} className="opacity-0" />
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default SelectCurrency;
