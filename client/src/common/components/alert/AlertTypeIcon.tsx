import SuccessIcon from '@assets/success_icon.svg';
import ErrorIcon from '@assets/error_icon.svg';
import WarningIcon from '@assets/warning_icon.svg';

import { Icon } from '..';

interface Props {
  type: 'success' | 'error' | 'warning';
}

const AlertTypeIcon = ({ type }: Props) => {
  return <Icon src={ALERT_ICON[type]}></Icon>;
};

const ALERT_ICON = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
};

export default AlertTypeIcon;
