import { ReactNode } from 'react';
import { useRecoilState } from 'recoil';

import { AlertType, alertAtom, closeAlert, createAlert } from '@atoms/alertAtom';

interface Return {
  addAlert: (type: AlertType, children: ReactNode) => void;
  removeAlert: (id: number) => void;
}

const useAlert = (): Return => {
  const [_, setAlert] = useRecoilState(alertAtom);

  const addAlert = (type: AlertType, children: ReactNode = '') => {
    setAlert(createAlert(type, children));
  };

  const removeAlert = (id: number) => {
    setAlert(closeAlert(id));
  };

  return { addAlert, removeAlert };
};

export default useAlert;
