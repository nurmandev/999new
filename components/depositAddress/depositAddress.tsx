import classNames from 'classnames';
import { HTMLAttributes, useMemo } from 'react';

type DepositAddressProps = {
  address: string;
} & HTMLAttributes<HTMLElement>;

export const DepositAddressComponent = (props: DepositAddressProps) => {
  const { address, ...rest } = props;

  const renderAddress = useMemo(() => {
    const highlights = [
      { start: 0, end: 4, highlight: true },
      { start: 4, end: 13, highlight: false },
      { start: 13, end: 17, highlight: true },
      { start: 17, end: -4, highlight: false },
      { start: -4, end: null, highlight: true },
    ];
    return highlights.map((item, index) => (
      <span className={classNames({ 'text-color-primary': item.highlight })} key={index}>
        {item.end ? address.slice(item.start, item.end) : address.slice(item.start)}
      </span>
    ));
  }, [address]);

  return (
    <div {...rest} className={classNames('break-all', rest?.className)}>
      {renderAddress}
    </div>
  );
};
