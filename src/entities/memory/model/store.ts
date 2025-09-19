import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Memory } from './types';

export type MemoriesState = {
    memories: Memory[];
    addMemory: (memory: Memory) => void;
    updateMemory: (id: string, updater: (current: Memory) => Memory) => void;
    removeMemory: (id: string) => void;
    addTagsToMemory: (memoryId: string, tagIds: string[]) => void;
    removeTagsFromMemory: (memoryId: string, tagIds: string[]) => void;
    clearMemories: () => void;
};

export const useMemoriesStore = create<MemoriesState>()(
    persist(
        (set) => ({
            memories: [],
            addMemory: (memory) => set((state) => ({ memories: [...state.memories, memory] })),
            updateMemory: (id, updater) =>
                set((state) => ({
                    memories: state.memories.map((m) => (m.id === id ? updater(m) : m)),
                })),
            removeMemory: (id) =>
                set((state) => ({
                    memories: state.memories.filter((m) => m.id !== id),
                })),
            addTagsToMemory: (memoryId, tagIds) =>
                set((state) => ({
                    memories: state.memories.map((m) =>
                        m.id === memoryId ? { ...m, tagIds: [...m.tagIds, ...tagIds] } : m,
                    ),
                })),
            removeTagsFromMemory: (memoryId, tagIds) =>
                set((state) => ({
                    memories: state.memories.map((m) =>
                        m.id === memoryId
                            ? {
                                  ...m,
                                  tagIds: m.tagIds.filter((id) => !tagIds.includes(id)),
                              }
                            : m,
                    ),
                })),
            clearMemories: () => set(() => ({ memories: [] })),
        }),
        { name: 'memories' },
    ),
);
