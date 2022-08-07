import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

import type { BackendRequestFn } from '../api/api';
import {
    apiAddFriend,
    apiCreateGame,
    apiCreateRandomGame,
    apiCreateUser,
    apiDeclineGame,
    apiFindUser,
    apiGiveUpGame,
    apiLogin,
    apiRemoveFriend,
    apiRequestGames,
    apiRequestGameStats,
    apiRequestQuiz,
    apiRequestState,
    apiRequestStats,
    apiRequestUploadQuizRound,
    apiRequestUploadRound,
    apiSendMessage,
    apiUpdateUser,
} from '../api/api';
import { QuestionType } from '../api/IApiGame';
import type { IApiPopup } from '../api/IApiPopup';
import { CATEGORIES_PER_ROUND, QUESTIONS_PER_ROUND, STORAGE_KEY_COOKIE } from '../consts';
import { createRequestFn, QD_SERVER } from '../settings';

import {
    addFriendAction,
    appDataAction,
    createGameAction,
    createUserAction,
    declineGameAction,
    findUserAction,
    giveUpGameAction,
    loadGamesAction,
    loadGameStatsAction,
    loadQuizAction,
    loadStatsAction,
    loginAction,
    removeFriendAction,
    sendGameMessageAction,
    updateUserAction,
    uploadQuizRoundAction,
    uploadRoundAction,
} from './actions/entities.actions';
import type { ActionType } from './actions/requests.utils';
import {
    finishRound,
    finishRoundQuiz,
    nextQuestion,
    nextQuestionQuiz,
    selectAnswer,
    selectAnswerQuiz,
    selectCategory,
} from './actions/ui.actions';
import type { AppAction } from './interfaces/AppAction';
import type { IAppStore } from './interfaces/IAppStore';
import {
    selectedGameIdSelector,
    selectedGameQuestionSelector,
    selectedGameQuestionsSelector,
    selectedGameSelector,
    selectedGameStateSelector,
    selectedQuizIdSelector,
    selectedQuizQuestionsSelector,
    selectedQuizSelector,
    selectedQuizStateSelector,
    showAnswerSelector,
} from './selectors/ui.selectors';
import { extraThunkArgument } from './store';

export interface IExtraArgument {
    requestFn: BackendRequestFn;
}

export type AppThunkAction<R = void> = ThunkAction<R, IAppStore, IExtraArgument, AppAction>;
export type AppThunkDispatch = ThunkDispatch<IAppStore, IExtraArgument, AppAction>;

function showPopup(popup: IApiPopup): void {
    // TODO Show some overlay instead of a modal alert
    alert(popup.popup_title + '\n' + popup.popup_mess);
}

/**
 *
 * @param possiblePopup
 * @returns true, if popup was handled and result should be skipped, otherwise false
 */
function handlePopup(possiblePopup: IApiPopup | { popup: IApiPopup } | object): boolean {
    if (!('popup_mess' in possiblePopup)) {
        if ('popup' in possiblePopup && possiblePopup.popup != null) {
            showPopup(possiblePopup.popup);
        }
        return false;
    }
    showPopup(possiblePopup);
    return !!possiblePopup.skip;
}

function requestHandleHelper<T extends object, R>(
    dispatch: AppThunkDispatch,
    oncompleted: (data: Exclude<T, IApiPopup>) => R,
): (data: T) => R | never {
    return data => {
        if (handlePopup(data)) {
            throw new Error();
        }
        return oncompleted(data as Exclude<T, IApiPopup>);
    };
}

function handleRequest<
    T extends object,
    REQUEST extends string,
    RESPONSE,
    ERROR,
    T5,
    REQUEST_INFO extends { id: string | number } | undefined,
>(
    dispatch: AppThunkDispatch,
    sendRequest: () => Promise<T>,
    action: ActionType<REQUEST, RESPONSE, ERROR, Exclude<T, IApiPopup>, T5, REQUEST_INFO>,
    requestInfo: REQUEST_INFO,
): Promise<T> {
    dispatch(action.createRequestAction(requestInfo) as unknown as AppAction);
    return sendRequest()
        .then(
            requestHandleHelper(dispatch, res => {
                dispatch(action.createResponseAction(res, requestInfo) as unknown as AppAction);
                return res;
            }),
        )
        .catch((e: Response) => {
            dispatch(
                action.createErrorAction('Request failed', requestInfo) as unknown as AppAction,
            );
            throw e;
        });
}

