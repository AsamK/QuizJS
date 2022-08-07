export interface IQuestion {
    q_id: number;
    timestamp?: number;
    cat_id: number;
    answer_time: number;
    stats: {
        correct_answer_ratio: number;
        correct_answer_percent: number;
        wrong1_answer_percent: number;
        wrong2_answer_percent: number;
        wrong3_answer_percent: number;
    };
    question: string;
    wrong1: string;
    wrong2: string;
    wrong3: string;
    correct: string;
    image_url?: string;
}
