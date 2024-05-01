import { ReactNode } from 'react';
import { atom } from 'recoil';

export type AlertType = 'success' | 'error' | 'warning';
export type AlertState = 'opened' | 'closed';

export interface IQueueItem {
  id: number;
  type: AlertType;
  children: ReactNode;
  state: AlertState;
}

export interface IAlert {
  isOpened: boolean;
  queue: IQueueItem[];
}

export const alertAtom = atom<IAlert>({
  key: 'alertAtom',
  default: {
    isOpened: false,
    queue: [],
  },
});

export const createAlert = (type: AlertType, children: ReactNode) => {
  const openedAlert = {
    id: 0,
    type,
    children,
    state: 'opened' as AlertState,
  };

  return (alert: IAlert) => {
    const isOpened = true;
    const id = alert.queue.length + 1;

    if (alert.queue.findIndex((a) => a.id === id) !== -1) return alert;
    const queue = [{ ...openedAlert, id }, ...alert.queue];
    return { isOpened, queue };
  };
};

export const closeAlert = (id: number) => {
  return (alert: IAlert) => {
    const isOpened = alert.isOpened;
    const queue = alert.queue.map((a) => {
      if (a.id === id) return { ...a, state: 'closed' as AlertState };
      return a;
    });
    return { isOpened, queue };
  };
};

export const deleteAlert = (id: number) => {
  return (alert: IAlert) => {
    const isOpened = alert.isOpened;
    const queue = alert.queue.filter((a) => a.id !== id);
    return { isOpened, queue };
  };
};
