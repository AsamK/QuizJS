import type { IGameState, IQuizState } from './interfaces/IAppStore';
import type { IQuestion } from './interfaces/IQuestion';

export function getGameStateOrDefault(state: Map<number, IGameState>, gameId?: number | null): IGameState {
    const s = gameId == null ? null : state.get(gameId);
    if (s) {
        return s;
    }

    return getDefaultGameState();
}

export function getDefaultGameState(): IGameState {
    return {
        answeredTimestamp: null,
        current_answers_length: 0,
        firstShownTimestamp: null,
        pendingAnswers: [],
        pendingQuestionTypes: [],
        pendingSelectedAnswer: null,
        pendingSelectedQuestionType: null,
        selectedCategoryIndex: null,
    };
}

export function getQuizStateOrDefault(state: Map<string, IQuizState>, quizId?: string | null): IQuizState {
    const s = quizId == null ? null : state.get(quizId);
    if (s) {
        return s;
    }

    return getDefaultQuizState();
}

export function getDefaultQuizState(): IQuizState {
    return {
        answeredTimestamp: null,
        current_answers_length: 0,
        firstShownTimestamp: null,
        pendingAnswers: [],
    };
}

export function getOpponentAnswerIndexByPercentage(question: IQuestion): number {
    const stats = question.stats;
    let opponentAnswer = 0;
    let maxPercent = stats.correct_answer_percent;
    if (maxPercent < stats.wrong1_answer_percent) {
        opponentAnswer = 1;
        maxPercent = stats.wrong1_answer_percent;
    }
    if (maxPercent < stats.wrong2_answer_percent) {
        opponentAnswer = 2;
        maxPercent = stats.wrong2_answer_percent;
    }
    if (maxPercent < stats.wrong3_answer_percent) {
        opponentAnswer = 3;
        maxPercent = stats.wrong3_answer_percent;
    }
    return opponentAnswer;
}

export function immutableRemoveAtPosition<T>(array: T[], index: number): T[] {
    if (index < 0 || index >= array.length) {
        return array;
    }
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1),
    ];
}

export function immutableModifyAtPosition<T>(array: T[], index: number, fn: (old: T) => T): T[] {
    if (index < 0 || index >= array.length) {
        return array;
    }
    return [
        ...array.slice(0, index),
        fn(array[index]),
        ...array.slice(index + 1),
    ];
}

export function immutableReplaceAtPositionOrAppend<T>(array: T[], index: number, item: T): T[] {
    if (index < 0 || index >= array.length) {
        return [
            ...array,
            item,
        ];
    }
    return [
        ...array.slice(0, index),
        item,
        ...array.slice(index + 1),
    ];
}
