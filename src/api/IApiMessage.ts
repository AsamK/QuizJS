import { IsoDate } from './types';

export interface IApiMessage {
    text: string;
    created_at: IsoDate;
    from: number;
    to: number;
    id: string;
}
