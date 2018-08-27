import { IApiCoins } from './IApiCoins';
import { IApiGame } from './IApiGame';

export interface IApiGamesResponse {
    games: IApiGame[];
    coins?: IApiCoins; // TODO make not optional
}
