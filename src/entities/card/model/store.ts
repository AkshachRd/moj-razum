import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Card } from './types';

export type CardsState = {
    cards: Card[];
    addCard: (card: Card) => void;
    addTagsToCard: (cardId: string, tagIds: string[]) => void;
    removeTagsFromCard: (cardId: string, tagIds: string[]) => void;
};

export const useCardStore = create<CardsState>()(
    persist(
        (set, get) => ({
            cards: [],
            addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
            addTagsToCard: (cardId: string, tagIds: string[]) => {
                set((state) => ({
                    cards: state.cards.map((card) =>
                        card.id === cardId
                            ? { ...card, tagIds: [...card.tagIds, ...tagIds] }
                            : card,
                    ),
                }));
            },
            removeTagsFromCard: (cardId: string, tagIds: string[]) => {
                set((state) => ({
                    cards: state.cards.map((card) =>
                        card.id === cardId
                            ? { ...card, tagIds: card.tagIds.filter((id) => !tagIds.includes(id)) }
                            : card,
                    ),
                }));
            },
        }),
        { name: 'cards' },
    ),
);
