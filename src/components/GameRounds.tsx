import { Property } from 'csstype';
import React from 'react';

import { AnswerType, IGameRoundState } from '../redux/interfaces/IGameRoundState';
import './GameRounds.css';

export interface IGameRoundsStateProps {
    gameRound: IGameRoundState[];
    onQuestionClick: (round: number, question: number) => void;
}

const QuestionItem = ({ color, onClick }: { color: Property.BackgroundColor, onClick: () => void }) => {
    return <div className="qd-game-round_question-block" style={{ backgroundColor: color }} onClick={onClick}>
    </div>;
};

function getAnswerColor(answers: AnswerType[], index: number): Property.BackgroundColor {
    switch (answers[index]) {
        case undefined: return 'lightgray';
        case AnswerType.CORRECT: return 'green';
        case AnswerType.HIDDEN: return 'gray';
        case AnswerType.WRONG1:
        case AnswerType.WRONG2:
        case AnswerType.WRONG3:
        case AnswerType.TIME_ELAPSED: return 'red';
        case AnswerType.INVALID: return 'blue';
    }
}

function isAnswerClickable(answers: AnswerType[], index: number): boolean {
    switch (answers[index]) {
        case undefined: return false;
        case AnswerType.CORRECT: return true;
        case AnswerType.HIDDEN: return false;
        case AnswerType.WRONG1:
        case AnswerType.WRONG2:
        case AnswerType.WRONG3:
        case AnswerType.TIME_ELAPSED:
        case AnswerType.INVALID: return true;
    }
}

function GameRounds({ gameRound, onQuestionClick }: IGameRoundsStateProps): React.ReactElement<IGameRoundsStateProps> {
    const roundAnswerIndices = [0, 1, 2];
    const rounds = gameRound.map((round, r) => (
        <div className="qd-game-round" key={r}>
            <div className="qd-game-round_questions">
                {roundAnswerIndices.map(i =>
                    <QuestionItem
                        key={i}
                        onClick={() => { if (isAnswerClickable(round.yourAnswers, i)) { onQuestionClick(r, i); } }}
                        color={getAnswerColor(round.yourAnswers, i)} />
                )}
            </div>
            <div className="qd-game-round_info"
            >Runde:&nbsp;{r + 1}
                <div className="qd-game-round_category">
                    {!round.category ? null : round.category.name}
                </div>
            </div>
            <div className="qd-game-round_questions">
                {roundAnswerIndices.map(i =>
                    <QuestionItem
                        key={i}
                        onClick={() => { if (isAnswerClickable(round.opponentAnswers, i)) { onQuestionClick(r, i); } }}
                        color={getAnswerColor(round.opponentAnswers, i)} />
                )}
            </div>
        </div>
    ));

    return <div className="qd-game-rounds">
        {rounds}
    </div>;
}

export default GameRounds;
