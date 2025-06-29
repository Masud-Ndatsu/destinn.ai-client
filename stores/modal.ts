import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  open: (value: boolean) => void;
};

const useModalStore = create<State & Action>((set) => ({
  isOpen: false,
  open: (value) => set({ isOpen: value }),
}));

export default useModalStore;
