import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { api_getProviders } from '@/api/game';
import { API_PROVIDER_IMAGE, ROUTER } from '@/base/constants/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import BaseLayout from '@/components/layouts/base.layout';
import MetaHead from '@/components/metaHead/metaHead';

type ProviderDetailType = {
  id: string;
  name: string;
  identifier: string;
};

function ProvidersPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState<ProviderDetailType[]>([]);

  const getProviders = async () => {
    try {
      setIsLoading(true);
      const _res = await api_getProviders();
      const tempProviders: ProviderDetailType[] = _res.data.map((provider: any) => ({
        id: provider.id,
        name: provider.name,
        identifier: provider.identifier,
      }));
      setProviders(tempProviders);
    } catch (error) {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProviders();
  }, []);

  return (
    <>
      <MetaHead />
      <Head>
        <link rel="canonical" href="https://bonenza.com/providers" key="canonical" />
      </Head>
      <div className="py-[24px]">
        {isLoading && <Loader />}
        <Breadcrumbs
          data={[{ title: 'Casino', href: ROUTER.Casino }]}
          endpoint={{ title: String(t('casino:gameProvider')), href: ROUTER.Providers }}
        />

        <>
          <div className="game-grid-parent mt-[20px]">
            {providers.map((provider, index) => (
              <Link
                key={index}
                href={ROUTER.Provider(String(provider.identifier))}
                role="button"
                className={cn(
                  'border border-solid border-color-card-border-primary',
                  'bg-color-card-bg-primary',
                  'text-gray-300 hover:text-white text-m_default sm:text-default',
                  'rounded-lg flex flex-col justify-between items-center p-3 min-h-[100px]',
                )}
              >
                <Image
                  height={54}
                  width={150}
                  src={
                    provider.identifier
                      ? `${API_PROVIDER_IMAGE}/${provider.identifier}.png`
                      : `/img/providers/softswiss.png`
                  }
                  alt="provider logo"
                  onError={(e) => {
                    e.currentTarget.src = `/img/providers/softswiss.png`;
                  }}
                  className="object-contain h-[40px] sm:h-[45px] w-auto"
                />
                <p className="text-center">{provider?.name || ''}</p>
              </Link>
            ))}
          </div>
        </>
      </div>
    </>
  );
}

ProvidersPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ProvidersPage;
