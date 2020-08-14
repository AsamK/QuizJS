import { appDataAction, createGameAction, createUserAction, declineGameAction, loadGameAction, loadGamesAction, loadQuizAction, loginAction, uploadQuizRoundAction, uploadRoundAction } from '../actions/entities.actions';
import { COOKIE_LOADED, FINISH_ROUND, FINISH_ROUND_QUIZ, INITIAL_GAME_STATE, INITIAL_QUIZ_STATE, NEXT_QUESTION, NEXT_QUESTION_QUIZ, SELECT_ANSWER, SELECT_ANSWER_QUIZ, SELECT_CATEGORY, SELECT_GAME, SELECT_QUIZ, SHOW_CREATE_NEW_GAME, SHOW_PROFILE, START_PLAYING, START_PLAYING_QUIZ, STOP_PLAYING } from '../actions/ui.actions';
import { AppAction } from '../interfaces/AppAction';
import { IGameState, IQuizState } from '../interfaces/IAppStore';
import { getDefaultGameState, getDefaultQuizState, getGameStateOrDefault, getQuizStateOrDefault } from '../utils';

export function loggedIn(state = false, action: AppAction): typeof state {
    switch (action.type) {
        case COOKIE_LOADED:
        case loginAction.RESPONSE:
        case createUserAction.RESPONSE:
            return true;
        default:
            return state;
    }
}

export function showCreateNewGame(state = false, action: AppAction): typeof state {
    switch (action.type) {
        case SHOW_CREATE_NEW_GAME:
            return action.show;
        case createGameAction.REQUEST:
            return false;
        default:
            return state;
    }
}

export function showProfile(state = false, action: AppAction): typeof state {
    switch (action.type) {
        case SHOW_PROFILE:
            return action.show;
        default:
            return state;
    }
}

export function selectedGameId(state: number | null = null, action: AppAction): typeof state {
    switch (action.type) {
        case SELECT_GAME:
            return action.gameId;
        case declineGameAction.RESPONSE: {
            const gameId = Number(action.requestId);
            if (state === gameId) {
                return null;
            }
            return state;
        }
        default:
            return state;
    }
}

export function selectedQuizId(state: string | null = null, action: AppAction): typeof state {
    switch (action.type) {
        case SELECT_QUIZ:
            return action.quizId;
        default:
            return state;
    }
}

export function isPlaying(state = false, action: AppAction): typeof state {
    switch (action.type) {
        case START_PLAYING:
        case START_PLAYING_QUIZ:
            return true;
        case SELECT_GAME:
        case SELECT_QUIZ:
        case STOP_PLAYING:
        case FINISH_ROUND:
        case FINISH_ROUND_QUIZ:
            return false;
        default:
            return state;
    }
}

export function showAnswer(state = false, action: AppAction): typeof state {
    switch (action.type) {
        case SELECT_QUIZ:
        case NEXT_QUESTION_QUIZ:
        case FINISH_ROUND_QUIZ:
            return false;
        case SELECT_ANSWER_QUIZ:
            return true;
        default:
            return state;
    }
}

