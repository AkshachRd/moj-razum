import {
    IBM_Plex_Mono as FontMono,
    IBM_Plex_Sans as FontSans,
    IBM_Plex_Serif as FontSerif,
} from 'next/font/google';

export const fontSans = FontSans({
    subsets: ['latin', 'cyrillic'],
    weight: ['400'],
    variable: '--font-sans',
});

export const fontMono = FontMono({
    subsets: ['latin', 'cyrillic'],
    weight: ['400'],
    variable: '--font-mono',
});

export const fontSerif = FontSerif({
    subsets: ['latin', 'cyrillic'],
    weight: ['400'],
    variable: '--font-serif',
});
