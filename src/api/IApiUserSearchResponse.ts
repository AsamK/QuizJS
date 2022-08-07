import type { IApiOpponent } from './IApiOpponent';

export interface IApiUserSearchResponse {
    qdOpponent: IApiOpponent;
    users: IApiOpponent[];
}