export function gameState(state: Map<number, IGameState> = new Map(), action: AppAction): typeof state {
    switch (action.type) {
        case INITIAL_GAME_STATE: {
            return new Map(action.gameStates);
        }
        case SELECT_CATEGORY: {
            const newState = new Map(state);
            newState.set(action.gameId, {
                ...getGameStateOrDefault(state, action.gameId),
                answeredTimestamp: null,
                firstShownTimestamp: action.timestamp,
                selectedCategoryIndex: action.categoryId,
            });
            return newState;
        }
        case SELECT_ANSWER: {
            const newState = new Map(state);
            const prev = getGameStateOrDefault(state, action.gameId);
            newState.set(action.gameId, {
                ...prev,
                answeredTimestamp: action.timestamp,
                pendingSelectedAnswer: action.answerIndex,
                pendingSelectedQuestionType: action.questionType,
            });
            return newState;
        }
        case NEXT_QUESTION: {
            const prev = getGameStateOrDefault(state, action.gameId);
            if (prev.pendingSelectedAnswer == null || prev.pendingSelectedQuestionType == null) {
                console.error('Invalid state, next called while pendingSelectedAnswer was null');
                return state;
            }

            const newState = new Map(state);
            newState.set(action.gameId, {
                ...prev,
                answeredTimestamp: null,
                firstShownTimestamp: action.timestamp,
                pendingAnswers: [...prev.pendingAnswers, prev.pendingSelectedAnswer],
                pendingQuestionTypes: [...prev.pendingQuestionTypes, prev.pendingSelectedQuestionType],
                pendingSelectedAnswer: null,
                pendingSelectedQuestionType: null,
            });
            return newState;
        }
        case FINISH_ROUND: {
            const prev = getGameStateOrDefault(state, action.gameId);
            if (prev.pendingSelectedAnswer == null || prev.pendingSelectedQuestionType == null) {
                console.error('Invalid state, finish called while pendingSelectedAnswer was null');
                return state;
            }

            const newState = new Map(state);
            newState.set(action.gameId, {
                ...prev,
                pendingAnswers: [...prev.pendingAnswers, prev.pendingSelectedAnswer],
                pendingQuestionTypes: [...prev.pendingQuestionTypes, prev.pendingSelectedQuestionType],
                pendingSelectedAnswer: null,
                pendingSelectedQuestionType: null,
            });
            return newState;
        }
        case START_PLAYING: {
            const newState = new Map(state);
            const prev = getGameStateOrDefault(state, action.gameId);
            if (prev.firstShownTimestamp != null && prev.answeredTimestamp == null) {
                return state;
            }
            newState.set(action.gameId, {
                ...prev,
                answeredTimestamp: null,
                firstShownTimestamp: action.timestamp,
            });
            return newState;
        }
        case uploadRoundAction.RESPONSE: {
            const newState = new Map(state);
            newState.delete(action.response.game.game_id);
            return newState;
        }
        case loadGameAction.RESPONSE: {
            const game = action.response.game;
            const prev = state.get(game.game_id);
            if (prev && prev.current_answers_length === game.your_answers.length) {
                return state;
            }
            const newState = new Map(state);
            newState.set(game.game_id, {
                ...getDefaultGameState(),
                current_answers_length: game.your_answers.length,
            });
            return newState;
        }
        case loadGamesAction.RESPONSE:
        case appDataAction.RESPONSE: {
            let newState: typeof state | undefined;
            const response = action.response;
            const games = 'games' in response ? response.games : response.user.games;
            games.forEach(game => {
                const prev = state.get(game.game_id);
                if (prev && prev.current_answers_length === game.your_answers.length) {
                    return;
                }
                if (!newState) {
                    newState = new Map(state);
                }
                newState.set(game.game_id, {
                    ...getDefaultGameState(),
                    current_answers_length: game.your_answers.length,
                });
                return newState;
            });
            return newState || state;
        }
        default:
            return state;
    }
}

export function quizState(state: Map<string, IQuizState> = new Map(), action: AppAction): typeof state {
    switch (action.type) {
        case INITIAL_QUIZ_STATE: {
            return new Map(action.quizStates);
        }
        case SELECT_ANSWER_QUIZ: {
            const newState = new Map(state);
            const prev = getQuizStateOrDefault(state, action.quizId);
            newState.set(action.quizId, {
                ...prev,
                answeredTimestamp: action.timestamp,
                pendingAnswers: [...prev.pendingAnswers, {
                    answer: action.answerIndex,
                    time: prev.firstShownTimestamp == null ? 0 : (action.timestamp - prev.firstShownTimestamp) / 1000,
                    timestamp: action.timestamp,
                }],
            });
            return newState;
        }
        case NEXT_QUESTION_QUIZ: {
            const newState = new Map(state);
            const prev = getQuizStateOrDefault(state, action.quizId);
            newState.set(action.quizId, {
                ...prev,
                answeredTimestamp: null,
                firstShownTimestamp: action.timestamp,
            });
            return newState;
        }
        case START_PLAYING_QUIZ: {
            const newState = new Map(state);
            const prev = getQuizStateOrDefault(state, action.quizId);
            if (prev.firstShownTimestamp != null && prev.answeredTimestamp == null) {
                return state;
            }
            newState.set(action.quizId, {
                ...prev,
                answeredTimestamp: null,
                firstShownTimestamp: action.timestamp,
            });
            return newState;
        }
        case uploadQuizRoundAction.RESPONSE: {
            const newState = new Map(state);
            newState.delete(action.response.quiz.quiz_id);
            return newState;
        }
        case loadQuizAction.RESPONSE: {
            const quiz = action.response.quiz;
            const prev = state.get(quiz.quiz_id);
            if (prev && prev.current_answers_length === quiz.your_answers.answers.length) {
                return state;
            }
            const newState = new Map(state);
            newState.set(quiz.quiz_id, {
                ...getDefaultQuizState(),
                current_answers_length: quiz.your_answers.answers.length,
            });
            return newState;
        }
        case appDataAction.RESPONSE: {
            let newState: typeof state | undefined;
            const response = action.response;
            const quizs = response.user.quizzes;
            quizs.forEach(quiz => {
                const prev = state.get(quiz.quiz_id);
                if (prev && prev.current_answers_length === quiz.your_answers.answers.length) {
                    return;
                }
                if (!newState) {
                    newState = new Map(state);
                }
                newState.set(quiz.quiz_id, {
                    ...getDefaultQuizState(),
                    current_answers_length: quiz.your_answers.answers.length,
                });
                return newState;
            });
            return newState || state;
        }
        default:
            return state;
    }
}
