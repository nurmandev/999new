import cn from 'classnames';
import Link from 'next/link';

import { useTranslation } from '@/config/i18next';
import styles from '@/styles/pages/error.module.scss';

function ErrorForbidden() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.errorPage}>
      <h2 className={styles.numberTitle}>403</h2>
      <span className={cn('my-3', styles.description)}>{t('message403')}</span>
      <Link href="/" legacyBehavior>
        <a className="btn btn-primary">{t('buttonGoHome')}</a>
      </Link>
    </div>
  );
}

export default ErrorForbidden;
