import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { api_deleteSession, api_getSessions } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER, TOAST_ENUM } from '@/base/constants/common';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useWidth } from '@/base/hooks/useWidth';
import { formatDate } from '@/base/libs/utils';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { SessionType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';

const SettingSession = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation('');
  const [dataTable, setDataTable] = useState<SessionType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const width = useWidth();

  const sessionColumns: ColumnDef<SessionType>[] = useMemo(() => {
    if (width > 800)
      return [
        {
          accessorKey: 'browser',
          header: String(t('setting:browser')),
          cell: ({ row }) => <div className="text-black dark:text-white">{row.original.browser}</div>,
          minSize: 100,
        },
        {
          accessorKey: 'location',
          header: String(t('setting:location')),
          minSize: 30,
          cell: ({ row }) => <div className="text-black dark:text-color-text-primary">{row.original.location}</div>,
        },
        {
          accessorKey: 'ip',
          header: String(t('setting:IPAddress')),
          cell: ({ row }) => <div className="text-black dark:text-white">{row.original.ipAddress}</div>,
          maxSize: 80,
        },
        {
          accessorKey: 'lastUsed',
          header: String(t('setting:lastUsed')),
          maxSize: 30,
          cell: ({ row }) => (
            <div
              className={cn('flex items-center justify-center gap-[10px]', {
                'text-color-primary': row.original.active,
                'dark:text-color-text-primary text-black': !row.original.active,
              })}
            >
              {row.original.active && (
                <div className={cn('w-[8px] h-[8px] rounded-full bg-color-primary blur-[1px]')}></div>
              )}
              <div className="font-bold text-center">
                {row.original.active
                  ? 'Online'
                  : formatDate(row.original.lastUsedAt, DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
              </div>
            </div>
          ),
        },
        {
          accessorKey: 'action',
          header: String(t('setting:action')),
          maxSize: 80,
          cell: ({ row }) => (
            <>
              {row.original.active ? (
                <div className="text-color-text-green">{t('setting:inUse')}</div>
              ) : (
                <div
                  className="text-color-red"
                  role="button"
                  aria-disabled={row.original.active}
                  onClick={() => handleRemoveUserSession(row.original.id)}
                >
                  {t('setting:remove')}
                </div>
              )}
            </>
          ),
        },
      ];

    return [
      {
        accessorKey: 'browser',
        header: () => <div className="text-left font-semibold pl-2">{String(t('setting:browser'))}</div>,
        cell: ({ row }) => (
          <div className="pl-2">
            <div className="text-[13px] font-extrabold text-left text-black dark:text-white">
              {row.original.browser}
            </div>
            <div className="font-extralight text-left text-black dark:text-white">{`${row.original.location} | ${row.original.ipAddress}`}</div>
            <div
              className={cn('flex items-center justify-start gap-[10px]', {
                'text-color-primary': row.original.active,
                'dark:text-color-text-primary text-black': !row.original.active,
              })}
            >
              {row.original.active && (
                <div className={cn('w-[8px] h-[8px] rounded-full bg-color-primary blur-[1px]')}></div>
              )}
              <div className="font-bold text-center">
                {row.original.active
                  ? 'Online'
                  : formatDate(row.original.lastUsedAt, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
              </div>
            </div>
          </div>
        ),
        minSize: 100,
      },
      {
        accessorKey: 'action',
        header: () => <div className="text-right font-semibold pr-2">{String(t('setting:action'))}</div>,
        maxSize: 80,
        cell: ({ row }) => (
          <>
            {row.original.active ? (
              <div className="text-color-text-green text-right pr-2">{t('setting:inUse')}</div>
            ) : (
              <div
                className="text-color-red text-right pr-2"
                role="button"
                aria-disabled={row.original.active}
                onClick={() => handleRemoveUserSession(row.original.id)}
              >
                {t('setting:remove')}
              </div>
            )}
          </>
        ),
      },
    ];
  }, [i18n.language, width]);

  const handleRemoveUserSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const res = await api_deleteSession(sessionId);
      getListUserSessions();
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const getListUserSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setDataTable([]);
      setTotalRows(0);
      const _res = await api_getSessions(page, limit);
      const tempSessions: SessionType[] = _res.data?.sessions?.map((item: any) => ({
        lastUsedAt: new Date(item.lastUsedAt),
        ipAddress: item.ipAddress ?? '',
        location: item.location ?? '',
        id: item.id ?? '',
        browser: item.browser ?? '',
        active: !!item.active,
      }));
      setPage(Number(_res.data?.page || 0));
      setTotalRows(Number(_res.data?.totalCount || 0));
      setDataTable(tempSessions);
    } catch (error) {
      setDataTable([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    getListUserSessions();
  }, [getListUserSessions]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="px-1 sm:px-[12px] py-[12px] md:mt-0 sm:mt-[30px] mt-0 flex flex-col items-start relative w-full">
        <div className="font-semibold text-default">{t('setting:sessionsUsedInPast')}</div>
        <TableComponent
          containerClassName="w-full mt-[30px]"
          isLoading={isLoading}
          data={dataTable}
          columns={sessionColumns}
        />
        <Paging
          onPageChange={handleChangePage}
          itemPerPage={limit}
          totalItem={totalRows}
          currentPage={page}
          setItemPerPage={handleChangeItemPerPage}
          hiddenPerPage={true}
        />
      </div>
    </>
  );
};

const SettingSessionAuth = withAuth(SettingSession);

SettingSessionAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingSessionAuth;
