import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const AmlPage = () => {
  const { t } = useTranslation('');
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/aml"
          key="canonical"
        />
      </Head>
      <div className="sm:block hidden pl-[7px] pr-[5px] pb-[15px] text-[14px]">
        <div className="">
          <div className="text-black dark:text-[#ffff] font-bold text-left mb-[10px]">{t('helper:definitionsML')}</div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:moneyLaundering')}:</span>{' '}
                {t('helper:moneyLaunderingContent')}
              </p>
              <br />
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:placement')}:</span>{' '}
                {t('helper:placementContent')}
              </p>
              <br />
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:layering')}:</span>{' '}
                {t('helper:layeringContent')}
              </p>
              <br />
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:integration')}:</span>{' '}
                {t('helper:integrationContent')}
              </p>
              <br />
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:aMLPolicy')}:</span>{' '}
                {t('helper:aMLPolicyContent')}
              </p>
              <br />
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy')}</span>{' '}
                {t('helper:establishedPolicyContent')}
              </p>
              <br />
              <li className="dark:text-white text-black">{t('helper:establishedPolicy1')}</li>
              <li className="dark:text-white text-black">{t('helper:establishedPolicy2')}</li>
              <li className="dark:text-white text-black">{t('helper:establishedPolicy3')}</li>
              <li className="dark:text-white text-black">{t('helper:establishedPolicy4')}</li>
              <li className="dark:text-white text-black">{t('helper:establishedPolicy5')}</li>
              <li className="dark:text-white text-black">{t('helper:establishedPolicy6')}</li>
              <br />
              <p>
                <span className="dark:text-white text-black font-semibold">{t('helper:complyProcedures')},</span>{' '}
                {t('helper:complyProceduresContent')}
              </p>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden block w-full">
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] font-bold text-left">{t('helper:definitionsML')}</div>
                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100 w-full"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100 w-full"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-default pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[12px]">
                      <p>
                        <span className="dark:text-white text-black font-semibold">{t('helper:moneyLaundering')}:</span>{' '}
                        {t('helper:moneyLaunderingContent')}
                      </p>
                    </div>
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[12px]">
                      <p>
                        <span className="dark:text-white text-black font-semibold">{t('helper:placement')}:</span>{' '}
                        {t('helper:placementContent')}
                      </p>
                    </div>
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[12px]">
                      <p>
                        <span className="dark:text-white text-black font-semibold">{t('helper:layering')}:</span>{' '}
                        {t('helper:layeringContent')}
                      </p>
                    </div>
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[12px]">
                      <p>
                        <span className="dark:text-white text-black font-semibold">{t('helper:integration')}:</span>{' '}
                        {t('helper:integrationContent')}
                      </p>
                    </div>
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[12px]">
                      <p>
                        <span className="dark:text-white text-black font-semibold">{t('helper:aMLPolicy')}:</span>{' '}
                        {t('helper:aMLPolicyContent')}
                      </p>
                    </div>
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left">
                      <p>
                        <span className="dark:text-white text-black font-semibold">
                          {t('helper:establishedPolicy')}
                        </span>{' '}
                        {t('helper:establishedPolicyContent')}
                      </p>
                      <br />
                      <li className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy1')}</li>
                      <li className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy2')}</li>
                      <li className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy3')}</li>
                      <li className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy4')}</li>
                      <li className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy5')}</li>
                      <li className="dark:text-white text-black font-semibold">{t('helper:establishedPolicy6')}</li>
                      <br />
                    </div>
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[12px]">
                      <p>
                        <span className="dark:text-white text-black font-semibold">
                          {t('helper:complyProcedures')},{' '}
                        </span>{' '}
                        {t('helper:complyProceduresContent')}
                      </p>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      </div>
    </>
  );
};

AmlPage.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default AmlPage;
