import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { getRandomTagColor } from '../lib/getRandomTagColor';

import { Tag, TagColor } from './types';

export type TagsState = {
    tags: Tag[];
    addTag: (name: string, color?: TagColor) => Tag;
    removeTag: (tagId: string) => void;
    clearTags: () => void;
};

export const useTagsStore = create<TagsState>()(
    persist(
        (set) => ({
            tags: [],
            addTag: (name, color) => {
                const tag = { id: nanoid(), name, color: color ?? getRandomTagColor() };

                set((state) => ({ tags: [...state.tags, tag] }));

                return tag;
            },
            removeTag: (tagId) =>
                set((state) => ({
                    tags: state.tags.filter((t) => t.id !== tagId),
                })),
            clearTags: () => set(() => ({ tags: [] })),
        }),
        { name: 'tags' },
    ),
);
