import type { IApiImageQuestion } from './IApiImageQuestion';
import type { IApiMessage } from './IApiMessage';
import type { IApiOpponent } from './IApiOpponent';
import type { IApiQuestion } from './IApiQuestion';

export const enum GameState {
    REQUESTED = 0,
    ACTIVE = 1,
    FINISHED = 2,
    GAVE_UP = 5,
    ELAPSED = 6,
    NEW_RANDOM_GAME = 10,
}

export const enum QuestionType {
    NORMAL = 0,
    IMAGE = 1,
}

export interface IApiGame {
    nounce: number;
    game_id: number;
    your_question_types: QuestionType[];
    opponent_answers: number[];
    your_answers: number[];
    opponent_question_types: QuestionType[];
    cat_choices: number[];
    is_image_question_disabled: boolean;
    mutual: null;
    elapsed_min: number;
    messages: IApiMessage[];
    state: GameState;
    mode: 0;
    your_turn: boolean;
    give_up_player_id: null;
    you_gave_up: boolean;
    questions: IApiQuestion[];
    image_questions: IApiImageQuestion[];
    opponent: IApiOpponent;
    rating_bonus: number;
}
