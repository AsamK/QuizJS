import { IApiQuizQuestion } from './IApiQuizQuestion';
import { IDateRange } from './IDateRange';
import { Color, IsoDate } from './types';

export interface IApiQuizAnswer {
    answer: number;
    timestamp: IsoDate;
    time: number;
}

export interface IApiQuiz {
    quiz_id: string;
    name: string;
    color: Color;
    card_image: {
        url_ldpi: string,
        url_mdpi: string,
        url_hdpi: string,
        url_xhdpi: string,
    };
    show_until: null;
    pub_daterange: IDateRange;
    app_id: string;
    opponent_name: null;
    opponent_avatar: null;
    save_aggregated_stats: boolean;
    questions: IApiQuizQuestion[];
    quiz_sponsor: null;
    your_answers: {
        give_up: boolean,
        answers: IApiQuizAnswer[],
        finish_date: IsoDate,
    };
    push_message: null;
    your_ranking: number;
    n_players: number;
}
