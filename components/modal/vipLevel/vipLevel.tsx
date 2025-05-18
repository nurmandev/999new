import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getVipProgress, api_vipLevelSystem } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';
import LevelTableComponent from '@/components/table/levelTable';

type ModalVipLevelProps = {
  onClose: () => void;
  onBack: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type levelDataType = {
  rank: string;
  level: number;
  name: string;
  xp: number;
  levelUpBonus: number;
};

type rankUpType = {
  name: string;
  startLevel: number;
  endLevel: number;
  startLevelDes: string;
  endLevelDes: string;
  levels: levelDataType[];
};

export default function ModalVipLevel({ show, onClose, onBack }: ModalVipLevelProps) {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rankList, setRankList] = useState<rankUpType[]>([]);
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );
  const [levelCurrent, setLevelCurrent] = useState<rankUpType>({
    name: '',
    startLevel: 0,
    endLevel: 0,
    startLevelDes: '',
    endLevelDes: '',
    levels: [],
  });

  const getRankList = async () => {
    try {
      setIsLoading(true);
      const [_resVipProgress] = await Promise.all([api_getVipProgress(), api_vipLevelSystem()]);
      const _res = await api_vipLevelSystem();
      const tempRankDatas: rankUpType[] = _res?.data.levelUpDetails.map((item: any) => ({
        name: item.medalName ?? '',
        startLevel: Number(item.startLevelNum ?? 0),
        endLevel: Number(item.endLevelNum ?? 0),
        startLevelDes: item.startLevel ?? '',
        endLevelDes: item.endLevel ?? '',
        levels: item?.levels?.map((level: any) => ({
          rank: item.medalName ?? '',
          level: level.level,
          name: level.name,
          xp: level.requiredXp,
          levelUpBonus: level.levelUpBonus,
        })) || [],
      }));
      const currentLevel = Number(_resVipProgress.data?.currentVipLevel || 0);
      setRankList(tempRankDatas);
      if (tempRankDatas.length > 0) {
        const userRank = tempRankDatas.find((item) => currentLevel >= item.startLevel && currentLevel <= item.endLevel);
        setLevelCurrent(userRank ?? tempRankDatas[0]);
      }
    } catch (error) {
      setRankList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLinkImage = (rank?: string) => {
    return rank?.split(' ')[0];
  };

  const dataMedal = [
    { img: '/img/bronze-medal.png', name: 'Bronze' },
    { img: '/img/silver-medal.png', name: 'Silver' },
    { img: '/img/gold-medal.png', name: 'Gold' },
    { img: '/img/platinum1-medal.png', name: 'Platinum I' },
    { img: '/img/platinum2-medal.png', name: 'Platinum II' },
    { img: '/img/diamond1-medal.png', name: 'Diamond I' },
    { img: '/img/diamond2-medal.png', name: 'Diamond II' },
    { img: '/img/diamond3-medal.png', name: 'Diamond III' },
  ];

  const vipColumns = useMemo(() => {
    const wagerColumnsDefault: ColumnDef<levelDataType>[] = [
      {
        accessorKey: 'level',

        header: () => (
          <div className="text-left pl-2 text-[12px] sm:text-[14px] font-semibold">{t('vipClub:level')}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-white text-color-light-text-primary truncate flex items-center gap-2 sm:px-2 p-[5px]">
            <div className="dark:text-white text-color-light-text-primary text-[12px] sm:text-[14px] pl-2 min-w-[80px]">
              {row?.original?.name}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'xp',
        header: () => (
          <div className="text-center text-[12px] sm:text-[14px] font-semibold">{t('vipClub:requiredXP')}</div>
        ),
        cell: ({ row }) => (
          <div className="sm:min-w-[400px] text-[12px] sm:text-[14px] text-center dark:text-white text-color-light-text-primary truncate sm:px-2 px-[5px]">
            {row?.original?.xp}
          </div>
        ),
      },
      {
        accessorKey: 'levelUpBonus',
        header: () => (
          <div>
            <div className="text-right text-[12px] sm:text-[14px] font-semibold pr-2">{t('vipClub:levelUpBonus')}</div>
            <div className="text-right text-[12px] sm:text-[14px] font-semibold pr-2">(USDT)</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-[12px] sm:text-[14px] dark:text-white text-[#000] truncate text-right sm:px-4 px-[12px]">
            {row.original.levelUpBonus}
          </div>
        ),
      },
    ];
    return wagerColumnsDefault;
  }, [t]);

  useEffect(() => {
    if (isLogin && show) {
      getRankList();
    }
  }, [isLogin, show]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded sm:rounded-large overflow-hidden h-full sm:h-[720px] sm:!max-h-[90vh]"
      >
        <div className="flex max-sm:flex-1 flex-col gap-3 overflow-y-auto px-[20px] pt-[10px] pb-[30px] bg-gradient-card-modal sm:rounded-default sm:h-[820px]">
          <div className="text-black dark:text-white md:text-[18px] text-[16px] font-bold flex justify-center py-4 items-center gap-[20px]">
            <div className="text-default sm:text-[18px] font-semibold">{t('vipClub:VIPLevelSystem')}</div>
          </div>
          {isLoading && <Loader />}
          <div className={`w-full flex gap-1 overflow-x-auto scrollbar min-h-[120px] mt-4`}>
            {rankList.map((item, index) => (
              <div
                className={cn(
                  'relative flex flex-col items-center w-[87px] h-[105px] sm:h-[120px] min-w-fit cursor-pointer border-none pb-[15px] px-[10px] bg-transparent',
                  styles.rank_text,
                )}
                key={index}
                onClick={() => setLevelCurrent(item)}
              >
                <Image
                  src={dataMedal.find((medal) => medal.name === item.name)?.img || '/img/vip.png'}
                  width={50}
                  height={50}
                  alt="vip"
                  className={cn('mt-auto mb-auto', {
                    'w-[35px] h-[35px] md:w-[50px] md:h-[50px]':
                      item.name.includes('Platinum') && item.name !== 'Diamond III',
                    'w-[42px] h-[42px] md:w-[60px] md:h-[60px]':
                      item.name.includes('Platinum') || item.name === 'Diamond III',
                    'opacity-100': levelCurrent.startLevel === item.startLevel,
                    // 'opacity-100': selectedRank.startLevel !== item.startLevel,
                  })}
                  onError={(e) => {
                    e.currentTarget.src = '/img/vip.png';
                  }}
                />
                {levelCurrent.startLevel === item.startLevel && (
                  <Image
                    src="/img/selected-medal.png"
                    width={50}
                    height={50}
                    alt="medal"
                    className="absolute left-0 right-0 -bottom-0 w-full h-full"
                  />
                )}
                <div className="text-white text-[12px] font-semibold z-[1]">{item.name}</div>
              </div>
            ))}
          </div>
          <div className="text-default sm:text-[16px] font-semibold text-left py-2 px-2">
            {`${t('vipClub:vipLevelTier')} 
            ${levelCurrent?.levels[0]?.level}-${levelCurrent?.levels[(levelCurrent.levels.length - 1)]?.level}`}
          </div>
          <LevelTableComponent
            containerClassName="w-full pt-0 !px-0 bg-color-card-bg-primary"
            data={levelCurrent.levels}
            columns={vipColumns}
          />
          <div
            onClick={onBack}
            className="rounded-large flex justify-center w-full items-center cursor-pointer text-[14px] text-white font-semibold bg-gradient-btn-play shadow-bs-btn p-[10px] mt-auto"
          >
            {t('exclusion:exclusionGoBack')}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
