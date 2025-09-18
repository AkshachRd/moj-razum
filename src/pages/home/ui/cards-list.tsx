'use client';

import { CardItem } from './card-item';

import { Masonry } from '@/shared/ui/masonry';
import { useCardStore } from '@/entities/card';

type CardsListProps = {
    selectedTagIds: string[];
};

const items = [
    {
        id: '1',

        img: 'https://picsum.photos/id/1015/600/900?grayscale',

        url: 'https://example.com/one',

        height: 400,
    },

    {
        id: '2',

        img: 'https://picsum.photos/id/1011/600/750?grayscale',

        url: 'https://example.com/two',

        height: 250,
    },

    {
        id: '3',

        img: 'https://picsum.photos/id/1020/600/800?grayscale',

        url: 'https://example.com/three',

        height: 600,
    },

    // ... more items
];

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
            <Masonry
                animateFrom="bottom"
                blurToFocus={true}
                colorShiftOnHover={false}
                duration={0.6}
                ease="power3.out"
                hoverScale={0.95}
                items={items}
                scaleOnHover={true}
                stagger={0.05}
            />
        </div>
    );
}
