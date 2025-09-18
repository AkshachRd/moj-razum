'use client';

import { useState } from 'react';
import { addToast } from '@heroui/react';
import { readStreamableValue } from 'ai/rsc';

import { generateQuestions } from '../lib/generate-questions';
import { useTaskStore } from '../model/store';

import { parseError } from '@/shared/ai';

function removeJsonMarkdown(text: string) {
    text = text.trim();
    if (text.startsWith('```json')) {
        text = text.slice(7);
    } else if (text.startsWith('json')) {
        text = text.slice(4);
    } else if (text.startsWith('```')) {
        text = text.slice(3);
    }
    if (text.endsWith('```')) {
        text = text.slice(0, -3);
    }

    return text.trim();
}

export function handleError(error: unknown) {
    const errorMessage = parseError(error);

    addToast({
        title: 'Deep search error',
        description: errorMessage,
        color: 'danger',
    });
}

export function useDeepResearch() {
    const taskStore = useTaskStore();
    const [status, setStatus] = useState<string>('');

    async function askQuestions() {
        const { question } = useTaskStore.getState();

        setStatus('Thinking...');

        taskStore.setQuestion(question);

        let content = '';
        const { output } = await generateQuestions(question, 'english', handleError);

        for await (const delta of readStreamableValue(output)) {
            content = `${content}${delta}`;
            taskStore.updateQuestions(content);
        }
    }

    return {
        status,
        askQuestions,
    };
}
