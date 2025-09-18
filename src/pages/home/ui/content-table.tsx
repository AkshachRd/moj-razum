import { CardsTable } from './cards-table';
import { TagsTable } from './tags-table';

export function ContentTable() {
    return (
        <div className="flex flex-row justify-center gap-2">
            <TagsTable />
            <CardsTable />
        </div>
    );
}
