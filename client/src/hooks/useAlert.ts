import { useRecoilState } from 'recoil';

import { Alert, alertAtom } from '@atoms/stateAtom';

type AlertType = 'success' | 'error' | 'warning';
type ChildrenType = React.ReactNode;

type Return = [Alert, (type: AlertType, children: ChildrenType) => void];

const useAlert = (): Return => {
  const [alert, setAlert] = useRecoilState(alertAtom);

  const handleChangeAlert = (type: AlertType, children: ChildrenType = '') => {
    const openedAlert = {
      isOpened: true,
      type,
      children,
    };
    setAlert(openedAlert);
  };

  return [alert, handleChangeAlert];
};

export default useAlert;
