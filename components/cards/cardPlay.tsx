import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

type CardPlayProps = {
  imgBackGround: string;
  title: string;
  description: string;
  textButton: string;
  href: string;
  isClick?: boolean;
  action: string;
};

export default function CardPlay({
  imgBackGround,
  title,
  description,
  textButton,
  href,
  isClick = false,
  action,
}: CardPlayProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (isClick) {
          window.open(href);
        } else {
          router.push(href);
        }
      }}
      className={cn(styles.cardBox, 'relative overflow-hidden rounded-large cursor-pointer')}
    >
      <div className={cn(styles.cardImage)}>
        <div className='relative'>
          <div className='shadow-bs-div absolute left-0 right-0 bottom-0 h-[140px] rounded-large -z-[1]' />
          <Image
            height={25}
            width={25}
            src={imgBackGround}
            className='w-full object-contain p-6'
            alt="card-play"
          />
        </div>
      </div>
      <div
        className={cn(
          styles.cardContent,
          'flex flex-col gap-[20px] pt-4 px-4 pb-4 items-center',
          'dark:!backdrop-blur-[8px] dark:bg-[#17255455]',
        )}
      >
        <div className="flex justify-center items-center dark:text-white text-color-text-secondary text-[12px] md:text-[16px] min-[1300px]:text-[15px] font-medium text-center h-[60px]">
          {description}
        </div>
        {!isClick && (
          <Link
            href={href}
            type="button"
            className={cn(
              styles[action],
              'w-[100%] rounded-[5px] font-medium text-[14px] text-white py-[8px] text-center',
            )}
          >
            {textButton}
          </Link>
        )}
        {isClick && (
          <div
            role="button"
            className={cn(
              styles[action],
              'w-[100%] rounded-[5px] font-medium text-[14px] text-white py-[8px] text-center',
            )}
            onClick={() => window.open(href)}
          >
            {textButton}
          </div>
        )}
      </div>
    </div>
  );
}
