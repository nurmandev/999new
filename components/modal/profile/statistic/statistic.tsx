import { Menu, Transition } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_BetStatistics } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import CsrWrapper from '@/components/CsrWrapper';
import Paging from '@/components/paging/paging';
import RankingTableComponent from '@/components/table/rankingTable';

import { GameDetail, UserDetail } from '../../../../types/common';
import CommonModal from '../../commonModal/commonModal';
import { API_AVATAR } from '@/base/constants/common';

type ModalStatisticProps = {
  userData?: UserDetail;
  isShow: boolean;
  onBack: () => void;
};

type StatisticTransactionType = {
  currencyLogo: string;
  currency: string;
  wins: number;
  bets: number;
  wagered: number;
  wageredUsd: number;
};

export default function Statistic({ userData, isShow, onBack }: ModalStatisticProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('');
  const exchange = useExchange();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [game, setGame] = useState<GameDetail>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTable, setTotalTable] = useState(0);
  const [statisticTransaction, setStatisticTransaction] = useState<StatisticTransactionType[]>([]);
  const [listGames, setListGame] = useState<GameDetail[]>([]);

  const { userName, userId, avatar, viewInFiat, localFiat, isLogin } = useSelector(
    (state: AppState) => ({
      userName: state.auth.user.userName,
      avatar: state.auth.user.avatar,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      userId: state.auth.user.userId,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const statisticsColumn = useMemo(() => {
    const statisticsColumnsDefault: ColumnDef<StatisticTransactionType>[] = [
      {
        accessorKey: 'currency',
        header: () => <div className="text-[12px] font-normal pl-2 sm:pl-4">{t('statistic:currency')}</div>,
        cell: ({ row }) => (
          <div className="text-color-text-primary truncate flex items-center justify-start gap-[5px] py-2 sm:py-3 pl-2 sm:pl-4">
            <Image
              height={20}
              width={20}
              src={row.original.currencyLogo ? row.original.currencyLogo : '/img/fiats/USDT.png'}
              alt="currency"
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
              }}
            />
            <span className="dark:text-white text-black font-normal">{row.original.currency}</span>
          </div>
        ),
      },
      {
        accessorKey: 'win',
        header: () => <div className="text-center text-[12px] font-normal">{t('statistic:win')}</div>,
        cell: ({ row }) => (
          <div className="font-normal dark:text-white text-[#000] truncate text-center">{row.original.wins}</div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="text-center text-[12px] font-normal">{t('statistic:bet')}</div>,
        cell: ({ row }) => (
          <div className="font-normal dark:text-white text-[#000] truncate text-center">{row.original.bets}</div>
        ),
      },
      {
        accessorKey: 'wagered',
        header: () => <div className="text-right text-[12px] font-normal pr-2 sm:pr-4">{t('statistic:wagered')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-[#000] truncate text-right font-semibold pr-2 sm:pr-4">
            {viewInFiat
              ? currencyFormat1(row.original.wageredUsd * exchange, 2, localFiat?.name || 'USD')
              : currencyFormat1(row.original.wagered, 4, '', false)}
          </div>
        ),
      },
    ];
    return statisticsColumnsDefault;
  }, [exchange, viewInFiat, localFiat]);

  useEffect(() => {
    if (isLogin && isShow) {
      getStatisticTransaction();
    }
  }, [userData, isLogin, isShow]);

  const getStatisticTransaction = async () => {
    try {
      setIsLoading(true);
      if (!userData) return;
      const res = await api_BetStatistics(userData.userId);
      const tempStatisticTransactions: StatisticTransactionType[] = res.data?.map((item: any) => ({
        currencyLogo: item.currencyLogo ?? '/image/fiats/USDT.png',
        currency: item.currencyName ?? 'USDT',
        bets: Number(item.totalBets ?? 0),
        wins: Number(item.totalWins ?? 0),
        wagered: Number(item.wageredAmount ?? 0),
        wageredUsd: Number(item.wageredAmountUsd ?? 0),
      }));
      setStatisticTransaction(tempStatisticTransactions);
    } catch (error) {
      setStatisticTransaction([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
  };

  return (
    <div className="rounded max-w-full sm:max-w-[540px]">
      <div className="bg-color-header-primary !h-[calc(100%-64px)] p-0">
        <div
          className="text-black dark:text-white md:text-[18px] text-[16px] font-bold flex items-center gap-[10px] cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft2 className="w-[16px] text-[#67707B] stroke-4" />
          <div className="text-[16px]">{t('statistic:statistics')}</div>
        </div>
        {/* <div className="flex gap-[16px] items-center justify-center">
          <Menu
            as="div"
            className="relative w-full max-w-[200px] text-left rounded flex dark:text-white text-[#000] dark:bg-color-input-primary bg-color-light-bg-primary"
          >
            <Menu.Button className="w-full">
              <div className="dark:bg-color-input-primary rounded bg-white flex items-center justify-between w-full h-[36px] px-[20px]">
                <div className="dark:text-color-text-primary text-[#31373d] text-[12px] sm:text-[14px] truncate">
                  {game?.title || t('statistic:global')}
                </div>
                <div className="dark:text-white truncate text-right min-w-[15px]">
                  <ArrowRight2 size={15} className="dark:text-[#abb6c2] text-[#9FA5AC]" />
                </div>
              </div>
            </Menu.Button>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
            </Transition.Child>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute xl:right-0 sm:left-[100px] md:left-[auto] sm:right-[auto] right-0 z-[50] w-full mt-14 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 rounded-[5px] dark:bg-color-input-primary bg-white max-w-[200px] -top-[20px]">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={cn(
                          active
                            ? 'dark:bg-gray-600 bg-gray-100 dark:text-white text-black'
                            : 'dark:text-gray-400 text-black',
                          'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                        )}
                        onClick={() => setGame({})}
                      >
                        <div>{t('statistic:global')}</div>
                      </div>
                    )}
                  </Menu.Item>
                  {listGames.map((item, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              active
                                ? 'dark:bg-gray-600 bg-gray-100 dark:text-white text-black'
                                : 'dark:text-gray-400 text-black',
                              'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                            )}
                            onClick={() => setGame(item)}
                          >
                            <div className="max-w-full truncate">{item.title}</div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="flex items-center gap-[16px]">
            <div className="h-[35px] w-[35px] rounded-full overflow-hidden">
              <Image
                height={35}
                width={35}
                src={userData?.avatar || avatar ? `${API_AVATAR}${userData?.avatar || avatar}` : '/img/avatar-1.png'}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
              />
            </div>
            <div className="text-black dark:text-white max-w-[85px] sm:max-w-[100px] truncate text-[12px] sm:text-[14px] font-[700]">
              {userData?.userName || userName}
            </div>
          </div>
        </div> */}
        <div className="dark:bg-color-panel-bg bg-white rounded-[5px] p-[14px] flex items-center justify-between mt-[12px] gap-3">
          <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
            <div className="flex gap-[5px] items-center">
              <Image
                src="/img/icon/total-win.png"
                width={12}
                height={12}
                className="w-[12px] h-[12px]"
                alt="total win"
              />
              <div className="text-[10px] sm:text-[12px] text-color-text-primary">{t('profile:totalWins')}</div>
            </div>
            <div className="text-[14px] sm:text-[16px] dark:text-white text-black">
              {Number(userData?.winCount || '0')}
            </div>
          </div>
          <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
            <div className="flex gap-[5px] items-center">
              <Image
                src="/img/icon/total-bets.png"
                width={12}
                height={12}
                className="w-[12px] h-[12px]"
                alt="total bets"
              />
              <div className="text-[10px] sm:text-[12px] text-color-text-primary">{t('profile:totalBets')}</div>
            </div>
            <div className="text-[14px] sm:text-[16px] dark:text-white text-black">
              {Number(userData?.betCount || '0')}
            </div>
          </div>
          <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%] max-w-[30%]">
            <div className="flex gap-[5px] items-center">
              <Image
                src="/img/icon/total-wagered.png"
                width={12}
                height={12}
                className="w-[12px] h-[12px]"
                alt="total wagered"
              />
              <div className="text-[10px] sm:text-[12px] text-color-text-primary">{t('profile:totalWagered')}</div>
            </div>
            <div className="text-[14px] sm:text-[16px] dark:text-white text-black text-center w-full truncate">
              {viewInFiat
                ? currencyFormat1((userData?.totalWager || 0) * exchange, 2, localFiat?.name || 'USD')
                : currencyFormat1(userData?.totalWager || 0, 2, '', false)}
            </div>
          </div>
        </div>
        <div className="dark:bg-color-modal-bg-primary bg-white mt-[10px]">
          {!isLoading && statisticTransaction.length > 0 && (
            <RankingTableComponent
              isLoading={isLoading}
              containerClassName="w-full dark:bg-color-panel-bg rounded !p-1 bg-white"
              data={statisticTransaction.filter((e) => !!e)}
              columns={statisticsColumn}
            />
          )}
          {!isLoading && statisticTransaction.length === 0 && (
            <div className="flex justify-center relative py-6">
              <CsrWrapper>
                <Image
                  src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px]"
                  alt="noData"
                />
              </CsrWrapper>

              <p className="absolute dark:text-color-text-primary text-[#31373d] text-[12px] sm:text-[14px] bottom-[24px] text-center">
                {t('table:noData')}
              </p>
            </div>
          )}
        </div>
        {!!statisticTransaction.length && (
          <Paging onPageChange={handleChangePage} itemPerPage={limit} totalItem={totalTable} currentPage={page} />
        )}
      </div>
    </div>
  );
}
