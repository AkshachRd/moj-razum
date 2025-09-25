'use client';

import {
    exists,
    mkdir,
    readTextFile,
    writeTextFile,
    readDir,
    remove,
    BaseDirectory,
} from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

async function ensureDirAppData(path: string) {
    const present = await exists(path, { baseDir: BaseDirectory.AppData });

    if (!present) {
        await mkdir(path, { recursive: true, baseDir: BaseDirectory.AppData });
    }
}

export async function getDataRoot(): Promise<string> {
    // Use AppData base directory with a relative scope path
    const dir = 'mentem';

    await ensureDirAppData(dir);

    return dir;
}

export async function getCollectionDir(collection: 'memories' | 'cards' | 'tags'): Promise<string> {
    const root = await getDataRoot();
    const dir = await join(root, collection);

    await ensureDirAppData(dir);

    return dir;
}

export async function writeMarkdownFile(dir: string, fileName: string, content: string) {
    const filePath = await join(dir, fileName);

    await writeTextFile(filePath, content, { baseDir: BaseDirectory.AppData });

    return filePath;
}

export async function readMarkdownFile(dir: string, fileName: string) {
    const filePath = await join(dir, fileName);

    return await readTextFile(filePath, { baseDir: BaseDirectory.AppData });
}

export async function listFiles(dir: string) {
    return await readDir(dir, { baseDir: BaseDirectory.AppData });
}

export async function deleteFile(dir: string, fileName: string) {
    const filePath = await join(dir, fileName);

    await remove(filePath, { baseDir: BaseDirectory.AppData });
}

export async function fileExists(dir: string, fileName: string) {
    const filePath = await join(dir, fileName);

    return await exists(filePath, { baseDir: BaseDirectory.AppData });
}

async function findProjectRoot(): Promise<string | null> {
    // Ascend up to 8 levels from the runtime working directory to find a package.json
    let current = '.';

    for (let i = 0; i < 8; i++) {
        try {
            const candidatePkg = await join(current, 'package.json');

            if (await exists(candidatePkg)) {
                return current;
            }
        } catch {
            /* ignore */
        }
        current = await join(current, '..');
    }

    return null;
}
