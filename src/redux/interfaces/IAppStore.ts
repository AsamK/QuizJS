import { QuestionType } from '../../api/IApiGame';
import { ICategory } from './ICategory';
import { IGame } from './IGame';
import { IOpponent } from './IOpponent';
import { IQuestion } from './IQuestion';
import { IQuiz } from './IQuiz';
import { IUser } from './IUser';

export interface IAppStore {
    entities: IStoreEntities;
    ui: IStoreUi;
}

export interface IStoreEntities {
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
}

export interface IStoreUi {
    showCreateNewGame: boolean;
    showProfile: boolean;
    selectedGameId: number | null;
    selectedQuizId: string | null;
    isPlaying: boolean;
    showAnswer: boolean;
    gameState: Map<number, IGameState>;
    loggedIn: boolean;
}
