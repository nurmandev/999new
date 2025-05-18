import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { AppState } from '@/base/redux/store';

type WrapperBodyProps = {
  id?: string;
  children: JSX.Element;
  wrapperClassName?: string;
  contentClassName?: string;
};

const WrapperBody: React.FC<WrapperBodyProps> = ({ children, wrapperClassName, contentClassName, id }) => {
  const { showChatType, isToggleSidebar } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      isToggleSidebar: state.modal.isToggleSidebar,
    }),
    shallowEqual,
  );

  return (
    <>
      <div
        id={id ? id : ''}
        className={classNames(
          'm-auto max-w-full w-full max-[640px]:ml-0 max-[640px]:max-w-full ',
          {
            'min-[1936px]:max-w-[1430px]': showChatType && !isToggleSidebar,
            'max-[1280px]:max-w-[calc(100%-62px)] max-[1280px]:m-[unset] max-[1279px]:ml-[62px] max-[768px]:ml-[62px]':
              isToggleSidebar,
            '2xl:max-w-full xl:max-w-full': showChatType,
            'min-[1786px]:max-w-[1430px] 2xl:max-w-full': !showChatType && isToggleSidebar,
            'max-[1598px]:max-w-[1430px] md:max-w-full': !showChatType && !isToggleSidebar,
          },
          wrapperClassName,
        )}
      >
        <div
          className={classNames(
            'flex max-w-[1430px] md:w-full px-0 min-[340px]:px-[12px] sm:px-[40px] min-[1500px]:px-[40px] m-auto',
            contentClassName,
          )}
        >
          <div className={classNames('flex-1 w-full text-white')}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default WrapperBody;
