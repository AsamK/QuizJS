import { IApiGame } from '../../api/IApiGame';
import { IApiQuestion } from '../../api/IApiQuestion';
import { IApiQuiz } from '../../api/IApiQuiz';
import { IApiQuizQuestion } from '../../api/IApiQuizQuestion';
import { ADD_FRIEND_RESPONSE, APP_DATA_RESPONSE, CREATE_GAME_RESPONSE, DECLINE_GAME_RESPONSE, FIND_USER_ERROR, FIND_USER_RESPONSE, GIVE_UP_GAME_RESPONSE, LOAD_GAME_RESPONSE, LOAD_GAMES_RESPONSE, LOAD_QUIZ_RESPONSE, LOGIN_RESPONSE, REMOVE_FRIEND_RESPONSE, UPDATE_USER_RESPONSE, UPLOAD_QUIZ_ROUND_RESPONSE, UPLOAD_ROUND_RESPONSE } from '../actions/entities.actions';
import { IAppAction } from '../interfaces/IAppAction';
import { ICategory } from '../interfaces/ICategory';
import { IGame } from '../interfaces/IGame';
import { IOpponent } from '../interfaces/IOpponent';
import { IQuestion } from '../interfaces/IQuestion';
import { IQuiz } from '../interfaces/IQuiz';
import { IUser } from '../interfaces/IUser';
import { immutableModifyAtPosition, immutableReplaceAtPositionOrAppend } from '../utils';

export function user(state: IUser | null = null, action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE:
        case LOGIN_RESPONSE:
            return action.response.user;
        case UPDATE_USER_RESPONSE:
            if (!state) {
                return state;
            }
            return {
                ...state,
                email: action.response.user.email,
                name: action.response.user.name,
            };
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
    timestamp: game.elapsed_min === 2880 ? null : (Math.floor(Date.now() / 60 / 1000) - game.elapsed_min) * 60 * 1000,
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
            const questionHandlerFn = (question: IApiQuestion) => {
                if (!result) {
                    result = new Map(state);
                }
                result.set(question.q_id, mapApiQuestionToQuestion(question));
            };
            action.response.user.games.forEach(game => {
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
const mapApiQuizToQuiz = (quiz: IApiQuiz): IQuiz => ({
    card_image: quiz.card_image,
    color: quiz.color,
    n_players: quiz.n_players,
    name: quiz.name,
    pub_daterange: quiz.pub_daterange,
    questions: quiz.questions.map(q => q.id),
    quiz_id: quiz.quiz_id,
    quiz_sponsor: quiz.quiz_sponsor,
    save_aggregated_stats: quiz.save_aggregated_stats,
    your_answers: {
        answers: quiz.your_answers.answers.map(a => ({
            answer: a.answer,
            time: a.time,
            timestamp: new Date(a.timestamp).getTime(),
        })),
        finish_date: quiz.your_answers.finish_date,
        give_up: quiz.your_answers.give_up,
    },
    your_ranking: quiz.your_ranking,
});

export function quizzes(state: IQuiz[] = [], action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE:
        case LOGIN_RESPONSE: {
            return action.response.user.quizzes
                .map(mapApiQuizToQuiz);
        }
        case UPLOAD_QUIZ_ROUND_RESPONSE:
        case LOAD_QUIZ_RESPONSE: {
            const newQuiz = mapApiQuizToQuiz(action.response.quiz);
            return immutableReplaceAtPositionOrAppend(state, state.findIndex(q => q.quiz_id === newQuiz.quiz_id), newQuiz);
        }
        default:
            return state;
    }
}
const mapApiQuizQuestionToQuestion = (question: IApiQuizQuestion): IQuestion => ({
    answer_time: 20,
    cat_id: question.category.cat_id,
    correct: question.correct,
    image_url: question.image ? question.image.url_xhdpi : undefined,
    q_id: question.id,
    question: question.question,
    stats: question.stats,
    wrong1: question.wrong1,
    wrong2: question.wrong2,
    wrong3: question.wrong3,
});

export function quizQuestions(state: Map<number, IQuestion> = new Map(), action: IAppAction): typeof state {
    switch (action.type) {
        case APP_DATA_RESPONSE:
        case LOGIN_RESPONSE: {
            let result: typeof state | undefined;
            const questionHandlerFn = (question: IApiQuizQuestion) => {
                if (!result) {
                    result = new Map(state);
                }
                result.set(question.id, mapApiQuizQuestionToQuestion(question));
            };
            action.response.user.quizzes.forEach(quiz => {
                quiz.questions.forEach(questionHandlerFn);
            });
            return result || state;
        }
        default:
            return state;
    }
}
