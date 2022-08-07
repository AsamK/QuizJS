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

export async function apiLogin(
    requestFn: BackendRequestFn,
    userName: string,
    passwordSalt: string,
    password: string,
): Promise<IApiPopup | { cookie: string; body: IApiStateResponse }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        name: userName,
        pwd: passwordHash,
    });
    const response = await requestFn('POST', 'users/login', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });

    const responseBody = (await response.json()) as IApiPopup | IApiStateResponse;
    if ('logged_in' in responseBody) {
        return {
            body: responseBody,
            cookie:
                response.headers.get('Set-Cookie') || response.headers.get('X-Set-Cookie') || '',
        };
    }
    return responseBody;
}

export async function apiCreateUser(
    requestFn: BackendRequestFn,
    userName: string,
    email: string,
    passwordSalt: string,
    password: string,
): Promise<IApiPopup | { cookie: string; body: IApiStateResponse }> {
    const passwordHash = getPasswordHash(passwordSalt, password);
    const body = toFormUrlencoded({
        email,
        name: userName,
        pwd: passwordHash,
    });
    const response = await requestFn('POST', 'users/create', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    const responseBody = (await response.json()) as IApiPopup | IApiStateResponse;
    if ('logged_in' in responseBody) {
        return {
            body: responseBody,
            cookie:
                response.headers.get('Set-Cookie') || response.headers.get('X-Set-Cookie') || '',
        };
    }
    return responseBody;
}

export async function apiUpdateUser(
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
    const response = await requestFn('POST', 'users/update_user', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiPopup | { user: IApiUser };
}

export async function apiUpdateAvatar(
    requestFn: BackendRequestFn,
    avatarCode: string,
): Promise<IApiBooleanResult> {
    const body = toFormUrlencoded({
        avatar_code: avatarCode,
    });
    const response = await requestFn('POST', 'users/update_avatar', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiBooleanResult;
}

export async function apiAddDeviceTokenAndroid(
    requestFn: BackendRequestFn,
    deviceToken: string,
    deviceType: string,
): Promise<IApiBooleanResult> {
    const body = toFormUrlencoded({
        device_token: deviceToken,
        device_type: deviceType,
    });
    const response = await requestFn('POST', 'users/add_device_token_android', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiBooleanResult;
}

export async function apiRequestState(requestFn: BackendRequestFn): Promise<IApiStateResponse> {
    const response = await requestFn('POST', 'users/current_user_games_m', {});
    return (await response.json()) as IApiStateResponse;
}

export async function apiRequestGames(
    requestFn: BackendRequestFn,
    gameIds: number[],
): Promise<IApiGamesResponse> {
    const body = toFormUrlencoded({
        gids: '[' + gameIds.join(',') + ']',
    });
    const response = await requestFn('POST', 'games/short_games', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGamesResponse;
}

export async function apiRequestGame(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        gids: String(gameId),
    });
    const response = await requestFn('POST', 'games_f', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGameResponse;
}

export async function apiRequestGameM(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        gids: String(gameId),
    });
    const response = await requestFn('POST', 'games_m', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGameResponse;
}

export async function apiCreateGame(
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
    const response = await requestFn('POST', 'games/create_game', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGameResponse;
}

export async function apiCreateRandomGame(
    requestFn: BackendRequestFn,
    mode = 0,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        mode: String(mode),
    });
    const response = await requestFn('POST', 'games/start_random_game', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGameResponse;
}

export async function apiDeclineGame(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiBooleanResult> {
    const body = toFormUrlencoded({
        accept: '0',
        game_id: String(gameId),
    });
    const response = await requestFn('POST', 'games/accept', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiBooleanResult;
}

export async function apiGiveUpGame(
    requestFn: BackendRequestFn,
    gameId: number,
): Promise<IApiGameResponse> {
    const body = toFormUrlencoded({
        game_id: String(gameId),
    });
    const response = await requestFn('POST', 'games/give_up', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGameResponse;
}

export async function apiSendMessage(
    requestFn: BackendRequestFn,
    gameId: number,
    text: string,
): Promise<IApiSendMessageResponse> {
    const body = toFormUrlencoded({
        game_id: String(gameId),
        text,
    });
    const response = await requestFn('POST', 'games/send_message', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiSendMessageResponse;
}

export async function apiRemoveFriend(
    requestFn: BackendRequestFn,
    userId: string,
): Promise<{ removed_id: string }> {
    const body = toFormUrlencoded({
        friend_id: userId,
    });
    const response = await requestFn('POST', 'users/remove_friend', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as { removed_id: string };
}

export async function apiAddFriend(
    requestFn: BackendRequestFn,
    userId: string,
): Promise<IApiPopup> {
    const body = toFormUrlencoded({
        friend_id: userId,
    });
    const response = await requestFn('POST', 'users/add_friend', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiPopup;
}

export async function apiFindUser(
    requestFn: BackendRequestFn,
    searchName: string,
): Promise<IApiUserSearchResponse | IApiPopup> {
    const body = toFormUrlencoded({
        opponent_name: searchName,
    });
    const response = await requestFn('POST', 'users/find_user', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiUserSearchResponse | IApiPopup;
}

export async function apiRequestUploadRound(
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
    const response = await requestFn('POST', 'games/upload_round_answers', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiGameResponse;
}

export async function apiRequestQuiz(
    requestFn: BackendRequestFn,
    quizId: string,
): Promise<IApiQuizResponse> {
    const response = await requestFn('GET', 'quizzes/', {
        queryParams: { quiz_id: quizId },
    });
    return (await response.json()) as IApiQuizResponse;
}

export async function apiRequestUploadQuizRound(
    requestFn: BackendRequestFn,
    quizId: string,
    answers: IApiQuizAnswer[],
    giveUp = false,
): Promise<IApiQuizResponse> {
    const body = toFormUrlencoded({
        answer_dicts: JSON.stringify(answers),
        give_up: giveUp ? '1' : '0',
    });
    const response = await requestFn('POST', 'quizzes/my_answers', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
        queryParams: { quiz_id: quizId },
    });
    return (await response.json()) as IApiQuizResponse;
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

export async function apiRequestDailyChallenge(
    requestFn: BackendRequestFn,
    challengeSize: number,
): Promise<IApiDailyChallengeResponse> {
    const response = await requestFn('GET', 'games/dailyChallenge', {
        queryParams: { challengeSize: challengeSize.toString() },
    });
    return (await response.json()) as IApiDailyChallengeResponse;
}

export interface IApiDailyChallengeUploadResponse {
    locale: string; // de-DE
    friendTopList: IApiRatingUser[];
    maxScore: number;
    topList: IApiRatingUser[];
}

export async function apiUploadDailyChallenge(
    requestFn: BackendRequestFn,
    score: number,
): Promise<IApiDailyChallengeUploadResponse> {
    const body = toFormUrlencoded({
        facebook_ids: '[]',
        score: score.toString(),
    });
    const response = await requestFn('POST', 'games/submitBlitzGame', {
        body,
        contentType: CONTENT_TYPE_URLENCODED,
    });
    return (await response.json()) as IApiDailyChallengeUploadResponse;
}

export interface IApiRatingUser extends IApiOpponent {
    score: number;
}

export interface IApiTopListRatingResponse {
    users: IApiRatingUser[];
}

export async function apiRequestTopListRating(
    requestFn: BackendRequestFn,
    mode = 2,
): Promise<IApiTopListRatingResponse> {
    const response = await requestFn('GET', 'users/top_list_rating', {
        queryParams: {
            fids: '[]',
            mode: mode.toString(),
        },
    });
    return (await response.json()) as IApiTopListRatingResponse;
}

export async function apiRequestStats(requestFn: BackendRequestFn): Promise<IApiStats> {
    const response = await requestFn('GET', 'stats/my_stats', {});
    return (await response.json()) as IApiStats;
}

export async function apiRequestGameStats(requestFn: BackendRequestFn): Promise<IApiGameStats> {
    const response = await requestFn('GET', 'stats/my_game_stats', {});
    return (await response.json()) as IApiGameStats;
}

function getPasswordHash(passwordSalt: string, password: string): string {
    const plain = passwordSalt + password;
    return MD5(plain);
}
