import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiAddFriend, apiCreateGame, apiCreateRandomGame, apiCreateUser, apiDeclineGame, apiFindUser, apiGiveUpGame, apiLogin, apiRemoveFriend, apiRequestGames, apiRequestQuiz, apiRequestState, apiRequestUploadQuizRound, apiRequestUploadRound, apiUpdateUser, BackendRequestFn } from '../api/api';
import { QuestionType } from '../api/IApiGame';
import { IApiPopup } from '../api/IApiPopup';
import { CATEGORIES_PER_ROUND, QUESTIONS_PER_ROUND, STORAGE_KEY_COOKIE } from '../consts';
import { createRequestFn, extraThunkArgument, QD_SERVER } from '../settings';
import { addFriendError, addFriendRequest, addFriendResponse, createGameError, createGameRequest, createGameResponse, createUserError, createUserRequest, createUserResponse, declineGameError, declineGameRequest, declineGameResponse, findUserError, findUserRequest, findUserResponse, giveUpGameError, giveUpGameRequest, giveUpGameResponse, loadGamesError, loadGamesRequest, loadGamesResponse, loadQuizError, loadQuizRequest, loadQuizResponse, loginError, loginRequest, loginResponse, removeFriendError, removeFriendRequest, removeFriendResponse, stateError, stateRequest, stateResponse, updateUserError, updateUserRequest, updateUserResponse, uploadQuizRoundError, uploadQuizRoundRequest, uploadQuizRoundResponse, uploadRoundError, uploadRoundRequest, uploadRoundResponse } from './actions/entities.actions';
import { finishRound, finishRoundQuiz, nextQuestion, nextQuestionQuiz, selectAnswer, selectAnswerQuiz, selectCategory } from './actions/ui.actions';
import { IAppAction } from './interfaces/IAppAction';
import { IAppStore } from './interfaces/IAppStore';
import { selectedGameIdSelector, selectedGameQuestionSelector, selectedGameQuestionsSelector, selectedGameSelector, selectedGameStateSelector, selectedQuizIdSelector, selectedQuizQuestionsSelector, selectedQuizSelector, selectedQuizStateSelector, showAnswerSelector } from './selectors/ui.selectors';

export interface IExtraArgument {
    requestFn: BackendRequestFn;
}

export type AppThunkAction<R = void> = ThunkAction<R, IAppStore, IExtraArgument, IAppAction>;
export type AppThunkDispatch = ThunkDispatch<IAppStore, IExtraArgument, IAppAction>;

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
): (data: T) => R | undefined {
    return (data: T): R | undefined => {
        if (handlePopup(data)) {
            throw new Error();
        }
        return oncompleted(data as Exclude<T, IApiPopup>);
    };
}

export function login(userName: string, password: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(loginRequest());
        apiLogin(requestFn, userName, QD_SERVER.passwordSalt, password)
            .then(requestHandleHelper(dispatch, res => {
                if ('cookie' in res) {
                    localStorage.setItem(STORAGE_KEY_COOKIE, res.cookie);
                    extraThunkArgument.requestFn = createRequestFn(QD_SERVER.host, res.cookie);
                    dispatch(loginResponse(res.body));
                } else {
                    dispatch(loginError(res));
                }
            }))
            .catch(e => dispatch(loginError(e)));
    };
}

export function loadData(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(stateRequest());
        apiRequestState(requestFn)
            .then(requestHandleHelper(dispatch, state => {
                dispatch(stateResponse(state));
            }))
            .catch(e => dispatch(stateError(e)));
    };
}

export function loadGame(gameId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(loadGamesRequest());
        apiRequestGames(requestFn, [gameId])
            .then(requestHandleHelper(dispatch, state => {
                dispatch(loadGamesResponse(state));
            }))
            .catch(e => dispatch(loadGamesError(e)));
    };
}

export function loadQuiz(quizId: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(loadQuizRequest());
        apiRequestQuiz(requestFn, quizId)
            .then(requestHandleHelper(dispatch, state => {
                dispatch(loadQuizResponse(state));
            }))
            .catch(e => dispatch(loadQuizError(e)));
    };
}

export function createUser(name: string, email: string, password: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(createUserRequest());
        apiCreateUser(requestFn, name, email, QD_SERVER.passwordSalt, password)
            .then(res => {
                if ('cookie' in res) {
                    localStorage.setItem(STORAGE_KEY_COOKIE, res.cookie);
                    extraThunkArgument.requestFn = createRequestFn(QD_SERVER.host, res.cookie);
                    dispatch(createUserResponse(res.body));
                } else {
                    dispatch(createUserError(res));
                }
            })
            .catch(e => dispatch(createUserError(e)));
    };
}

export function updateUser(name: string, email: string, password: string | null): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(updateUserRequest());
        apiUpdateUser(requestFn, name, email, QD_SERVER.passwordSalt, password)
            .then(requestHandleHelper(dispatch, res => {
                dispatch(updateUserResponse(res));
            }))
            .catch(e => dispatch(updateUserError(e)));
    };
}

