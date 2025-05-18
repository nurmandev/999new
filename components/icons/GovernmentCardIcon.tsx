import React, { HTMLProps } from 'react';

function GovernmentCardIcon(props: HTMLProps<any>) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5431 11H3.30712C2.03371 11 1 9.9663 1 8.69289V3.30711C1 2.0337 2.03371 1 3.30712 1H12.5431C13.8165 1 14.8502 2.0337 14.8502 3.30711V8.69289C14.8502 9.9663 13.8165 11 12.5431 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3.29968 3.29968H4.07122" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.29968 5.6142H6.37834" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.29968 7.92133H6.37834" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12.5431 3.29968H9.46448V6.37835H12.5431V3.29968Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default GovernmentCardIcon;
