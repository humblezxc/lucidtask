import { create } from 'zustand';
import { Tag } from '@/types/suggestions';

interface FormulaState {
    tags: Tag[];
    input: string;
    addTag: (tag: Tag) => void;
    removeTag: (id: string) => void;
    setInput: (input: string) => void;
    clearAll: () => void;
}

export const useFormulaStore = create<FormulaState>((set) => ({
    tags: [],
    input: '',
    addTag: (tag) => set((state) => ({
        tags: [...state.tags, tag],
        input: ''
    })),
    removeTag: (id) => set((state) => ({
        tags: state.tags.filter(tag => tag.id !== id)
    })),
    setInput: (input) => set({ input }),
    clearAll: () => set({ tags: [], input: '' }),
}));
