import { Switch } from '@headlessui/react';
import cn from 'classnames';
import { ReactElement } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { UserSettingPrivacyType } from '@/base/types/common';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';

import styles from '../../balance/index.module.scss';

const PrivacyPage = () => {
  const { settings } = useSelector(
    (state: AppState) => ({
      settings: state.auth.user.privacySetting,
    }),
    shallowEqual,
  );

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const handleUpdateSetting = async (setting: UserSettingPrivacyType) => {
    dispatch(updateSetting(setting));
  };

  return (
    <div className={`${styles.cardContent}`}>
      <div className="w-full p-2 text-white h-1/3 sm:p-0 md:mt-0">
        <div className="flex justify-between items-center border-b border-solid sm:gap-[40px] dark:border-color-border-primary border-color-light-border-primary pb-[8px]">
          <label className="text-left cursor-pointer" htmlFor="hideGamingData">
            <div className="dark:text-color-text-primary text-color-light-text-primary text-default">
              {t('setting:hideMyGamingDataOnProfile')}
            </div>
            <div className="text-[#53575C] text-[10px]">{t('setting:evenIfHidden')}</div>
          </label>
          <Switch
            id="hideGamingData"
            checked={settings.settingHideGamingData}
            onChange={(value) => handleUpdateSetting({ ...settings, settingHideGamingData: value })}
            className={cn('relative inline-flex h-[24px] w-[44px] items-center rounded-full min-w-[44px]', {
              'bg-[#3bc11733]': settings.settingHideGamingData,
              'dark:bg-color-toggle-primary bg-gray-200': !settings.settingHideGamingData,
            })}
          >
            <span
              className={cn('inline-block h-[20px] w-[20px] transform rounded-full transition', {
                'translate-x-[20px] bg-color-primary': settings.settingHideGamingData,
                'translate-x-1 bg-gray-400': !settings.settingHideGamingData,
              })}
            />
          </Switch>
        </div>
        <div className="flex justify-between border-b border-solid items-center gap-[40px] dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <label className="text-left cursor-pointer" htmlFor="hideUserName">
            <div className="dark:text-color-text-primary text-color-light-text-primary text-default">
              {t('setting:hideMyUsernameFromPublicLists')}
            </div>
            <div className="text-[#53575C] text-[10px]">{t('setting:noOneCanViewYourProfile')}</div>
          </label>
          <Switch
            id="hideUserName"
            checked={settings.settingHideUserName}
            onChange={(value) => handleUpdateSetting({ ...settings, settingHideUserName: value })}
            className={cn('relative inline-flex h-[24px] w-[44px] items-center rounded-full min-w-[44px]', {
              'bg-[#3bc11733]': settings.settingHideUserName,
              'dark:bg-color-toggle-primary bg-gray-200': !settings.settingHideUserName,
            })}
          >
            <span
              className={cn('inline-block h-[20px] w-[20px] transform rounded-full transition', {
                'translate-x-[20px] bg-color-primary': settings.settingHideUserName,
                'translate-x-1 bg-gray-400': !settings.settingHideUserName,
              })}
            />
          </Switch>
        </div>
        {/* <div className="flex justify-between border-b border-solid gap-[40px] dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <label
            className="cursor-pointer dark:text-color-text-primary text-color-light-text-primary text-default"
            htmlFor="refuseTip"
          >
            {t('setting:refuseTipFromStrangers')}
          </label>
          <Switch
            id="refuseTip"
            checked={settings.settingRefuseTipFromStrangers}
            onChange={(value) => handleUpdateSetting({ ...settings, settingRefuseTipFromStrangers: value })}
            className={cn('relative inline-flex h-[24px] w-[44px] items-center rounded-full min-w-[44px]', {
              'bg-[#3bc11733]': settings.settingRefuseTipFromStrangers,
              'dark:bg-color-toggle-primary bg-gray-200': !settings.settingRefuseTipFromStrangers,
            })}
          >
            <span
              className={`${
                settings.settingRefuseTipFromStrangers
                  ? 'translate-x-[20px] bg-color-primary'
                  : 'translate-x-1 bg-gray-400'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div> */}
      </div>
    </div>
  );
};

const PrivacyPageAuth = withAuth(PrivacyPage);

PrivacyPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default PrivacyPageAuth;
