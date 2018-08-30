import { IApiGame } from '../../api/IApiGame';
import { IApiQuestion } from '../../api/IApiQuestion';
import { ADD_FRIEND_RESPONSE, APP_DATA_RESPONSE, CREATE_GAME_RESPONSE, DECLINE_GAME_RESPONSE, FIND_USER_ERROR, FIND_USER_RESPONSE, GIVE_UP_GAME_RESPONSE, LOAD_GAME_RESPONSE, LOAD_GAMES_RESPONSE, LOGIN_RESPONSE, REMOVE_FRIEND_RESPONSE, UPLOAD_ROUND_RESPONSE } from '../actions/entities.actions';
import { IAppAction } from '../interfaces/IAppAction';
import { ICategory } from '../interfaces/ICategory';
import { IGame } from '../interfaces/IGame';
import { IOpponent } from '../interfaces/IOpponent';
import { IQuestion } from '../interfaces/IQuestion';
import { IUser } from '../interfaces/IUser';
import { immutableModifyAtPosition, immutableReplaceAtPositionOrAppend } from '../utils';

export function user(state: IUser | null = null, action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE:
        case LOGIN_RESPONSE:
            return action.response.user;
        default:
            return state;
    }
}

export function friends(state: IUser[] = [], action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE:
        case LOGIN_RESPONSE:
            const userFriends = action.response.user.friends;
            if (!userFriends) {
                return state;
            }

            return userFriends;
        case ADD_FRIEND_RESPONSE:
            if (state.find(f => f.user_id === action.userId)) {
                // Prevent dupliate entry
                return state;
            }
            return [
                ...state,
                {
                    avatar_code: null,
                    blocked: null,
                    board_game_player: false,
                    email: null,
                    enough_questions: true,
                    name: action.name,
                    only_chat_with_friends: false,
                    q_reviewer: 0,
                    qc: false,
                    show_gift: false,
                    user_id: action.userId,
                },
            ];
        case REMOVE_FRIEND_RESPONSE: {
            return state.filter(f => f.user_id !== action.userId);
        }
        default:
            return state;
    }
}

export function foundUser(state: IOpponent | null = null, action: IAppAction): typeof state {
    switch (action.type) {
        case FIND_USER_RESPONSE:
            return action.response.qdOpponent;
        case FIND_USER_ERROR:
            return null;
        default:
            return state;
    }
}

const mapApiGameToGame = (game: IApiGame): IGame => ({
    cat_choices: game.cat_choices,
    game_id: game.game_id,
    give_up_player_id: game.give_up_player_id,
    is_image_question_disabled: game.is_image_question_disabled,
    mode: game.mode,
    nounce: game.nounce,
    opponent: game.opponent,
    opponent_answers: game.opponent_answers,
    opponent_question_types: game.opponent_question_types,
    rating_bonus: game.rating_bonus,
    state: game.state,
    timestamp: (Math.round(Date.now() / 60 / 1000) - game.elapsed_min) * 60 * 1000,
    you_gave_up: game.you_gave_up,
    your_answers: game.your_answers,
    your_question_types: game.your_question_types,
    your_turn: game.your_turn,
});

export function games(state: IGame[] = [], action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE:
        case LOGIN_RESPONSE: {
            return action.response.user.games
                .map(mapApiGameToGame);
        }
        case CREATE_GAME_RESPONSE:
        case LOAD_GAME_RESPONSE:
        case GIVE_UP_GAME_RESPONSE:
        case UPLOAD_ROUND_RESPONSE: {
            const game = action.response.game;
            const index = state.findIndex(g => g.game_id === game.game_id);
            return immutableReplaceAtPositionOrAppend(state, index, mapApiGameToGame(game));
        }
        case LOAD_GAMES_RESPONSE: {
            let newState = state;
            action.response.games.forEach(game => {
                const index = newState.findIndex(g => g.game_id === game.game_id);
                newState = immutableModifyAtPosition(newState, index, oldGame => {
                    if (oldGame.your_answers.length > game.your_answers.length ||
                        oldGame.opponent_answers.length > game.opponent_answers.length) {
                        return oldGame;
                    }
                    return mapApiGameToGame(game);
                });
            });
            return newState;
        }
        case DECLINE_GAME_RESPONSE: {
            if (!action.response.t) {
                return state;
            }
            return state.filter(g => g.game_id !== action.gameId);
        }

        default:
            return state;
    }
}

export function gameQuestions(state: Map<number, number[]> = new Map(), action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE: {
            let result: typeof state | undefined;
            action.response.user.games
                .forEach(game => {
                    if (game.questions.length === 0) {
                        return;
                    }
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(game.game_id, game.questions.map(q => q.q_id));
                });
            return result || state;
        }
        case CREATE_GAME_RESPONSE:
        case LOAD_GAME_RESPONSE:
        case UPLOAD_ROUND_RESPONSE: {
            const game = action.response.game;
            if (game.questions.length === 0) {
                return state;
            }
            const result = new Map(state);
            result.set(game.game_id, game.questions.map(q => q.q_id));
            return result;
        }
        case LOAD_GAMES_RESPONSE: {
            let result: typeof state | undefined;
            action.response.games
                .forEach(game => {
                    if (game.questions.length === 0) {
                        return;
                    }
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(game.game_id, game.questions.map(q => q.q_id));
                });
            return result || state;
        }
        default:
            return state;
    }
}

