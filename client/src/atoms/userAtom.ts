import { atom } from "recoil";

interface User {
  name: string;
  room: string;
}

export const userAtom = atom<User>({
  key: "userAtom",
  default: {
    name: "",
    room: "",
  },
});
