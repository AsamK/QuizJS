import { IApiBooleanResult } from '../../api/IApiBooleanResult';
import { IApiGameResponse } from '../../api/IApiGameResponse';
import { IApiGamesResponse } from '../../api/IApiGamesResponse';
import { IApiGameStats } from '../../api/IApiGameStats';
import { IApiPopup } from '../../api/IApiPopup';
import { IApiQuizResponse } from '../../api/IApiQuizResponse';
import { IApiSendMessageResponse } from '../../api/IApiSendMessageResponse';
import { IApiStateResponse } from '../../api/IApiStateResponse';
import { IApiStats } from '../../api/IApiStats';
import { IApiUser } from '../../api/IApiUser';
import { IApiUserSearchResponse } from '../../api/IApiUserSearchResponse';
import { AppAction } from '../interfaces/AppAction';
import { IMessage } from '../interfaces/IMessage';
import { ActionType } from './requests.utils';

export const INITIAL_MESSAGES = 'INITIAL_MESSAGES';

export const initialMessages = (messages: IMessage[]): AppAction => ({
    messages,
    type: INITIAL_MESSAGES,
});


export const createUserAction = new ActionType
    <'CREATE_USER_REQUEST', 'CREATE_USER_RESPONSE', 'CREATE_USER_ERROR', IApiStateResponse, IApiPopup>
    ('CREATE_USER_REQUEST', 'CREATE_USER_RESPONSE', 'CREATE_USER_ERROR');

export const updateUserAction = new ActionType
    <'UPDATE_USER_REQUEST', 'UPDATE_USER_RESPONSE', 'UPDATE_USER_ERROR', { user: IApiUser }, IApiPopup>
    ('UPDATE_USER_REQUEST', 'UPDATE_USER_RESPONSE', 'UPDATE_USER_ERROR');

export const loginAction = new ActionType
    <'LOGIN_REQUEST', 'LOGIN_RESPONSE', 'LOGIN_ERROR', IApiStateResponse, IApiPopup>
    ('LOGIN_REQUEST', 'LOGIN_RESPONSE', 'LOGIN_ERROR');

export const appDataAction = new ActionType
    <'APP_DATA_REQUEST', 'APP_DATA_RESPONSE', 'APP_DATA_ERROR', IApiStateResponse, IApiPopup>
    ('APP_DATA_REQUEST', 'APP_DATA_RESPONSE', 'APP_DATA_ERROR');

export const createGameAction = new ActionType
    <'CREATE_GAME_REQUEST', 'CREATE_GAME_RESPONSE', 'CREATE_GAME_ERROR', IApiGameResponse, IApiPopup, { id: string }>
    ('CREATE_GAME_REQUEST', 'CREATE_GAME_RESPONSE', 'CREATE_GAME_ERROR');

export const declineGameAction = new ActionType
    <'DECLINE_GAME_REQUEST', 'DECLINE_GAME_RESPONSE', 'DECLINE_GAME_ERROR', IApiBooleanResult, IApiPopup, { id: number }>
    ('DECLINE_GAME_REQUEST', 'DECLINE_GAME_RESPONSE', 'DECLINE_GAME_ERROR');

export const giveUpGameAction = new ActionType
    <'GIVE_UP_GAME_REQUEST', 'GIVE_UP_GAME_RESPONSE', 'GIVE_UP_GAME_ERROR', IApiGameResponse, IApiPopup, { id: number }>
    ('GIVE_UP_GAME_REQUEST', 'GIVE_UP_GAME_RESPONSE', 'GIVE_UP_GAME_ERROR');

export const sendGameMessageAction = new ActionType
    <'SEND_GAME_MESSAGE_REQUEST', 'SEND_GAME_MESSAGE_RESPONSE', 'SEND_GAME_MESSAGE_ERROR',
        IApiSendMessageResponse, IApiPopup, { id: number, message: string }>
    ('SEND_GAME_MESSAGE_REQUEST', 'SEND_GAME_MESSAGE_RESPONSE', 'SEND_GAME_MESSAGE_ERROR');

