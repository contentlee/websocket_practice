import { HTMLAttributes, ReactNode, useEffect } from 'react';
import { keyframes } from '@emotion/react';

import { IQueueItem, alertAtom, closeAlert, deleteAlert } from '@atoms/alertAtom';

import { palette } from '@utils/palette';
import { useRecoilState } from 'recoil';

interface Props extends HTMLAttributes<HTMLDivElement> {
  alert: IQueueItem;
  children?: ReactNode;
}

const ANIMATION_DURATION = 500;
const ALERT_DURATION = 5000;
const DEFAULT_ANIMATION = '.5s ease-in-out forwards ';

const AlertBody = ({ alert: { id, state, type }, children, ...props }: Props) => {
  const [_, setAlert] = useRecoilState(alertAtom);
  useEffect(() => {
    if (state === 'opened') {
      const fadein = setTimeout(() => {
        setAlert(closeAlert(id));
      }, ALERT_DURATION + ANIMATION_DURATION);
      return () => {
        clearTimeout(fadein);
      };
    } else if (state === 'closed') {
      const fadeout = setTimeout(() => {
        setAlert(deleteAlert(id));
      }, ANIMATION_DURATION);
      return () => {
        clearTimeout(fadeout);
      };
    }
  }, [state]);

  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '350px',
        padding: '0 14px',
        gap: '1.25em',
        color: palette.main.wht,
        userSelect: 'none',
        animation: DEFAULT_ANIMATION + KEYFRAMES_VARIANTS[state],
        ...TYPE_VARIANTS[type],
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const TYPE_VARIANTS = {
  success: {
    backgroundColor: palette.point.green,
  },
  error: {
    backgroundColor: palette.point.red,
  },
  warning: {
    backgroundColor: palette.point.yellow,
  },
};

const KEYFRAMES_VARIANTS = {
  new: '',
  opened: keyframes`
  0% {
    opacity: 0;
    max-height: 0px;
    margin-bottom: 0px;
    transform: translateX(10px);
  }
  50% {
    opacity: 0;
    min-height: 2.5em;
    margin-bottom: 12px;
    transform: translateX(10px);
  }

  100% {
    opacity: 1;
    min-height: 2.5em;
    margin-bottom: 12px;
    transform: translateX(0);
  }
`,
  closed: keyframes`
  0% {
    opacity: 1;
    min-height: 2.5em;
    margin-bottom: 12px;
    transform: translateX(0);
  }

  50% {
    opacity: 0;
    min-height: 2.5em;
    max-height: 2.5em;
    margin-bottom: 12px;
    transform: translateX(10px);
  }

  100% {
    opacity: 0;
    max-height: 0px;
    margin-bottom: 0px;
    transform: translateX(10px);
  }`,
};

export default AlertBody;
