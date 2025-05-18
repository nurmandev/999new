import React, { HTMLProps } from 'react';

function SlotIcon(props: HTMLProps<any>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.99625 7.29963H4V8.31835H4.7191V7.65918H5.49813L4.53933 10.236H5.85768L6.99625 7.29963Z"
        fill="currentColor"
      />
      <path
        d="M10.8315 7H7.17603V8.25843H8.13483V7.41948H9.09363L7.89513 10.5955H9.51311L10.8315 7Z"
        fill="currentColor"
      />
      <path
        d="M14.0674 7.29963H11.0712V8.31835H11.8502V7.65918H12.6292L11.6704 10.236H12.9888L14.0674 7.29963Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SlotIcon;
