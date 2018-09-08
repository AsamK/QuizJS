import { GameState, QuestionType } from '../../api/IApiGame';
import { IApiOpponent } from '../../api/IApiOpponent';

export interface IGame {
    nounce: number;
    game_id: number;
    your_question_types: QuestionType[];
    opponent_answers: number[];
    your_answers: number[];
    opponent_question_types: QuestionType[];
    cat_choices: number[];
    is_image_question_disabled: boolean;
    timestamp: number | null;
    state: GameState;
    mode: 0;
    your_turn: boolean;
    give_up_player_id: null;
    you_gave_up: boolean;
    opponent: IApiOpponent;
    rating_bonus: number;
}
