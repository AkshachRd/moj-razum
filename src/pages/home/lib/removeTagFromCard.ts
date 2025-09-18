import { useCardStore } from '@/entities/card';
import { useTagsStore } from '@/entities/tag';

export const removeTagFromCard = (cardId: string, tagId: string): void => {
    const { removeTagsFromCard, cards } = useCardStore.getState();
    const { removeTag } = useTagsStore.getState();

    removeTagsFromCard(cardId, [tagId]);

    // TODO: probably will be a bottleneck
    const isTagUsed =
        cards
            .map((card) => card.tagIds)
            .flat()
            .find((id) => id === tagId) !== undefined;

    if (!isTagUsed) {
        removeTag(tagId);
    }
};
