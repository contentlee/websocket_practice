import { produce } from 'immer';
import { atom } from 'recoil';

export interface Alert {
  isOpened: boolean;
  type: 'success' | 'error' | 'warning';
  children: React.ReactNode;
}

export const alertAtom = atom<Alert>({
  key: 'alertAtom',
  default: {
    isOpened: false,
    type: 'success',
    children: '',
  },
});

export const closeAlertAction = (prev: Alert) =>
  produce(prev, (draft) => {
    draft.isOpened = false;
    return draft;
  });

interface Modal {
  isOpened: boolean;
  type: string;
}

export const modalAtom = atom<Modal>({
  key: 'modalAtom',
  default: {
    isOpened: false,
    type: 'create',
  },
});
