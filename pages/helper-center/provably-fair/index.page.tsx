import { Menu, Transition } from '@headlessui/react';
import { ArrowDown2 } from 'iconsax-react';
import Head from 'next/head';
import { Fragment, ReactElement, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const ProvablyFairPage = () => {
  const { t } = useTranslation('');
  const [activeProvably, setActiveProvably] = useState('Crash');
  const LIST_PROVABLY_FAIR = [
    'Crash',
    'Double',
    'Classic Dice',
    'Plinko',
    'Hash Dice',
    'Ultimate Dice',
    'Keno',
    'Wheel',
    'Twist',
    'Cave Of Plunder',
    'Mines',
    'Tower Legend',
    'CoinFlip',
    'Hilo',
    'Sword',
    'Beauties',
    'Roulette',
    'Video Poker',
    'Ring of Fortune',
    'Baccarat',
    'Keno Multiplayer',
    'Blackjack',
    'Roulette Multiplayer',
    'Baccarat Multiplayer',
    'BCGAME Blackjack A',
    'BCGAME Blackjack B',
    'BCGAME Speed Blackjack',
    'BCGAME VIP Blackjack',
    'BC Speed Baccarat',
    'BC ONE BlackJack',
    'Fairness',
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/provably-fair"
          key="canonical"
        />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px]">
        <div className="">
          <div className="text-black dark:text-[#ffff] text-[0.875rem] font-bold text-left mb-[16px]">
            {t('helper:game')}
          </div>
          <div className={'flex-1 bg-white dark:bg-[#31343D] rounded-[15px] text-white'}>
            <Menu as="div" className="relative w-full text-left rounded-[7px] flex text-white">
              <Menu.Button className="w-full">
                <div
                  role="button"
                  className="flex items-center h-[48px] gap-2 py-2 px-2 w-full rounded bg-[#2B2E35] min-w-[200px]"
                >
                  <div className="flex-1 text-start">{activeProvably}</div>
                  <div className="text-white truncate text-right min-w-[15px]">
                    <ArrowDown2 size={15} />
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
                <Menu.Items className="absolute bg-[#17181b] w-full origin-top-right right-0 top-[45px] z-[5] cursor-pointer rounded p-2">
                  {LIST_PROVABLY_FAIR.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          onClick={() => setActiveProvably(item)}
                          className={`${activeProvably === item && 'border border-solid border-[#f59e0b]'
                            } flex-1 flex items-center hover:text-[#99a4b099] text-[#99a4b099] hover:bg-[#2d303566] justify-start gap-[10px] h-[32px] my-[4px] px-[10px]`}
                          role="button"
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px]">
                            <div className="flex-1 text-start text-[14px]">{String(t(item))}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="mt-[16px]">
          <div className="text-black dark:text-[#ffff] text-[0.875rem] font-bold text-left mb-[7px]">
            {t('helper:fairness')}
          </div>
          <div className="">
            <div className="mb-[9px]">
              <div className="text-black dark:text-[#ffff] text-[0.875rem] dark:font-bold text-left mb-[10px]">
                {t('helper:gameFair')}
              </div>
              <div className="text-[#31373d] dark:text-[#98A7B5] text-[0.875rem] font-normal text-left">
                <p>{t('helper:gameFair1')}</p>
                <br />
                <p>{t('helper:gameFair2')}</p>
                <br />
                <p>{t('helper:gameFair3')}</p>
                <br />
                <p>{t('helper:gameFair4')}</p>
                <br />
              </div>
            </div>
            <div className="mb-[9px]">
              <div className="flex gap-1 text-[#5f6975cc] dark:text-[#99a4b0] text-[0.875rem] dark:font-bold text-left mb-[10px]">
                <p>{t('helper:gameFair5')}</p>
                {/* <div className="flex gap-3 text-[#3BC117]">
                  <p className="cursor-pointer">{t('helper:github')}</p>
                  <p className="cursor-pointer">{t('helper:verify')}</p>
                </div> */}
              </div>
              <div className="text-[#31373d] dark:text-[#98A7B5] text-[0.875rem] font-normal text-left">
                <p>{t('helper:gameFair6')}</p>
                <br />
                <p>{t('helper:gameFair7')}</p>
                <br />
                <ol className="list-decimal px-4">
                  <li>{t('helper:gameFair8')}</li>
                  <br />
                  <li>{t('helper:gameFair9')}</li>
                  <br />
                  <li>{t('helper:gameFair10')}</li>
                  <br />
                  <p>{t('helper:gameFair11')}</p>
                  <br />
                  <p>{t('helper:gameFair12')}</p>
                  <br />
                  <li>{t('helper:gameFair13')}</li>
                </ol>
                <br />
                <p>{t('helper:gameFair14')}</p>
                <br />
                <p>{t('helper:gameFair15')}</p>
                <br />
                <p>{t('helper:gameFair16')}</p>
                <br />
                <p>{t('helper:gameFair17')}</p>
                <br />
                <p>{t('helper:gameFair18')}</p>
              </div>
            </div>
          </div>
          {/* <div
            role="button"
            className="my-[4rem] max-w-[315px] bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
          >
            {t('helper:validate')}
          </div> */}
        </div>
      </div>
    </>
  );
};

ProvablyFairPage.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default ProvablyFairPage;
