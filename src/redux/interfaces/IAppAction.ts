import { IApiBooleanResult } from '../../api/IApiBooleanResult';
import { QuestionType } from '../../api/IApiGame';
import { IApiGameResponse } from '../../api/IApiGameResponse';
import { IApiGamesResponse } from '../../api/IApiGamesResponse';
import { IApiQuizResponse } from '../../api/IApiQuizResponse';
import { IApiStateResponse } from '../../api/IApiStateResponse';
import { IApiUser } from '../../api/IApiUser';
import { IApiUserSearchResponse } from '../../api/IApiUserSearchResponse';
import { ADD_FRIEND_ERROR, ADD_FRIEND_REQUEST, ADD_FRIEND_RESPONSE, APP_DATA_ERROR, APP_DATA_REQUEST, APP_DATA_RESPONSE, CREATE_GAME_ERROR, CREATE_GAME_REQUEST, CREATE_GAME_RESPONSE, CREATE_USER_ERROR, CREATE_USER_REQUEST, CREATE_USER_RESPONSE, DECLINE_GAME_ERROR, DECLINE_GAME_REQUEST, DECLINE_GAME_RESPONSE, FIND_USER_ERROR, FIND_USER_REQUEST, FIND_USER_RESPONSE, GIVE_UP_GAME_ERROR, GIVE_UP_GAME_REQUEST, GIVE_UP_GAME_RESPONSE, LOAD_GAME_ERROR, LOAD_GAME_REQUEST, LOAD_GAME_RESPONSE, LOAD_GAMES_ERROR, LOAD_GAMES_REQUEST, LOAD_GAMES_RESPONSE, LOAD_QUIZ_ERROR, LOAD_QUIZ_REQUEST, LOAD_QUIZ_RESPONSE, LOGIN_ERROR, LOGIN_REQUEST, LOGIN_RESPONSE, REMOVE_FRIEND_ERROR, REMOVE_FRIEND_REQUEST, REMOVE_FRIEND_RESPONSE, UPDATE_USER_ERROR, UPDATE_USER_REQUEST, UPDATE_USER_RESPONSE, UPLOAD_QUIZ_ROUND_ERROR, UPLOAD_QUIZ_ROUND_REQUEST, UPLOAD_QUIZ_ROUND_RESPONSE, UPLOAD_ROUND_ERROR, UPLOAD_ROUND_REQUEST, UPLOAD_ROUND_RESPONSE } from '../actions/entities.actions';
import { COOKIE_LOADED, FINISH_ROUND, FINISH_ROUND_QUIZ, INITIAL_GAME_STATE, INITIAL_QUIZ_STATE, NEXT_QUESTION, NEXT_QUESTION_QUIZ, SELECT_ANSWER, SELECT_ANSWER_QUIZ, SELECT_CATEGORY, SELECT_GAME, SELECT_QUIZ, SHOW_CREATE_NEW_GAME, SHOW_PROFILE, START_PLAYING, START_PLAYING_QUIZ, STOP_PLAYING } from '../actions/ui.actions';
import { IGameState, IQuizState } from './IAppStore';

type IAppUiAction =
    { type: typeof COOKIE_LOADED, cookie: string } |
    { type: typeof SHOW_CREATE_NEW_GAME, show: boolean } |
    { type: typeof SHOW_PROFILE, show: boolean } |
    { type: typeof SELECT_GAME, gameId: number | null } |
    { type: typeof START_PLAYING, gameId: number, timestamp: number } |
    { type: typeof STOP_PLAYING } |
    { type: typeof SELECT_CATEGORY, gameId: number, categoryId: number, timestamp: number } |
    { type: typeof SELECT_ANSWER, gameId: number, answerIndex: number, questionType: QuestionType, timestamp: number } |
    { type: typeof NEXT_QUESTION, gameId: number, timestamp: number } |
    { type: typeof FINISH_ROUND, gameId: number } |
    { type: typeof SELECT_QUIZ, quizId: string | null } |
    { type: typeof START_PLAYING_QUIZ, quizId: string, timestamp: number } |
    { type: typeof SELECT_ANSWER_QUIZ, quizId: string, answerIndex: number, timestamp: number } |
    { type: typeof NEXT_QUESTION_QUIZ, quizId: string, timestamp: number } |
    { type: typeof FINISH_ROUND_QUIZ, quizId: string } |
    never;

