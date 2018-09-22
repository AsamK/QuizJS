import { IApiQuizAnswer } from '../../api/IApiQuiz';
import { IDateRange } from '../../api/IDateRange';
import { Color, IsoDate } from '../../api/types';

export interface IQuiz {
    quiz_id: string;
    name: string;
    color: Color;
    card_image: {
        url_ldpi: string,
        url_mdpi: string,
        url_hdpi: string,
        url_xhdpi: string,
    };
    pub_daterange: IDateRange;
    save_aggregated_stats: boolean;
    questions: number[];
    quiz_sponsor: null;
    your_answers: {
        give_up: boolean,
        answers: IApiQuizAnswer[],
        finish_date: IsoDate,
    };
    your_ranking: number;
    n_players: number;
}
