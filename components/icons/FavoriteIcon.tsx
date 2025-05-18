import React, { HTMLProps } from 'react';

function FavoriteIcon(props: HTMLProps<any>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.33 2.32422C10.9725 2.32422 9.7575 2.98422 9 3.99672C8.2425 2.98422 7.0275 2.32422 5.67 2.32422C3.3675 2.32422 1.5 4.19922 1.5 6.51672C1.5 7.40922 1.6425 8.23422 1.89 8.99922C3.075 12.7492 6.7275 14.9917 8.535 15.6067C8.79 15.6967 9.21 15.6967 9.465 15.6067C11.2725 14.9917 14.925 12.7492 16.11 8.99922C16.3575 8.23422 16.5 7.40922 16.5 6.51672C16.5 4.19922 14.6325 2.32422 12.33 2.32422Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default FavoriteIcon;
