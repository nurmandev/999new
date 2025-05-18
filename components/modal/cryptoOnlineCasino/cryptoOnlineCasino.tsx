import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';

type ModalCryptoOnlineProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalCryptoOnline({ show, onClose }: ModalCryptoOnlineProps) {
  const { t } = useTranslation('');

  const cryptoContent = [
    {
      title: t('cryptoModal:contentOne:title'),
      textListOne: [
        t('cryptoModal:contentOne:textContent1'),
        t('cryptoModal:contentOne:textContent2'),
        t('cryptoModal:contentOne:textContent3'),
      ],
      textNoteOne: [],
    },
    {
      title: t('cryptoModal:contentTwo:title'),
      textListOne: [
        t('cryptoModal:contentTwo:textContent1'),
        t('cryptoModal:contentTwo:textContent2'),
        t('cryptoModal:contentTwo:textContent3'),
        t('cryptoModal:contentTwo:textContent4'),
      ],
      textNoteOne: [],
    },
    {
      title: t('cryptoModal:contentThree:title'),
      textListOne: [t('cryptoModal:contentThree:textContent1'), t('cryptoModal:contentThree:textContent2')],
      textNoteOne: [],
    },
    {
      title: t('cryptoModal:contentFour:title'),
      textListOne: [],
      textNoteOne: [
        t('cryptoModal:contentFour:textContent1'),
        t('cryptoModal:contentFour:textContent2'),
        t('cryptoModal:contentFour:textContent3'),
        t('cryptoModal:contentFour:textContent4'),
      ],
    },
    {
      title: t('cryptoModal:contentFive:title'),
      textListOne: [],
      textNoteOne: [t('cryptoModal:contentFive:textContent1'), t('cryptoModal:contentFive:textContent2')],
    },
    {
      title: t('cryptoModal:contentSix:title'),
      textListOne: [
        t('cryptoModal:contentSix:textContent1'),
        t('cryptoModal:contentSix:textContent2'),
        t('cryptoModal:contentSix:textContent3'),
      ],
      textNoteOne: [],
    },
    {
      title: t('cryptoModal:contentSevent:title'),
      textListOne: [
        t('cryptoModal:contentSevent:textContent1'),
        t('cryptoModal:contentSevent:textContent2'),
        t('cryptoModal:contentSevent:textContent3'),
        t('cryptoModal:contentSevent:textContent4'),
        t('cryptoModal:contentSevent:textContent5'),
      ],
      textNoteOne: [],
    },
    {
      title: t('cryptoModal:contentEight:title'),
      textListOne: [t('cryptoModal:contentEight:textContent1'), t('cryptoModal:contentEight:textContent2')],
      textNoteOne: [
        t('cryptoModal:contentEight:textContent3'),
        t('cryptoModal:contentEight:textContent4'),
        t('cryptoModal:contentEight:textContent5'),
        t('cryptoModal:contentEight:textContent6'),
      ],
    },
    {
      title: t('cryptoModal:contentNine:title'),
      textListOne: [
        t('cryptoModal:contentNine:textContent1'),
        t('cryptoModal:contentNine:textContent2'),
        t('cryptoModal:contentNine:textContent3'),
      ],
      textNoteOne: [
        t('cryptoModal:contentNine:textContent4'),
        t('cryptoModal:contentNine:textContent5'),
        t('cryptoModal:contentNine:textContent6'),
      ],
      textListTwo: [t('cryptoModal:contentNine:textContent7')],
      textNoteTwo: [t('cryptoModal:contentNine:textContent8'), t('cryptoModal:contentNine:textContent9')],
      textListEnd: [t('cryptoModal:contentNine:textContent10')],
    },
    {
      title: t('cryptoModal:contentTen:title'),
      textListOne: [
        t('cryptoModal:contentTen:textContent1'),
        t('cryptoModal:contentTen:textContent2'),
        t('cryptoModal:contentTen:textContent3'),
        t('cryptoModal:contentTen:textContent4'),
        t('cryptoModal:contentTen:textContent5'),
        t('cryptoModal:contentTen:textContent6'),
        t('cryptoModal:contentTen:textContent7'),
        t('cryptoModal:contentTen:textContent8'),
        t('cryptoModal:contentTen:textContent9'),
        t('cryptoModal:contentTen:textContent10'),
        t('cryptoModal:contentTen:textContent11'),
        t('cryptoModal:contentTen:textContent12'),
        t('cryptoModal:contentTen:textContent13'),
        t('cryptoModal:contentTen:textContent14'),
        t('cryptoModal:contentTen:textContent15'),
        t('cryptoModal:contentTen:textContent16'),
        t('cryptoModal:contentTen:textContent17'),
        t('cryptoModal:contentTen:textContent18'),
        t('cryptoModal:contentTen:textContent19'),
        t('cryptoModal:contentTen:textContent20'),
        t('cryptoModal:contentTen:textContent21'),
        t('cryptoModal:contentTen:textContent22'),
      ],
      textNoteOne: [],
    },
    {
      title: t('cryptoModal:contentEleven:title'),
      textListOne: [t('cryptoModal:contentEleven:textContent1'), t('cryptoModal:contentEleven:textContent2')],
      textNoteOne: [],
    },
  ];

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded !max-w-[464px] sm:h-[90vh] sm:min-h-[90vh]"
        header={
          <div className="modal-header">
            <div className="text-[16px] dark:text-white text-black font-[600]">Details</div>
          </div>
        }
      >
        <div className="p-20px dark:bg-[#1e2024] bg-white overflow-scroll">
          {cryptoContent.map((item, index) => (
            <div key={index}>
              <h2 className="my-[12px] font-bold text-black dark:text-white">{item.title}</h2>
              {item.textListOne.length > 0 &&
                item.textListOne.map((textOne, indexTextOne) => (
                  <p key={indexTextOne} className="text-[14px] dark:text-[#98A7B5] text-[#31373d] my-2">
                    {textOne}
                  </p>
                ))}
              {item.textNoteOne.length > 0 &&
                item.textNoteOne.map((textNoteOne, indexNoteOne) => (
                  <li key={indexNoteOne} className="text-[14px] dark:text-[#98A7B5] text-[#31373d] my-2">
                    {textNoteOne}
                  </li>
                ))}
              {item?.textListTwo &&
                item?.textListTwo?.map((textTow, indexTextTow) => (
                  <p key={indexTextTow} className="text-[14px] dark:text-[#98A7B5] text-[#31373d] my-2">
                    {textTow}
                  </p>
                ))}
              {item.textNoteTwo &&
                item.textNoteTwo?.map((textNoteTwo, indexNoteTwo) => (
                  <li key={indexNoteTwo} className="text-[14px] dark:text-[#98A7B5] text-[#31373d] my-2">
                    {textNoteTwo}
                  </li>
                ))}
              {item?.textListEnd &&
                item?.textListEnd?.map((textEnd, indexTextEnd) => (
                  <p key={indexTextEnd} className="text-[14px] dark:text-[#98A7B5] text-[#31373d] my-2">
                    {textEnd}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </CommonModal>
    </>
  );
}
