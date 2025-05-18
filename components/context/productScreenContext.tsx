import { createContext } from 'react';

type ProductScreenType = {
  resetScreen?: (isBack?: boolean) => void;
};

export const ProductScreenContext = createContext<ProductScreenType>({});
