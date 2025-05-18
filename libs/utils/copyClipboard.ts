import { toast } from 'react-toastify';

import { TOAST_ENUM } from '@/base/constants/common';

export function copyClipBoard(text: string, showToast: boolean = true) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // text area method
    let textArea = document.createElement('textarea');
    textArea.value = text;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
  if (showToast) toast.success('Copied', { containerId: TOAST_ENUM.COMMON, toastId: 'copy-clipboard-notification' });
}
