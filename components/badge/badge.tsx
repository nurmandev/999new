import classNames from 'classnames';
import React, { HTMLProps } from 'react';

const BadgeComponent = ({
  content = '',
  indeterminate,
  className = '',
  ...rest
}: {
  content?: string;
  indeterminate?: boolean;
} & HTMLProps<HTMLSpanElement>) => {
  return (
    <span
      {...rest}
      className={classNames(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        content === 'Inactive'
          ? 'bg-gray-50 text-gray-600 ring-gray-500/10'
          : 'bg-green-50 text-green-700 ring-green-600/20',
      )}
    >
      {String(content)}
    </span>
  );
};

export default BadgeComponent;
