import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import Image from 'next/image';
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
  isCongrat?: boolean;
  isScrollableInRotate?: boolean;
  dialogProps?: DialogProps<ElementType>;
  transitionRootProps?: DialogProps<ElementType>;
} & TransitionRootProps<ElementType>;

export default function CommonModal({
  show,
  onClose,
  children,
  header,
  panelClass,
  position,
  isShowCloseButton = true,
  isScrollableInRotate,
  dialogProps,
  isStatic,
  transitionRootProps,
  isCongrat = false,
}: CommonModalProps) {
  return (
    <>
      <div className="relative z-[60]">
        <div
          className={cn('fixed inset-0 bg-[#000000aa] cursor-pointer', {
            'scale-0 opacity-0': !show,
            'scale-100 opacity-100': show,
          })}
        />
        <div
          className={cn('fixed inset-0 z-10', 'transition-all duration-200 ease-in', {
            'translate-x-[110%] sm:scale-100 md:opacity-0 md:translate-x-0 md:scale-0': !show && !isCongrat,
            'translate-x-0 md:opacity-100 scale-100': show,
            'scale-0': !show && isCongrat,
          })}
        >
          <div
            className={cn(
              'relative flex min-h-full sm:items-center items-start justify-center text-center z-[100]',
              position,
            )}
            onClick={onClose}
          >
            {isCongrat && (
              <div
                className={`absolute w-[600px] aspect-square sm:w-[900px] sm:h-[900px] ${
                  show ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    width={400}
                    height={600}
                    src={`/img/spin/Coins.gif`}
                    alt="coin"
                    className={`absolute w-full h-full ${show ? 'scale-100' : 'scale-0'}`}
                  />
                  <Image
                    width={400}
                    height={600}
                    src={`/img/spin/congrat1.webp`}
                    alt="congrat"
                    className={`absolute w-full h-full ${show ? 'scale-100' : 'scale-0'}`}
                  />
                </div>
              </div>
            )}
            <div
              className={cn(
                'overflow-hidden sm:rounded-large z-50 text-black dark:text-white flex flex-col relative bg-white dark:bg-color-modal-bg-primary text-left shadow-xl w-full max-w-[799px] max-h-[100vh] sm:h-auto h-screen',
                panelClass,
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {header}
                {isShowCloseButton && (
                  <div
                    className={cn(
                      'p-5 absolute top-[0px] right-[0px] z-[10] rounded-md transition-all duration-300 rotate-0 hover:rotate-90',
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
