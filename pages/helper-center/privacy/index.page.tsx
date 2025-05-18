import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import HelperLayout from '@/components/layouts/helper.layout';
import Head from 'next/head';

const HelperPrivacyPage = () => {
  const { t } = useTranslation('');
  const listPrivacyBlock = [
    t('privacy:privacyBlock1'),
    t('privacy:privacyBlock2'),
    t('privacy:privacyBlock3'),
    t('privacy:privacyBlock4'),
    t('privacy:privacyBlock5'),
    t('privacy:privacyBlock6'),
  ];

  const listCookiePolicy = [
    t('privacy:cookiePolicy6'),
    t('privacy:cookiePolicy7'),
    t('privacy:cookiePolicy8'),
    t('privacy:cookiePolicy9'),
    t('privacy:cookiePolicy10'),
    t('privacy:cookiePolicy11'),
    t('privacy:cookiePolicy12'),
    t('privacy:cookiePolicy13'),
    t('privacy:cookiePolicy14'),
  ];

  const listProtectionPolicy = [
    t('privacy:protectionPolicy1'),
    t('privacy:protectionPolicy2'),
    t('privacy:protectionPolicy3'),
    t('privacy:protectionPolicy4'),
    t('privacy:protectionPolicy5'),
    t('privacy:protectionPolicy6'),
    t('privacy:protectionPolicy7'),
    t('privacy:protectionPolicy8'),
    t('privacy:protectionPolicy9'),
    t('privacy:protectionPolicy10'),
    t('privacy:protectionPolicy11'),
    t('privacy:protectionPolicy12'),
  ];
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://bonenza.com/helper-center/privacy"
          key="canonical"
        />
      </Head>
      <div className="sm:block hidden pl-[7px] pr-[5px] pb-[15px] pt-[20px]">
        <div className="">
          <div className="text-black dark:text-[#FFF] text-[16px] font-bold text-left mb-[10px]">
            {t('privacy:privacyPolicy')}
          </div>
          <div className="pl-2">
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[9px]">
              {listPrivacyBlock.map((item, index) => {
                return (
                  <div key={index}>
                    <p>{item}</p>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-[10px]">
          <div className="text-black dark:text-[#ffff] text-[16px] font-bold text-left mb-[7px]">
            {t('privacy:cookiesPolicy')}
          </div>
          <div className="pl-2">
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[4px]">
                {t('privacy:whatCookies')}
              </div>
              <div
                className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left"
                dangerouslySetInnerHTML={{ __html: String(t('privacy:cookiePolicy4')) }}
              ></div>
            </div>
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[4px]">
                {t('privacy:cookiePolicy1')}
              </div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                {t('privacy:cookiePolicy2')}
              </div>
            </div>
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[4px]">
                {t('privacy:cookiePolicy3')}
              </div>
              <div
                className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]"
                dangerouslySetInnerHTML={{ __html: String(t('privacy:cookiePolicy5')) }}
              ></div>
              {listCookiePolicy.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[4px]">
                {t('privacy:cookiePolicy15')}
              </div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                {t('privacy:cookiePolicy16')}
              </div>
            </div>
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[4px]">
                {t('privacy:personalDataProtection')}
              </div>
              <div
                className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left"
                dangerouslySetInnerHTML={{ __html: String(t('privacy:personalDataProtection1')) }}
              ></div>
            </div>
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[4px]">
                {t('privacy:protectionPolicy')}
              </div>
              {listProtectionPolicy.map((item, index) => {
                return (
                  <div
                    className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[4px]"
                    key={index}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
            <div className="mb-[24px]">
              <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[10px]">
                {t('privacy:dataInternational')}
              </div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                {t('privacy:dataInternational1')}
              </div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                {t('privacy:dataInternational2')}
              </div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                {t('privacy:dataInternational3')}
              </div>
            </div>
          </div>
        </div>
        <div className="pl-2">
          <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[10px]">
            {t('privacy:technicalIssues')}
          </div>
          <div className="">
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
              {t('privacy:technicalIssues1')}
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
              {t('privacy:technicalIssues2')}
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[4px]">
              Username
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[4px]">
              {t('privacy:technicalIssues4')}
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[4px]">
              {t('privacy:technicalIssues5')}
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
              {t('privacy:technicalIssues6')}
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
              {t('privacy:technicalIssues7')}
            </div>
          </div>
        </div>
        <div className="mt-[36px]">
          <div className="text-black dark:text-[#ffff] text-[16px] font-bold text-left mb-[10px]">
            {t('privacy:collectingAndUsing')}
          </div>
        </div>
        <div className="mt-[20px] pl-2">
          <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[10px]">
            {t('privacy:typesOfData')}
          </div>
          <div className="">
            <div className="text-black dark:text-[#C2C2C2] text-[14px] font-normal text-left pb-[12px]">
              {'- '}
              {t('privacy:personalData')}
            </div>
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px] pl-2">
              {t('privacy:personalData1')}
            </div>
            <ul className="text-left list-disc ml-[15px] pl-2">
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                {t('privacy:personalData2')}
              </li>
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                {t('privacy:personalData3')}
              </li>
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                {t('privacy:personalData4')}
              </li>
            </ul>
          </div>
          <div className="">
            <div className="text-black dark:text-[#C2C2C2] text-[14px] font-normal text-left pb-[10px]">
              {'- '}
              {t('privacy:usageData')}
            </div>
            <div className="pl-2">
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                {t('privacy:usageData1')}
              </div>
              <div
                className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]"
                dangerouslySetInnerHTML={{ __html: String(t('privacy:usageData2')) }}
              ></div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                {t('privacy:usageData3')}
              </div>
              <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                {t('privacy:usageData4')}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[20px] pl-2">
          <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[10px]">
            {t('privacy:information')}
          </div>
          <div className="">
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
              {t('privacy:information1')}
            </div>
            <ul className="text-left list-disc ml-[15px]">
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">Google</li>
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                Facebook
              </li>
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                Telegram
              </li>
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                Metamask
              </li>
              <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                Web 3.0
              </li>
            </ul>
          </div>
          <div className="">
            <div
              className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]"
              dangerouslySetInnerHTML={{ __html: String(t('privacy:information2')) }}
            ></div>
            <div
              className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]"
              dangerouslySetInnerHTML={{ __html: String(t('privacy:information3')) }}
            ></div>
          </div>
        </div>
        <div className="pl-2">
          <div className="text-black dark:text-[#ffff] text-[14px] font-normal text-left mb-[10px]">
            {t('privacy:deletePersonalData')}
          </div>
          <div className="">
            <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[9px]">
              {t('privacy:deletePersonalData1')}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden block w-full">
        <Disclosure>
          {({ open }) => (
            <div className="w-full mt-[38px] border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center  mb-[12px]">
                <div className="text-[#ffff] text-[14px] font-bold text-left">{t('privacy:privacyPolicy')}</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[10px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      {t('privacy:privacyPolicy1')}
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      {t('privacy:privacyPolicy2')}
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      {t('privacy:privacyPolicy3')}
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      {t('privacy:privacyPolicy4')}
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      {t('privacy:privacyPolicy5')}
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                      {t('privacy:privacyPolicy6')}
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center mt-[6px] mb-[6px]">
                <div className="text-black dark:text-[#ffff] text-[14px] font-bold text-left">Cookies Policy</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[10px] pb-2'}>
                  <div className="">
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        What are cookies?
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        A cookie is a piece of information in the form of a very small text file that is placed on an
                        internet user&apos;s computer. It is generated by a web page server (which is basically the
                        computer that operates the website) and can be used by that server whenever the user visits the
                        site. A cookie can be thought of as an internet user&apos;s identification card, which tells a
                        website when the user has returned. Cookies can&apos;t harm your computer and we don&apos;t
                        store any personally identifiable information about you on any of our cookies.
                      </div>
                    </div>
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        Why do we use cookies on BONENZA?
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        BONENZA uses two types of cookies: cookies set by us and cookies set by third parties (i.e.
                        other websites or services). BONENZA cookies enable us to keep you signed in to your account
                        throughout your visit and to tailor the information displayed on the site to your preferences.
                      </div>
                    </div>
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        What cookies do we use on BONENZA?
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        _fp - stores browser&apos;s fingerprint. Lifetime: forever.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        _t - stores timestamp when user firstly visited site in current browsing session. Needed for
                        unique visits statistic. Lifetime: browsing session.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        _r - stores http referrer for current browsing session. Needed in order to external track
                        traffic sources. Lifetime: browsing session.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        _c - stores identifier of affiliate campaign. Needed for affiliate statistic. Lifetime: forever.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Cookies set by third parties for wildcard domain: *.BONENZA
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Google analytics: _ga, _gat, _gid
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Zendesk：__ zlcmid
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Cloudflare：__ cfuid
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Please keep in mind that some browsers (i.e. chrome on mac) keep background processes running
                        even if no tabs opened due to this session cookies may left set between sessions.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        There are also cookies set by third party scripts to their domains.
                      </div>
                    </div>
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        How can I manage my cookies on BONENZA?
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        If you wish to stop accepting cookies, you can do so through the Privacy Settings option in your
                        browser.
                      </div>
                    </div>
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        Personal Data Protection Policy
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        BONENZA&apos;s mission is to keep your Data safe and for this matter we protect your data in
                        various ways. We provide our customers with high security standards, such as encryption of data
                        in motion over public networks, encryption of data in database, auditing standards, Distributed
                        Denial of Service mitigations, and a Live Chat available on-site.
                      </div>
                    </div>
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        6.Server Protection Policy
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        All servers have full encryption;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        All backups have encryption;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Firewalls, VPN Access;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Access to servers allowed only over VPN;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        All http/s services work over Cloudflare;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Connections to nodes over VPN;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        SSH port forwarding tunnels;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Services allowed only over VPN;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        Server have firewall and allowed only SSH port;
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        Alerts on critical services.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        Data Breach Notification
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                        When BONENZA will be made aware of personal data breaches we will notify relevant users in
                        accordance with GDPR timeframes.
                      </div>
                    </div>
                    <div className="mb-[9px]">
                      <div className="text-black dark:text-[#ffff] text-[14px] dark:font-bold text-left mb-[10px]">
                        Data International Transfer
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        We only disclose personal data to third parties where it is necessary to provide the
                        high-quality service or in order to respond lawful requests from authorities.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        We share the following data to third party systems:
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left mb-[11px]">
                        All servers have full encryption;Zendesk Inc. – username and e-mail information is transferred
                        if user sends a message to live-chat or sends an e-mail to support mailbox.
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center mt-[6px] mb-[6px]">
                <div className="text-[#ffff] text-[14px] font-bold text-left">Technical issues</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[10px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
                      Although we try to do our best, problems could occur now and then. Our team will do everything we
                      could to solve your problems as soon as possible. To assist you quicker, You can join us by
                      clicking the button above to join the telegram group.
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
                      If an error occurs, please provide the following information:
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
                      Username
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
                      Date and time of the problem
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
                      Game ID or table name, if any
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[20px]">
                      Screenshot of the error, if possible
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left">
                      We really appreciate your help and the error report you provided because your information report
                      could help us improve.
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center mt-[6px] mb-[6px]">
                <div className="text-[#ffff] text-[14px] font-bold text-left">
                  Collecting and Using Your Personal Data
                </div>
                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
              </Disclosure.Button>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center mt-[6px] mb-[6px]">
                <div className="text-[#ffff] text-[14px] font-bold text-left">Types of Data Collected</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[10px] pb-2'}>
                  <div className="">
                    <div className="text-black dark:text-[#C2C2C2] text-[14px] font-bold text-left pb-[12px]">
                      Personal Data
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      While using Our Service, We may ask You to provide Us with certain personally identifiable
                      information that can be used to contact or identify You. Personally identifiable information may
                      include, but is not limited to:
                    </div>
                    <ul className="text-left list-disc ml-[15px]">
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Email address
                      </li>
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        First name and last name
                      </li>
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Usage Data
                      </li>
                    </ul>
                  </div>
                  <div className="">
                    <div className="text-black dark:text-[#C2C2C2] text-[14px] font-bold text-left pb-[10px]">
                      Usage Data
                    </div>
                    <div className="">
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                        Usage Data is collected automatically when using the Service.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                        Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g. IP
                        address), browser type, browser version, the pages of our Service that You visit, the time and
                        date of Your visit, the time spent on those pages, unique device identifiers and other
                        diagnostic data.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                        When You access the Service by or through a mobile device, We may collect certain information
                        automatically, including, but not limited to, the type of mobile device You use, Your mobile
                        device unique ID, the IP address of Your mobile device, Your mobile operating system, the type
                        of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                      </div>
                      <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                        We may also collect information that Your browser sends whenever You visit our Service or when
                        You access the Service by or through a mobile device.
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full border-b border-solid border-[#3D4049]">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center mt-[6px] mb-[6px]">
                <div className="text-[#ffff] text-[14px] font-bold text-left">
                  Information from Third-Party Social Media Services
                </div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[10px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      BONENZA allows You to create an account and log in to use the Service through the following
                      Third-party Social Media Services:
                    </div>
                    <ul className="text-left list-disc ml-[15px]">
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Google
                      </li>
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Facebook
                      </li>
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Telegram
                      </li>
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Metamask
                      </li>
                      <li className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal  pb-[12px]">
                        Web3.0
                      </li>
                    </ul>
                  </div>
                  <div className="">
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      If You decide to register through or otherwise grant us access to a Third-Party Social Media
                      Service, We may collect Personal data that is already associated with Your Third-Party Social
                      Media Service&apos;s account, such as Your name, Your email address, Your activities or Your
                      contact list associated with that account.
                    </div>
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[12px]">
                      You may also have the option of sharing additional information with the BONENZA through Your
                      Third-Party Social Media Service&apos;s account. If You choose to provide such information and
                      Personal Data, during registration or otherwise, You are giving BONENZA permission to use, share,
                      and store it in a manner consistent with this Privacy Policy.
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <div className="w-full">
              <Disclosure.Button className="py-2 w-full flex justify-between items-center mt-[6px]">
                <div className="text-[#ffff] text-[14px] font-bold text-left"> Delete Personal Data</div>
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
                <Disclosure.Panel className={'flex flex-col gap-[10px] w-full text-[10px] pb-2'}>
                  <div className="">
                    <div className="text-[#31373d] dark:text-color-text-primary text-[14px] font-normal text-left pb-[9px]">
                      You can request to have your personal data deleted if BONENZA no longer have a legal reason to
                      continue to process or store it. Please note that this right is not guaranteed - in the sense that
                      BONENZA do not have the ability to comply with your request if it is subject to a legal obligation
                      to store your data. You can request the deletion of your personal data by sending an email to
                      support@bonenza
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

HelperPrivacyPage.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default HelperPrivacyPage;
