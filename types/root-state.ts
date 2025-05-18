import { AuthState, CommonState, LoadingState, ModalState, UserDataState } from '@/types/reducer-states';

type RootState = {
  auth: AuthState;
  user: UserDataState;
  modal: ModalState;
  loading: LoadingState;
  common: CommonState;
};
export type { RootState };
