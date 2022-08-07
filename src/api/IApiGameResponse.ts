import type { IApiCoins } from './IApiCoins';
import type { IApiGame } from './IApiGame';
import type { IApiPopup } from './IApiPopup';

export interface IApiGameResponse {
    game: IApiGame;
    coins: IApiCoins;
    popup: IApiPopup | null;
}
