import { create } from "zustand";

type State = {
  isSearchView: boolean;
  isMenuView: boolean;
};

type Actions = {
  setSearchView: (value: boolean) => void;
  setMenuView: (value: boolean) => void;
};

const useNavbarStore = create<State & Actions>((set) => ({
  isSearchView: false,
  isMenuView: false,
  setSearchView: (value) => set({ isSearchView: value }),
  setMenuView: (value) => set({ isMenuView: value }),
}));

export default useNavbarStore;
