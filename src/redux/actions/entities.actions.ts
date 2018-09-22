import { IApiBooleanResult } from '../../api/IApiBooleanResult';
import { IApiGameResponse } from '../../api/IApiGameResponse';
import { IApiGamesResponse } from '../../api/IApiGamesResponse';
import { IApiQuizResponse } from '../../api/IApiQuizResponse';
import { IApiStateResponse } from '../../api/IApiStateResponse';
import { IApiUser } from '../../api/IApiUser';
import { IApiUserSearchResponse } from '../../api/IApiUserSearchResponse';
import { IAppAction } from '../interfaces/IAppAction';

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_RESPONSE = 'CREATE_USER_RESPONSE';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';

export const createUserRequest = (): IAppAction => ({
    type: CREATE_USER_REQUEST,
});

export const createUserResponse = (response: IApiStateResponse): IAppAction => ({
    response,
    type: CREATE_USER_RESPONSE,
});

export const createUserError = (e: any): IAppAction => ({
    type: CREATE_USER_ERROR,
});

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_RESPONSE = 'UPDATE_USER_RESPONSE';
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';

export const updateUserRequest = (): IAppAction => ({
    type: UPDATE_USER_REQUEST,
});

export const updateUserResponse = (response: { user: IApiUser }): IAppAction => ({
    response,
    type: UPDATE_USER_RESPONSE,
});

export const updateUserError = (e: any): IAppAction => ({
    type: UPDATE_USER_ERROR,
});

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const loginRequest = (): IAppAction => ({
    type: LOGIN_REQUEST,
});

export const loginResponse = (response: IApiStateResponse): IAppAction => ({
    response,
    type: LOGIN_RESPONSE,
});

export const loginError = (e: any): IAppAction => ({
    type: LOGIN_ERROR,
});

export const APP_DATA_RESPONSE = 'APP_DATA_RESPONSE';
export const APP_DATA_REQUEST = 'APP_DATA_REQUEST';
export const APP_DATA_ERROR = 'APP_DATA_ERROR';

export const stateRequest = (): IAppAction => ({
    type: APP_DATA_REQUEST,
});

export const stateResponse = (response: IApiStateResponse): IAppAction => ({
    response,
    type: APP_DATA_RESPONSE,
});

export const stateError = (e: any): IAppAction => ({
    type: APP_DATA_ERROR,
});

export const CREATE_GAME_RESPONSE = 'CREATE_GAME_RESPONSE';
export const CREATE_GAME_REQUEST = 'CREATE_GAME_REQUEST';
export const CREATE_GAME_ERROR = 'CREATE_GAME_ERROR';

export const createGameRequest = (): IAppAction => ({
    type: CREATE_GAME_REQUEST,
});

export const createGameResponse = (response: IApiGameResponse): IAppAction => ({
    response,
    type: CREATE_GAME_RESPONSE,
});

export const createGameError = (e: any): IAppAction => ({
    type: CREATE_GAME_ERROR,
});

export const DECLINE_GAME_RESPONSE = 'DECLINE_GAME_RESPONSE';
export const DECLINE_GAME_REQUEST = 'DECLINE_GAME_REQUEST';
export const DECLINE_GAME_ERROR = 'DECLINE_GAME_ERROR';

export const declineGameRequest = (): IAppAction => ({
    type: DECLINE_GAME_REQUEST,
});

export const declineGameResponse = (gameId: number, response: IApiBooleanResult): IAppAction => ({
    gameId,
    response,
    type: DECLINE_GAME_RESPONSE,
});

export const declineGameError = (e: any): IAppAction => ({
    type: DECLINE_GAME_ERROR,
});

export const GIVE_UP_GAME_RESPONSE = 'GIVE_UP_GAME_RESPONSE';
export const GIVE_UP_GAME_REQUEST = 'GIVE_UP_GAME_REQUEST';
export const GIVE_UP_GAME_ERROR = 'GIVE_UP_GAME_ERROR';

export const giveUpGameRequest = (): IAppAction => ({
    type: GIVE_UP_GAME_REQUEST,
});

export const giveUpGameResponse = (response: IApiGameResponse): IAppAction => ({
    response,
    type: GIVE_UP_GAME_RESPONSE,
});

export const giveUpGameError = (e: any): IAppAction => ({
    type: GIVE_UP_GAME_ERROR,
});

export const FIND_USER_RESPONSE = 'FIND_USER_RESPONSE';
export const FIND_USER_REQUEST = 'FIND_USER_REQUEST';
export const FIND_USER_ERROR = 'FIND_USER_ERROR';

export const findUserRequest = (): IAppAction => ({
    type: FIND_USER_REQUEST,
});

export const findUserResponse = (response: IApiUserSearchResponse): IAppAction => ({
    response,
    type: FIND_USER_RESPONSE,
});

