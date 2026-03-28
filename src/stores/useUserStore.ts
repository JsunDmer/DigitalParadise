import { create } from 'zustand';

export interface ChildProfile {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  createdAt: string;
}

interface UserState {
  currentChild: ChildProfile | null;
  children: ChildProfile[];
  setCurrentChild: (child: ChildProfile | null) => void;
  addChild: (child: ChildProfile) => void;
  removeChild: (childId: string) => void;
  updateChild: (childId: string, updates: Partial<ChildProfile>) => void;
  switchChild: (childId: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentChild: null,
  children: [],
  setCurrentChild: (child) => set({ currentChild: child }),
  addChild: (child) =>
    set((state) => ({
      children: [...state.children, child],
      currentChild: state.children.length === 0 ? child : state.currentChild,
    })),
  removeChild: (childId) =>
    set((state) => {
      const newChildren = state.children.filter((c) => c.id !== childId);
      const newCurrentChild =
        state.currentChild?.id === childId
          ? newChildren.length > 0
            ? newChildren[0]
            : null
          : state.currentChild;
      return { children: newChildren, currentChild: newCurrentChild };
    }),
  updateChild: (childId, updates) =>
    set((state) => ({
      children: state.children.map((c) =>
        c.id === childId ? { ...c, ...updates } : c
      ),
      currentChild:
        state.currentChild?.id === childId
          ? { ...state.currentChild, ...updates }
          : state.currentChild,
    })),
  switchChild: (childId) => {
    const child = get().children.find((c) => c.id === childId);
    if (child) {
      set({ currentChild: child });
    }
  },
}));
