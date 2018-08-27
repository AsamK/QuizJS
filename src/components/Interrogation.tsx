import React from 'react';

import { IApiCategory } from '../api/IApiCategory';
import Answer, { AnswerState } from './Answer';
import './Interrogation.css';
import Question from './Question';

interface IInterrogationProps {
    question: IQuizQuestion;
    onAnswerClick: (index: number) => void;
    onContinueClick: () => void;
    showCorrectAnswerIndex: number | null;
    showSelectedAnswerIndex: number | null;
}

export interface IQuizQuestion {
    category: IApiCategory;
    question: string;
    answers: [string, string, string, string];
    imageUrl?: string;
}

const Interrogation = ({
    question, showCorrectAnswerIndex, showSelectedAnswerIndex, onAnswerClick, onContinueClick,
}: IInterrogationProps) => {
    const answers = question.answers
        .map((answer, i) => <Answer
            key={i}
            state={showCorrectAnswerIndex !== i && i === showSelectedAnswerIndex ? AnswerState.WRONG :
                showCorrectAnswerIndex === i && i === showSelectedAnswerIndex ? AnswerState.CORRECT :
                    showCorrectAnswerIndex === i && i !== showSelectedAnswerIndex ? AnswerState.CORRECT_BUT_NOT_SELECTED :
                        AnswerState.NEUTRAL
            }
            answer={answer}
            onClick={() => onAnswerClick(i)}
        />);
    return <div className="qd-interrogation">
        <div className="qd-interrogation_category" style={{ backgroundColor: question.category.color }}>{question.category.name}</div>
        <Question question={question.question} imageUrl={question.imageUrl} onClick={onContinueClick} />
        {answers}
    </div>;
};

export default Interrogation;
