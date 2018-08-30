import { IGameState } from './interfaces/IAppStore';

export function getGameStateOrDefault(state: Map<number, IGameState>, gameId?: number | null): IGameState {
    const s = gameId == null ? null : state.get(gameId);
    if (s) {
        return s;
    }

    return getDefaultGameState();
}

export function getDefaultGameState(): IGameState {
    return {
        current_answers_length: 0,
        pendingAnswers: [],
        pendingQuestionTypes: [],
        selectedCategoryIndex: null,
    };
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
