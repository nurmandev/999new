import { Menu } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2 } from 'iconsax-react';
import Head from 'next/head';
import { ReactElement, useState } from 'react';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';

import { api_requestSelfExclusion } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import HelperLayout from '@/components/layouts/helper.layout';
import CommonModal from '@/components/modal/commonModal/commonModal';

const SelfExclusion = () => {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState(false);
  const periods = [
    {
      description: `1 ${t('helper:selfExclusionPeriodMonth')}`,
      value: 1,
    },
    {
      description: `3 ${t('helper:selfExclusionPeriodMonth')}`,
      value: 3,
    },
    {
      description: `6 ${t('helper:selfExclusionPeriodMonth')}`,
      value: 6,
    },
    {
      description: `12 ${t('helper:selfExclusionPeriodMonth')}`,
      value: 12,
    },
    {
      description: t('helper:selfExclusionPeriodPermanent'),
      value: -1,
    },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [acknowledge, setAcknowledge] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);

  const handleRequest = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const utcTime = Date.now();
      const disabledDate = new Date(utcTime);
      disabledDate.setMonth(disabledDate.getMonth() + selectedPeriod);
      const unixTime = selectedPeriod === -1 ? -1 : Math.floor(disabledDate.getTime() / 1000);
      const _res = await api_requestSelfExclusion(unixTime);
      toast.success(t('success:sentEmailSuccessfully'), {
        containerId: TOAST_ENUM.COMMON,
        toastId: 'selfExclusionSucceed',
        icon: true,
      });
      setIsLoading(false);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      // const status = error.response?.data?.statusCode ?? '';
      // const description = error.response?.data?.error ?? "You can't set self-exclusion.";
      // if (message === 'email') {
      //   toast.error(description, { containerId: TOAST_ENUM.COMMON });
      // } else {
      //   toast.error("You can't set self-exclusion.", { containerId: TOAST_ENUM.COMMON });
      // }
      const errMessage = getErrorMessage(errType);
      toast.error(String(t(errMessage)), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <link rel="canonical" href="https://bonenza.com/helper-center/self-exclusion" key="canonical" />
      </Head>
      <div className="pl-[7px] pr-[5px] pb-[15px] pt-6 text-[14px]">
        <div className="text-black dark:text-[#ffff] font-bold text-[14px] text-left mb-[10px]">
          {t('helper:selfExclusion')}
        </div>
        <div className="border-solid border-b-[1px] border-b-[#333] pb-2">
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left pb-[9px]">
            <div>{t('helper:selfExclusionContent1')}</div>
            <div className="mt-4">{t('helper:selfExclusionContent2')}</div>
            <div className="flex items-center gap-4 mt-8">
              <span>{t('helper:selfExclusionContent3')}</span>
              <Menu
                as="div"
                className="relative h-[38px] flex items-center justify-between text-[14px] min-w-[120px] px-2 dark:bg-color-menu-primary bg-color-light-bg-primary rounded-large"
              >
                <Menu.Button className="flex-1 ">
                  <div
                    className="flex items-center justify-between w-full gap-2 text-black dark:text-white"
                    role="button"
                  >
                    {periods.find((item) => item.value === selectedPeriod)?.description}
                    <ArrowDown2 className="h-[16px] w-[16px]" />
                  </div>
                </Menu.Button>
                <Menu.Items className="absolute dark:bg-color-menu-primary bg-color-light-bg-primary w-full origin-top-right right-0 top-[40px] z-[10] cursor-pointer p-1 rounded-large">
                  <div className="py-0">
                    {periods.map((item, index) => (
                      <Menu.Item key={index}>
                        {() => (
                          <div
                            className={cn(
                              'flex items-center justify-start py-[5px] px-[5px] w-full dark:hover:bg-color-hover-primary hover:bg-color-light-bg-p rounded-default',
                              {
                                'border-[1px] border-solid border-color-primary': item.value === selectedPeriod,
                              },
                            )}
                            role="button"
                            onClick={() => setSelectedPeriod(item.value)}
                          >
                            <div className="flex-1 flex items-center justify-between gap-[10px] sm:text-[14px] text-[12px]">
                              <div className="flex-1 text-black text-start dark:text-white">{item.description}</div>
                              {item.value === selectedPeriod && (
                                <div className={cn('w-[8px] h-[8px] rounded-full bg-color-primary blur-[1px]')}></div>
                              )}
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-[#31373d] dark:text-[#98A7B5] text-left">
            <input
              checked={acknowledge}
              className="w-[12px] h-[12px] bg-color-primary text-color-primary mr-2"
              type="checkbox"
              id="vehicle1"
              onClick={() => setAcknowledge(!acknowledge)}
            />
            <span>{t('helper:selfExclusionAcknowledge1')}</span>
            <span className="px-1 text-color-primary hover:cursor-pointer" onClick={() => setShowRules(true)}>
              {t('helper:selfExclusionAcknowledge')}
            </span>
            <span>{t('helper:selfExclusionAcknowledge2')}</span>
          </div>
          <div className="flex justify-start mt-4">
            <button
              className="flex justify-center bg-gradient-btn-play shadow-bs-btn p-[10px] rounded-large min-w-[200px] disabled:opacity-40 hover:opacity-90"
              disabled={!acknowledge}
              onClick={() => handleRequest()}
            >
              {isLoading ? (
                <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-5 !h-5" />
              ) : (
                t('helper:selfExclusionRequest')
              )}
            </button>
          </div>
        </div>
        <CommonModal
          show={showRules}
          onClose={() => setShowRules(false)}
          panelClass="rounded"
          header={
            <div className="flex flex-col items-start modal-header gap-[20px]">
              <div className="flex justify-between text-[16px] dark:text-white text-black gap-[10px]">
                <p>{t('helper:selfExclusion')}</p>
              </div>
            </div>
          }
        >
          <div className="text-[#31373d] dark:text-[#98A7B5] font-normal text-left py-8 px-6">
            <div className="">{t('helper:selfExclusionRules1')}</div>
            <div className="pt-3">{t('helper:selfExclusionRules2')}</div>
            <div className="pt-3">{t('helper:selfExclusionRules3')}</div>
            <div className="pt-3">{t('helper:selfExclusionRules4')}</div>
            <div className="pt-3">{t('helper:selfExclusionRules5')}</div>
            <div className="pt-3">{t('helper:selfExclusionRules6')}</div>
            <div className="pt-3">{t('helper:selfExclusionRules7')}</div>
            <div className="pl-3">
              <li className="pt-2">{t('helper:selfExclusionAgree1')}</li>
              <li className="pt-2">{t('helper:selfExclusionAgree2')}</li>
              <li className="pt-2">{t('helper:selfExclusionAgree3')}</li>
              <li className="pt-2">{t('helper:selfExclusionAgree4')}</li>
            </div>
          </div>
        </CommonModal>
      </div>
    </>
  );
};

SelfExclusion.getLayout = function getLayout(page: ReactElement) {
  return <HelperLayout>{page}</HelperLayout>;
};

export default SelfExclusion;
