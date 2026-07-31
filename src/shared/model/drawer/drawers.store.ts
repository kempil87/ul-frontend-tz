import { create } from 'zustand';

type DrawersState = {
  open: Set<string>;
  isOpen: (name: string) => boolean;
  openDrawer: (name: string) => void;
  closeDrawer: (name: string) => void;
  toggleDrawer: (name: string) => void;
  setDrawerOpen: (name: string, open: boolean) => void;
  closeAll: () => void;
};

export const useDrawersStore = create<DrawersState>((set, get) => ({
  open: new Set(),

  isOpen: (name) => get().open.has(name),

  openDrawer: (name) => {
    set((state) => {
      if (state.open.has(name)) return state;
      const open = new Set(state.open);
      open.add(name);
      return { open };
    });
  },

  closeDrawer: (name) => {
    set((state) => {
      if (!state.open.has(name)) return state;
      const open = new Set(state.open);
      open.delete(name);
      return { open };
    });
  },

  toggleDrawer: (name) => {
    const { open, openDrawer, closeDrawer } = get();
    if (open.has(name)) closeDrawer(name);
    else openDrawer(name);
  },

  setDrawerOpen: (name, nextOpen) => {
    if (nextOpen) get().openDrawer(name);
    else get().closeDrawer(name);
  },

  closeAll: () => {
    set({ open: new Set() });
  },
}));

export const drawerApi = {
  open: (name: string) => useDrawersStore.getState().openDrawer(name),
  close: (name: string) => useDrawersStore.getState().closeDrawer(name),
  toggle: (name: string) => useDrawersStore.getState().toggleDrawer(name),
  setOpen: (name: string, open: boolean) => useDrawersStore.getState().setDrawerOpen(name, open),
  closeAll: () => useDrawersStore.getState().closeAll(),
};