export function gameImageQuestions(state: Map<number, Map<number, number>> = new Map(), action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE: {
            let result: typeof state | undefined;
            action.response.user.games
                .forEach(game => {
                    if (game.image_questions.length === 0) {
                        return;
                    }
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(game.game_id, game.image_questions.reduce((map, q) => map.set(q.index, q.question.q_id), new Map()));
                });
            return result || state;
        }
        case CREATE_GAME_RESPONSE:
        case LOAD_GAME_RESPONSE:
        case UPLOAD_ROUND_RESPONSE: {
            const game = action.response.game;
            if (game.image_questions.length === 0) {
                return state;
            }
            const result = new Map(state);
            result.set(game.game_id, game.image_questions.reduce((map, q) => map.set(q.index, q.question.q_id), new Map()));
            return result;
        }
        case LOAD_GAMES_RESPONSE: {
            let result: typeof state | undefined;
            action.response.games
                .forEach(game => {
                    if (game.image_questions.length === 0) {
                        return;
                    }
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(game.game_id, game.image_questions.reduce((map, q) => map.set(q.index, q.question.q_id), new Map()));
                });
            return result || state;
        }
        default:
            return state;
    }
}

const mapApiQuestionToQuestion = (question: IApiQuestion): IQuestion => ({
    answer_time: question.answer_time,
    cat_id: question.cat_id,
    correct: question.correct,
    expires: question.expires,
    extra_explanation: question.extra_explanation,
    image_url: question.image_url,
    q_id: question.q_id,
    question: question.question,
    stats: question.stats,
    timestamp: new Date(question.timestamp).getTime(),
    wrong1: question.wrong1,
    wrong2: question.wrong2,
    wrong3: question.wrong3,
});

export function questions(state: Map<number, IQuestion> = new Map(), action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE: {
            let result: typeof state | undefined;
            action.response.user.games.forEach(game => {
                const questionHandlerFn = (question: IApiQuestion) => {
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(question.q_id, mapApiQuestionToQuestion(question));
                };
                game.questions.forEach(questionHandlerFn);
                game.image_questions.forEach(q => questionHandlerFn(q.question));
            });
            return result || state;
        }
        case CREATE_GAME_RESPONSE:
        case LOAD_GAME_RESPONSE:
        case UPLOAD_ROUND_RESPONSE: {
            const game = action.response.game;
            if (game.questions.length === 0) {
                return state;
            }
            const result = new Map(state);
            game.questions.forEach(question => {
                result.set(question.q_id, mapApiQuestionToQuestion(question));
            });
            game.image_questions.forEach(q => {
                const question = q.question;
                result.set(question.q_id, mapApiQuestionToQuestion(question));
            });
            return result;
        }
        case LOAD_GAMES_RESPONSE: {
            let result: typeof state | undefined;
            action.response.games.forEach(game => {
                const questionHandlerFn = (question: IApiQuestion) => {
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(question.q_id, mapApiQuestionToQuestion(question));
                };
                game.questions.forEach(questionHandlerFn);
                game.image_questions.forEach(q => questionHandlerFn(q.question));
            });
            return result || state;
        }
        default:
            return state;
    }
}

export function categories(state: Map<number, ICategory> = new Map(), action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE: {
            let result: typeof state | undefined;
            action.response.user.games.forEach(game => {
                game.questions.forEach(question => {
                    if (state.has(question.cat_id) || (result && result.has(question.cat_id))) {
                        // Categories don't change, so we don't have to update here
                        return;
                    }
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(question.cat_id, question.category);
                });
            });
            return result || state;
        }
        case CREATE_GAME_RESPONSE:
        case LOAD_GAME_RESPONSE:
        case UPLOAD_ROUND_RESPONSE: {
            const game = action.response.game;
            if (game.questions.length === 0) {
                return state;
            }
            let result: typeof state | undefined;
            game.questions.forEach(question => {
                if (state.has(question.cat_id) || (result && result.has(question.cat_id))) {
                    // Categories don't change, so we don't have to update here
                    return;
                }
                if (!result) {
                    result = new Map(state);
                }
                result.set(question.cat_id, question.category);
            });
            return result || state;
        }
        case LOAD_GAMES_RESPONSE: {
            let result: typeof state | undefined;
            action.response.games.forEach(game => {
                game.questions.forEach(question => {
                    if (state.has(question.cat_id) || (result && result.has(question.cat_id))) {
                        // Categories don't change, so we don't have to update here
                        return;
                    }
                    if (!result) {
                        result = new Map(state);
                    }
                    result.set(question.cat_id, question.category);
                });
            });
            return result || state;
        }
        default:
            return state;
    }
}
