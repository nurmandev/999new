import cn from 'classnames';
import { useTranslation } from '@/base/config/i18next';
import { GameListType } from '@/base/types/common';

const GameDescriptionComponent = ({ gameDetail }: { gameDetail: GameListType }) => {
  const { t } = useTranslation('');

  return (
    <div>
      <div className="dark:text-white text-[#000] text-default sm:text-[16px]">{t('gameDetail:aboutThisGame')}</div>
      <div
        className={cn(
          'bg-color-card-bg-primary border border-solid border-color-card-border-primary rounded-lg',
          'flex flex-col gap-4 p-4 mt-4',
        )}
      >
        <div className="text-m_default sm:text-default dark:text-white font-semibold text-[#31373d]">
          {gameDetail.title}: {t('gameDetail:gameReviewTheme')}
        </div>
        <div className="text-m_default sm:text-default dark:text-gray-400 text-[#31373d]">{gameDetail.description}</div>
      </div>
    </div>
  );
};

export default GameDescriptionComponent;
