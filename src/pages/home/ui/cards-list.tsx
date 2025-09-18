'use client';

import { CardItem } from './card-item';

import { useCardStore } from '@/entities/card';

type CardsListProps = {
    selectedTagIds: string[];
};

export function CardsList({ selectedTagIds }: CardsListProps) {
    const { cards } = useCardStore();

    const filteredCards =
        selectedTagIds.length === 0
            ? cards
            : cards.filter((card) => card.tagIds.some((tagId) => selectedTagIds.includes(tagId)));

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((card) => (
                <CardItem key={card.id} card={card} />
            ))}
        </div>
    );
}
