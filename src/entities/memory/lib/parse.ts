import type { Memory } from '../model/types';

export function parseMemoryMarkdown(content: string): Memory | null {
    const trimmed = content.trimStart();

    if (!trimmed.startsWith('---')) return null;

    const secondIdx = trimmed.indexOf('\n---', 3);

    if (secondIdx === -1) return null;

    const fmBlock = trimmed.slice(3, secondIdx).trim();
    const body = trimmed.slice(secondIdx + 4).trimStart();

    const fm = parseSimpleYaml(fmBlock) as any;

    if (!fm || typeof fm !== 'object') return null;

    const kind = String(fm.kind ?? 'note');

    if (kind === 'note') {
        return {
            id: String(fm.id),
            kind: 'note',
            title: fm.title ? String(fm.title) : undefined,
            content: body ?? '',
            createdAt: Number(fm.createdAt ?? Date.now()),
            updatedAt: Number(fm.updatedAt ?? Date.now()),
            tagIds: Array.isArray(fm.tagIds) ? fm.tagIds.map(String) : [],
        };
    }

    // Non-note kinds: hydrate basic metadata only
    const base = {
        id: String(fm.id),
        kind: kind as Memory['kind'],
        title: fm.title ? String(fm.title) : undefined,
        createdAt: Number(fm.createdAt ?? Date.now()),
        updatedAt: Number(fm.updatedAt ?? Date.now()),
        tagIds: Array.isArray(fm.tagIds) ? fm.tagIds.map(String) : [],
    } as any;

    if (kind === 'image')
        return {
            ...base,
            url: String(fm.meta?.url ?? ''),
            alt: fm.meta?.alt ? String(fm.meta.alt) : undefined,
        };
    if (kind === 'quote')
        return {
            ...base,
            text: body ?? '',
            author: fm.meta?.author ? String(fm.meta.author) : undefined,
            sourceUrl: fm.meta?.sourceUrl ? String(fm.meta.sourceUrl) : undefined,
        };
    if (kind === 'article')
        return {
            ...base,
            url: String(fm.meta?.url ?? ''),
            excerpt: fm.meta?.excerpt ? String(fm.meta.excerpt) : undefined,
            source: fm.meta?.source ? String(fm.meta.source) : undefined,
        };
    if (kind === 'product')
        return {
            ...base,
            url: fm.meta?.url ? String(fm.meta.url) : undefined,
            price: fm.meta?.price ? String(fm.meta.price) : undefined,
            currency: fm.meta?.currency ? String(fm.meta.currency) : undefined,
        };

    return null;
}

function parseSimpleYaml(yaml: string): unknown {
    const lines = yaml.split(/\r?\n/);
    const stack: any[] = [{}];
    const indents: number[] = [0];

    for (const raw of lines) {
        if (!raw.trim()) continue;
        const indent = raw.match(/^\s*/)?.[0].length ?? 0;
        const line = raw.trim();

        while (indent < indents[indents.length - 1]) {
            indents.pop();
            stack.pop();
        }

        if (line.startsWith('- ')) {
            const arr = Array.isArray(stack[stack.length - 1])
                ? stack[stack.length - 1]
                : (stack[stack.length - 1] = []);

            arr.push(parseScalar(line.slice(2)));
            continue;
        }

        const idx = line.indexOf(':');

        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();

        if (!value) {
            const obj: any = {};

            (stack[stack.length - 1] as any)[key] = obj;
            stack.push(obj);
            indents.push(indent + 2);
        } else {
            (stack[stack.length - 1] as any)[key] = parseScalar(value);
        }
    }

    return stack[0];
}

function parseScalar(value: string): unknown {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^[-]?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    try {
        // quoted string
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            return JSON.parse(value.replace(/'/g, '"'));
        }
    } catch {
        /* ignore */
    }

    return value;
}
