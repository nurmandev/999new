import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2, ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { Fragment, useMemo } from 'react';

import { useTranslation } from '@/base/config/i18next';

interface IProps {
  onPageChange?: (action: string) => void;
  setItemPerPage?: (itemPerPage: number) => void;
  currentPage: number;
  itemPerPage: number;
  totalItem: number;
  hiddenPerPage?: boolean;
}

const LIST_ITEM_PER_PAGE = [5, 10, 20];

const Paging: React.FC<IProps> = ({
  currentPage,
  onPageChange,
  itemPerPage,
  totalItem,
  setItemPerPage,
  hiddenPerPage = false,
}) => {
  const disableNext = useMemo(() => {
    return Math.ceil(totalItem / itemPerPage) <= currentPage;
  }, [currentPage, totalItem, itemPerPage]);

  const disablePrev = useMemo(() => {
    return currentPage === 1;
  }, [currentPage]);

  const { t } = useTranslation('');

  const pages = [];
  const pageCount = Math.ceil(totalItem / itemPerPage);
  for (let index = 1; index <= pageCount; index++) {
    if (index === 1 || index === pageCount) pages.push(`${index}`);
    else if (index <= currentPage && index >= currentPage - 2) pages.push(`${index}`);
    else if (index >= currentPage && index <= currentPage + 2) pages.push(`${index}`);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  if (totalItem > 0)
    return (
      <div className="w-full flex flex-col md:flex-row items-center justify-center p-[10px] gap-6 select-none">
        <div className="flex items-center gap-4">
          {hiddenPerPage && (
            <Menu
              as="div"
              className="relative h-[38px] flex items-center justify-center text-[14px] min-w-[70px] select-none dark:bg-color-card-bg-secondary bg-color-light-bg-primary rounded border-solid border border-color-card-border-primary"
            >
              <Menu.Button className="flex-1 ">
                <div className="flex items-center justify-center w-full gap-2 dark:text-white text-black" role="button">
                  {itemPerPage}
                  <ArrowDown2 className="h-[16px] w-[16px]" />
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
                <Menu.Items className="absolute dark:bg-color-menu-primary bg-color-light-bg-primary w-full origin-top-right right-0 top-[40px] z-[10] cursor-pointer p-1 rounded-md">
                  <div className="flex flex-col gap-1 py-0">
                    {LIST_ITEM_PER_PAGE.map((item, index) => (
                      <Menu.Item key={index}>
                        {() => (
                          <div
                            className={cn(
                              'flex items-center justify-start py-[5px] px-[5px] w-full dark:hover:bg-color-hover-primary hover:bg-color-light-bg-p rounded-md',
                              {
                                'border-[1px] border-solid border-color-primary': item === itemPerPage,
                              },
                            )}
                            role="button"
                            onClick={() => setItemPerPage?.(item)}
                          >
                            <div className="flex-1 flex items-center justify-between gap-[10px] sm:text-[14px] text-[12px]">
                              <div className="flex-1 text-start dark:text-white text-black">{item}</div>
                              {item === itemPerPage && (
                                <div className={cn('w-[8px] h-[8px] rounded-full bg-color-primary blur-[1px]')}></div>
                              )}
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          <p className="dark:text-color-text-primary text-color-light-text-primary text-[12px]">
            {t('paging:total')}: {Math.ceil(totalItem / itemPerPage) || 1}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          {pages.map((pageNum, index) => (
            <div
              key={`page-${index}`}
              className={cn(
                'dark:text-white text-black text-[14px] font-light px-2 py-1 hover:bg-color-hover-default rounded',
                {
                  '!font-bold !text-color-primary border-solid border border-color-primary ':
                    `${currentPage}` === pageNum,
                  'cursor-pointer': pageNum != '...',
                },
              )}
              onClick={() => {
                if (pageNum !== '...') onPageChange?.(pageNum);
              }}
            >
              {pageNum}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className={cn(
              'p-2 dark:bg-color-menu-primary bg-color-light-bg-primary dark:text-white text-black rounded border border-solid border-color-card-border-primary',
              {
                'opacity-20 cursor-not-allowed': disablePrev,
                // 'dark:text-white text-black': !disablePrev,
              },
            )}
            onClick={() => onPageChange?.('Prev')}
            disabled={disablePrev}
          >
            <ArrowLeft2 className="h-[16px] w-[16px] flex justify-center items-center" />
          </button>
          <button
            className={cn(
              'p-2 dark:bg-color-menu-primary bg-color-light-bg-primary dark:text-white text-black rounded border border-solid border-color-card-border-primary',
              {
                'opacity-20 cursor-not-allowed': disableNext,
                // 'dark:text-white text-black': !disableNext,
              },
            )}
            onClick={() => onPageChange?.('Next')}
            disabled={disableNext}
          >
            <ArrowRight2 className="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>
    );
  else return <div></div>;
};

export default Paging;
