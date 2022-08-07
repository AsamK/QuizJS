// TODO improve json casts
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { toFormUrlencoded } from '../utils/utils';

import type { IApiBooleanResult } from './IApiBooleanResult';
import type { IApiGameResponse } from './IApiGameResponse';
import type { IApiGamesResponse } from './IApiGamesResponse';
import type { IApiGameStats } from './IApiGameStats';
import type { IApiOpponent } from './IApiOpponent';
import type { IApiPopup } from './IApiPopup';
import type { IApiQuizAnswer } from './IApiQuiz';
import type { IApiQuizResponse } from './IApiQuizResponse';
import type { IApiSendMessageResponse } from './IApiSendMessageResponse';
import type { IApiStateResponse } from './IApiStateResponse';
import type { IApiStats } from './IApiStats';
import type { IApiUser } from './IApiUser';
import type { IApiUserSearchResponse } from './IApiUserSearchResponse';
import { MD5 } from './md5';

const CONTENT_TYPE_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8';

export interface IRequestOptions {
    contentType?: string;
    body?: string;
    queryParams?: { [key: string]: string };
}

export type BackendRequestFn = (
    method: 'GET' | 'POST',
    path: string,
    options: IRequestOptions,
) => Promise<Response>;

export function apiLogin(
    requestFn: BackendRequestFn,
    userName: string,
    passwordSalt: string,
    password: string,
): Promise<IApiPopup | { cookie: string | null; body: IApiStateResponse }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        name: userName,
        pwd: passwordHash,
    });
    return requestFn('POST', 'users/login', { body, contentType: CONTENT_TYPE_URLENCODED }).then(
        response =>
            response.json().then((responseBody: IApiPopup | IApiStateResponse) => {
                if ('logged_in' in responseBody) {
                    return {
                        body: responseBody,
                        cookie:
                            response.headers.get('Set-Cookie') ||
                            response.headers.get('X-Set-Cookie'),
                    };
                }
                return responseBody;
            }),
    );
}

export function apiCreateUser(
    requestFn: BackendRequestFn,
    userName: string,
    email: string,
    passwordSalt: string,
    password: string,
): Promise<IApiPopup | { cookie: string | null; body: IApiStateResponse }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        email,
        name: userName,
        pwd: passwordHash,
    });
    return requestFn('POST', 'users/create', { body, contentType: CONTENT_TYPE_URLENCODED }).then(
        response =>
            response.json().then((responseBody: IApiPopup | IApiStateResponse) => {
                if ('logged_in' in responseBody) {
                    return {
                        body: responseBody,
                        cookie:
                            response.headers.get('Set-Cookie') ||
                            response.headers.get('X-Set-Cookie'),
                    };
                }
                return responseBody;
            }),
    );
}

