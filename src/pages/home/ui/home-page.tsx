'use client';

import { useState } from 'react';

import { SearchBar } from './search-bar';
import { HomeContent } from './home-content';

export function HomePage() {
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div>
                <SearchBar selectedTagIds={selectedTagIds} setSelectedTagIds={setSelectedTagIds} />
            </div>
            <HomeContent selectedTagIds={selectedTagIds} />
        </section>
    );
}
