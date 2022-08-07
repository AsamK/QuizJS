import type { IsoDate } from './types';

export interface IDateRange {
    upper: IsoDate;
    lower: IsoDate;
    /* e.g. [) */
    bounds: string;
}
