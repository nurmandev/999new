import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType, useState } from 'react';
import { useTranslation } from '@/base/config/i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { TOAST_ENUM } from '@/base/constants/common';
import Loader from '@/components/common/preloader/loader';
import InputNumber from '@/components/input/typing/InputNumber';
import Image from 'next/image';
import CommonModal from '../commonModal/commonModal';

type ModalDepositMetamaskProps = {
  onClose: () => void;
  show: boolean;
  walletAddress: string;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type BnbDepositForm = {
  amount: number;
};

export default function ModalDepositMetamask({ show, onClose, walletAddress }: ModalDepositMetamaskProps) {
  const { t } = useTranslation('');

  const schema = yup.object().shape({
    amount: yup.string().required(String(t('deposit:amountRequired'))),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BnbDepositForm>({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitMetamask = async (data: BnbDepositForm) => {
    // try {
    //   // setIsLoading(true);
    //   const provider = await metamask.getProvider();
    //   const web3 = new Web3(provider);
    //   const accounts = await provider.request({ method: 'eth_requestAccounts' });
    //   await provider.request({
    //     method: 'eth_sendTransaction',
    //     params: [
    //       {
    //         chainId: 56,
    //         from: accounts[0],
    //         value: parseInt(web3.utils.toWei(String(data.amount), 'ether')).toString(16),
    //         to: walletAddress,
    //       },
    //     ],
    //   });
    //   onClose();
    // } catch (error: any) {
    //   if (error?.code !== 4001) {
    //     toast.error('Deposit Failed', { containerId: TOAST_ENUM.MODAL });
    //   }
    // } finally {
    //   // setIsLoading(false);
    // }
  };

  return (
    <>
      <CommonModal isStatic show={show} onClose={onClose} panelClass="rounded sm:max-w-[420px]">
        <form className="flex-1 p-[20px]" onSubmit={handleSubmit(handleSubmitMetamask)}>
          {isLoading && <Loader />}
          <div className="flex items-center gap-[10px] mb-[20px]">
            <Image src={'img/icon/MetaMask.png'} alt="bnb" width={40} height={40} />
            <div className="text-[14px] dark:text-gray-300 text-gray-500">
              {t('deposit:depositWith')}
              <div className="font-bold text-[20px] dark:text-white text-black">Metamask</div>
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <Image src={'img/fiats/BNB.png'} alt="bnb" width={25} height={25} />
            <div className="text-[14px] dark:text-gray-300 text-gray-500">{t('deposit:bnbDepositAmount')}</div>
          </div>

          <div
            className={cn(
              'w-full pl-[18px] pr-[20px] py-[10px] mt-[10px] text-[16px] rounded dark:bg-[#161D26] bg-[#f6f7fa] flex items-center justify-between gap-[10px] border border-solid border-gray-500',
              {
                'border-red-500 border border-solid': errors.amount?.message,
              },
            )}
          >
            <InputNumber
              size={7}
              customClass="flex-1 pl-[2px] bg-transparent !rounded-[0px] abc"
              control={control}
              isShowError={false}
              name="amount"
              type="number"
            />
          </div>
          {errors.amount?.message && <span className="text-red-500 w-full text-[14px]"> {errors.amount?.message}</span>}
          <div className="flex items-center justify-center mt-[30px]">
            <button
              type="submit"
              className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] py-[10px] px-[20px] min-w-[140px] dark:text-black text-white"
            >
              {t('withdraw:deposit')}
            </button>
          </div>
        </form>
      </CommonModal>
    </>
  );
}
