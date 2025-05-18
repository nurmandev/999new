import cn from 'classnames';

import { useTranslation } from '@/base/config/i18next';

import styles from './progress.module.scss';

type ProgressProps = {
  quantityTotal: number;
  quantitySuccess: number;
};

const ProgressComponent = ({ quantitySuccess, quantityTotal }: ProgressProps) => {
  const { t } = useTranslation(['product']);

  return (
    <div className={styles.progress} data-testid="sis-progress">
      <div
        className={cn(styles.progressContent, 'p-2 mb-3 me-3 rounded d-flex align-items-center justify-content-center')}
      >
        <span className="mb-0 pe-2">
          {!!quantityTotal && (
            <>
              <span>{quantitySuccess}</span>
              <span className="">/</span>
              <span>{quantityTotal}</span>
            </>
          )}
          {quantityTotal ? <span className="ps-2">{t('fileUploaded')}</span> : <span>{t('uploading')}</span>}
        </span>
        <svg className="animate-spin mt-3 ..." viewBox="0 0 24 24" />
      </div>
    </div>
  );
};

export default ProgressComponent;
