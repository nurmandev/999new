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
import { useDispatch } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ObjectLiteral } from '@/base/types/common';

import styles from './adminTable.module.scss';

export type AdminTableComponentPropsType = {
  columns: ColumnDef<any>[];
  data: ObjectLiteral[];
  isLoading?: boolean;
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
  onRowClick?: (row: Row<any>) => void;
};

const AdminTableComponent: React.FC<AdminTableComponentPropsType> = ({
  columns,
  data,
  isLoading,
  selectRows,
  containerClassName,
  tableClassName,
  noDataText,
  headerVarian,
  renderRowClass,
  onRowClick,
}) => {
  const { t } = useTranslation(['errorCommon', 'notices']);
  const dispatch = useDispatch();
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
    <div className={cn('table-responsive relative', containerClassName, styles.tableWrapper)}>
      <table className={cn('table mb-0 min-h-[100px] w-full h-full', tableClassName, styles.table)}>
        <thead className={cn(styles.tableHeader, 'dark:bg-[#1D2738] bg-color-light-bg-primary')}>
          {getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id} className="relative z-0">
              {headerGroup.headers.map((header, index) => {
                return (
                  <th
                    key={header.id}
                    className={cn(
                      headerVarian ? styles[headerVarian] : '',
                      { '!text-right': index === headerGroup.headers.length - 1 },
                      'whitespace-nowrap dark:text-white text-color-text-primary bg-white/10 font-semibold sm:!text-[14px] !text-[12px] !border-0 text-left',
                    )}
                    {...{
                      style: {
                        // width: `${100 / headerGroup.headers.length}%`,
                        minWidth: header?.column?.columnDef?.minSize ?? 'unset',
                        maxWidth: header?.column?.columnDef?.maxSize ?? 'unset',
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
        <tbody
          className={cn({ 'relative py-10': isLoading }, 'sm:!text-[14px] !text-[12px] bg-[#1D2738] min-h-[500px]')}
        >
          {isLoading && (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex items-center justify-center">
                  <ReactLoading type="bubbles" color="#00AAE6" delay={50} />
                </div>
              </td>
            </tr>
          )}
          {!!data.length &&
            getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(renderRowClass?.(row), 'h-0 cursor-pointer')}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells?.().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}

          {!data.length && !isLoading && (
            <tr className="">
              <td colSpan={columns.length} className="text-center ">
                <div className="flex flex-col items-center gap-[15px] text-[#53575C]">
                  <Image src={'/img/empty-dark.png'} alt="noData" width={150} height={150} />
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

export default AdminTableComponent;
