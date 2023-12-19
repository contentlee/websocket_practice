import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRecoilState } from 'recoil';

import SuccessIcon from '@assets/success_icon.svg';
import ErrorIcon from '@assets/error_icon.svg';
import WarningIcon from '@assets/warning_icon.svg';
import CloseIcon from '@assets/close_icon.svg';

import { alertAtom, closeAlertAction } from '@atoms/stateAtom';

import { Alert, Icon, AlertLayout } from '../components';

const AlertContainer = () => {
  const [{ isOpened, type, children }, setAlert] = useRecoilState(alertAtom);

  const handleClickClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setAlert(closeAlertAction);
  };

  useEffect(() => {
    if (isOpened) {
      const fadeout = setTimeout(() => setAlert(closeAlertAction), 5000);
      return () => clearTimeout(fadeout);
    }
  }, [alert, setAlert]);

  return (
    isOpened &&
    createPortal(
      <AlertLayout>
        <Alert type={type}>
          <Icon src={ALERT_ICON[type]}></Icon>
          {children}
          <Icon src={CloseIcon} onClick={handleClickClose}></Icon>
        </Alert>
      </AlertLayout>,
      document.body,
      'alert',
    )
  );
};

const ALERT_ICON = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
};

export default AlertContainer;
