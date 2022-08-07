import type { QuestionType } from '../../api/IApiGame';
import type { AppAction } from '../interfaces/AppAction';
import type { IGameState, IQuizState } from '../interfaces/IAppStore';

export const COOKIE_LOADED = 'COOKIE_LOADED';

export const cookieLoaded = (cookie: string): AppAction => ({
    cookie,
    type: COOKIE_LOADED,
});

export const SHOW_CREATE_NEW_GAME = 'SHOW_CREATE_NEW_GAME';

export const showCreateNewGame = (show = true): AppAction => ({
    show,
    type: SHOW_CREATE_NEW_GAME,
});

export const SHOW_PROFILE = 'SHOW_PROFILE';

export const showProfile = (show = true): AppAction => ({
    show,
    type: SHOW_PROFILE,
});

export const SELECT_GAME = 'SELECT_GAME';

export const selectGame = (gameId: number | null): AppAction => ({
    gameId,
    type: SELECT_GAME,
});

export const START_PLAYING = 'START_PLAYING';

export const startPlaying = (gameId: number, timestamp: number): AppAction => ({
    gameId,
    timestamp,
    type: START_PLAYING,
});

export const STOP_PLAYING = 'STOP_PLAYING';

export const stopPlaying = (): AppAction => ({
    type: STOP_PLAYING,
});

export const SELECT_CATEGORY = 'SELECT_CATEGORY';

export const selectCategory = (
    gameId: number,
    categoryId: number,
    timestamp: number,
): AppAction => ({
    categoryId,
    gameId,
    timestamp,
    type: SELECT_CATEGORY,
});

export const SELECT_ANSWER = 'SELECT_ANSWER';

export const selectAnswer = (
    gameId: number,
    answerIndex: number,
    questionType: QuestionType,
    timestamp: number,
): AppAction => ({
    answerIndex,
    gameId,
    questionType,
    timestamp,
    type: SELECT_ANSWER,
});

export const NEXT_QUESTION = 'NEXT_QUESTION';

export const nextQuestion = (gameId: number, timestamp: number): AppAction => ({
    gameId,
    timestamp,
    type: NEXT_QUESTION,
});

export const FINISH_ROUND = 'FINISH_ROUND';

export const finishRound = (gameId: number): AppAction => ({
    gameId,
    type: FINISH_ROUND,
});

export const SELECT_QUIZ = 'SELECT_QUIZ';

export const selectQuiz = (quizId: string | null): AppAction => ({
    quizId,
    type: SELECT_QUIZ,
});

export const START_PLAYING_QUIZ = 'START_PLAYING_QUIZ';

export const startPlayingQuiz = (quizId: string, timestamp: number): AppAction => ({
    quizId,
    timestamp,
    type: START_PLAYING_QUIZ,
});

export const SELECT_ANSWER_QUIZ = 'SELECT_ANSWER_QUIZ';

export const selectAnswerQuiz = (
    quizId: string,
    answerIndex: number,
    timestamp: number,
): AppAction => ({
    answerIndex,
    quizId,
    timestamp,
    type: SELECT_ANSWER_QUIZ,
});

export const NEXT_QUESTION_QUIZ = 'NEXT_QUESTION_QUIZ';

export const nextQuestionQuiz = (quizId: string, timestamp: number): AppAction => ({
    quizId,
    timestamp,
    type: NEXT_QUESTION_QUIZ,
});

export const FINISH_ROUND_QUIZ = 'FINISH_ROUND_QUIZ';

export const finishRoundQuiz = (quizId: string): AppAction => ({
    quizId,
    type: FINISH_ROUND_QUIZ,
});

export const INITIAL_GAME_STATE = 'INITIAL_GAME_STATE';

export const initialGameState = (gameStates: [[number, IGameState]]): AppAction => ({
    gameStates,
    type: INITIAL_GAME_STATE,
});

export const INITIAL_QUIZ_STATE = 'INITIAL_QUIZ_STATE';

export const initialQuizState = (quizStates: [[string, IQuizState]]): AppAction => ({
    quizStates,
    type: INITIAL_QUIZ_STATE,
});
