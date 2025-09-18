'use server';

import { streamText, smoothStream } from 'ai';
import { createStreamableValue } from 'ai/rsc';

import { thinkingModel } from './models';
import { generatePrompt, getSystemPrompt } from './prompts';

import { getResponseLanguagePrompt } from '@/shared/ai/prompts';

function smoothTextStream() {
    return smoothStream({
        chunking: 'word',
        delayInMs: 0,
    });
}

export async function generateQuestions(
    question: string,
    language: string,
    onError: (error: unknown) => void,
) {
    const stream = createStreamableValue('');

    (async () => {
        const { textStream } = streamText({
            model: thinkingModel,
            system: getSystemPrompt(),
            prompt: [generatePrompt(question), getResponseLanguagePrompt(language)].join('\n\n'),
            experimental_transform: smoothTextStream(),
            onError,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}
