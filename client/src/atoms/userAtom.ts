import { produce } from 'immer';
import { atom, useRecoilState } from 'recoil';

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

const [_, setUser] = useRecoilState(userAtom);

export const changeUser = (value: string): void =>
  setUser((prev) =>
    produce(prev, (draft) => {
      draft.name = value;
      return draft;
    }),
  );
