export type MemoryKind = 'note' | 'image' | 'quote' | 'article' | 'product';

export type BaseMemory = {
    id: string;
    kind: MemoryKind;
    title?: string;
    tldr?: string;
    createdAt: number;
    updatedAt: number;
    tagIds: string[];
};

export type NoteMemory = BaseMemory & {
    kind: 'note';
    content: string;
};

export type ImageMemory = BaseMemory & {
    kind: 'image';
    url: string;
    alt?: string;
};

export type QuoteMemory = BaseMemory & {
    kind: 'quote';
    text: string;
    author?: string;
    sourceUrl?: string;
};

export type ArticleMemory = BaseMemory & {
    kind: 'article';
    url: string;
    excerpt?: string;
    source?: string;
};

export type ProductMemory = BaseMemory & {
    kind: 'product';
    url?: string;
    price?: string;
    currency?: string;
};

export type Memory = NoteMemory | ImageMemory | QuoteMemory | ArticleMemory | ProductMemory;
