'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  children: Readonly<React.ReactNode>;
};

const CsrWrapper = ({ children }: Props) => {
  const [isSever, setIsServer] = useState<boolean>(true);

  useEffect(() => {
    if (window) {
      setIsServer(false);
    }
  }, []);

  return <>{isSever ? <></> : children}</>;
};

export default CsrWrapper;
