import { ICategory } from './ICategory';

export enum AnswerType {
    HIDDEN = -1,
    CORRECT = 0,
    WRONG1 = 1,
    WRONG2 = 2,
    WRONG3 = 3,
}

export interface IGameRoundState {
    category: ICategory | null;
    yourAnswers: AnswerType[];
    opponentAnswers: AnswerType[];
}
