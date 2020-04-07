export interface IApiStats {
    rating: number;
    n_games_played: number;
    n_games_won: number;
    n_games_lost: number;
    n_games_tied: number;
    n_questions_answered: number;
    n_questions_correct: number;
    n_perfect_games: number;
    cat_stats: IApiCategoryStat[];
    quiz_stats: null;
    rank: number;
    n_users: number;
}

export interface IApiCategoryStat {
    percentCorrect: number;
    cat_name: string;
    percent: number;
}
