import { produce } from "immer";
import { atom } from "recoil";

interface Alert {
  isOpened: boolean;
  type: "success" | "error" | "warning";
  children: React.ReactNode;
}

export const alertAtom = atom<Alert>({
  key: "alertAtom",
  default: {
    isOpened: false,
    type: "success",
    children: "",
  },
});

export const closeAlertAction = (prev: Alert) =>
  produce(prev, (draft) => {
    draft.isOpened = false;
    return draft;
  });

interface Modal {
  isOpened: boolean;
  type: "create" | "attendeeList";
}

export const modalAtom = atom<Modal>({
  key: "modalAtom",
  default: {
    isOpened: false,
    type: "create",
  },
});

export const closeModalAction = (prev: Modal) =>
  produce(prev, (draft) => {
    draft.isOpened = false;
    return draft;
  });

interface Alarm {
  isOpened: boolean;
  type: "call" | "video";
}

export const alarmAtom = atom<Alarm>({
  key: "alarmAtom",
  default: {
    isOpened: false,
    type: "call",
  },
});
