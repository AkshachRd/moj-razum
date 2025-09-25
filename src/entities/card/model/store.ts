import { create } from 'zustand';

import { cardToMarkdown } from '../lib/serialize';

import { Card } from './types';

import { getCollectionDir, writeMarkdownFile } from '@/shared/lib/fs';

export type CardsState = {
    cards: Card[];
    addCard: (card: Card) => void;
    addTagsToCard: (cardId: string, tagIds: string[]) => void;
    removeTagsFromCard: (cardId: string, tagIds: string[]) => void;
    hydrate: (cards: Card[]) => void;
};

export const useCardStore = create<CardsState>()((set, get) => ({
    cards: [],
    addCard: (card) => {
        void (async () => {
            try {
                const dir = await getCollectionDir('cards');
                const fileName = `${card.id}.md`;

                await writeMarkdownFile(dir, fileName, cardToMarkdown(card));
            } catch (error) {
                console.error('Failed to write card file', error);
            }
        })();
        set((state) => ({ cards: [...state.cards, card] }));
    },
    addTagsToCard: (cardId: string, tagIds: string[]) => {
        set((state) => ({
            cards: state.cards.map((card) =>
                card.id === cardId ? { ...card, tagIds: [...card.tagIds, ...tagIds] } : card,
            ),
        }));
        void (async () => {
            try {
                const current = get().cards.find((c) => c.id === cardId);

                if (!current) return;
                const dir = await getCollectionDir('cards');

                await writeMarkdownFile(dir, `${cardId}.md`, cardToMarkdown(current));
            } catch (error) {
                console.error('Failed to update card file (add tags)', error);
            }
        })();
    },
    removeTagsFromCard: (cardId: string, tagIds: string[]) => {
        set((state) => ({
            cards: state.cards.map((card) =>
                card.id === cardId
                    ? { ...card, tagIds: card.tagIds.filter((id) => !tagIds.includes(id)) }
                    : card,
            ),
        }));
        void (async () => {
            try {
                const current = get().cards.find((c) => c.id === cardId);

                if (!current) return;
                const dir = await getCollectionDir('cards');

                await writeMarkdownFile(dir, `${cardId}.md`, cardToMarkdown(current));
            } catch (error) {
                console.error('Failed to update card file (remove tags)', error);
            }
        })();
    },
    hydrate: (cards) => set(() => ({ cards })),
}));
