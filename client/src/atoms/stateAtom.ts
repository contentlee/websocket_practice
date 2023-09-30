import { atom } from "recoil";

interface Modal {
  isOpened: boolean;
  type: "create";
}

export const modalAtom = atom<Modal>({
  key: "modalAtom",
  default: {
    isOpened: false,
    type: "create",
  },
});
