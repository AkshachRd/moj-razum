'use client';

import { CardItem } from './card-item';

import { Masonry } from '@/shared/ui/masonry';
import { useCardStore } from '@/entities/card';

type CardsListProps = {
    selectedTagIds: string[];
};

// Estimated fixed card height (px): header h-24 (96) + divider (~1) + footer h-24 (96) + padding
const CARD_HEIGHT_PX = 240;

export function CardsList({ selectedTagIds }: CardsListProps) {
    const { cards } = useCardStore();

    const filteredCards =
        selectedTagIds.length === 0
            ? cards
            : cards.filter((card) => card.tagIds.some((tagId) => selectedTagIds.includes(tagId)));

    return (
        <Masonry
            animateFrom="bottom"
            blurToFocus={true}
            columnWidth={380}
            duration={0.6}
            ease="power3.out"
            getItemHeight={(_, __) => CARD_HEIGHT_PX}
            getItemKey={(card) => card.id}
            hoverScale={0.98}
            items={filteredCards}
            renderItem={(card) => <CardItem card={card} />}
            scaleOnHover={true}
            stagger={0.05}
        />
    );
}
