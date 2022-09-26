// Types
import { AlertStore, ErrorType } from '@/types/store/alert';

export const state = () => ({
  message: '',
  type: ''
});

export const mutations = {
  set(state: AlertStore, { message, type }: { message: string; type: ErrorType }) {
    state.message = message;
    state.type = type;
  },
  reset(state: AlertStore) {
    state.message = '';
    state.type = '';
  }
};
