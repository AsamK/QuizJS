import React from 'react';

import './Question.css';

interface IQuestionProps {
    question: string;
    imageUrl?: string;
    onClick?: () => void;
}

const Question = ({ question, imageUrl, onClick }: IQuestionProps) => {
    return (
        <div className={imageUrl ? 'qd-question with-image' : 'qd-question'} onClick={onClick}>
            <span className="qd-question_text">{question}</span>
            {imageUrl && <img className="qd-question_image" src={imageUrl} />}
        </div>
    );
};

export default Question;
