import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import cn from 'classnames';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';

import { useTranslation } from '@/base/config/i18next';
import { ObjectLiteral } from '@/base/types/common';

import CsrWrapper from '../CsrWrapper';
import styles from './index.module.scss';

export type TableComponentPropsType = {
  columns: ColumnDef<any>[];
  data: ObjectLiteral[];
  isLoading?: boolean;
  isExpanding?: boolean;
  selectRows?: {
    rowSelectionIndex: RowSelectionState;
    setRowSelectionIndex: OnChangeFn<RowSelectionState>;
    setRowSelection: (arg: ObjectLiteral[]) => void;
  };
  containerClassName?: string;
  tableClassName?: string;
  noDataText?: string;
  headerVarian?: 'danger';
  renderRowClass?: (context: Row<ObjectLiteral>) => string;
  handleClickRow?: (row: Row<any>) => void;
};

const TableComponent: React.FC<TableComponentPropsType> = ({
  columns,
  data,
  isLoading,
  isExpanding = true,
  selectRows,
  containerClassName,
  tableClassName,
  noDataText,
  headerVarian,
  renderRowClass,
  handleClickRow,
}) => {
  const { t } = useTranslation(['errorCommon', 'notices']);
  const { theme } = useTheme();

  const { getHeaderGroups, getRowModel, getSelectedRowModel } = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: selectRows?.rowSelectionIndex || {},
    },
    onRowSelectionChange: selectRows?.setRowSelectionIndex,
  });

  useEffect(() => {
    if (selectRows?.rowSelectionIndex) {
      selectRows?.setRowSelection?.(getSelectedRowModel()?.rows?.map((ele) => ele.original));
    }
  }, [selectRows?.rowSelectionIndex]);

  return (
    <div
      className={cn(
        'table-responsive shadow-lg relative',
        isExpanding ? '' : ' max-h-[600px]',
        containerClassName,
        styles.tableWrapper,
      )}
    >
      <table
        className={cn(
          `mb-0 min-h-[150px] w-full h-full table`,
          tableClassName,
          styles.table,
          theme === 'light' && styles.tableLight,
        )}
      >
        <thead className={cn(styles.tableHeader, '')}>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={cn(
                      headerVarian ? styles[headerVarian] : '',
                      'whitespace-nowrap bg-color-table-header-bg-primary dark:!text-white text-color-light-text-primary font-semibold !text-[14px] border-none text-center',
                    )}
                    {...{
                      style: {
                        width: header?.column?.columnDef?.size ?? 'auto',
                        minWidth: header?.column?.columnDef?.minSize ?? 'unset',
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={cn('sm:text-[14px] text-[12px]', { 'relative py-10': isLoading })}>
          {isLoading && (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex items-center justify-center">
                  <ReactLoading type="bubbles" color="#00AAE6" delay={50} />
                </div>
              </td>
            </tr>
          )}
          {!!data?.length &&
            getRowModel().rows.map((row) => (
              <tr
                onClick={() => handleClickRow?.(row)}
                key={row.id}
                className={cn(renderRowClass?.(row), 'h-0 cursor-pointer')}
              >
                {row.getVisibleCells?.().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}

          {!data?.length && !isLoading && (
            <tr className="">
              <td colSpan={columns.length} className="text-center ">
                <div className="flex flex-col items-center gap-[15px] text-[#53575C]">
                  <CsrWrapper>
                    <Image
                      src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                      alt="noData"
                      width={150}
                      height={150}
                    />
                  </CsrWrapper>

                  {noDataText || t('table:noData')}
                </div>
              </td>
            </tr>
          )}
          <tr className=""></tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
