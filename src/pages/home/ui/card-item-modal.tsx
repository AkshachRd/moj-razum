'use client';

import { ModalContent, Button, ModalBody, Divider } from '@heroui/react';

import { TagInput } from './tag-input';

import { Card, CardComponent } from '@/entities/card';
import { useTagsStore } from '@/entities/tag';

interface CardItemModalProps {
    card: Card;
}

export function CardItemModal({ card }: CardItemModalProps) {
    const { tags } = useTagsStore();
    const cardTags = tags.filter((tag) => card.tagIds.includes(tag.id));

    return (
        <ModalContent>
            {(onClose) => (
                <ModalBody>
                    <div className="flex h-[600px]">
                        <div className="flex flex-1 items-center justify-center">
                            <CardComponent
                                footerContent={card.backSide}
                                headerContent={card.frontSide}
                                revealBack={true}
                            />
                        </div>
                        <Divider orientation="vertical" />
                        <div className="flex w-80 flex-col gap-4 p-4">
                            <TagInput card={card} tags={cardTags} />
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            )}
        </ModalContent>
    );
}
