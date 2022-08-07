import type { QuestionType } from '../../api/IApiGame';
import type { IApiGameStats } from '../../api/IApiGameStats';
import type { IApiStats } from '../../api/IApiStats';
import type { LoadingState } from '../actions/requests.utils';

import type { ICategory } from './ICategory';
import type { IGame } from './IGame';
import type { IMessage } from './IMessage';
import type { IOpponent } from './IOpponent';
import type { IQuestion } from './IQuestion';
import type { IQuiz } from './IQuiz';
import type { IQuizAnswer } from './IQuizAnswer';
import type { IUser } from './IUser';

export interface IAppStore {
    entities: IStoreEntities;
    ui: IStoreUi;
}

export interface IStoreEntities {
    loadingStates: { [requestId: string]: LoadingState };
    categories: Map<number, ICategory>;
    friends: IUser[];
    user: IUser | null;
    foundUser: IOpponent | null;
    gameQuestions: Map<number, number[]>;
    games: IGame[];
    questions: Map<number, IQuestion>;
    gameImageQuestions: Map<number, Map<number, number>>;
    messages: IMessage[];
    quizzes: IQuiz[];
    quizQuestions: Map<number, IQuestion>;
    userStats: IApiStats | null;
    friendStats: IApiGameStats | null;
}

export interface IGameState {
    current_answers_length: number;
    pendingAnswers: number[];
    pendingQuestionTypes: QuestionType[];
    selectedCategoryIndex: number | null;
    firstShownTimestamp: number | null;
    answeredTimestamp: number | null;
    pendingSelectedAnswer: number | null;
    pendingSelectedQuestionType: QuestionType | null;
}

export interface IQuizState {
    current_answers_length: number;
    pendingAnswers: IQuizAnswer[];
    firstShownTimestamp: number | null;
    answeredTimestamp: number | null;
}

export interface IStoreUi {
    showCreateNewGame: boolean;
    showProfile: boolean;
    selectedGameId: number | null;
    selectedQuizId: string | null;
    isPlaying: boolean;
    showAnswer: boolean;
    gameState: Map<number, IGameState>;
    quizState: Map<string, IQuizState>;
    loggedIn: boolean;
}
