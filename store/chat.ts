import { create } from "zustand";

interface ChatbotStore {
  isChatbotOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  isChatbotOpen: false,
  openChatbot: () => set({ isChatbotOpen: true }),
  closeChatbot: () => set({ isChatbotOpen: false }),
  toggleChatbot: () =>
    set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
}));
