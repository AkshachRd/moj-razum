import { streamText, smoothStream } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

import { getSystemPrompt } from '../lib/prompts';

// Allow streaming responses up to 30 seconds
const maxDuration = 30;

const openrouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openrouterApiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

const openrouter = createOpenRouter({ apiKey: openrouterApiKey });
const model = openrouter('deepseek/deepseek-r1:free');

function smoothTextStream() {
    return smoothStream({
        chunking: 'word',
        delayInMs: 0,
    });
}

export async function POST(req: Request) {
    const { prompt }: { prompt: string } = await req.json();

    const result = streamText({
        model,
        system: getSystemPrompt(),
        prompt,
        experimental_transform: smoothTextStream(),
    });

    return result.toDataStreamResponse();
}
