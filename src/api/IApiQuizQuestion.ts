import type { IApiCategory } from './IApiCategory';

interface IApiQuizQuestionImage {
    profilePic: boolean;
    tempDeleted: boolean;
    logotype: boolean;
    center: boolean;
    profilepic: boolean;
    tempdeleted: boolean;
    copyright: string;
    url_ldpi: string;
    url_mdpi: string;
    url_hdpi: string;
    url_xhdpi: string;
}

export interface IApiQuizQuestion {
    id: number;
    question_type: 0;
    category: IApiCategory;
    sort_order: number;
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
    image: IApiQuizQuestionImage | null;
}
