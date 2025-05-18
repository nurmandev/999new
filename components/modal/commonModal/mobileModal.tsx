import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { ElementType } from 'react';
import { ToastContainer } from 'react-toastify';

import { TOAST_ENUM } from '@/base/constants/common';

type CommonModalProps = {
  onClose: () => void;
  show: boolean;
  children?: JSX.Element;
  header?: JSX.Element;
  panelClass?: string;
  isShowCloseButton?: boolean;
  position?: string;
  isStatic?: boolean;
  dialogProps?: DialogProps<ElementType>;
  transitionRootProps?: DialogProps<ElementType>;
} & TransitionRootProps<ElementType>;

export default function MobileModal({
  show,
  onClose,
  children,
  header,
  panelClass,
  position,
  isShowCloseButton = true,
  dialogProps,
  isStatic,
  transitionRootProps,
}: CommonModalProps) {
  return (
    <>
      <div className="block sm:hidden relative z-50">
        <div
          className={cn('fixed inset-0 bg-[#000000aa] cursor-pointer', {
            'scale-0 opacity-0': !show,
            'scale-100 opacity-100': show,
          })}
        />
        <div
          className={cn('fixed inset-0 z-10', 'transition-all duration-200 ease-in', {
            'translate-y-full': !show,
            'translate-y-0': show,
          })}
        >
          <div
            className={cn(
              'flex flex-col min-h-full sm:items-center items-start justify-end sm:p-4 text-center p-0 z-[11]',
              position,
            )}
            onClick={onClose}
          >
            <div
              className={cn(
                'rounded-t-large z-[20] text-black dark:text-white flex flex-col justify-center relative bg-white dark:bg-color-modal-bg-primary text-left shadow-xl l sm:my-8 w-full max-w-[799px]',
                panelClass,
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {header}
                {isShowCloseButton && (
                  <div
                    className={cn(
                      'absolute top-[20px] right-[20px] rounded-md z-[10] transition-all duration-300 rotate-0 hover:rotate-90',
                      'dark:text-color-text-primary dark:hover:text-white text-color-light-text-primary hover:text-black',
                    )}
                    role="button"
                    onClick={onClose}
                  >
                    <XMarkIcon width={20} className="stroke-[3]" />
                  </div>
                )}
              </div>
              {children}
              <ToastContainer
                autoClose={5000}
                enableMultiContainer
                containerId={TOAST_ENUM.MODAL}
                className="z-index-toast !text-[12px]"
                position="bottom-left"
                theme="dark"
                hideProgressBar={true}
                icon={() => null}
                closeButton={() => null}
                limit={5}
                toastClassName={'min-h-[40px]'}
                bodyClassName={'!p-0 text-gray-200'}
                draggableDirection={'x'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
