import cn from 'classnames';
import { ArrowUp2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';

import styles from './index.module.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation('');

  const { showChatType } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  useEffect(() => {
    const layout = document.getElementById('base-layout');
    let heightToHidden = 250;
    if (layout) {
      const handleScroll = (event: any) => {
        if (layout.scrollTop > heightToHidden) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      layout.addEventListener('scroll', handleScroll);

      return () => {
        layout.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleScrollToTop = () => {
    document.getElementById('base-layout')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isVisible && (
        <div
          className={cn(
            styles.scrollTopBtn,
            'dark:bg-[#2d3035]/70 bg-gray-300/60 dark:text-white text-gray-800 mr-[20px] px-[12px] py-[7px]',
            {
              'max-[1279px]:mr-[380px]': showChatType,
            },
          )}
          onClick={handleScrollToTop}
        >
          <ArrowUp2 className="w-[18px] h-[18px] text-color-primary" variant="Bold" />
          <p>{t('layout:top')}</p>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
