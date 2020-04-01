import { IsoDate } from '../../api/types';

export interface IMessage {
    text: string;
    created_at: IsoDate;
    from: string;
    to: string;
    id: string;
}
