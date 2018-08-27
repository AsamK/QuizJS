import React from 'react';

import './Question.css';

interface IQuestionProps {
    question: string;
    imageUrl?: string;
    onClick: () => void;
}

const Question = ({ question, imageUrl, onClick }: IQuestionProps) => {
    return <div className="qd-question"
        onClick={onClick}
    >
        {question}
        {imageUrl && <img src={imageUrl} />}
    </div>;
};

export default Question;
