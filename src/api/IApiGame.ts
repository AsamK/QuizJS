import { IApiImageQuestion } from './IApiImageQuestion';
import { IApiOpponent } from './IApiOpponent';
import { IApiQuestion } from './IApiQuestion';

export const enum GameState {
    REQUESTED = 0,
    ACTIVE = 1,
    FINISHED = 2,
    GAVE_UP = 5,
    ELAPSED = 6,
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
    messages: [];
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
