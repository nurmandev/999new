import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ArrowDown2, Calculator } from 'iconsax-react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

const friendVipData = [
  {
    logo: '/img/bronze-medal.png',
    level: 'VIP 04',
    wagerAmount: '1000',
    unlockAmount: '+ 0.50 $',
  },
  {
    logo: '/img/silver-medal.png',
    level: 'VIP 08',
    wagerAmount: '5000',
    unlockAmount: '+ 2.50 $',
  },
  {
    logo: '/img/silver-medal.png',
    level: 'VIP 14',
    wagerAmount: '17000',
    unlockAmount: '+ 5.00 $',
  },
  {
    logo: '/img/gold-medal.png',
    level: 'VIP 22',
    wagerAmount: '49000',
    unlockAmount: '+ 12.00 $',
  },
  {
    logo: '/img/gold-medal.png',
    level: 'VIP 30',
    wagerAmount: '129000',
    unlockAmount: '+ 25.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 38',
    wagerAmount: '321000',
    unlockAmount: '+ 50.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 46',
    wagerAmount: '769000',
    unlockAmount: '+ 80.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 54',
    wagerAmount: '1793000',
    unlockAmount: '+ 120.00 $',
  },
  {
    logo: '/img/platinum2-medal.png',
    level: 'VIP 62',
    wagerAmount: '4097000',
    unlockAmount: '+ 205.00 $',
  },
  {
    logo: '/img/diamond1-medal.png',
    level: 'VIP 70',
    wagerAmount: '9217000',
    unlockAmount: '+ 500.00 $',
  },
];

