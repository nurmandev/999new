import Image from 'next/image';
import { useTheme } from 'next-themes';

import { useTranslation } from '@/base/config/i18next';

type NoDataComponentProps = {
  noDataText?: string;
};

export const NoDataComponent = ({ noDataText }: NoDataComponentProps) => {
  const { t } = useTranslation('');
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-[15px] text-gray-400 text-m_default sm:text-default font-semibold mt-4">
      <Image
        className="sm:w-[150px] sm:h-[150px] w-[105px] h-[105px]"
        src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
        alt="noData"
        width={150}
        height={150}
      />
      {noDataText || t('table:noData')}
    </div>
  );
};
