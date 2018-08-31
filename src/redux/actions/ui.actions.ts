import { QuestionType } from '../../api/IApiGame';
import { IAppAction } from '../interfaces/IAppAction';

export const COOKIE_LOADED = 'COOKIE_LOADED';

export const cookieLoaded = (cookie: string): IAppAction => ({
    cookie,
    type: COOKIE_LOADED,
});

export const SHOW_CREATE_NEW_GAME = 'SHOW_CREATE_NEW_GAME';

export const showCreateNewGame = (show = true): IAppAction => ({
    show,
    type: SHOW_CREATE_NEW_GAME,
});

export const SELECT_GAME = 'SELECT_GAME';

export const selectGame = (gameId: number | null): IAppAction => ({
    gameId,
    type: SELECT_GAME,
});

export const START_PLAYING = 'START_PLAYING';

export const startPlaying = (gameId: number, timestamp: number): IAppAction => ({
    gameId,
    timestamp,
    type: START_PLAYING,
});

export const STOP_PLAYING = 'STOP_PLAYING';

export const stopPlaying = (): IAppAction => ({
    type: STOP_PLAYING,
});

export const SELECT_CATEGORY = 'SELECT_CATEGORY';

export const selectCategory = (gameId: number, categoryId: number): IAppAction => ({
    categoryId,
    gameId,
    type: SELECT_CATEGORY,
});

export const SELECT_ANSWER = 'SELECT_ANSWER';

export const selectAnswer = (gameId: number, answerIndex: number, questionType: QuestionType, timestamp: number): IAppAction => ({
    answerIndex,
    gameId,
    questionType,
    timestamp,
    type: SELECT_ANSWER,
});

export const NEXT_QUESTION = 'NEXT_QUESTION';

export const nextQuestion = (gameId: number, timestamp: number): IAppAction => ({
    gameId,
    timestamp,
    type: NEXT_QUESTION,
});

export const FINISH_ROUND = 'FINISH_ROUND';

export const finishRound = (gameId: number): IAppAction => ({
    gameId,
    type: FINISH_ROUND,
});
