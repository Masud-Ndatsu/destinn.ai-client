import { create } from "zustand";

type State = {
  isLoginModalOpen: boolean;
  isOpportunityModalOpen: boolean;
};

type Action = {
  setLoginModalOpen: (value: boolean) => void;
  setOpportunityModalOpen: (value: boolean) => void;
};

const useModalStore = create<State & Action>((set) => ({
  isLoginModalOpen: false,
  isOpportunityModalOpen: false,
  setLoginModalOpen: (value) => set({ isLoginModalOpen: value }),
  setOpportunityModalOpen: (value) => set({ isOpportunityModalOpen: value }),
}));

export default useModalStore;
