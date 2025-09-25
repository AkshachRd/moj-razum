import { Memory } from '../model/types';

export function memoryToMarkdown(memory: Memory): string {
    const frontMatter: Record<string, unknown> = {
        id: memory.id,
        kind: memory.kind,
        title: 'title' in memory ? memory.title : undefined,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt,
        tagIds: memory.tagIds,
        meta:
            memory.kind === 'image'
                ? { url: memory.url, alt: memory.alt }
                : memory.kind === 'quote'
                  ? { author: memory.author, sourceUrl: memory.sourceUrl }
                  : memory.kind === 'article'
                    ? { url: memory.url, excerpt: memory.excerpt, source: memory.source }
                    : memory.kind === 'product'
                      ? { url: memory.url, price: memory.price, currency: memory.currency }
                      : undefined,
    };

    const yaml = toYAML(frontMatter);
    const body = memory.kind === 'note' ? memory.content : '';

    return `---\n${yaml}\n---\n\n${body}`;
}

function toYAML(obj: Record<string, unknown>): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            lines.push(`${key}:`);
            for (const item of value) {
                lines.push(`  - ${formatScalar(item)}`);
            }
        } else if (typeof value === 'object' && value !== null) {
            lines.push(`${key}:`);
            for (const [k, v] of Object.entries(value)) {
                if (v === undefined) continue;
                lines.push(`  ${k}: ${formatScalar(v)}`);
            }
        } else {
            lines.push(`${key}: ${formatScalar(value)}`);
        }
    }

    return lines.join('\n');
}

function formatScalar(value: unknown): string {
    if (typeof value === 'string') {
        // wrap if contains special chars
        if (/[:#\-\n]/.test(value)) {
            return JSON.stringify(value);
        }

        return value;
    }

    return String(value);
}
