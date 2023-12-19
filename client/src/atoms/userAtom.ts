import { produce } from 'immer';
import { atom } from 'recoil';

interface User {
  name: string;
}
/// 이후 추가될 부분을 위해 객체로 남겨둠
export const userAtom = atom<User>({
  key: 'userAtom',
  default: {
    name: '',
  },
});

export const changeUser = (value: string) => (prev: User) =>
  produce(prev, (draft) => {
    draft.name = value;
    return draft;
  });
