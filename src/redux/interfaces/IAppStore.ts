import { QuestionType } from '../../api/IApiGame';
import { LoadingState } from '../actions/requests.utils';
import { ICategory } from './ICategory';
import { IGame } from './IGame';
import { IOpponent } from './IOpponent';
import { IQuestion } from './IQuestion';
import { IQuiz } from './IQuiz';
import { IQuizAnswer } from './IQuizAnswer';
import { IUser } from './IUser';

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
    quizzes: IQuiz[];
    quizQuestions: Map<number, IQuestion>;
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