export const uploadRoundAction = new ActionType
    <'UPLOAD_ROUND_REQUEST', 'UPLOAD_ROUND_RESPONSE', 'UPLOAD_ROUND_ERROR', IApiGameResponse, IApiPopup, { id: number }>
    ('UPLOAD_ROUND_REQUEST', 'UPLOAD_ROUND_RESPONSE', 'UPLOAD_ROUND_ERROR');

export const loadGameAction = new ActionType
    <'LOAD_GAME_REQUEST', 'LOAD_GAME_RESPONSE', 'LOAD_GAME_ERROR', IApiGameResponse, IApiPopup>
    ('LOAD_GAME_REQUEST', 'LOAD_GAME_RESPONSE', 'LOAD_GAME_ERROR');

export const loadGamesAction = new ActionType
    <'LOAD_GAMES_REQUEST', 'LOAD_GAMES_RESPONSE', 'LOAD_GAMES_ERROR', IApiGamesResponse, IApiPopup, { id: number }>
    ('LOAD_GAMES_REQUEST', 'LOAD_GAMES_RESPONSE', 'LOAD_GAMES_ERROR');

export const loadQuizAction = new ActionType
    <'LOAD_QUIZ_REQUEST', 'LOAD_QUIZ_RESPONSE', 'LOAD_QUIZ_ERROR', IApiQuizResponse, IApiPopup, { id: string }>
    ('LOAD_QUIZ_REQUEST', 'LOAD_QUIZ_RESPONSE', 'LOAD_QUIZ_ERROR');

export const uploadQuizRoundAction = new ActionType
    <'UPLOAD_QUIZ_ROUND_REQUEST', 'UPLOAD_QUIZ_ROUND_RESPONSE', 'UPLOAD_QUIZ_ROUND_ERROR', IApiQuizResponse, IApiPopup, { id: string }>
    ('UPLOAD_QUIZ_ROUND_REQUEST', 'UPLOAD_QUIZ_ROUND_RESPONSE', 'UPLOAD_QUIZ_ROUND_ERROR');

export const findUserAction = new ActionType
    <'FIND_USER_REQUEST', 'FIND_USER_RESPONSE', 'FIND_USER_ERROR', IApiUserSearchResponse, IApiPopup, { id: string }>
    ('FIND_USER_REQUEST', 'FIND_USER_RESPONSE', 'FIND_USER_ERROR');

export const addFriendAction = new ActionType
    <'ADD_FRIEND_REQUEST', 'ADD_FRIEND_RESPONSE', 'ADD_FRIEND_ERROR', never, IApiPopup, { id: string, name: string }>
    ('ADD_FRIEND_REQUEST', 'ADD_FRIEND_RESPONSE', 'ADD_FRIEND_ERROR');

export const removeFriendAction = new ActionType
    <'REMOVE_FRIEND_REQUEST', 'REMOVE_FRIEND_RESPONSE', 'REMOVE_FRIEND_ERROR', { removed_id: string }, IApiPopup, { id: string }>
    ('REMOVE_FRIEND_REQUEST', 'REMOVE_FRIEND_RESPONSE', 'REMOVE_FRIEND_ERROR');

export const loadStatsAction = new ActionType
    <'LOAD_STATS_REQUEST', 'LOAD_STATS_RESPONSE', 'LOAD_STATS_ERROR', IApiStats, IApiPopup>
    ('LOAD_STATS_REQUEST', 'LOAD_STATS_RESPONSE', 'LOAD_STATS_ERROR');

export const loadGameStatsAction = new ActionType
    <'LOAD_GAME_STATS_REQUEST', 'LOAD_GAME_STATS_RESPONSE', 'LOAD_GAME_STATS_ERROR', IApiGameStats, IApiPopup>
    ('LOAD_GAME_STATS_REQUEST', 'LOAD_GAME_STATS_RESPONSE', 'LOAD_GAME_STATS_ERROR');
