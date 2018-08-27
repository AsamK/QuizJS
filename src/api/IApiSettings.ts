export interface IApiSettings {
    wiq_enabled: boolean;
    ppf: number;
    feos: number;
    n_image_question_retries: number;
    facebook_events_enabled: boolean;
    free_coin_generation_time: number;
    admob_med_id: string;
    splash_freq: number;
    refresh_table_freq: number;
    lifelines_enabled: boolean;
    lifelines: {};
    max_free_games: number;
    check_limbo_games: boolean;
    coin_bundles: {
        coins_bundle_4: {
            color: string
            text: string
            coins: number;
            coins_str: string
        };
        coins_bundle_5: {
            color: string
            text: string
            coins: number;
            coins_str: string
        };
        coins_bundle_2: {
            color: string
            text: string
            coins: number;
            coins_str: string
        };
        coins_bundle_3: {
            color: string
            text: string
            coins: number;
            coins_str: string
        };
        coins_bundle_1: {
            color: string
            text: string
            coins: number;
            coins_str: string
        }
    };
    fulmium: boolean;
    feo: boolean;
    recommended_opponents_enabled: boolean;
    n_free_coins_per_generation: number;
    cqm_enabled: boolean;
    give_up_point_loss: number;
    override: { QUIZZES_MENU_NAME: string };
    n_starting_coins: number;
    email_if_no_push_token: boolean;
    refresh_frequency: number;
    monthly_quiz_enabled: boolean;
    is_davinci: boolean;
}
