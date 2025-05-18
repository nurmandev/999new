import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import DepositCryptoComponent from '@/components/deposit/crypto/depositCrypto';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';

import styles from './index.module.scss';

const DepositCryptoPage = () => {
  const { t } = useTranslation('');

  return (
    <>
      <div className={`${styles.cardContent}`}>

        <div className={`h-1/3 ${styles.contentHeader}`}>

          <DepositCryptoComponent />
        </div>
      </div>
    </>
  );
};

const DepositCryptoPageAuth = withAuth(DepositCryptoPage);

DepositCryptoPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default DepositCryptoPageAuth;
