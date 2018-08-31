import { ICategory } from './ICategory';

export interface IGameRoundState {
    category: ICategory | null;
    yourAnswers: number[];
    opponentAnswers: number[];
}
