import { XMarkIcon } from '@heroicons/react/24/outline';
import { Wallet1 } from 'iconsax-react';
import { useRouter } from 'next/router';
import React, { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';

type CommonSessionProps = {
  title?: string;
  icon?: ElementType;
  children?: React.ReactNode;
  iconClass?: string;
};

const CommonSession = ({ title, icon = Wallet1, children, iconClass }: CommonSessionProps) => {
  const { t } = useTranslation('');
  const router = useRouter();
  const IconElement = icon;
  return (
    <div className="w-full">
      <div className="flex items-center gap-[10px] dark:text-white text-black justify-between">
        <div className="flex items-center gap-[10px] dark:text-white text-black">
          <IconElement className={iconClass} />
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
        <XMarkIcon
          width={15}
          onClick={() => router.push('/')}
          className="dark:text-[#9FA5AC] sm:hidden block cursor-pointer dark:hover:text-white text-[#31373d] hover:text-black w-[1.5rem] h-[1.5rem]"
        />
      </div>
      <div className="sm:mt-5 mt-3 w-full">{children}</div>
    </div>
  );
};

export default CommonSession;
