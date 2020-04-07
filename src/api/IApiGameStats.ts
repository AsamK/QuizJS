export interface IApiGameStats {
    game_stats: IApiGameStat[];
}

export interface IApiGameStat {
    user_id: string;
    name: string;
    avatar_code: string | null;
    n_games_won: number;
    n_games_lost: number;
    n_games_tied: number;
}
