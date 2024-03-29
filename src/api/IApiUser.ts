import type { IApiCoins } from './IApiCoins';
import type { IApiDeviceToken } from './IApiDeviceToken';
import type { IApiGame } from './IApiGame';
import type { IApiQuiz } from './IApiQuiz';

export interface IApiUser {
    avatar_code: string | null;
    avatar: null;
    blocked: null;
    board_game_player: boolean;
    coins: null | IApiCoins;
    device_tokens: IApiDeviceToken[] | null;
    email: string;
    enough_questions: boolean;
    facebook_id: null;
    friends: IApiUser[] | null;
    games: IApiGame[];
    name: string;
    only_chat_with_friends: boolean;
    q_reviewer: number;
    qc: boolean;
    quizzes: IApiQuiz[];
    show_gift: boolean;
    user_id: string;
}
