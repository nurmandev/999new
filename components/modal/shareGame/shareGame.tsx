import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ElementType, useMemo } from 'react';

import { GameDetail, GameListType } from '@/base/types/common';

import { useTranslation } from '@/base/config/i18next';
import CommonModal from '../commonModal/commonModal';
import { convertToUrlCase } from '@/base/libs/utils/convert';

type ModalShareGameProps = {
  onClose: () => void;
  show: boolean;
  gameDetail: GameListType;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalShareGame({ show, onClose, gameDetail }: ModalShareGameProps) {
  const linkGame = useMemo(() => {
    return `https://bonenza.com/game/${convertToUrlCase(gameDetail.identifier || '')}`;
  }, [gameDetail]);

  const { t } = useTranslation('');

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center sm:p-[50px] p-[20px] gap-[30px]">
          <div className="text-[16px] font-semibold">{t('casino:shareThisGame')}</div>
          <div className="flex flex-wrap items-center justify-center gap-x-[15px] gap-y-[15px]">
            <Link
              href={`http://www.facebook.com/sharer/sharer.php?u=${linkGame}&title=${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="facebook-share" src={'/img/share-fb.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?url=${linkGame}&title=r${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="twitter-share" src={'/img/share-tw.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://t.me/share?url=${linkGame}&title=r${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="telegram-share" src={'/img/share-tl.png'} width={40} height={40} />
            </Link>
            <Link
              href={`http://vk.com/share.php?url=${linkGame}&title=r${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="vk-share" src={'/img/share-vk.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://lineit.line.me/share/ui?url=${linkGame}&title=${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="lineit-share" src={'/img/share-line.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://web.skype.com/share?url=${linkGame}&title=${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="skype-share" src={'/img/share-sk.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&amp;st.shareUrl=url=${linkGame}&title=${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="connect-share" src={'/img/share-ok.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${linkGame}&title=${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="linkedin-share" src={'/img/share-in.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://api.whatsapp.com/send?url=${linkGame}&title=${gameDetail.title}&text=${gameDetail.title}`}
              target="_blank"
            >
              <Image role="button" alt="whatsapp-share" src={'/img/share-ws.png'} width={40} height={40} />
            </Link>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