export function apiUpdateUser(
    requestFn: BackendRequestFn,
    userName: string,
    email: string,
    passwordSalt: string,
    password: string | null,
): Promise<IApiPopup | { user: IApiUser }> {
    const passwordHash = password == null ? '' : getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        email,
        name: userName,
        pwd: passwordHash,
    });
    return requestFn('POST', 'users/update_user', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiUpdateAvatar(
    requestFn: BackendRequestFn,
    avatarCode: string,
): Promise<IApiBooleanResult> {
    const body = toFormUrlencoded({
        avatar_code: avatarCode,
    });
    return requestFn('POST', 'users/update_avatar', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiAddDeviceTokenAndroid(
    requestFn: BackendRequestFn,
    deviceToken: string,
    deviceType: string,
): Promise<IApiBooleanResult> {
    const body = toFormUrlencoded({
        device_token: deviceToken,
        device_type: deviceType,
    });
    return requestFn('POST', 'users/add_device_token_android', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiRequestState(requestFn: BackendRequestFn): Promise<IApiStateResponse> {
    return requestFn('POST', 'users/current_user_games_m', {}).then(response => response.json());
}

export function apiRequestGames(
    requestFn: BackendRequestFn,
    gameIds: number[],
): Promise<IApiGamesResponse> {
    const body = toFormUrlencoded({
        gids: '[' + gameIds.join(',') + ']',
    });
    return requestFn('POST', 'games/short_games', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiRequestGame(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        gids: String(gameId),
    });
    return requestFn('POST', 'games_f', { body, contentType: CONTENT_TYPE_URLENCODED }).then(
        response => response.json(),
    );
}

export function apiRequestGameM(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        gids: String(gameId),
    });
    return requestFn('POST', 'games_m', { body, contentType: CONTENT_TYPE_URLENCODED }).then(
        response => response.json(),
    );
}

export function apiCreateGame(
    requestFn: BackendRequestFn,
    opponentId: string,
    mode = 0,
    wasRecommended = 0,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        mode: String(mode),
        opponent_id: opponentId,
        was_recommended: String(wasRecommended),
    });
    return requestFn('POST', 'games/create_game', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiCreateRandomGame(
    requestFn: BackendRequestFn,
    mode = 0,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        mode: String(mode),
    });
    return requestFn('POST', 'games/start_random_game', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiDeclineGame(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiBooleanResult> {
    const body = toFormUrlencoded({
        accept: '0',
        game_id: String(gameId),
    });
    return requestFn('POST', 'games/accept', { body, contentType: CONTENT_TYPE_URLENCODED }).then(
        response => response.json(),
    );
}

export function apiGiveUpGame(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        game_id: String(gameId),
    });
    return requestFn('POST', 'games/give_up', { body, contentType: CONTENT_TYPE_URLENCODED }).then(
        response => response.json(),
    );
}

export function apiSendMessage(
    requestFn: BackendRequestFn,
    gameId: number,
    text: string,
): Promise<IApiSendMessageResponse> {
    const body = toFormUrlencoded({
        game_id: String(gameId),
        text,
    });
    return requestFn('POST', 'games/send_message', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiRemoveFriend(
    requestFn: BackendRequestFn,
    userId: string,
): Promise<{ removed_id: string }> {
    const body = toFormUrlencoded({
        friend_id: userId,
    });
    return requestFn('POST', 'users/remove_friend', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiAddFriend(requestFn: BackendRequestFn, userId: string): Promise<IApiPopup> {
    const body = toFormUrlencoded({
        friend_id: userId,
    });
    return requestFn('POST', 'users/add_friend', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiFindUser(
    requestFn: BackendRequestFn,
    searchName: string,
): Promise<IApiUserSearchResponse | IApiPopup> {
    const body = toFormUrlencoded({
        opponent_name: searchName,
    });
    return requestFn('POST', 'users/find_user', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiRequestUploadRound(
    requestFn: BackendRequestFn,
    gameId: number,
    isImageQuestionDisabled: 0 | 1,
    catChoice: number,
    answers: number[],
    questionTypes: number[],
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        answers: '[' + answers.join(',') + ']',
        cat_choice: String(catChoice),
        game_id: String(gameId),
        is_image_question_disabled: String(isImageQuestionDisabled),
        question_types: '[' + questionTypes.join(',') + ']',
    });
    return requestFn('POST', 'games/upload_round_answers', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export function apiRequestQuiz(
    requestFn: BackendRequestFn,
    quizId: string,
): Promise<IApiQuizResponse> {
    return requestFn('GET', 'quizzes/', {
        queryParams: { quiz_id: quizId },
    }).then(response => response.json());
}

export function apiRequestUploadQuizRound(
    requestFn: BackendRequestFn,
    quizId: string,
    answers: IApiQuizAnswer[],
    giveUp = false,
): Promise<IApiQuizResponse> {
    const body = toFormUrlencoded({
        answer_dicts: JSON.stringify(answers),
        give_up: giveUp ? '1' : '0',
    });
    return requestFn('POST', 'quizzes/my_answers', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
        queryParams: { quiz_id: quizId },
    }).then(response => response.json());
}
export interface IApiDailyChallengeQuestion {
    type: 'text';
    revision: string;
    revision_id: number;
    question: string;
    wrong1: string;
    wrong2: string;
    wrong3: string;
    correct: string;
    image: null;
    created: string; // 2018-07-06T13:02:52.000000+00:00
    locale: string; // "de_DE"
}

export interface IApiDailyChallengeResponse {
    todaysChallenge: {
        locale: string; // de-DE
        challengeDate: string; // "2019-01-20",
        questions: {
            id: number;
            name: string;
            color: string;
            questions: IApiDailyChallengeQuestion[];
        }[];
    };
    tomorrowsCategory: {
        id: number;
        name: string;
        color: string;
    };
}

export function apiRequestDailyChallenge(
    requestFn: BackendRequestFn,
    challengeSize: number,
): Promise<IApiDailyChallengeResponse> {
    return requestFn('GET', 'games/dailyChallenge', {
        queryParams: { challengeSize: challengeSize.toString() },
    }).then(response => response.json());
}

export interface IApiDailyChallengeUploadResponse {
    locale: string; // de-DE
    friendTopList: IApiRatingUser[];
    maxScore: number;
    topList: IApiRatingUser[];
}

export function apiUploadDailyChallenge(
    requestFn: BackendRequestFn,
    score: number,
): Promise<IApiDailyChallengeUploadResponse> {
    const body = toFormUrlencoded({
        facebook_ids: '[]',
        score: score.toString(),
    });
    return requestFn('POST', 'games/submitBlitzGame', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    }).then(response => response.json());
}

export interface IApiRatingUser extends IApiOpponent {
    score: number;
}

export interface IApiTopListRatingResponse {
    users: IApiRatingUser[];
}

export function apiRequestTopListRating(
    requestFn: BackendRequestFn,
    mode = 2,
): Promise<IApiTopListRatingResponse> {
    return requestFn('GET', 'users/top_list_rating', {
        queryParams: {
            fids: '[]',
            mode: mode.toString(),
        },
    }).then(response => response.json());
}

export function apiRequestStats(requestFn: BackendRequestFn): Promise<IApiStats> {
    return requestFn('GET', 'stats/my_stats', {}).then(response => response.json());
}

export function apiRequestGameStats(requestFn: BackendRequestFn): Promise<IApiGameStats> {
    return requestFn('GET', 'stats/my_game_stats', {}).then(response => response.json());
}

function getPasswordHash(passwordSalt: string, password: string): string {
    const plain = passwordSalt + password;
    return MD5(plain);
}
