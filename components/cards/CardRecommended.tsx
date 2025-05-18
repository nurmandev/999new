import Image from 'next/image';

type CardRecommendedProps = {
  title: string;
  imgCard: string;
};

export default function CardRecommended({ title, imgCard }: CardRecommendedProps) {
  return (
    <div className="rounded-[15px] mx-1 bg-[#12181F] p-[10px]">
      <div className="rounded-md">
        <Image height={180} width={180} src={imgCard} alt="recommend-card" className="w-full object-contain rounded-md" />
      </div>
      <div className="">
        <div className="mt-[13px] flex justify-between">
          <div className="text-white font-medium text-[12px]">{title}</div>
          <Image height={20} width={20} src={'/img/icon/icon-question.png'} alt="question" className="rounded-md" />
        </div>
      </div>
    </div>
  );
}
