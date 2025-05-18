import { shallowEqual, useSelector } from 'react-redux';

import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

import styles from './index.module.scss';

export default function ({
  goalAmount,
  currentAmount,
  status,
}: {
  goalAmount: number;
  currentAmount: number;
  status: boolean;
}) {
  const { localFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );
  const percentage = Math.floor((currentAmount / goalAmount) * 100);
  const progress = status || percentage > 100 ? 100 : percentage;
  return (
    <div className={`w-full h-full relative overflow-hidden ${styles.progressBox}`}>
      <svg width="100%" height="100%" viewBox="0 0 64 64">
        <circle stroke-width="2" r="30" cx="32" cy="32" fill="transparent" stroke="#46434C" />
        <circle stroke-width="0" r="2" cx="32" cy="32" fill="#46434C" />
        <circle
          stroke-width="2"
          r="28.5"
          cx="32"
          cy="32"
          fill="transparent"
          stroke="#00AAE6"
          strokeDasharray="180"
          strokeDashoffset={1.8 * (100 - progress)}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center center',
          }}
        />
      </svg>
      <div
        className={`text-m_default absolute top-0 left-0 right-0 bottom-0 rounded-full flex justify-center items-center ${styles.progressDetail}`}
      >
        {currencyFormat1(currentAmount, 2, localFiat?.name)}
      </div>
      <div
        className={`text-m_default absolute top-0 left-0 right-0 bottom-0 rounded-full flex justify-center items-center ${styles.progressContent}`}
      >
        {progress}/100
      </div>
    </div>
  );
}
