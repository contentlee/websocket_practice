import { createPortal } from 'react-dom';
import { useRecoilState } from 'recoil';

import { AlertBody, AlertLayout, AlertTypeIcon, CloseButton } from '.';

import { alertAtom } from '@atoms/alertAtom';
import { useEffect, useState } from 'react';

const Alert = () => {
  const [{ isOpened, queue: originQueue }] = useRecoilState(alertAtom);
  const [queue, setQueue] = useState(originQueue);

  useEffect(() => {
    setQueue(originQueue);
  }, [originQueue]);

  return (
    isOpened &&
    !!queue.length &&
    createPortal(
      <AlertLayout>
        {queue?.map((alert) => {
          return (
            <AlertBody key={alert.id} alert={alert}>
              <AlertTypeIcon type={alert.type} />
              <div>{alert.children}</div>
              <CloseButton id={alert.id} />
            </AlertBody>
          );
        })}
      </AlertLayout>,
      document.body,
      'alert',
    )
  );
};

export default Alert;
