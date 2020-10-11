import { ICategory } from './ICategory';

export enum AnswerType {
    CORRECT,
    WRONG,
    HIDDEN,
}

export interface IGameRoundState {
    category: ICategory | null;
    yourAnswers: AnswerType[];
    opponentAnswers: AnswerType[];
}
