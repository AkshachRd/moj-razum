import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { useState } from 'react';

import { TagColor, TagComponent, useTagsStore } from '@/entities/tag';

export function TagsTable() {
    const { tags } = useTagsStore();
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const getClassNames = () => {
        return {
            td: 'before:bg-(--tag-color) data-[selected=true]:text-[--tag-color]-600 dark:data-[selected=true]:text-(--tag-color)',
        };
    };

    const setTegColorVar = (tagId?: string) => {
        const tag = tags.find((t) => t.id === tagId);
        const tagColor = tag?.color ?? 'default';

        const variants: Record<TagColor, string> = {
            warning: '[--tag-color:hsl(var(--heroui-warning)/.2)]',
            success: '[--tag-color:hsl(var(--heroui-success)/.2)]',
            danger: '[--tag-color:hsl(var(--heroui-danger)/.2)]',
            secondary: '[--tag-color:hsl(var(--heroui-secondary)/.2)]',
            primary: '[--tag-color:hsl(var(--heroui-primary)/.2)]',
            default: '[--tag-color:hsl(var(--heroui-default)/.6)]',
        };

        return variants[tagColor];
    };

    return (
        <Table
            isCompact
            aria-label="List of tags"
            className={setTegColorVar()}
            classNames={getClassNames()}
            fullWidth={false}
            selectionMode="multiple"
        >
            <TableHeader>
                <TableColumn>TAG</TableColumn>
            </TableHeader>
            <TableBody items={tags}>
                {(tag) => (
                    <TableRow key={tag.id} className={setTegColorVar(tag.id)}>
                        <TableCell>
                            <TagComponent color={tag.color}>{tag.name}</TagComponent>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