export function login(userName: string, password: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(
            dispatch,
            () =>
                apiLogin(requestFn, userName, QD_SERVER.passwordSalt, password).then(res => {
                    if (handlePopup(res)) {
                        throw res;
                    }
                    if ('cookie' in res) {
                        localStorage.setItem(STORAGE_KEY_COOKIE, res.cookie);
                        extraThunkArgument.requestFn = createRequestFn(QD_SERVER.host, res.cookie);
                        return res.body;
                    }
                    throw res;
                }),
            loginAction,
            undefined,
        );
    };
}

export function loadData(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiRequestState(requestFn), appDataAction, undefined);
    };
}

export function loadGame(gameId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiRequestGames(requestFn, [gameId]), loadGamesAction, {
            id: gameId,
        });
    };
}

export function loadQuiz(quizId: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiRequestQuiz(requestFn, quizId), loadQuizAction, {
            id: quizId,
        });
    };
}

export function createUser(name: string, email: string, password: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(
            dispatch,
            () =>
                apiCreateUser(requestFn, name, email, QD_SERVER.passwordSalt, password).then(
                    res => {
                        if ('cookie' in res) {
                            localStorage.setItem(STORAGE_KEY_COOKIE, res.cookie);
                            extraThunkArgument.requestFn = createRequestFn(
                                QD_SERVER.host,
                                res.cookie,
                            );
                            return res.body;
                        } else {
                            throw res;
                        }
                    },
                ),
            createUserAction,
            undefined,
        );
    };
}

export function updateUser(name: string, email: string, password: string | null): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(
            dispatch,
            () => apiUpdateUser(requestFn, name, email, QD_SERVER.passwordSalt, password),
            updateUserAction,
            undefined,
        );
    };
}

export function addFriend(userId: string, name = ''): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiAddFriend(requestFn, userId), addFriendAction, {
            id: userId,
            name,
        });
    };
}

export function removeFriend(userId: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiRemoveFriend(requestFn, userId), removeFriendAction, {
            id: userId,
        });
    };
}

export function createRandomGame(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiCreateRandomGame(requestFn), createGameAction, undefined);
    };
}

export function createGame(userId: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiCreateGame(requestFn, userId), createGameAction, {
            id: userId,
        });
    };
}

export function declineGame(gameId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiDeclineGame(requestFn, gameId), declineGameAction, {
            id: gameId,
        });
    };
}

export function giveUpGame(gameId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiGiveUpGame(requestFn, gameId), giveUpGameAction, {
            id: gameId,
        });
    };
}

export function sendMessageForGame(gameId: number, message: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(
            dispatch,
            () => apiSendMessage(requestFn, gameId, message),
            sendGameMessageAction,
            { id: gameId, message },
        );
    };
}

export function uploadRoundForSelectedGame(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        const state = getState();
        const game = selectedGameSelector(state);
        const questions = selectedGameQuestionsSelector(state);
        if (game == null || questions == null) {
            return;
        }

        const gameState = selectedGameStateSelector(state);

        const pendingAnswers =
            gameState.pendingSelectedAnswer === null
                ? gameState.pendingAnswers
                : [...gameState.pendingAnswers, gameState.pendingSelectedAnswer];

        const pendingQuestionTypes =
            gameState.pendingSelectedQuestionType === null
                ? gameState.pendingQuestionTypes
                : [...gameState.pendingQuestionTypes, gameState.pendingSelectedQuestionType];

        handleRequest(
            dispatch,
            () =>
                apiRequestUploadRound(
                    requestFn,
                    game.game_id,
                    0,
                    gameState.selectedCategoryIndex || 0,
                    [...game.your_answers, ...pendingAnswers],
                    [...game.your_question_types, ...pendingQuestionTypes],
                ),
            uploadRoundAction,
            { id: game.game_id },
        );
    };
}

export function selectCategoryForSelectedGame(categoryId: number): AppThunkAction {
    return (dispatch, getState) => {
        const gameId = selectedGameIdSelector(getState());
        if (gameId == null) {
            return;
        }
        dispatch(selectCategory(gameId, categoryId, Date.now()));
    };
}