export function addFriend(userId: string, name = ''): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(addFriendRequest());
        apiAddFriend(requestFn, userId)
            .then(requestHandleHelper(dispatch, state => {
                // handlePopup(state);
                dispatch(addFriendResponse(userId, name));
            }))
            .catch(e => dispatch(addFriendError(e)));
    };
}

export function removeFriend(userId: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(removeFriendRequest());
        apiRemoveFriend(requestFn, userId)
            .then(requestHandleHelper(dispatch, state => {
                dispatch(removeFriendResponse(userId));
            }))
            .catch(e => dispatch(removeFriendError(e)));
    };
}

export function createRandomGame(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(createGameRequest());
        apiCreateRandomGame(requestFn)
            .then(requestHandleHelper(dispatch, response => {
                dispatch(createGameResponse(response));
            }))
            .catch(e => dispatch(createGameError(e)));
    };
}

export function createGame(userId: string): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(createGameRequest());
        apiCreateGame(requestFn, userId)
            .then(requestHandleHelper(dispatch, response => {
                dispatch(createGameResponse(response));
            }))
            .catch(e => dispatch(createGameError(e)));
    };
}

export function declineGame(gameId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(declineGameRequest());
        apiDeclineGame(requestFn, gameId)
            .then(requestHandleHelper(dispatch, response => {
                dispatch(declineGameResponse(gameId, response));
            }))
            .catch(e => dispatch(declineGameError(e)));
    };
}

export function giveUpGame(gameId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        dispatch(giveUpGameRequest());
        apiGiveUpGame(requestFn, gameId)
            .then(requestHandleHelper(dispatch, response => {
                dispatch(giveUpGameResponse(response));
            }))
            .catch(e => dispatch(giveUpGameError(e)));
    };
}

function uploadRoundForSelectedGame(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        const state = getState();
        const game = selectedGameSelector(state);
        const questions = selectedGameQuestionsSelector(state);
        if (!showAnswerSelector(state) || game == null || questions == null) {
            return;
        }

        const gameState = selectedGameStateSelector(state);
        dispatch(uploadRoundRequest());
        apiRequestUploadRound(requestFn, game.game_id, 0, gameState.selectedCategoryIndex || 0,
            [...game.your_answers, ...gameState.pendingAnswers], [...game.your_question_types, ...gameState.pendingQuestionTypes])
            .then(requestHandleHelper(dispatch, res => {
                dispatch(uploadRoundResponse(res));
            }))
            .catch(e => dispatch(uploadRoundError(e)));
    };
}

export function selectCategoryForSelectedGame(categoryId: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        const gameId = selectedGameIdSelector(getState());
        if (gameId == null) {
            return;
        }
        dispatch(selectCategory(gameId, categoryId, Date.now()));
    };
}

export function selectAnswerForSelectedGame(answerIndex: number): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        const state = getState();
        const gameId = selectedGameIdSelector(state);
        if (showAnswerSelector(state) || gameId == null) {
            return;
        }

        const question = selectedGameQuestionSelector(state);
        const questionType = !question || !question.image_url ? QuestionType.NORMAL : QuestionType.IMAGE;
        dispatch(selectAnswer(gameId, answerIndex, questionType, Date.now()));
    };
}

export function nextQuestionSelectedGame(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
        const state = getState();
        const gameId = selectedGameIdSelector(state);
        const game = selectedGameSelector(state);
        const questions = selectedGameQuestionsSelector(state);
        if (!showAnswerSelector(state) || gameId == null || game == null || questions == null) {
            return;
        }

        const gameState = selectedGameStateSelector(state);

        if (game.opponent_answers.length + QUESTIONS_PER_ROUND <= game.your_answers.length + gameState.pendingAnswers.length ||
            game.your_answers.length + gameState.pendingAnswers.length >= questions.length / CATEGORIES_PER_ROUND) {
            dispatch(uploadRoundForSelectedGame());
            dispatch(finishRound(gameId));
        } else if (gameState.pendingAnswers.length % QUESTIONS_PER_ROUND === 0) {
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
        dispatch(uploadQuizRoundRequest());
        apiRequestUploadQuizRound(requestFn, quiz.quiz_id,
            [...quiz.your_answers.answers, ...gameState.pendingAnswers].map(a => ({
                answer: a.answer,
                time: a.time,
                timestamp: new Date(a.timestamp).toISOString(),
            })))
            .then(requestHandleHelper(dispatch, res => {
                dispatch(uploadQuizRoundResponse(res));
            }))
            .catch(e => dispatch(uploadQuizRoundError(e)));
    };
}

export function nextQuestionSelectedQuiz(): AppThunkAction {
    return (dispatch, getState, { requestFn }) => {
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
    return (dispatch, getState, { requestFn }) => {
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
        dispatch(findUserRequest());
        apiFindUser(requestFn, name)
            .then(requestHandleHelper(dispatch, res => {
                dispatch(findUserResponse(res));
            }))
            .catch(e => dispatch(findUserError(e)));
    };
}
