import 'swiper/css';
import 'swiper/css/grid';

import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import { api_affiliateFriends } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState, useAppDispatch } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import InputText from '@/components/input/typing/InputText';

import InputDateRangePicker from '../input/datePicker/inputDateRangePicker';
import Paging from '../paging/paging';
import AdminTableComponent from '../table/adminTable';

const fiatDecimals = 4;
type ReferralType = 'code' | 'friend';

type FilterType = {
  username?: string;
  userId?: string;
  registrationStartDate?: any;
  registrationEndDate?: any;
  wagerStartDate?: any;
  wagerEndDate?: any;
  code?: string;
};

type AffiliateFriendType = {
  referralCode: string;
  registrationDate: Date;
  status: string;
  totalCommission: number;
  totalWager: number;
  userId: number;
  username: string;
};

function ReferralCodeFriendComponent() {
  const exchangeRate = useExchange();
  const usdtPrice = useUSDTPrice();
  const { t, i18n } = useTranslation('');
  const dispatch = useAppDispatch();

  const { referralCode, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const [codeTab, setCodeTab] = useState<ReferralType>('friend');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [totalFriendsCnt, setTotalFriendsCnt] = useState(0);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsLimit, setFriendsLimit] = useState<number>(10);
  const [friendsTotalRow, setFriendsTotalRow] = useState<number>(0);
  const schema = yup.object().shape({});
  const [friendsTableData, setFriendsTableData] = useState<AffiliateFriendType[]>([]);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? friendsPage + 1 : action === 'Prev' ? friendsPage - 1 : +action;
    setFriendsPage(newPage);
    getListFriends();
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setFriendsLimit(itemPerPage);
    setFriendsPage(1);
  };

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FilterType) => {
    await getListFriends(data);
  };

  const getListFriends = useCallback(
    async (filter?: FilterType) => {
      try {
        setIsLoadingTable(true);
        const registrationStartDate =
          filter?.registrationStartDate?.length > 0 ? new Date(filter?.registrationStartDate).getTime() : undefined;
        const registrationEndDate = filter?.registrationEndDate
          ? new Date(filter.registrationEndDate).getTime()
          : undefined;
        const wagerStartDate =
          filter?.wagerStartDate.length > 0 ? new Date(filter?.wagerStartDate).getTime() : undefined;
        const wagerEndDate = filter?.wagerEndDate.length > 0 ? new Date(filter?.wagerEndDate).getTime() : undefined;
        const _res = await api_affiliateFriends(
          friendsPage,
          friendsLimit,
          filter?.username,
          filter?.userId,
          registrationStartDate,
          registrationEndDate,
          wagerStartDate,
          wagerEndDate,
        );
        const tempFriendsData =
          _res.data?.friends.map((item: any) => ({
            referralCode: referralCode,
            registrationDate: new Date(item.userRegisteredDate),
            status: '',
            totalCommission: Number(item.totalCommissionRewardsAmountUsd || 0),
            totalWager: Number(item.totalWagerAmountUsd || 0),
            userId: item.userId,
            username: item.userName,
          })) || [];
        setFriendsTotalRow(Number(_res.data?.totalCount || 0));
        setTotalFriendsCnt(Number(_res.data?.totalCount || 0));
        setFriendsTableData(tempFriendsData);
      } catch (error) {
        setFriendsTableData([]);
      } finally {
        setIsLoadingTable(false);
      }
    },
    [friendsPage, referralCode, friendsLimit],
  );

  const friendColumns: ColumnDef<AffiliateFriendType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'username',
        header: () => <div className="text-left">Username</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.username}</div>
          </div>
        ),
      },
      {
        accessorKey: 'userId',
        header: () => <div className="text-left">UserId</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.userId}</div>
          </div>
        ),
      },
      {
        accessorKey: 'totalWager',
        header: () => <div className="text-left">{t('mycasino:totalWager')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-color-primary gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {viewInFiat
                ? currencyFormat1(row.original.totalWager * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original.totalWager, fiatDecimals)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'totalCommission',
        header: () => <div className="text-left">{t('mycasino:totalCommissionReward')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {viewInFiat
                ? currencyFormat1(row.original.totalCommission * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original.totalCommission, fiatDecimals)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'registrationDate',
        header: () => <div className="text-left">{t('mycasino:registrationDate')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {formatDate(new Date(row.original.registrationDate), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'referralCode',
        header: () => <div className="text-left">{t('mycasino:code')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.referralCode}</div>
          </div>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    if (codeTab === 'friend') getListFriends();
  }, [codeTab, friendsPage, friendsLimit, referralCode]);

  return (
    <div className="">
      {isLoading && <Loader />}
      {codeTab === 'code' && (
        <div className="w-full rounded-default bg-[#1D2738] mt-5 text-center py-20">
          {t('affiliate:noReferralCode')}
        </div>
      )}
      {codeTab === 'friend' && (
        <div className="mt-5">
          <div className="bg-[#1D2738] rounded p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-[120px] flex flex-wrap items-center gap-[20px]">
              <div className="flex flex-col items-start w-full gap-1 sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="username">
                  {t('mycasino:Username')}
                </label>
                <InputText
                  control={control}
                  name="username"
                  placeholder="Please input"
                  customClass="min-w-[200px] !rounded !bg-color-input-primary !border-none !text-white py-2 px-3"
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1 sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="userId">
                  {t('mycasino:UserId')}
                </label>
                <InputText
                  control={control}
                  name="userId"
                  placeholder="Please input"
                  customClass="min-w-[200px] !rounded !bg-color-input-primary !border-none !text-white py-2 px-3"
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1 sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="registrationDate">
                  {t('mycasino:registrationDate')}
                </label>
                <InputDateRangePicker
                  control={control}
                  startName="registrationStartDate"
                  endName="registrationEndDate"
                  customClass="flex flex-row !bg-color-input-primary !border-none rounded !text-white py-2 px-3"
                  pickerClass="!w-[120px] !bg-transparent"
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1 sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="wagerDateRange">
                  {t('mycasino:wagerDateRange')}
                </label>
                <InputDateRangePicker
                  control={control}
                  startName="wagerStartDate"
                  endName="wagerEndDate"
                  customClass="flex flex-row !bg-color-input-primary !border-none rounded !text-white py-2 px-3"
                  pickerClass="!w-[120px] !bg-transparent"
                />
              </div>
              {/* <div className="flex flex-col items-start w-full gap-1 sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="code">
                  {t('mycasino:code')}
                </label>

                <SelectBox
                  customClass="min-w-[120px] rounded"
                  control={control}
                  name="code"
                  options={[
                    {
                      value: 'all',
                      label: 'All',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'tom',
                      label: 'Tom',
                    },
                  ]}
                />
              </div> */}
              <div className="flex flex-col items-start gap-1">
                <label className="opacity-0">1</label>
                <button className="px-6 py-2 text-white bg-gradient-btn-play shadow-bs-btn rounded-default" type="submit">
                  {t('mycasino:search')}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-[#1D2738] rounded p-4 mt-4">
            <AdminTableComponent
              containerClassName="w-full"
              isLoading={isLoadingTable}
              data={friendsTableData}
              columns={friendColumns}
            />
            <Paging
              onPageChange={handleChangePage}
              itemPerPage={friendsLimit}
              totalItem={friendsTotalRow}
              currentPage={friendsPage}
              setItemPerPage={handleChangeItemPerPage}
              hiddenPerPage={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralCodeFriendComponent;