export const findUserError = (e: any): IAppAction => ({
    type: FIND_USER_ERROR,
});

export const LOAD_GAME_RESPONSE = 'LOAD_GAME_RESPONSE';
export const LOAD_GAME_REQUEST = 'LOAD_GAME_REQUEST';
export const LOAD_GAME_ERROR = 'LOAD_GAME_ERROR';

export const loadGameRequest = (): IAppAction => ({
    type: LOAD_GAME_REQUEST,
});

export const loadGameResponse = (response: IApiGameResponse): IAppAction => ({
    response,
    type: LOAD_GAME_RESPONSE,
});

export const loadGameError = (e: any): IAppAction => ({
    type: LOAD_GAME_ERROR,
});

export const LOAD_GAMES_RESPONSE = 'LOAD_GAMES_RESPONSE';
export const LOAD_GAMES_REQUEST = 'LOAD_GAMES_REQUEST';
export const LOAD_GAMES_ERROR = 'LOAD_GAMES_ERROR';

export const loadGamesRequest = (): IAppAction => ({
    type: LOAD_GAMES_REQUEST,
});

export const loadGamesResponse = (response: IApiGamesResponse): IAppAction => ({
    response,
    type: LOAD_GAMES_RESPONSE,
});

export const loadGamesError = (e: any): IAppAction => ({
    type: LOAD_GAMES_ERROR,
});

export const LOAD_QUIZ_RESPONSE = 'LOAD_QUIZ_RESPONSE';
export const LOAD_QUIZ_REQUEST = 'LOAD_QUIZ_REQUEST';
export const LOAD_QUIZ_ERROR = 'LOAD_QUIZ_ERROR';

export const loadQuizRequest = (): IAppAction => ({
    type: LOAD_QUIZ_REQUEST,
});

export const loadQuizResponse = (response: IApiQuizResponse): IAppAction => ({
    response,
    type: LOAD_QUIZ_RESPONSE,
});

export const loadQuizError = (e: any): IAppAction => ({
    type: LOAD_QUIZ_ERROR,
});

export const UPLOAD_QUIZ_ROUND_RESPONSE = 'UPLOAD_QUIZ_ROUND_RESPONSE';
export const UPLOAD_QUIZ_ROUND_REQUEST = 'UPLOAD_QUIZ_ROUND_REQUEST';
export const UPLOAD_QUIZ_ROUND_ERROR = 'UPLOAD_QUIZ_ROUND_ERROR';

export const uploadQuizRoundRequest = (): IAppAction => ({
    type: UPLOAD_QUIZ_ROUND_REQUEST,
});

export const uploadQuizRoundResponse = (response: IApiQuizResponse): IAppAction => ({
    response,
    type: UPLOAD_QUIZ_ROUND_RESPONSE,
});

export const uploadQuizRoundError = (e: any): IAppAction => ({
    type: UPLOAD_QUIZ_ROUND_ERROR,
});

export const ADD_FRIEND_RESPONSE = 'ADD_FRIEND_RESPONSE';
export const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
export const ADD_FRIEND_ERROR = 'ADD_FRIEND_ERROR';

export const addFriendRequest = (): IAppAction => ({
    type: ADD_FRIEND_REQUEST,
});

export const addFriendResponse = (userId: string, name: string): IAppAction => ({
    name,
    type: ADD_FRIEND_RESPONSE,
    userId,
});

export const addFriendError = (e: any): IAppAction => ({
    type: ADD_FRIEND_ERROR,
});

export const REMOVE_FRIEND_RESPONSE = 'REMOVE_FRIEND_RESPONSE';
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST';
export const REMOVE_FRIEND_ERROR = 'REMOVE_FRIEND_ERROR';

export const removeFriendRequest = (): IAppAction => ({
    type: REMOVE_FRIEND_REQUEST,
});

export const removeFriendResponse = (userId: string): IAppAction => ({
    type: REMOVE_FRIEND_RESPONSE,
    userId,
});

export const removeFriendError = (e: any): IAppAction => ({
    type: REMOVE_FRIEND_ERROR,
});

export const UPLOAD_ROUND_RESPONSE = 'UPLOAD_ROUND_RESPONSE';
export const UPLOAD_ROUND_REQUEST = 'UPLOAD_ROUND_REQUEST';
export const UPLOAD_ROUND_ERROR = 'UPLOAD_ROUND_ERROR';

export const uploadRoundRequest = (): IAppAction => ({
    type: UPLOAD_ROUND_REQUEST,
});

export const uploadRoundResponse = (response: IApiGameResponse): IAppAction => ({
    response,
    type: UPLOAD_ROUND_RESPONSE,
});

export const uploadRoundError = (e: any): IAppAction => ({
    type: UPLOAD_ROUND_ERROR,
});
