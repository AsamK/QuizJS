import { IApiGame } from './IApiGame';
import { IApiGameResponse } from './IApiGameResponse';
import { IApiGamesResponse } from './IApiGamesResponse';
import { IApiPopup } from './IApiPopup';
import { IApiStateResponse } from './IApiStateResponse';
import { IApiStats } from './IApiStats';
import { IApiUser } from './IApiUser';
import { IApiUserSearchResponse } from './IApiUserSearchResponse';
import { MD5 } from './md5';

const CONTENT_TYPE_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8';

export interface IRequestOptions {
    contentType?: string;
    body?: string;
}

export type BackendRequestFn = (method: 'GET' | 'POST', path: string, options: IRequestOptions) => Promise<Response>;

export function createProxiedRequestFn(proxyUrl: string, targetHost: string, cookie?: string): BackendRequestFn {
    return (method: 'GET' | 'POST', path: string, { contentType, body }: IRequestOptions) => {
        const headers = new Headers([
            ['Target-Host', targetHost],
            ['Target-Path', path],
        ]);
        if (cookie) {
            headers.set('X-Cookie', cookie);
        }
        if (contentType) {
            headers.set('Content-Type', contentType);
        }

        return fetch(proxyUrl, {
            body,
            headers,
            method,
            mode: 'cors',
        });
    };
}

export function login(requestFn: BackendRequestFn, userName: string, passwordSalt: string, password: string,
): Promise<IApiPopup | { cookie: string, body: IApiStateResponse }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        name: userName,
        pwd: passwordHash,
    });
    return requestFn('POST', 'users/login', { body, contentType: CONTENT_TYPE_URLENCODED }).then(response =>
        response.json().then(responseBody => {
            if (responseBody.logged_in) {
                return {
                    body: responseBody,
                    cookie: response.headers.get('Set-Cookie') || response.headers.get('X-Set-Cookie'),
                };
            }
            return responseBody;
        }),
    );
}

export function createUser(requestFn: BackendRequestFn, userName: string, email: string, passwordSalt: string, password: string,
): Promise<IApiPopup | { cookie: string, body: IApiStateResponse }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        email,
        name: userName,
        pwd: passwordHash,
    });
    return requestFn('POST', 'users/create', { body, contentType: CONTENT_TYPE_URLENCODED }).then(response =>
        response.json().then(responseBody => {
            if (responseBody.logged_in) {
                return {
                    body: responseBody,
                    cookie: response.headers.get('Set-Cookie') || response.headers.get('X-Set-Cookie'),
                };
            }
            return responseBody;
        }),
    );
}

export function updateUser(requestFn: BackendRequestFn, userName: string, email: string, passwordSalt: string, password: string,
): Promise<IApiPopup | { user: IApiUser }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        email,
        name: userName,
        pwd: passwordHash,
    });
    return requestFn('POST', 'users/update_user', { body, contentType: CONTENT_TYPE_URLENCODED }).then(response => response.json());
}

export function updateAvatar(requestFn: BackendRequestFn, avatarCode: string): Promise<{ t: boolean }> {
    const body = toFormUrlencoded({
        avatar_code: avatarCode,
    });
    return requestFn('POST', 'users/update_avatar', { body, contentType: CONTENT_TYPE_URLENCODED }).then(response => response.json());
}

export function addDeviceTokenAndroid(requestFn: BackendRequestFn, deviceToken: string, deviceType: string): Promise<{ t: boolean }> {
    const body = toFormUrlencoded({
        device_token: deviceToken,
        device_type: deviceType,
    });
    return requestFn('POST', 'users/add_device_token_android', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function requestState(requestFn: BackendRequestFn): Promise<IApiStateResponse> {
    return requestFn('POST', 'users/current_user_games_m', {}).then(response => response.json());
}

export function requestGames(requestFn: BackendRequestFn, gameIds: number[]): Promise<IApiGamesResponse> {
    const body = toFormUrlencoded({
        gids: '[' + gameIds.join(',') + ']',
    });
    return requestFn('POST', 'games/short_games', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function requestGame(requestFn: BackendRequestFn, gameId: number): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        gids: String(gameId),
    });
    return requestFn('POST', 'games_f', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function requestGameM(requestFn: BackendRequestFn, gameId: number): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        gids: String(gameId),
    });
    return requestFn('POST', 'games_m', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function createGame(requestFn: BackendRequestFn, opponentId: string, mode = 0, wasRecommended = 0): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        mode: String(mode),
        opponent_id: opponentId,
        was_recommended: String(wasRecommended),
    });
    return requestFn('POST', 'games/create_game', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function createRandomGame(requestFn: BackendRequestFn, mode = 0): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        mode: String(mode),
    });
    return requestFn('POST', 'games/start_random_game', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function acceptGame(requestFn: BackendRequestFn, gameId: number, accept: boolean): Promise<{ t: boolean }> {
    const body = toFormUrlencoded({
        accept: accept ? '1' : '0',
        game_id: String(gameId),
    });
    return requestFn('POST', 'games/accept', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function giveUpGame(requestFn: BackendRequestFn, gameId: number): Promise<IApiGame> {
    const body = toFormUrlencoded({
        game_id: String(gameId),
    });
    return requestFn('POST', 'games/give_up', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function removeFriend(requestFn: BackendRequestFn, userId: string): Promise<{ removed_id: string }> {
    const body = toFormUrlencoded({
        friend_id: userId,
    });
    return requestFn('POST', 'users/remove_friend', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function addFriend(requestFn: BackendRequestFn, userId: string): Promise<IApiPopup> {
    const body = toFormUrlencoded({
        friend_id: userId,
    });
    return requestFn('POST', 'users/add_friend', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function findUser(requestFn: BackendRequestFn, searchName: string): Promise<IApiUserSearchResponse | IApiPopup> {
    const body = toFormUrlencoded({
        opponent_name: searchName,
    });
    return requestFn('POST', 'users/find_user', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function requestUploadRound(
    requestFn: BackendRequestFn,
    gameId: number,
    isImageQuestionDisabled: 0 | 1,
    catChoice: number,
    answers: number[],
    questionTypes: number[],
): Promise<IApiGame> {
    const body = toFormUrlencoded({
        answers: '[' + answers.join(',') + ']',
        cat_choice: String(catChoice),
        game_id: String(gameId),
        is_image_question_disabled: String(isImageQuestionDisabled),
        question_types: '[' + questionTypes.join(',') + ']',
    });
    return requestFn('POST', 'games/upload_round_answers', { body, contentType: CONTENT_TYPE_URLENCODED })
        .then(response => response.json());
}

export function requestStats(requestFn: BackendRequestFn): Promise<IApiStats> {
    return requestFn('GET', 'stats/my_stats', {}).then(response => response.json());
}

function toFormUrlencoded(form: { [key: string]: string }): string {
    return Object.keys(form)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(form[key]))
        .join('&');
}

function getPasswordHash(passwordSalt: string, password: string): string {
    const plain = passwordSalt + password;
    return MD5(plain);
}
