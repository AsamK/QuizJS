import { IApiCoins } from './IApiCoins';
import { IApiGame } from './IApiGame';
import { IApiPopup } from './IApiPopup';

export interface IApiGameResponse {
    game: IApiGame;
    coins: IApiCoins;
    popup: IApiPopup | null;
}
