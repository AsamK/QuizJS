import React from 'react';

import './Answer.css';

export const enum AnswerState {
    NEUTRAL,
    CORRECT,
    WRONG,
    CORRECT_BUT_NOT_SELECTED,
}

interface IAnswerProps {
    answer: string;
    info?: string;
    state: AnswerState;
    onClick: () => void;
}

const Answer = ({ answer, info, state, onClick }: IAnswerProps) => {
    return (
        <div
            className={
                'qd-answer' +
                (state === AnswerState.CORRECT
                    ? ' qd-answer_correct'
                    : state === AnswerState.WRONG
                    ? ' qd-answer_wrong'
                    : state === AnswerState.CORRECT_BUT_NOT_SELECTED
                    ? ' qd-answer_correct-but'
                    : '')
            }
            onClick={onClick}
        >
            {answer}
            <div className="qd-answer_info">{info}</div>
        </div>
    );
};

export default Answer;
