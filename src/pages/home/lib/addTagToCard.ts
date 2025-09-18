import { useCardStore } from '@/entities/card';
import { Tag, TagColor, useTagsStore } from '@/entities/tag';

export const addTagToCard = (cardId: string, tagName: string, tagColor?: TagColor): Tag => {
    const { addTag } = useTagsStore.getState();
    const { addTagsToCard } = useCardStore.getState();

    const tag = addTag(tagName, tagColor);

    addTagsToCard(cardId, [tag.id]);

    return tag;
};
