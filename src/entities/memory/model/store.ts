import { create } from 'zustand';

import { memoryToMarkdown } from '../lib';

import { Memory } from './types';

import { deleteFile, fileExists, getCollectionDir, writeMarkdownFile } from '@/shared/lib/fs';

export type MemoriesState = {
    memories: Memory[];
    addMemory: (memory: Memory) => void;
    updateMemory: (id: string, updater: (current: Memory) => Memory) => void;
    removeMemory: (id: string) => void;
    addTagsToMemory: (memoryId: string, tagIds: string[]) => void;
    removeTagsFromMemory: (memoryId: string, tagIds: string[]) => void;
    clearMemories: () => void;
    hydrate: (memories: Memory[]) => void;
};

export const useMemoriesStore = create<MemoriesState>()((set, get) => ({
    memories: [],
    addMemory: (memory) => {
        void (async () => {
            try {
                const dir = await getCollectionDir('memories');
                const fileName = `${memory.id}.md`;

                await writeMarkdownFile(dir, fileName, memoryToMarkdown(memory));
            } catch (error) {
                console.error('[mem] add -> write fail', error);
            }
        })();
        set((state) => ({ memories: [...state.memories, memory] }));
    },
    updateMemory: (id, updater) => {
        set((state) => ({
            memories: state.memories.map((m) => (m.id === id ? updater(m) : m)),
        }));
        void (async () => {
            try {
                const dir = await getCollectionDir('memories');
                const current = get().memories.find((m) => m.id === id);

                if (current) {
                    await writeMarkdownFile(dir, `${id}.md`, memoryToMarkdown(current));
                }
            } catch (error) {
                console.error('[mem] update -> write fail', error);
            }
        })();
    },
    removeMemory: (id) => {
        set((state) => ({
            memories: state.memories.filter((m) => m.id !== id),
        }));
        void (async () => {
            try {
                const dir = await getCollectionDir('memories');

                if (await fileExists(dir, `${id}.md`)) {
                    await deleteFile(dir, `${id}.md`);
                }
            } catch (error) {
                console.error('[mem] delete -> fail', error);
            }
        })();
    },
    addTagsToMemory: (memoryId, tagIds) => {
        set((state) => ({
            memories: state.memories.map((m) =>
                m.id === memoryId ? { ...m, tagIds: [...m.tagIds, ...tagIds] } : m,
            ),
        }));
        void (async () => {
            try {
                const dir = await getCollectionDir('memories');
                const current = get().memories.find((m) => m.id === memoryId);

                if (current) {
                    await writeMarkdownFile(dir, `${memoryId}.md`, memoryToMarkdown(current));
                }
            } catch (error) {
                console.error('[mem] addTags -> write fail', error);
            }
        })();
    },
    removeTagsFromMemory: (memoryId, tagIds) => {
        set((state) => ({
            memories: state.memories.map((m) =>
                m.id === memoryId
                    ? {
                          ...m,
                          tagIds: m.tagIds.filter((id) => !tagIds.includes(id)),
                      }
                    : m,
            ),
        }));
        void (async () => {
            try {
                const dir = await getCollectionDir('memories');
                const current = get().memories.find((m) => m.id === memoryId);

                if (current) {
                    await writeMarkdownFile(dir, `${memoryId}.md`, memoryToMarkdown(current));
                }
            } catch (error) {
                console.error('[mem] removeTags -> write fail', error);
            }
        })();
    },
    clearMemories: () => set(() => ({ memories: [] })),
    hydrate: (memories) => set(() => ({ memories })),
}));
