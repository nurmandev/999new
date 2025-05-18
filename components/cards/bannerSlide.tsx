import { useTranslation } from '@/base/config/i18next';
import Image from 'next/image';

type CardTopRatedProps = {
  title: string;
  imgCard: string;
};

export default function CardTopRated({ title, imgCard }: CardTopRatedProps) {
  const { t } = useTranslation('');
  return (
    <div className="rounded-[15px] mx-1 bg-[#12181F] p-[10px]">
      <div className="rounded-md">
        <Image height={180} width={180} src={imgCard} alt="top-rated" className="w-full object-contain rounded-md" />
      </div>
      <div className="">
        <div className="mt-[13px] flex justify-between">
          <div className="text-white font-medium text-[12px]">{title}</div>
          <Image height={20} width={20} src={'/img/icon/icon-question.png'} alt="question" className="rounded-md" />
        </div>
        <div className="flex justify-center items-center rounded-[16px] bg-[#F61B4F] hover:opacity-[0.9] cursor-pointer py-[10px] gap-[10px] mt-[13px]">
          <Image height={20} width={20} src={'/img/icon/live-stream.png'} alt="live-stream" className="rounded-md" />
          <div className="text-white font-bold text-[14px]">{String(t('homePage:playNow'))}</div>
        </div>
      </div>
    </div>
  );
}
