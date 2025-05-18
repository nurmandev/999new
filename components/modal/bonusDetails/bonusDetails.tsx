import { DialogProps, Menu, Transition, TransitionRootProps } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { ElementType, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_bonusDetailCategories, api_bonusDetailTransactions, bonusCategoryType } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_MARKER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { BonusTransactionType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import TableComponent from '@/components/table';

import CommonModal from '../commonModal/commonModal';
import { useWidth } from '@/base/hooks/useWidth';

type ModalBonusDetailProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalBonusDetail({ show, onClose }: ModalBonusDetailProps) {
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const width = useWidth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [bonusCategoriesValue, setbonusCategoriesValue] = useState({
    luckySpinUsd: 0,
    questUsd: 0,
    weeklyCashbackUsd: 0,
    monthlyCashbackUsd: 0,
    depositBonusUsd: 0,
    levelUpBonusUsd: 0,
  });
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [listTransactions, setListTransactions] = useState<BonusTransactionType[]>([]);
  const { localFiat, viewInFiat, isLogin } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      isLogin: state.auth.isLogin,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const bonusCategories = [
    {
      title: t('bonus:allBonuses'),
      category: 'all',
      img: '',
      show: false,
    },
    {
      title: t('bonus:weeklyCashback'),
      category: 'weekly_cashback',
      img: '/img/modal/weekly.png',
      show: true,
    },
    {
      title: t('bonus:monthlyCashback'),
      category: 'monthly_cashback',
      img: '/img/modal/monthly.png',
      show: true,
    },
    {
      title: t('bonus:levelUpBonus'),
      category: 'level_up',
      img: '/img/modal/levelup.png',
      show: true,
    },
    {
      title: 'Quest',
      category: 'quest',
      img: '/img/modal/quests.png',
      show: true,
    },
    {
      title: 'Lucky Spin',
      category: 'lucky_spin',
      img: '/img/modal/spin.png',
      show: true,
    },
    // {
    //   title: 'Free Spin',
    //   img: '/img/modal/freespin.png',
    //   value: '0.00',
    // },
    {
      title: 'Deposit Bonus',
      category: 'deposit_bonus',
      img: '/img/modal/deposit.png',
      show: true,
    },
  ];

  const initLoad = async () => {
    try {
      setIsLoading(true);
      const [_resCategories, _resTransaction] = await Promise.all([
        api_bonusDetailCategories(),
        api_bonusDetailTransactions(),
      ]);
      const tempListTransactionData: BonusTransactionType[] =
        _resTransaction.data?.map((item: any) => ({
          amount: Number(item.amount || 0),
          amountUsd: Number(item.amountUsd || 0),
          type: item.bonusType || item.type,
          time: item.time,
          symbol: item.symbolName,
          symbolLogo: item.symbolLogo,
        })) ?? [];
      setbonusCategoriesValue({
        luckySpinUsd: Number(_resCategories.data?.totalLuckySpinBonusAmountUsd),
        questUsd: Number(_resCategories.data?.totalQuestBonusAmountUsd),
        weeklyCashbackUsd: Number(_resCategories.data?.weeklyCashbackAmountUsd || 0),
        monthlyCashbackUsd: Number(_resCategories.data?.monthlyCashbackAmountUsd || 0),
        depositBonusUsd: Number(_resCategories.data?.totalDepositBonusAmountUsd || 0),
        levelUpBonusUsd: Number(_resCategories.data?.totalVipLevelUpBonusAmountUsd || 0),
      });
      setListTransactions(tempListTransactionData);
    } catch (error) {
      setbonusCategoriesValue({
        luckySpinUsd: 0,
        questUsd: 0,
        weeklyCashbackUsd: 0,
        monthlyCashbackUsd: 0,
        depositBonusUsd: 0,
        levelUpBonusUsd: 0,
      });
      setListTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getListTypeBonus = useCallback(async () => {
    try {
      setIsLoadingTable(true);
      const _res = await api_bonusDetailTransactions(typeFilter as bonusCategoryType);
      const tempListTransactionData: BonusTransactionType[] =
        _res.data?.map((item: any) => ({
          amount: Number(item.amount || 0),
          amountUsd: Number(item.amountUsd || 0),
          type: item.bonusType || item.type,
          time: item.time,
          symbol: item.symbolName,
          symbolLogo: item.symbolLogo,
        })) ?? [];
      setListTransactions(tempListTransactionData);
    } catch (error) {
      setListTransactions([]);
    } finally {
      setIsLoadingTable(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    if (show && isLogin) {
      initLoad();
    }
  }, [show, isLogin]);

  useEffect(() => {
    if (show && isLogin) {
      getListTypeBonus();
    }
  }, [getListTypeBonus, show, isLogin]);

  const columns: ColumnDef<BonusTransactionType>[] = useMemo(() => {
    if (width > 1024)
      return [
        {
          accessorKey: 'actionType',
          header: () => (
            <div className="text-left text-[12px] text-color-text-primary font-normal">
              {t('historyBonus:bonusType')}
            </div>
          ),
          cell: ({ row }) => (
            <div className="text-[14px] text-left dark:text-color-text-primary text-[#000] truncate">
              {row.original.type}
            </div>
          ),
          minSize: 50,
          maxSize: 80,
        },
        {
          accessorKey: 'amountClaimed',
          header: () => (
            <div className="text-center text-[12px] font-normal text-color-text-primary">
              {t('historyBonus:amountClaimed')}
            </div>
          ),
          cell: ({ row }) => (
            <div className="font-bold text-[14px] flex justify-center gap-1 dark:text-white text-[#000] truncate text-center">
              <Image
                height={20}
                width={20}
                src={row.original.symbol ? `/img/fiats/${row.original.symbol}.png` : `/img/fiats/USDT.png`}
                onError={(e) => {
                  e.currentTarget.src = `/img/fiats/USDT.png`;
                }}
                alt="currency"
              />
              {viewInFiat
                ? currencyFormat1(row.original.amountUsd * exchangeRate, 2, localFiat?.name)
                : currencyFormat1(row.original.amount, 4, '', false)}
            </div>
          ),
          minSize: 200,
          maxSize: 200,
        },
        {
          accessorKey: 'createdAt',
          header: () => (
            <div className="text-right text-[12px] text-color-text-primary font-normal">{t('historyBonus:time')}</div>
          ),
          cell: ({ row }) => (
            <div className="text-color-text-primary truncate flex items-center justify-end gap-[5px]">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_MARKER)}
            </div>
          ),
        },
      ];
    return [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left text-m_default text-color-text-primary font-normal">
            {t('historyBonus:bonusType')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-full max-w-[100px] sm:max-w-max text-m_default sm:text-default text-left dark:text-color-text-primary text-[#000] truncate">
            {row.original.type}
          </div>
        ),
      },
      {
        accessorKey: 'amountClaimed',
        header: () => (
          <div className="text-center text-[12px] font-normal text-color-text-primary">
            {t('historyBonus:amountClaimed')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="max-w-[110px] sm:max-w-max font-bold text-m_default sm:text-[14px] flex justify-start gap-1 dark:text-white text-[#000] truncate text-center">
            <Image
              height={20}
              width={20}
              src={row.original.symbol ? `/img/fiats/${row.original.symbol}.png` : `/img/fiats/USDT.png`}
              onError={(e) => {
                e.currentTarget.src = `/img/fiats/USDT.png`;
              }}
              alt="currency"
            />
            {viewInFiat
              ? currencyFormat1(row.original.amountUsd * exchangeRate, 2, localFiat?.name)
              : currencyFormat1(row.original.amount, 4, '', false)}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="text-right text-m_default sm:text-default text-color-text-primary font-normal">
            {t('historyBonus:time')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-m_default sm:text-default min-w-[90px] sm:min-w-[200px] text-color-text-primary text-right flex items-center justify-end gap-[5px]">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_MARKER)}
          </div>
        ),
      },
    ];
  }, [t, localFiat, width]);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded sm:!h-[90vh] sm:min-h-[90vh]"
        header={<div className="modal-header">{t('bonus:bonusDetail')}</div>}
      >
        <div className="flex flex-col relative h-full dark:text-color-text-primary text-[#3137d] overflow-y-auto p-3 sm:p-5 bg-color-light-bg-primary dark:bg-color-modal-bg-default">
          {isLoading && <Loader />}
          <div className="">
            <div className="dark:text-white text-black text-m_default sm:text-[16px] mb-3">
              {t('bonus:bonusCategories')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 p-1 sm:p-4 pt-0 dark:bg-color-card-bg-default bg-white rounded-default">
              {bonusCategories
                .filter((item) => item.show)
                .map((item, index) => (
                  <div key={index} className="text-[12px] mt-1 sm:mt-4">
                    <div className="flex items-center">
                      <div className="w-[28px] h-[28px] flex items-center justify-center">
                        <Image src={item.img} width={21} height={21} alt="bonus" />
                      </div>
                      <div className="truncate max-w-full">{item.title}</div>
                    </div>
                    <div className="text-m_default sm:text-[14px] font-bold dark:text-white text-black pl-[6px]">
                      {item.category === 'weekly_cashback' &&
                        (viewInFiat
                          ? currencyFormat1(bonusCategoriesValue.weeklyCashbackUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(bonusCategoriesValue.weeklyCashbackUsd, 2))}
                      {item.category === 'monthly_cashback' &&
                        (viewInFiat
                          ? currencyFormat1(bonusCategoriesValue.monthlyCashbackUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(bonusCategoriesValue.monthlyCashbackUsd, 2))}
                      {item.category === 'level_up' &&
                        (viewInFiat
                          ? currencyFormat1(bonusCategoriesValue.levelUpBonusUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(bonusCategoriesValue.levelUpBonusUsd, 2))}
                      {item.category === 'deposit_bonus' &&
                        (viewInFiat
                          ? currencyFormat1(bonusCategoriesValue.depositBonusUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(bonusCategoriesValue.depositBonusUsd, 2))}
                      {item.category === 'lucky_spin' &&
                        (viewInFiat
                          ? currencyFormat1(bonusCategoriesValue.luckySpinUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(bonusCategoriesValue.luckySpinUsd, 2))}
                      {item.category === 'quest' &&
                        (viewInFiat
                          ? currencyFormat1(bonusCategoriesValue.questUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(bonusCategoriesValue.questUsd, 2))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-between mt-2">
            <div className="dark:text-white text-black text-m_default sm:text-[16px]">
              {t('bonus:bonusTransaction')}
            </div>
            <Menu
              as="div"
              className="relative flex h-[40px] px-[20px] min-w-[200px] dark:bg-color-input-primary bg-white rounded-[4px]"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-start dark:text-white text-black">
                      {bonusCategories.find((item) => item.category === typeFilter)?.title}
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className=" dark:text-white text-black" width={15} />
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
                <Menu.Items className="absolute dark:bg-color-menu-primary bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                  <div className="py-1  dark:bg-color-menu-primary bg-white">
                    {bonusCategories.map((bonus, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-color-menu-secondary hover:bg-[#f5f6fa]"
                            role="button"
                            onClick={() => setTypeFilter(bonus.category)}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                              <div className="flex-1 text-start dark:text-white max-w-full truncate text-black capitalize">
                                {bonus.title}
                              </div>
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
          <div className="mt-2 mb-3 text-[11px] sm:text-[14px]">{t('bonus:onlyTheLatest')}</div>
          <div className="dark:bg-color-card-bg-secondary bg-white p-0 sm:p-3 pb-0">
            <TableComponent
              isExpanding={false}
              isLoading={isLoadingTable}
              handleClickRow={() => {}}
              data={listTransactions}
              columns={columns}
            />
          </div>
          {/* <div className="dark:bg-[#2D3035] pb-3">
            <Paging
              onPageChange={handleChangePage}
              itemPerPage={limit}
              totalItem={totalTable}
              currentPage={page}
              setItemPerPage={handleChangeItemPerPage}
              hiddenPerPage={true}
            />
          </div> */}
        </div>
      </CommonModal>
    </>
  );
}
