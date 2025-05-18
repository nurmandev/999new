import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { OptionSidebarDataType } from '../common/iconOption/iconOption';
type SubMobileMenuProps = {
  datas: OptionSidebarDataType[];
  isShow: boolean;
};
const SubMobileMenu: React.FC<SubMobileMenuProps> = ({ datas, isShow }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="fixed top-[69px] left-0 right-0 z-[8] dark:bg-color-header-secondary">
      <div className="p-0">
        <div
          className={cn(
            `relative my-[4px] mx-[12px] max-w-full overflow-x-scroll snap-x snap-mandatory sm:hidden flex sm:flex-wrap flex-nowrap gap-[4px]`,
            {
              hidden: !isShow,
              '-translate-y-full': !isShow,
              'translate-y-0': isShow,
              'grid-cols-1': datas.length === 1,
              'grid-cols-2': datas.length === 2,
              'grid-cols-3': datas.length === 3,
              'grid-cols-4': datas.length === 4,
            },
          )}
        >
          {datas.map(({ title, href, icon }, index) => {
            const IconEle = icon;
            return (
              <Link
                key={index}
                href={href}
                className={cn(
                  'min-w-fit flex items-center px-[8px] py-[10px] bg-[#f0f1f5] dark:bg-color-card-header-primary gap-[4px] flex-shrink-0 rounded-default dark:text-white text-color-light-text-primary hover:bg-[#F6F7FA]  dark:hover:bg-color-hover-primary',
                  `${
                    (href === '/' ? router.asPath === href : router.asPath.includes(href))
                      ? 'dark:text-white dark:!bg-color-card-header-active bg-[#F6F7FA] font-extrabold'
                      : ''
                  }`,
                )}
              >
                <IconEle className={`${title ? 'w-[12px] h-[12px]' : 'w-[18px] h-[18px]'}`} />
                {title && <div className={`text-[13px]`}>{t(title)}</div>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubMobileMenu;