function RateAndRulesComponent() {
  const { t, i18n } = useTranslation('');
  const [wagerAmount, setWagerAmount] = useState<number>(1000);
  const [commissionRate, setCommissionRate] = useState<number>(7);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);

  const [currentCommission, setCurrentCommission] = useState<'live' | 'slot'>('live');

  return (
    <div className="w-full mt-5">
      <div className="flex flex-col w-full gap-4 lg:flex-row">
        <div className="flex flex-col w-full gap-4">
          <div className="relative">
            <Image
              src="/img/affiliate/casino-rule-1.png"
              width={20}
              height={20}
              className="object-cover w-full rounded-large"
              alt="affiliate-casino-rule"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center gap-4 px-10 py-6">
              <div className="text-default lg:text-title">Live Casino</div>
              <div className="pl-4 text-m_default lg:text-default">
                Wager x 1% x{' '}
                <span className="font-bold text-color-text-green">{t('mycasino:commissionRate')} (7%)</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/img/affiliate/casino-rule-2.png"
              width={20}
              height={20}
              className="object-cover w-full rounded-large"
              alt="affiliate-casino-rule"
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center gap-4 px-10 py-6">
              <div className="text-default lg:text-title">Slot Game</div>
              <div className="pl-4 text-m_default lg:text-default">
                Wager x 1% x{' '}
                <span className="font-bold text-color-text-green">{t('mycasino:commissionRate')} (15%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-gradient-card-default rounded-default min-w-[300px] p-6">
          <div className="flex items-center justify-start gap-1">
            <Calculator className="w-5 h-5" />
            {t('affiliate:commissionCalculator')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-end justify-start gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-m_default">Wager (USDT)</div>
                <input
                  className="w-full px-4 py-3 text-white rounded bg-color-input-primary"
                  value={wagerAmount}
                  onChange={(event) => setWagerAmount(event.target.value ? parseFloat(event.target.value) : 0)}
                />
              </div>
              <div className="min-w-[50px] text-center py-3">x 1% x</div>
            </div>
            <div className="flex items-end justify-start gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-m_default">{t('mycasino:commissionRate')}</div>
                <input className="w-full px-4 py-3 text-white rounded bg-color-input-primary" value={commissionRate} />
              </div>
              <div className="min-w-[20px] text-center py-3">%</div>
            </div>
          </div>
          <Menu as="div" className="relative w-auto text-left sm:mb-5 rounded-[7px] flex text-white">
            <Menu.Button className="w-full">
              <div
                role="button"
                className="flex items-center justify-between font-bold gap-2 py-2 px-2 w-full rounded bg-color-input-secondary min-w-[200px]"
              >
                {currentCommission === 'live' ? 'Live Casino (7%)' : 'Slot Game (15%)'}
                <ArrowDown2 stroke="3" />
              </div>
            </Menu.Button>
            <Menu.Items className="absolute origin-top left-0 right-0 top-[40px] z-[5] cursor-pointer rounded p-2">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className="w-full px-4 py-2 bg-color-input-secondary text-m_default"
                    onClick={() => {
                      setCurrentCommission('live');
                      setCommissionRate(7);
                    }}
                  >
                    Live Casino (7%)
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className="w-full px-4 py-2 bg-color-input-secondary text-m_default"
                    onClick={() => {
                      setCurrentCommission('slot');
                      setCommissionRate(15);
                    }}
                  >
                    Slot Game (15%)
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div className="font-extrabold text-color-text-green text-m_title">
            {`= ${(wagerAmount * 0.01 * commissionRate) / 100} USDT`}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-5 bg-color-card-bg-primary p-4 rounded-default">
        <div className="font-semibold">{t('footer:rules')}</div>
        <div
          className={cn('overflow-hidden flex flex-col gap-4 text-default', 'transition-all ease-in duration-300', {
            'max-h-[0px] -mt-8': isShowMore,
            'max-h-[800px]': !isShowMore,
          })}
        >
          <div>
            {`${t('affiliate:commissionRule1')} ${t('affiliate:commissionRule2')} ${t('affiliate:commissionRule3')}`}
          </div>
          <div>{t('affiliate:commissionRule4')}</div>
        </div>
        <div
          className="cursor-pointer flex justify-center items-center m-auto text-m_default sm:text-default gap-2 text-color-primary font-semibold"
          onClick={() => setIsShowMore(!isShowMore)}
        >
          {isShowMore ? t('affiliate:showRule') : t('affiliate:hideRule')}
          <ChevronDownIcon
            width={20}
            height={20}
            className={cn('dark:text-color-primary stroke-[3]', 'transition-all ease-in duration-200', {
              'rotate-0': isShowMore,
              'rotate-180': !isShowMore,
            })}
          />
        </div>
      </div>
      <div className="p-6 mt-4 bg-gradient-card-default rounded-default">
        {t('affiliate:howToGetReferralReward')}
        <div className="grid grid-cols-1 gap-20 mt-4 lg:grid-cols-3">
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">1</div>
            <div className="flex flex-col">
              <div className="text-color-primary">{t('affiliate:shareFriends1')}</div>
              <div className="mt-3 text-m_default">{t('affiliate:shareFriends2')}</div>
            </div>
            <Image
              className="object-cover h-[80px] w-[80px] opacity-30"
              height={50}
              width={50}
              src="/img/affiliate/friends.png"
              alt="affiliate-friends"
            />
          </div>
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">2</div>
            <div className="flex flex-col">
              <div className="text-color-primary">{t('affiliate:getDollar1')}</div>
              <div className="mt-3 text-m_default">{t('affiliate:getDollar2')}</div>
            </div>
            <Image
              className="object-cover h-[80px] w-[80px] opacity-30"
              height={50}
              width={50}
              src="/img/fiats/USDT.png"
              alt="currency-usdt"
            />
          </div>
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">3</div>
            <div className="flex flex-col">
              <div className="text-color-primary">{t('affiliate:levelUpAndReceive1')}</div>
              <div className="mt-3 text-m_default">{t('affiliate:levelUpAndReceive2')}</div>
            </div>
            <Image
              className="object-cover h-[80px] w-[80px] opacity-30"
              height={50}
              width={50}
              src="/img/affiliate/rewards.png"
              alt="affiliate-rewards"
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-6 mt-4 bg-color-card-bg-primary rounded-default">
        <div className="grid grid-cols-3 text-default">
          <div className="font-bold text-center">{t('affiliate:friendsLevel')}</div>
          <div className="font-bold text-center">{t('affiliate:totalWager')}</div>
          <div className="font-bold text-center">{t('affiliate:unlockAmount')}</div>
        </div>
        <div className="mt-5">
          {friendVipData.map((friend, index) => (
            <div
              key={`affiliate-rate-${friend.level}`}
              className={`grid grid-cols-3 text-default py-2 rounded-default mb-1 ${index % 2 === 0 ? ' bg-[#FFF1]' : 'bg-[#FFF2]'
                }`}
            >
              <div className="flex items-center justify-center gap-4 font-bold text-center">
                <Image src={friend.logo} width={32} height={32} className="object-cover h-8" alt="logo" />
                {friend.level}
              </div>
              <div className="flex items-center justify-center font-bold text-center">{friend.wagerAmount}</div>
              <div className="flex justify-center items-center text-center font-bold text-[#FFF27C]">
                {friend.unlockAmount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RateAndRulesComponent;
