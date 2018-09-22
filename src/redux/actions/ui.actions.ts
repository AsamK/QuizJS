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

export const SHOW_PROFILE = 'SHOW_PROFILE';

export const showProfile = (show = true): IAppAction => ({
    show,
    type: SHOW_PROFILE,
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

export const selectCategory = (gameId: number, categoryId: number, timestamp: number): IAppAction => ({
    categoryId,
    gameId,
    timestamp,
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

export const SELECT_QUIZ = 'SELECT_QUIZ';

export const selectQuiz = (quizId: string | null): IAppAction => ({
    quizId,
    type: SELECT_QUIZ,
});

export const START_PLAYING_QUIZ = 'START_PLAYING_QUIZ';

export const startPlayingQuiz = (quizId: string, timestamp: number): IAppAction => ({
    quizId,
    timestamp,
    type: START_PLAYING_QUIZ,
});

export const SELECT_ANSWER_QUIZ = 'SELECT_ANSWER_QUIZ';

export const selectAnswerQuiz = (quizId: string, answerIndex: number, timestamp: number): IAppAction => ({
    answerIndex,
    quizId,
    timestamp,
    type: SELECT_ANSWER_QUIZ,
});

export const NEXT_QUESTION_QUIZ = 'NEXT_QUESTION_QUIZ';

export const nextQuestionQuiz = (quizId: string, timestamp: number): IAppAction => ({
    quizId,
    timestamp,
    type: NEXT_QUESTION_QUIZ,
});

export const FINISH_ROUND_QUIZ = 'FINISH_ROUND_QUIZ';

export const finishRoundQuiz = (quizId: string): IAppAction => ({
    quizId,
    type: FINISH_ROUND_QUIZ,
});
