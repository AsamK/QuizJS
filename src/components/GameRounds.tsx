import React from 'react';
import { Property } from 'csstype';

import { AnswerType, IGameRoundState } from '../redux/interfaces/IGameRoundState';
import './GameRounds.css';

export interface IGameRoundsStateProps {
    gameRound: IGameRoundState[];
}

const QuestionItem = ({ color }: { color: Property.BackgroundColor }) => {
    return <div className="qd-game-round_question-block" style={{ backgroundColor: color }}>
    </div>;
};

function getAnswerColor(answers: AnswerType[], index: number): Property.BackgroundColor {
    switch (answers[index]) {
        case undefined: return 'lightgray'
        case AnswerType.CORRECT: return 'green'
        case AnswerType.HIDDEN: return 'gray'
        case AnswerType.WRONG: return 'red'
    }
}

function GameRounds({ gameRound }: IGameRoundsStateProps): React.ReactElement<IGameRoundsStateProps> {
    const roundAnswerIndices = [0, 1, 2];
    const rounds = gameRound.map((round, i) => (
        <div className="qd-game-round" key={i}>
            <div className="qd-game-round_questions">
                {roundAnswerIndices.map(i =>
                    <QuestionItem
                        key={i}
                        color={getAnswerColor(round.yourAnswers, i)} />
                )}
            </div>
            <div className="qd-game-round_info"
            >Runde:&nbsp;{i + 1}
                <div className="qd-game-round_category">
                    {!round.category ? null : round.category.name}
                </div>
            </div>
            <div className="qd-game-round_questions">
                {roundAnswerIndices.map(i =>
                    <QuestionItem
                        key={i}
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
