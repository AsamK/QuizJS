import type { IApiCoins } from './IApiCoins';
import type { IApiGame } from './IApiGame';

export interface IApiGamesResponse {
    games: IApiGame[];
    coins?: IApiCoins; // TODO make not optional
}
