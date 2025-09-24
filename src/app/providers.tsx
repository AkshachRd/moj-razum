'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { nanoid } from 'nanoid';
import { listen } from '@tauri-apps/api/event';

import { useMemoriesStore } from '@/entities/memory/model/store';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
    }
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const router = useRouter();
    const addMemory = useMemoriesStore((s) => s.addMemory);

    React.useEffect(() => {
        let unlistenDeepLink: (() => void) | undefined;
        let unlistenSingle: (() => void) | undefined;

        (async () => {
            try {
                unlistenDeepLink = await onOpenUrl((urls: string[]) => {
                    for (const href of urls) {
                        try {
                            const url = new URL(href);

                            if (url.protocol !== 'mentem:') continue;

                            if (url.hostname === 'clip' && url.pathname === '/note') {
                                const content = url.searchParams.get('content') ?? '';
                                const title = url.searchParams.get('title') ?? undefined;
                                const sourceUrl = url.searchParams.get('url') ?? undefined;

                                const now = Date.now();
                                const lines = [content, sourceUrl ? `\n\nSource: ${sourceUrl}` : '']
                                    .filter(Boolean)
                                    .join('');

                                addMemory({
                                    id: nanoid(),
                                    kind: 'note',
                                    title,
                                    content: lines,
                                    createdAt: now,
                                    updatedAt: now,
                                    tagIds: [],
                                });
                            }
                        } catch {
                            /* ignore malformed deep link */
                        }
                    }
                });

                // Also handle deep links forwarded from a second instance
                unlistenSingle = await listen<string[]>('single-instance-deep-link', (event) => {
                    const urls = event.payload ?? [];

                    for (const href of urls) {
                        try {
                            const url = new URL(href);

                            if (url.protocol !== 'mentem:') continue;
                            if (url.hostname === 'clip' && url.pathname === '/note') {
                                const content = url.searchParams.get('content') ?? '';
                                const title = url.searchParams.get('title') ?? undefined;
                                const sourceUrl = url.searchParams.get('url') ?? undefined;

                                const now = Date.now();
                                const lines = [content, sourceUrl ? `\n\nSource: ${sourceUrl}` : '']
                                    .filter(Boolean)
                                    .join('');

                                addMemory({
                                    id: nanoid(),
                                    kind: 'note',
                                    title,
                                    content: lines,
                                    createdAt: now,
                                    updatedAt: now,
                                    tagIds: [],
                                });
                            }
                        } catch {
                            /* ignore */
                        }
                    }
                });
            } catch {
                /* plugin not available (e.g. web dev) */
            }
        })();

        return () => {
            try {
                unlistenDeepLink?.();
                unlistenSingle?.();
            } catch {
                /* ignore */
            }
        };
    }, [addMemory]);

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <ToastProvider />
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
