import { useTranslation } from '@/base/config/i18next';
import Image from 'next/image';

type CardBigWinProps = {
  title: string;
  price: string | number;
  imgCard: string;
};

export default function CardBigWin({ title, price, imgCard }: CardBigWinProps) {
  const { t } = useTranslation('');
  return (
    <div className="rounded-[15px] bg-[#12181F] p-[10px]">
      <div className="rounded-md">
        <Image height={180} width={180} src={imgCard} alt="bigWin" className="w-full object-contain rounded-md max-w-[140px]" />
      </div>
      <div className="">
        <div className="mt-[13px] flex justify-between">
          <div className="text-white font-medium text-[12px]">{title}</div>
        </div>
        <div className="flex justify-center items-center rounded-[5px] bg-[#0DFDE4]/20 cursor-pointer h-[28px] mt-[13px]">
          <div className="text-[#0DFDE4] font-bold text-[14px]">{price}</div>
        </div>
      </div>
    </div>
  );
}
