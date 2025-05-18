import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';

const TermsOfServicePage = () => {
  const { t } = useTranslation('');
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/terms-of-service"
          key="canonical"
        />
      </Head>
      <div className="sm:block hidden pl-[7px] pr-[5px] pb-[15px]">
        <div className="text-[14px]">
          <div className="text-black dark:text-[#ffff] font-bold text-left mb-[16px]">{t('helper:termsService')}</div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <p>{t('helper:termsService1')}</p>
              <br />
              <p>{t('helper:termsService2')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:termsService3')}</li>
                <br />
                <li>{t('helper:termsService4')}</li>
                <br />
                <li>{t('helper:termsService5')}</li>
                <br />
                <li>{t('helper:termsService6')}</li>
              </ul>
              <br />
              <p>{t('helper:termsService7')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:termsService8')}</li>
                <br />
                <li>{t('helper:termsService9')}</li>
              </ul>
              <br />
              <p>{t('helper:termsService10')}</p>
              <br />
              <p>{t('helper:termsService11')}</p>
              <br />
              <p>{t('helper:termsService12')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:termsService13')}</li>
                <br />
                <li>{t('helper:termsService14')}</li>
                <br />
                <li>{t('helper:termsService15')}</li>
                <br />
                <li>{t('helper:termsService16')}</li>
                <br />
                <li>{t('helper:termsService17')}</li>
                <br />
                <li>{t('helper:termsService18')}</li>
                <br />
                <li>{t('helper:termsService19')}</li>
                <br />
                <li>{t('helper:termsService20')}</li>
                <br />
                <li>{t('helper:termsService21')}</li>
                <br />
                <li>{t('helper:termsService22')}</li>
              </ul>
              <br />
              <p>{t('helper:termsService23')}</p>
              <br />
              <p>{t('helper:termsService24')}</p>
              <br />
              <p>{t('helper:termsService25')}</p>
              <br />
              <p>{t('helper:termsService26')}</p>
              <br />
              <p>{t('helper:termsService27')}</p>
              <br />
              <p>{t('helper:termsService28')}</p>
              <br />
              <p>{t('helper:termsService29')}</p>
              <br />
              <p>{t('helper:termsService30')}</p>
              <br />
              <p>{t('helper:termsService31')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:termsService32')}</li>
                <br />
                <li>{t('helper:termsService33')}</li>
                <br />
                <li>{t('helper:termsService34')}</li>
                <br />
                <li>{t('helper:termsService35')}</li>
                <br />
                <li>{t('helper:termsService36')}</li>
                <br />
                <li>{t('helper:termsService37')}</li>
              </ul>
              <br />
              <p>{t('helper:termsService38')}</p>
              <br />
              <p>{t('helper:termsService39')}</p>
              <br />
              <p>{t('helper:termsService40')}</p>
              <br />
              <p>{t('helper:termsService41')}</p>
              <br />
              <p>{t('helper:termsService42')}</p>
              <br />
              <p>{t('helper:termsService43')}</p>
              <br />
              <p>{t('helper:termsService44')}</p>
              <br />
              <p>{t('helper:termsService45')}</p>
              <br />
              <p>{t('helper:termsService46')}</p>
              <br />
              <p>{t('helper:termsService47')}</p>
              <br />
              <p>{t('helper:termsService48')}</p>
              <br />
              <p>{t('helper:termsService49')}</p>
              <br />
              <p>{t('helper:termsService50')}</p>
              <br />
              <p>{t('helper:termsService51')}</p>
              <br />
              <p>{t('helper:termsService52')}</p>
              <br />
              <p>{t('helper:termsService53')}</p>
              <br />
              <p>{t('helper:termsService54')}</p>
              <br />
              <p>{t('helper:termsService55')}</p>
              <br />
              <p>{t('helper:termsService56')}</p>
              <br />
              <p>{t('helper:termsService57')}</p>
              <br />
              <p>{t('helper:termsService58')}</p>
              <br />
              <p>{t('helper:termsService59')}</p>
              <br />
              <p>{t('helper:termsService60')}</p>
            </div>
          </div>
        </div>
        <div className="mt-[35px] text-[14px]">
          <div className="text-black dark:text-[#ffff] font-bold text-left mb-[16px]">{t('helper:userAgreement')}</div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <p>{t('helper:userAgreement1')}</p>
              <br />
              <p>{t('helper:userAgreement2')}</p>
              <br />
              <p>{t('helper:userAgreement3')}</p>
              <br />
              <p>{t('helper:userAgreement4')}</p>
              <br />
            </div>
          </div>
        </div>
        <div className="mt-[35px] text-[14px]">
          <div className="text-black dark:text-[#ffff] font-bold text-left mb-[16px]">{t('helper:definitions')}</div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <p>{t('helper:definition1')}</p>
              <br />
              <p>{t('helper:definition2')}</p>
              <br />
              <p>{t('helper:definition3')}</p>
              <br />
              <p>{t('helper:definition4')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition5')}</li>
                <br />
                <li>{t('helper:definition6')}</li>
                <br />
                <li>{t('helper:definition7')}</li>
                <br />
                <li>{t('helper:definition8')}</li>
                <br />
                <li>{t('helper:definition9')}</li>
              </ul>
              <br />
              <p>{t('helper:definition10')}</p>
              <br />
              <p>{t('helper:definition11')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition12')}</li>
                <br />
                <li>{t('helper:definition13')}</li>
                <br />
                <li>{t('helper:definition14')}</li>
                <br />
                <li>{t('helper:definition15')}</li>
                <br />
                <li>{t('helper:definition16')}</li>
                <br />
                <li>{t('helper:definition17')}</li>
                <br />
                <li>{t('helper:definition18')}</li>
                <br />
                <li>{t('helper:definition19')}</li>
                <br />
                <li>{t('helper:definition20')}</li>
                <br />
                <li>{t('helper:definition21')}</li>
                <br />
                <li>{t('helper:definition22')}</li>
                <br />
                <li>{t('helper:definition23')}</li>
                <br />
                <li>{t('helper:definition24')}</li>
                <br />
                <li>{t('helper:definition25')}</li>
                <br />
                <li>{t('helper:definition26')}</li>
                <br />
                <li>{t('helper:definition27')}</li>
                <br />
                <li>{t('helper:definition28')}</li>
              </ul>
              <br />
              <p>{t('helper:definition29')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition30')}</li>
                <br />
                <li>{t('helper:definition31')}</li>
                <br />
                <li>{t('helper:definition32')}</li>
                <br />
                <li>{t('helper:definition33')}</li>
                <br />
                <li>{t('helper:definition34')}</li>
                <br />
                <li>{t('helper:definition35')}</li>
              </ul>
              <p>{t('helper:definition36')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition37')}</li>
              </ul>
              <br />
              <p>{t('helper:definition38')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition39')}</li>
                <br />
                <li>{t('helper:definition40')}</li>
                <br />
                <li>{t('helper:definition41')}</li>
                <br />
                <li>{t('helper:definition42')}</li>
                <br />
                <li>{t('helper:definition43')}</li>
                <br />
                <li>{t('helper:definition44')}</li>
                <br />
                <li>{t('helper:definition45')}</li>
                <br />
                <li>{t('helper:definition46')}</li>
                <br />
                <li>{t('helper:definition47')}</li>
                <br />
                <li>{t('helper:definition48')}</li>
                <br />
                <li>{t('helper:definition49')}</li>
                <br />
                <li>{t('helper:definition50')}</li>
                <br />
              </ul>
              <p>{t('helper:definition51')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition52')}</li>
                <br />
                <li>{t('helper:definition53')}</li>
                <br />
                <li>{t('helper:definition54')}</li>
                <br />
                <li>{t('helper:definition55')}</li>
                <br />
                <li>{t('helper:definition56')}</li>
                <br />
                <li>{t('helper:definition57')}</li>
                <br />
                <li>{t('helper:definition58')}</li>
                <br />
                <li>{t('helper:definition59')}</li>
                <br />
                <li>{t('helper:definition60')}</li>
                <br />
              </ul>
              <p>{t('helper:definition61')}</p>
              <br />
              <p>{t('helper:definition62')}</p>
              <br />
              <p>{t('helper:definition63')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition64')}</li>
                <br />
                <li>{t('helper:definition65')}</li>
                <br />
                <li>{t('helper:definition66')}</li>
                <br />
                <li>{t('helper:definition67')}</li>
                <br />
                <li>{t('helper:definition68')}</li>
                <br />
              </ul>
              <p>{t('helper:definition69')}</p>
              <br />
              <p>{t('helper:definition70')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition71')}</li>
                <br />
                <li>{t('helper:definition72')}</li>
                <br />
                <li>{t('helper:definition73')}</li>
                <br />
                <li>{t('helper:definition74')}</li>
                <br />
                <li>{t('helper:definition75')}</li>
                <br />
                <li>{t('helper:definition76')}</li>
                <br />
                <li>{t('helper:definition77')}</li>
                <br />
                <li>{t('helper:definition78')}</li>
                <br />
                <li>{t('helper:definition79')}</li>
                <br />
              </ul>
              <p>{t('helper:definition80')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition81')}</li>
                <br />
                <li>{t('helper:definition82')}</li>
                <br />
              </ul>
              <p>{t('helper:definition83')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:definition84')}</li>
                <br />
                <li>{t('helper:definition85')}</li>
                <br />
                <li>{t('helper:definition86')}</li>
                <br />
                <li>{t('helper:definition87')}</li>
                <br />
                <li>{t('helper:definition88')}</li>
                <br />
                <li>{t('helper:definition89')}</li>
                <br />
                <li>{t('helper:definition90')}</li>
                <br />
                <li>{t('helper:definition91')}</li>
                <br />
                <li>{t('helper:definition92')}</li>
                <br />
                <li>{t('helper:definition93')}</li>
                <br />
                <li>{t('helper:definition94')}</li>
                <br />
                <li>{t('helper:definition95')}</li>
                <br />
                <li>{t('helper:definition96')}</li>
                <br />
              </ul>
              <p>{t('helper:privacyPolicy')}</p>
              <br />
              <p>{t('helper:privacyPolicy1')}</p>
              <br />
              <p>{t('helper:privacyPolicy2')}</p>
              <br />
              <p>{t('helper:privacyPolicy3')}</p>
              <br />
              <p>{t('helper:privacyPolicy4')}</p>
              <br />
              <p>{t('helper:privacyPolicy5')}</p>
              <br />
              <p>{t('helper:privacyPolicy6')}</p>
              <br />
              <p>{t('helper:cookiesPolicy')}</p>
              <br />
              <p>{t('helper:cookiesPolicy1')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy2')}</li>
                <br />
              </ul>
              <p>{t('helper:cookiesPolicy3')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy4')}</li>
                <br />
              </ul>
              <p>{t('helper:cookiesPolicy5')}</p>
              <br />
              <p>{t('helper:cookiesPolicy6')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy7')}</li>
                <br />
                <li>{t('helper:cookiesPolicy8')}</li>
                <br />
                <li>{t('helper:cookiesPolicy9')}</li>
                <br />
                <li>{t('helper:cookiesPolicy10')}</li>
                <br />
                <li>{t('helper:cookiesPolicy11')}</li>
                <br />
                <li>{t('helper:cookiesPolicy12')}</li>
                <br />
                <li>{t('helper:cookiesPolicy13')}</li>
                <br />
                <li>{t('helper:cookiesPolicy14')}</li>
                <br />
                <li>{t('helper:cookiesPolicy15')}</li>
                <br />
                <li>{t('helper:cookiesPolicy16')}</li>
                <br />
              </ul>
              <p>{t('helper:cookiesPolicy17')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy18')}</li>
              </ul>
              <br />
              <p>{t('helper:cookiesPolicy19')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy20')}</li>
              </ul>
              <br />
              <p>{t('helper:cookiesPolicy21')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy22')}</li>
                <br />
                <li>{t('helper:cookiesPolicy23')}</li>
                <br />
                <li>{t('helper:cookiesPolicy24')}</li>
                <br />
                <li>{t('helper:cookiesPolicy25')}</li>
                <br />
                <li>{t('helper:cookiesPolicy26')}</li>
                <br />
                <li>{t('helper:cookiesPolicy27')}</li>
                <br />
                <li>{t('helper:cookiesPolicy28')}</li>
                <br />
                <li>{t('helper:cookiesPolicy29')}</li>
                <br />
                <li>{t('helper:cookiesPolicy30')}</li>
                <br />
                <li>{t('helper:cookiesPolicy31')}</li>
                <br />
                <li>{t('helper:cookiesPolicy32')}</li>
                <br />
                <li>{t('helper:cookiesPolicy33')}</li>
                <br />
              </ul>
              <p>{t('helper:cookiesPolicy34')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:cookiesPolicy35')}</li>
                <br />
                <li>{t('helper:cookiesPolicy36')}</li>
                <br />
                <li>{t('helper:cookiesPolicy37')}</li>
                <br />
                <li>{t('helper:cookiesPolicy38')}</li>
                <br />
                <li>{t('helper:cookiesPolicy39')}</li>
                <br />
                <li>{t('helper:cookiesPolicy40')}</li>
                <br />
                <li>{t('helper:cookiesPolicy41')}</li>
                <br />
              </ul>
              <p>{t('helper:cookiesPolicy42')}</p>
              <br />
              <p>{t('helper:cookiesPolicy43')}</p>
              <br />
              <p>{t('helper:cookiesPolicy44')}</p>
              <br />
              <p>{t('helper:cookiesPolicy45')}</p>
              <br />
              <p>{t('helper:cookiesPolicy46')}</p>
              <br />
              <p>{t('helper:cookiesPolicy47')}</p>
              <br />
              <p>{t('helper:cookiesPolicy48')}</p>
              <br />
              <p>{t('helper:cookiesPolicy49')}</p>
              <br />
              <p>{t('helper:cookiesPolicy50')}</p>
              <br />
              <p>{t('helper:cookiesPolicy51')}</p>
              <br />
              <p>{t('helper:cookiesPolicy52')}</p>
              <br />
              <p>{t('helper:cookiesPolicy53')}</p>
              <br />
              <p>{t('helper:cookiesPolicy54')}</p>
              <br />
              <p>{t('helper:cookiesPolicy55')}</p>
              <br />
              <p>{t('helper:cookiesPolicy56')}</p>
              <br />
              <p>{t('helper:cookiesPolicy57')}</p>
              <br />
              <ul className="list-disc px-4">
                <li>{t('helper:google')}</li>
                <br />
                <li>{t('helper:facebook')}</li>
                <br />
                <li>{t('helper:telegram')}</li>
                <br />
                <li>{t('helper:metamask')}</li>
                <br />
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-[35px] text-[14px]">
          <div className="text-black dark:text-[#ffff] font-bold text-left mb-[16px]">{t('helper:web3')}</div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <p>{t('helper:web31')}</p>
              <br />
              <p>{t('helper:web32')}</p>
              <br />
              <p>{t('helper:web33')}</p>
              <br />
              <p>{t('helper:web34')}</p>
            </div>
          </div>
        </div>
        <div className="mt-[35px] text-[14px]">
          <div className="text-black dark:text-[#ffff] font-bold text-left mb-[16px]">
            {t('helper:registrationLogin')}
          </div>
          <div className="">
            <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
              <p>{t('helper:registrationLogin1')}</p>
              <br />
              <p>{t('helper:registrationLogin2')}</p>
              <br />
              <p>{t('helper:registrationLogin3')}</p>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden block w-full">
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[12px] md:mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] font-bold text-left">{t('helper:termsService')}</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[12px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
                      <p>{t('helper:termsService1')}</p>
                      <br />
                      <p>{t('helper:termsService2')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:termsService3')}</li>
                        <br />
                        <li>{t('helper:termsService4')}</li>
                        <br />
                        <li>{t('helper:termsService5')}</li>
                        <br />
                        <li>{t('helper:termsService6')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:termsService7')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:termsService8')}</li>
                        <br />
                        <li>{t('helper:termsService9')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:termsService10')}</p>
                      <br />
                      <p>{t('helper:termsService11')}</p>
                      <br />
                      <p>{t('helper:termsService12')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:termsService13')}</li>
                        <br />
                        <li>{t('helper:termsService14')}</li>
                        <br />
                        <li>{t('helper:termsService15')}</li>
                        <br />
                        <li>{t('helper:termsService16')}</li>
                        <br />
                        <li>{t('helper:termsService17')}</li>
                        <br />
                        <li>{t('helper:termsService18')}</li>
                        <br />
                        <li>{t('helper:termsService19')}</li>
                        <br />
                        <li>{t('helper:termsService20')}</li>
                        <br />
                        <li>{t('helper:termsService21')}</li>
                        <br />
                        <li>{t('helper:termsService22')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:termsService23')}</p>
                      <br />
                      <p>{t('helper:termsService24')}</p>
                      <br />
                      <p>{t('helper:termsService25')}</p>
                      <br />
                      <p>{t('helper:termsService26')}</p>
                      <br />
                      <p>{t('helper:termsService27')}</p>
                      <br />
                      <p>{t('helper:termsService28')}</p>
                      <br />
                      <p>{t('helper:termsService29')}</p>
                      <br />
                      <p>{t('helper:termsService30')}</p>
                      <br />
                      <p>{t('helper:termsService31')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:termsService32')}</li>
                        <br />
                        <li>{t('helper:termsService33')}</li>
                        <br />
                        <li>{t('helper:termsService34')}</li>
                        <br />
                        <li>{t('helper:termsService35')}</li>
                        <br />
                        <li>{t('helper:termsService36')}</li>
                        <br />
                        <li>{t('helper:termsService37')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:termsService38')}</p>
                      <br />
                      <p>{t('helper:termsService39')}</p>
                      <br />
                      <p>{t('helper:termsService40')}</p>
                      <br />
                      <p>{t('helper:termsService41')}</p>
                      <br />
                      <p>{t('helper:termsService42')}</p>
                      <br />
                      <p>{t('helper:termsService43')}</p>
                      <br />
                      <p>{t('helper:termsService44')}</p>
                      <br />
                      <p>{t('helper:termsService45')}</p>
                      <br />
                      <p>{t('helper:termsService46')}</p>
                      <br />
                      <p>{t('helper:termsService47')}</p>
                      <br />
                      <p>{t('helper:termsService48')}</p>
                      <br />
                      <p>{t('helper:termsService49')}</p>
                      <br />
                      <p>{t('helper:termsService50')}</p>
                      <br />
                      <p>{t('helper:termsService51')}</p>
                      <br />
                      <p>{t('helper:termsService52')}</p>
                      <br />
                      <p>{t('helper:termsService53')}</p>
                      <br />
                      <p>{t('helper:termsService54')}</p>
                      <br />
                      <p>{t('helper:termsService55')}</p>
                      <br />
                      <p>{t('helper:termsService56')}</p>
                      <br />
                      <p>{t('helper:termsService57')}</p>
                      <br />
                      <p>{t('helper:termsService58')}</p>
                      <br />
                      <p>{t('helper:termsService59')}</p>
                      <br />
                      <p>{t('helper:termsService60')}</p>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[12px] md:mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] font-bold text-left">{t('helper:userAgreement')}</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[12px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
                      <p>{t('helper:userAgreement1')}</p>
                      <br />
                      <p>{t('helper:userAgreement2')}</p>
                      <br />
                      <p>{t('helper:userAgreement3')}</p>
                      <br />
                      <p>{t('helper:userAgreement4')}</p>
                      <br />
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[12px] md:mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] font-bold text-left">{t('helper:definitions')}</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[12px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
                      <p>{t('helper:definition1')}</p>
                      <br />
                      <p>{t('helper:definition2')}</p>
                      <br />
                      <p>{t('helper:definition3')}</p>
                      <br />
                      <p>{t('helper:definition4')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition5')}</li>
                        <br />
                        <li>{t('helper:definition6')}</li>
                        <br />
                        <li>{t('helper:definition7')}</li>
                        <br />
                        <li>{t('helper:definition8')}</li>
                        <br />
                        <li>{t('helper:definition9')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:definition10')}</p>
                      <br />
                      <p>{t('helper:definition11')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition12')}</li>
                        <br />
                        <li>{t('helper:definition13')}</li>
                        <br />
                        <li>{t('helper:definition14')}</li>
                        <br />
                        <li>{t('helper:definition15')}</li>
                        <br />
                        <li>{t('helper:definition16')}</li>
                        <br />
                        <li>{t('helper:definition17')}</li>
                        <br />
                        <li>{t('helper:definition18')}</li>
                        <br />
                        <li>{t('helper:definition19')}</li>
                        <br />
                        <li>{t('helper:definition20')}</li>
                        <br />
                        <li>{t('helper:definition21')}</li>
                        <br />
                        <li>{t('helper:definition22')}</li>
                        <br />
                        <li>{t('helper:definition23')}</li>
                        <br />
                        <li>{t('helper:definition24')}</li>
                        <br />
                        <li>{t('helper:definition25')}</li>
                        <br />
                        <li>{t('helper:definition26')}</li>
                        <br />
                        <li>{t('helper:definition27')}</li>
                        <br />
                        <li>{t('helper:definition28')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:definition29')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition30')}</li>
                        <br />
                        <li>{t('helper:definition31')}</li>
                        <br />
                        <li>{t('helper:definition32')}</li>
                        <br />
                        <li>{t('helper:definition33')}</li>
                        <br />
                        <li>{t('helper:definition34')}</li>
                        <br />
                        <li>{t('helper:definition35')}</li>
                      </ul>
                      <p>{t('helper:definition36')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition37')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:definition38')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition39')}</li>
                        <br />
                        <li>{t('helper:definition40')}</li>
                        <br />
                        <li>{t('helper:definition41')}</li>
                        <br />
                        <li>{t('helper:definition42')}</li>
                        <br />
                        <li>{t('helper:definition43')}</li>
                        <br />
                        <li>{t('helper:definition44')}</li>
                        <br />
                        <li>{t('helper:definition45')}</li>
                        <br />
                        <li>{t('helper:definition46')}</li>
                        <br />
                        <li>{t('helper:definition47')}</li>
                        <br />
                        <li>{t('helper:definition48')}</li>
                        <br />
                        <li>{t('helper:definition49')}</li>
                        <br />
                        <li>{t('helper:definition50')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition51')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition52')}</li>
                        <br />
                        <li>{t('helper:definition53')}</li>
                        <br />
                        <li>{t('helper:definition54')}</li>
                        <br />
                        <li>{t('helper:definition55')}</li>
                        <br />
                        <li>{t('helper:definition56')}</li>
                        <br />
                        <li>{t('helper:definition57')}</li>
                        <br />
                        <li>{t('helper:definition58')}</li>
                        <br />
                        <li>{t('helper:definition59')}</li>
                        <br />
                        <li>{t('helper:definition60')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition61')}</p>
                      <br />
                      <p>{t('helper:definition62')}</p>
                      <br />
                      <p>{t('helper:definition63')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition64')}</li>
                        <br />
                        <li>{t('helper:definition65')}</li>
                        <br />
                        <li>{t('helper:definition66')}</li>
                        <br />
                        <li>{t('helper:definition67')}</li>
                        <br />
                        <li>{t('helper:definition68')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition69')}</p>
                      <br />
                      <p>{t('helper:definition70')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition71')}</li>
                        <br />
                        <li>{t('helper:definition72')}</li>
                        <br />
                        <li>{t('helper:definition73')}</li>
                        <br />
                        <li>{t('helper:definition74')}</li>
                        <br />
                        <li>{t('helper:definition75')}</li>
                        <br />
                        <li>{t('helper:definition76')}</li>
                        <br />
                        <li>{t('helper:definition77')}</li>
                        <br />
                        <li>{t('helper:definition78')}</li>
                        <br />
                        <li>{t('helper:definition79')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition80')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition81')}</li>
                        <br />
                        <li>{t('helper:definition82')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition83')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition84')}</li>
                        <br />
                        <li>{t('helper:definition85')}</li>
                        <br />
                        <li>{t('helper:definition86')}</li>
                        <br />
                        <li>{t('helper:definition87')}</li>
                        <br />
                        <li>{t('helper:definition88')}</li>
                        <br />
                        <li>{t('helper:definition89')}</li>
                        <br />
                        <li>{t('helper:definition90')}</li>
                        <br />
                        <li>{t('helper:definition91')}</li>
                        <br />
                        <li>{t('helper:definition92')}</li>
                        <br />
                        <li>{t('helper:definition93')}</li>
                        <br />
                        <li>{t('helper:definition94')}</li>
                        <br />
                        <li>{t('helper:definition95')}</li>
                        <br />
                        <li>{t('helper:definition96')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:privacyPolicy')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy1')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy2')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy3')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy4')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy5')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy6')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy1')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy2')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy3')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy4')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy5')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy6')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy7')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy8')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy9')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy10')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy11')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy12')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy13')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy14')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy15')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy16')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy17')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy18')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:cookiesPolicy19')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy20')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:cookiesPolicy21')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy22')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy23')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy24')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy25')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy26')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy27')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy28')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy29')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy30')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy31')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy32')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy33')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy34')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy35')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy36')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy37')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy38')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy39')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy40')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy41')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy42')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy43')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy44')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy45')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy46')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy47')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy48')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy49')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy50')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy51')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy52')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy53')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy54')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy55')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy56')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy57')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:google')}</li>
                        <br />
                        <li>{t('helper:facebook')}</li>
                        <br />
                        <li>{t('helper:telegram')}</li>
                        <br />
                        <li>{t('helper:metamask')}</li>
                        <br />
                      </ul>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[12px] md:mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] font-bold text-left">{t('helper:web3')}</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[12px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
                      <p>{t('helper:definition1')}</p>
                      <br />
                      <p>{t('helper:definition2')}</p>
                      <br />
                      <p>{t('helper:definition3')}</p>
                      <br />
                      <p>{t('helper:definition4')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition5')}</li>
                        <br />
                        <li>{t('helper:definition6')}</li>
                        <br />
                        <li>{t('helper:definition7')}</li>
                        <br />
                        <li>{t('helper:definition8')}</li>
                        <br />
                        <li>{t('helper:definition9')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:definition10')}</p>
                      <br />
                      <p>{t('helper:definition11')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition12')}</li>
                        <br />
                        <li>{t('helper:definition13')}</li>
                        <br />
                        <li>{t('helper:definition14')}</li>
                        <br />
                        <li>{t('helper:definition15')}</li>
                        <br />
                        <li>{t('helper:definition16')}</li>
                        <br />
                        <li>{t('helper:definition17')}</li>
                        <br />
                        <li>{t('helper:definition18')}</li>
                        <br />
                        <li>{t('helper:definition19')}</li>
                        <br />
                        <li>{t('helper:definition20')}</li>
                        <br />
                        <li>{t('helper:definition21')}</li>
                        <br />
                        <li>{t('helper:definition22')}</li>
                        <br />
                        <li>{t('helper:definition23')}</li>
                        <br />
                        <li>{t('helper:definition24')}</li>
                        <br />
                        <li>{t('helper:definition25')}</li>
                        <br />
                        <li>{t('helper:definition26')}</li>
                        <br />
                        <li>{t('helper:definition27')}</li>
                        <br />
                        <li>{t('helper:definition28')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:definition29')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition30')}</li>
                        <br />
                        <li>{t('helper:definition31')}</li>
                        <br />
                        <li>{t('helper:definition32')}</li>
                        <br />
                        <li>{t('helper:definition33')}</li>
                        <br />
                        <li>{t('helper:definition34')}</li>
                        <br />
                        <li>{t('helper:definition35')}</li>
                      </ul>
                      <p>{t('helper:definition36')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition37')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:definition38')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition39')}</li>
                        <br />
                        <li>{t('helper:definition40')}</li>
                        <br />
                        <li>{t('helper:definition41')}</li>
                        <br />
                        <li>{t('helper:definition42')}</li>
                        <br />
                        <li>{t('helper:definition43')}</li>
                        <br />
                        <li>{t('helper:definition44')}</li>
                        <br />
                        <li>{t('helper:definition45')}</li>
                        <br />
                        <li>{t('helper:definition46')}</li>
                        <br />
                        <li>{t('helper:definition47')}</li>
                        <br />
                        <li>{t('helper:definition48')}</li>
                        <br />
                        <li>{t('helper:definition49')}</li>
                        <br />
                        <li>{t('helper:definition50')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition51')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition52')}</li>
                        <br />
                        <li>{t('helper:definition53')}</li>
                        <br />
                        <li>{t('helper:definition54')}</li>
                        <br />
                        <li>{t('helper:definition55')}</li>
                        <br />
                        <li>{t('helper:definition56')}</li>
                        <br />
                        <li>{t('helper:definition57')}</li>
                        <br />
                        <li>{t('helper:definition58')}</li>
                        <br />
                        <li>{t('helper:definition59')}</li>
                        <br />
                        <li>{t('helper:definition60')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition61')}</p>
                      <br />
                      <p>{t('helper:definition62')}</p>
                      <br />
                      <p>{t('helper:definition63')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition64')}</li>
                        <br />
                        <li>{t('helper:definition65')}</li>
                        <br />
                        <li>{t('helper:definition66')}</li>
                        <br />
                        <li>{t('helper:definition67')}</li>
                        <br />
                        <li>{t('helper:definition68')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition69')}</p>
                      <br />
                      <p>{t('helper:definition70')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition71')}</li>
                        <br />
                        <li>{t('helper:definition72')}</li>
                        <br />
                        <li>{t('helper:definition73')}</li>
                        <br />
                        <li>{t('helper:definition74')}</li>
                        <br />
                        <li>{t('helper:definition75')}</li>
                        <br />
                        <li>{t('helper:definition76')}</li>
                        <br />
                        <li>{t('helper:definition77')}</li>
                        <br />
                        <li>{t('helper:definition78')}</li>
                        <br />
                        <li>{t('helper:definition79')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition80')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition81')}</li>
                        <br />
                        <li>{t('helper:definition82')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:definition83')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:definition84')}</li>
                        <br />
                        <li>{t('helper:definition85')}</li>
                        <br />
                        <li>{t('helper:definition86')}</li>
                        <br />
                        <li>{t('helper:definition87')}</li>
                        <br />
                        <li>{t('helper:definition88')}</li>
                        <br />
                        <li>{t('helper:definition89')}</li>
                        <br />
                        <li>{t('helper:definition90')}</li>
                        <br />
                        <li>{t('helper:definition91')}</li>
                        <br />
                        <li>{t('helper:definition92')}</li>
                        <br />
                        <li>{t('helper:definition93')}</li>
                        <br />
                        <li>{t('helper:definition94')}</li>
                        <br />
                        <li>{t('helper:definition95')}</li>
                        <br />
                        <li>{t('helper:definition96')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:privacyPolicy')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy1')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy2')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy3')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy4')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy5')}</p>
                      <br />
                      <p>{t('helper:privacyPolicy6')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy1')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy2')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy3')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy4')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy5')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy6')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy7')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy8')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy9')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy10')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy11')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy12')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy13')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy14')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy15')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy16')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy17')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy18')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:cookiesPolicy19')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy20')}</li>
                      </ul>
                      <br />
                      <p>{t('helper:cookiesPolicy21')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy22')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy23')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy24')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy25')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy26')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy27')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy28')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy29')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy30')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy31')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy32')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy33')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy34')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:cookiesPolicy35')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy36')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy37')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy38')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy39')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy40')}</li>
                        <br />
                        <li>{t('helper:cookiesPolicy41')}</li>
                        <br />
                      </ul>
                      <p>{t('helper:cookiesPolicy42')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy43')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy44')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy45')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy46')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy47')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy48')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy49')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy50')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy51')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy52')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy53')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy54')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy55')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy56')}</p>
                      <br />
                      <p>{t('helper:cookiesPolicy57')}</p>
                      <br />
                      <ul className="list-disc px-4">
                        <li>{t('helper:google')}</li>
                        <br />
                        <li>{t('helper:facebook')}</li>
                        <br />
                        <li>{t('helper:telegram')}</li>
                        <br />
                        <li>{t('helper:metamask')}</li>
                        <br />
                      </ul>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[12px] md:mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] font-bold text-left">{t('helper:registrationLogin')}</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[12px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
                      <p>{t('helper:registrationLogin1')}</p>
                      <br />
                      <p>{t('helper:registrationLogin2')}</p>
                      <br />
                      <p>{t('helper:registrationLogin3')}</p>
                      <br />
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

TermsOfServicePage.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default TermsOfServicePage;