export type IAppAction =
    { type: typeof INITIAL_GAME_STATE, gameStates: [[number, IGameState]] } |
    { type: typeof INITIAL_QUIZ_STATE, quizStates: [[string, IQuizState]] } |
    { type: typeof CREATE_USER_REQUEST } |
    { type: typeof CREATE_USER_RESPONSE, response: IApiStateResponse } |
    { type: typeof CREATE_USER_ERROR } |
    { type: typeof UPDATE_USER_REQUEST } |
    { type: typeof UPDATE_USER_RESPONSE, response: { user: IApiUser } } |
    { type: typeof UPDATE_USER_ERROR } |
    { type: typeof LOGIN_REQUEST } |
    { type: typeof LOGIN_RESPONSE, response: IApiStateResponse } |
    { type: typeof LOGIN_ERROR } |
    { type: typeof APP_DATA_REQUEST } |
    { type: typeof APP_DATA_RESPONSE, response: IApiStateResponse } |
    { type: typeof APP_DATA_ERROR } |
    { type: typeof CREATE_GAME_REQUEST } |
    { type: typeof CREATE_GAME_RESPONSE, response: IApiGameResponse } |
    { type: typeof CREATE_GAME_ERROR } |
    { type: typeof DECLINE_GAME_REQUEST } |
    { type: typeof DECLINE_GAME_RESPONSE, response: IApiBooleanResult, gameId: number } |
    { type: typeof DECLINE_GAME_ERROR } |
    { type: typeof GIVE_UP_GAME_REQUEST } |
    { type: typeof GIVE_UP_GAME_RESPONSE, response: IApiGameResponse } |
    { type: typeof GIVE_UP_GAME_ERROR } |
    { type: typeof FIND_USER_REQUEST } |
    { type: typeof FIND_USER_RESPONSE, response: IApiUserSearchResponse } |
    { type: typeof FIND_USER_ERROR } |
    { type: typeof LOAD_GAME_REQUEST } |
    { type: typeof LOAD_GAME_RESPONSE, response: IApiGameResponse } |
    { type: typeof LOAD_GAME_ERROR } |
    { type: typeof LOAD_GAMES_REQUEST } |
    { type: typeof LOAD_GAMES_RESPONSE, response: IApiGamesResponse } |
    { type: typeof LOAD_GAMES_ERROR } |
    { type: typeof LOAD_QUIZ_REQUEST } |
    { type: typeof LOAD_QUIZ_RESPONSE, response: IApiQuizResponse } |
    { type: typeof LOAD_QUIZ_ERROR } |
    { type: typeof ADD_FRIEND_REQUEST } |
    { type: typeof ADD_FRIEND_RESPONSE, userId: string, name: string } |
    { type: typeof ADD_FRIEND_ERROR } |
    { type: typeof REMOVE_FRIEND_REQUEST } |
    { type: typeof REMOVE_FRIEND_RESPONSE, userId: string } |
    { type: typeof REMOVE_FRIEND_ERROR } |
    { type: typeof UPLOAD_ROUND_REQUEST } |
    { type: typeof UPLOAD_ROUND_RESPONSE, response: IApiGameResponse } |
    { type: typeof UPLOAD_ROUND_ERROR } |
    { type: typeof UPLOAD_QUIZ_ROUND_REQUEST } |
    { type: typeof UPLOAD_QUIZ_ROUND_RESPONSE, response: IApiQuizResponse } |
    { type: typeof UPLOAD_QUIZ_ROUND_ERROR } |
    IAppUiAction |
    never;
