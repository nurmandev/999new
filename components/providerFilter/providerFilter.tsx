import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { ArrowRight2, SearchNormal } from 'iconsax-react';
import React, { memo, useEffect, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { titleCase } from '@/base/libs/utils';
import { GameProviderDetail } from '@/base/types/common';

type providerFilterProps = {
  listProvider: GameProviderDetail[];
  selectedProvider: string[];
  selectProvider: (id?: string | undefined) => void;
  viewCount?: boolean;
};

const ProviderFilter = ({ listProvider, selectedProvider, selectProvider, viewCount = true }: providerFilterProps) => {
  const { t } = useTranslation('');

  const [providers, setProviders] = useState<GameProviderDetail[]>(listProvider);
  const [searchInput, setSearchInput] = useState('');

  // const handleSearchInput = (val: string) => {
  //   if (!val) {
  //     setSearchInput('');
  //     setProviders(listProvider);
  //     return;
  //   }
  //   let tempProviders = [...providers];
  //   tempProviders = tempProviders.filter((item) => item.name.includes(searchInput));
  //   setProviders(tempProviders);
  //   setSearchInput(val);
  // };

  useEffect(() => {
    if (searchInput) {
      let tempProviders = [...listProvider];
      tempProviders = tempProviders.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()));
      setProviders(tempProviders);
    } else {
      setProviders(listProvider);
    }
  }, [listProvider, searchInput]);
  return (
    <div className="flex items-center gap-[10px] grow sm-grow-0">
      <div className="hidden sm:block">{t('casino:provider')}</div>
      <Listbox
        multiple
        as="div"
        className="relative w-full sm:w-[172px] text-left rounded flex text-[14px] dark:text-color-text-primary h-[36px] sm:h-[40px] text-[#000] dark:bg-color-bg-secondary bg-white"
      >
        <Listbox.Button className="px-[20px] w-full text-left">
          <div className="flex items-center justify-between">
            <div className="truncate">{selectedProvider.length || t('casino:allProviders')}</div>
            <ArrowRight2 size="16" color="#98a7b5" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute sm:mr-0 right-0 z-[1] mt-12 w-full max-w-full origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 rounded-md dark:bg-[#1c1c20] bg-white sm:w-auto shadow-bs-default">
            {/* <div
                onClick={() => selectProvider()}
                className="text-[14px] dark:text-color-text-primary cursor-pointer h-[32px] flex items-center justify-center border-b border-solid border-[#3b3f4a]"
              >
                {t('casino:clearAll')}
              </div> */}
            <div className="sticky text-[14px] px-[10px] dark:text-color-text-primary  h-[32px] flex items-center justify-center border-b border-solid dark:border-color-border-primary border-color-light-border-primary">
              <SearchNormal className="w-[20px] h-[20px]" />
              <input
                className="w-full ml-[10px] outline-none bg-transparent"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="py-1 max-h-[65vh] overflow-y-auto px-[6px] w-full scrollbar relative">
              {providers.map((provider) => (
                <Listbox.Option key={provider.id} value={provider.id}>
                  <div
                    onClick={() => selectProvider(provider.id)}
                    className={`text-[14px] dark:text-color-text-primary cursor-pointer px-[10px] my-[4px] h-[32px] flex items-center gap-[10px]`}
                  >
                    <div className="flex items-center justify-center rounded-[4px] border border-solid dark:border-color-border-primary border-color-light-border-primary w-4 h-4 dark:bg-[#2d303580] bg-color-light-bg-primary">
                      {provider?.isSelect && <CheckIcon className="w-[20px] text-color-primary" />}
                    </div>
                    <span className="truncate flex-1">{titleCase(provider.name || '')}</span>
                    {viewCount && <span className="text-color-primary">{provider.totalGames}</span>}
                  </div>
                </Listbox.Option>
              ))}
            </div>
          </div>
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default memo(ProviderFilter);
