import Image from 'next/image';

import { useTranslation } from '@/base/config/i18next';

type CardPromotionProps = {
  price: string;
  title: string;
  promotionName: string;
};

export default function CardPromotion({ price, title, promotionName }: CardPromotionProps) {
  const { t } = useTranslation('');
  return (
    <div className="bg-[#12181F] rounded-default p-[10px] w-full">
      <div className="relative">
        <Image width={350} height={150} src="/img/bg-card-promotion.png" alt="bg-card-promotion" />
        <div className="absolute top-[20px] left-[20px]">
          <div className="text-[24px] text-white font-bold">{price}</div>
          <div className="text-[13px] text-white font-bold uppercase">{title}</div>
        </div>
      </div>
      <div className="mt-[15px] flex justify-between">
        <div className="">
          <div className="text-[12px] text-[#939699]">{t('promotion:endAt')} 8/28/2023, 10:59:01</div>
          <div className="text-[12px] text-white font-bold">{promotionName}</div>
        </div>
        <div className="bg-color-primary/20 text-color-primary rounded-default py-[13px] font-bold text-[14px] text-center h-[44px] w-[140px]">
          {t('promotion:inProgress')}
        </div>
      </div>
    </div>
  );
}
