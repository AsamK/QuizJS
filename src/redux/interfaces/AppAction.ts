import type { QuestionType } from '../../api/IApiGame';
import type {
    addFriendAction,
    appDataAction,
    createGameAction,
    createUserAction,
    declineGameAction,
    findUserAction,
    giveUpGameAction,
    INITIAL_MESSAGES,
    loadGameAction,
    loadGamesAction,
    loadGameStatsAction,
    loadQuizAction,
    loadStatsAction,
    loginAction,
    removeFriendAction,
    sendGameMessageAction,
    updateUserAction,
    uploadQuizRoundAction,
    uploadRoundAction,
} from '../actions/entities.actions';
import type {
    COOKIE_LOADED,
    FINISH_ROUND,
    FINISH_ROUND_QUIZ,
    INITIAL_GAME_STATE,
    INITIAL_QUIZ_STATE,
    NEXT_QUESTION,
    NEXT_QUESTION_QUIZ,
    SELECT_ANSWER,
    SELECT_ANSWER_QUIZ,
    SELECT_CATEGORY,
    SELECT_GAME,
    SELECT_QUIZ,
    SHOW_CREATE_NEW_GAME,
    SHOW_PROFILE,
    START_PLAYING,
    START_PLAYING_QUIZ,
    STOP_PLAYING,
} from '../actions/ui.actions';

import type { IGameState, IQuizState } from './IAppStore';
import type { IMessage } from './IMessage';

type AppUiAction =
    | { type: typeof COOKIE_LOADED; cookie: string }
    | { type: typeof SHOW_CREATE_NEW_GAME; show: boolean }
    | { type: typeof SHOW_PROFILE; show: boolean }
    | { type: typeof SELECT_GAME; gameId: number | null }
    | { type: typeof START_PLAYING; gameId: number; timestamp: number }
    | { type: typeof STOP_PLAYING }
    | { type: typeof SELECT_CATEGORY; gameId: number; categoryId: number; timestamp: number }
    | {
          type: typeof SELECT_ANSWER;
          gameId: number;
          answerIndex: number;
          questionType: QuestionType;
          timestamp: number;
      }
    | { type: typeof NEXT_QUESTION; gameId: number; timestamp: number }
    | { type: typeof FINISH_ROUND; gameId: number }
    | { type: typeof SELECT_QUIZ; quizId: string | null }
    | { type: typeof START_PLAYING_QUIZ; quizId: string; timestamp: number }
    | { type: typeof SELECT_ANSWER_QUIZ; quizId: string; answerIndex: number; timestamp: number }
    | { type: typeof NEXT_QUESTION_QUIZ; quizId: string; timestamp: number }
    | { type: typeof FINISH_ROUND_QUIZ; quizId: string }
    | never;

type AppBackendAction =
    | { type: typeof INITIAL_MESSAGES; messages: IMessage[] }
    | typeof createUserAction.ALL_ACTIONS_ONLY_TYPE
    | typeof updateUserAction.ALL_ACTIONS_ONLY_TYPE
    | typeof loginAction.ALL_ACTIONS_ONLY_TYPE
    | typeof appDataAction.ALL_ACTIONS_ONLY_TYPE
    | typeof createGameAction.ALL_ACTIONS_ONLY_TYPE
    | typeof declineGameAction.ALL_ACTIONS_ONLY_TYPE
    | typeof giveUpGameAction.ALL_ACTIONS_ONLY_TYPE
    | typeof uploadRoundAction.ALL_ACTIONS_ONLY_TYPE
    | typeof sendGameMessageAction.ALL_ACTIONS_ONLY_TYPE
    | typeof loadGameAction.ALL_ACTIONS_ONLY_TYPE
    | typeof loadGamesAction.ALL_ACTIONS_ONLY_TYPE
    | typeof loadQuizAction.ALL_ACTIONS_ONLY_TYPE
    | typeof uploadQuizRoundAction.ALL_ACTIONS_ONLY_TYPE
    | typeof findUserAction.ALL_ACTIONS_ONLY_TYPE
    | typeof addFriendAction.ALL_ACTIONS_ONLY_TYPE
    | typeof removeFriendAction.ALL_ACTIONS_ONLY_TYPE
    | typeof loadStatsAction.ALL_ACTIONS_ONLY_TYPE
    | typeof loadGameStatsAction.ALL_ACTIONS_ONLY_TYPE
    | never;

export type AppAction =
    | { type: typeof INITIAL_GAME_STATE; gameStates: [[number, IGameState]] }
    | { type: typeof INITIAL_QUIZ_STATE; quizStates: [[string, IQuizState]] }
    | AppBackendAction
    | AppUiAction
    | never;
