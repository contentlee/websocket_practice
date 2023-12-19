import { modalAtom } from '@atoms/stateAtom';
import { produce } from 'immer';
import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

type RefType<T> = T | null;

type Return<T> = [React.MutableRefObject<RefType<T>>, (type: string) => void, () => void];

const useModal = <T extends HTMLElement>(): Return<T> => {
  const ref = useRef<RefType<T>>(null);
  const [_, setModal] = useRecoilState(modalAtom);

  const closeModal = () =>
    setModal((prev) =>
      produce(prev, (draft) => {
        draft.isOpened = false;
        return draft;
      }),
    );

  const openModal = (type: string = '') => {
    if (!!ref.current) {
      const modal = { isOpened: true, type, node: ref.current };
      setModal(modal);
    }
  };

  const handleClickOutOfModal = (e: MouseEvent) => {
    if (ref.current?.contains(e.target as Node)) closeModal();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutOfModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutOfModal);
    };
  }, []);
  return [ref, openModal, closeModal];
};

export default useModal;
