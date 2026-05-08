import { create } from 'zustand';

type LibraryView = 'shelf' | 'detail' | 'reader' | 'scanner';

interface LibraryState {
  view: LibraryView;
  selectedEditionId: string | null;
  setView: (view: LibraryView) => void;
  selectEdition: (id: string | null) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  view: 'shelf',
  selectedEditionId: null,
  setView: (view) => set({ view }),
  selectEdition: (id) => set({ selectedEditionId: id, view: id ? 'detail' : 'shelf' }),
}));