export function selectAnswerForSelectedGame(answerIndex: number): AppThunkAction {
    return (dispatch, getState) => {
        const state = getState();
        const gameId = selectedGameIdSelector(state);
        const gameState = selectedGameStateSelector(state);
        if (gameState.pendingSelectedAnswer != null || gameId == null) {
            return;
        }

        const question = selectedGameQuestionSelector(state);
        const questionType =
            !question || !question.image_url ? QuestionType.NORMAL : QuestionType.IMAGE;
        dispatch(selectAnswer(gameId, answerIndex, questionType, Date.now()));
    };
}

export function nextQuestionSelectedGame(): AppThunkAction {
    return (dispatch, getState) => {
        const state = getState();
        const gameId = selectedGameIdSelector(state);
        const game = selectedGameSelector(state);
        const questions = selectedGameQuestionsSelector(state);
        const gameState = selectedGameStateSelector(state);
        if (
            gameState.pendingSelectedAnswer == null ||
            gameId == null ||
            game == null ||
            questions == null
        ) {
            return;
        }

        const pendingAnswersLength = gameState.pendingAnswers.length + 1;

        if (
            game.opponent_answers.length + QUESTIONS_PER_ROUND <=
                game.your_answers.length + pendingAnswersLength ||
            game.your_answers.length + pendingAnswersLength >=
                questions.length / CATEGORIES_PER_ROUND
        ) {
            dispatch(uploadRoundForSelectedGame());
            dispatch(finishRound(gameId));
        } else if (pendingAnswersLength % QUESTIONS_PER_ROUND === 0) {
            dispatch(finishRound(gameId));
        } else {
            dispatch(nextQuestion(gameId, Date.now()));
        }
    };
}

export function uploadRoundForSelectedQuiz(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        const state = getState();
        const quiz = selectedQuizSelector(state);
        if (!showAnswerSelector(state) || quiz == null) {
            return;
        }

        const gameState = selectedQuizStateSelector(state);
        handleRequest(
            dispatch,
            () =>
                apiRequestUploadQuizRound(
                    requestFn,
                    quiz.quiz_id,
                    [...quiz.your_answers.answers, ...gameState.pendingAnswers].map(a => ({
                        answer: a.answer,
                        time: a.time,
                        timestamp: new Date(a.timestamp).toISOString(),
                    })),
                ),
            uploadQuizRoundAction,
            { id: quiz.quiz_id },
        );
    };
}

export function nextQuestionSelectedQuiz(): AppThunkAction {
    return (dispatch, getState) => {
        const state = getState();
        const quizId = selectedQuizIdSelector(state);
        const quiz = selectedQuizSelector(state);
        const questions = selectedQuizQuestionsSelector(state);
        if (!showAnswerSelector(state) || quizId == null || quiz == null || questions == null) {
            return;
        }

        const quizState = selectedQuizStateSelector(state);

        if (QUESTIONS_PER_ROUND <= quizState.pendingAnswers.length) {
            dispatch(uploadRoundForSelectedQuiz());
            dispatch(finishRoundQuiz(quizId));
        } else if (quizState.pendingAnswers.length % QUESTIONS_PER_ROUND === 0) {
            dispatch(finishRoundQuiz(quizId));
        } else {
            dispatch(nextQuestionQuiz(quizId, Date.now()));
        }
    };
}
export function selectAnswerForSelectedQuiz(answerIndex: number): AppThunkAction {
    return (dispatch, getState) => {
        const state = getState();
        const quizId = selectedQuizIdSelector(state);
        if (showAnswerSelector(state) || quizId == null) {
            return;
        }

        dispatch(selectAnswerQuiz(quizId, answerIndex, Date.now()));
    };
}

export function searchUser(name: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiFindUser(requestFn, name), findUserAction, { id: name });
    };
}

export function loadUserStats(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(dispatch, () => apiRequestStats(requestFn), loadStatsAction, undefined);
    };
}

export function loadFriendStats(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        handleRequest(
            dispatch,
            () => apiRequestGameStats(requestFn),
            loadGameStatsAction,
            undefined,
        );
    };
}
