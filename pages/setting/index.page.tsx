import Router from 'next/router';
import { ReactElement, useEffect } from 'react';

import { ROUTER } from '@/base/constants/common';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';

const SettingPage = () => {
  useEffect(() => {
    Router.push(ROUTER.SettingGeneral);
  }, []);

  return <></>;
};

const SettingPageAuth = withAuth(SettingPage);

SettingPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingPageAuth;
