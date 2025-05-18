import React, { HTMLProps } from 'react';

function RecentIcon(props: HTMLProps<any>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 1.5 13.14 1.5 9C1.5 4.86 4.86 1.5 9 1.5C13.14 1.5 16.5 4.86 16.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7824 11.3853L9.45741 9.99781C9.05241 9.75781 8.72241 9.18031 8.72241 8.70781V5.63281"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default RecentIcon;
