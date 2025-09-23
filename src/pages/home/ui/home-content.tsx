'use client';

import { Tab, Tabs } from '@heroui/react';

import { CardsList } from './cards-list';
import { ContentTable } from './content-table';
import { MemoriesList } from './memories-list';

import { TagComponent } from '@/entities/tag';
import { useTagsStore } from '@/entities/tag';

type HomeContentProps = {
    selectedTagIds: string[];
};

export const HomeContent = ({ selectedTagIds }: HomeContentProps) => {
    const { tags } = useTagsStore();

    return (
        <Tabs aria-label="Options" className="w-full" variant="underlined">
            <Tab key="cards" title="cards">
                <CardsList selectedTagIds={selectedTagIds} />
            </Tab>
            <Tab key="notes" title="notes">
                <MemoriesList selectedTagIds={selectedTagIds} />
            </Tab>
            <Tab key="tags" title="tags">
                <div className="flex flex-wrap justify-center gap-2">
                    {tags.map((tag) => (
                        <TagComponent key={tag.id} color={tag.color}>
                            {tag.name}
                        </TagComponent>
                    ))}
                </div>
            </Tab>
            <Tab key="table" className="w-full" title="table">
                <ContentTable />
            </Tab>
        </Tabs>
    );
};
