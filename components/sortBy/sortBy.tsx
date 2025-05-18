import { Menu, Transition } from '@headlessui/react';
import { ArrowRight2 } from 'iconsax-react';
import React, { Fragment } from 'react';

import { useTranslation } from '@/base/config/i18next';

type sortByProps = {
  sortBy: any[];
  selectSortBy: (value: any) => void;
  selectedSortBy: any;
  label?: boolean;
};

const SortBy = (props: sortByProps) => {
  const { sortBy, selectSortBy, selectedSortBy, label = true } = props;
  const { t } = useTranslation('');

  return (
    <div className="flex items-center gap-[10px] grow sm:grow-0">
      {label && <div className="hidden sm:block">{t('casino:sortBy')}</div>}
      <Menu
        as="div"
        className="relative w-full sm:w-[172px] text-left rounded flex text-[14px] dark:text-color-text-primary h-[36px] sm:h-[40px] text-[#000] dark:bg-color-bg-secondary bg-white"
      >
        <Menu.Button className="w-full px-[20px]">
          <div className="flex items-center justify-between">
            <div>{selectedSortBy.label}</div>
            <ArrowRight2 size="16" color="#98a7b5" />
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
          <div className="fixed sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
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
          <Menu.Items className="absolute sm:mr-0 right-0 z-[1] mt-12 w-full max-w-full origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 rounded-md max-sm:w-full dark:bg-[#1c1c20] bg-white sm:w-auto shadow-bs-default">
              <div className="py-1 max-h-[65vh] overflow-y-auto px-[6px] w-full">
                {sortBy.map((sort: any) => (
                  <Menu.Item key={sort.id}>
                    <div
                      onClick={() => selectSortBy(sort)}
                      className={`${
                        sort.id === selectedSortBy.id && 'border border-solid border-color-primary rounded-[3px]'
                      } text-[14px] dark:text-color-text-primary cursor-pointer px-[10px] my-[4px] h-[32px] flex items-center justify-between`}
                    >
                      {sort.label}
                      {sort.id === selectedSortBy.id && (
                        <div className="w-2 h-2 bg-color-primary rounded-full shadow-[0px_0px_0px_5px_#ffffff]"></div>
                      )}
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SortBy;
