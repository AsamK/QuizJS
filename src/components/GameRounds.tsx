import React from 'react';
import { IGameRoundState } from '../redux/interfaces/IGameRoundState';
import './GameRounds.css';

export interface IGameRoundsStateProps {
    gameRound: IGameRoundState[];
}

const QuestionItem = ({ color }: { color: 'red' | 'green' | 'gray' }) => {
    return <div className="qd-game-round_question-block" style={{ backgroundColor: color }}>
    </div>;
};

function GameRounds({ gameRound }: IGameRoundsStateProps): React.ReactElement<IGameRoundsStateProps> {
    const rounds = gameRound.map((round, i) => (
        <div className="qd-game-round" key={i}>
            <div className="qd-game-round_questions">
                <QuestionItem
                    color={round.yourAnswers.length <= 0 ? 'gray' : round.yourAnswers[0] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={round.yourAnswers.length <= 1 ? 'gray' : round.yourAnswers[1] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={round.yourAnswers.length <= 2 ? 'gray' : round.yourAnswers[2] === 0 ? 'green' : 'red'} />
            </div>
            <div className="qd-game-round_info"
            >Runde:&nbsp;{i + 1}
                <div className="qd-game-round_category">
                    {!round.category ? null : round.category.name}
                </div>
            </div>
            <div className="qd-game-round_questions">
                <QuestionItem
                    color={round.opponentAnswers.length <= 0 ? 'gray' : round.opponentAnswers[0] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={round.opponentAnswers.length <= 1 ? 'gray' : round.opponentAnswers[1] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={round.opponentAnswers.length <= 2 ? 'gray' : round.opponentAnswers[2] === 0 ? 'green' : 'red'} />
            </div>
        </div>
    ));

    return <div className="qd-game-rounds">
        {rounds}
    </div>;
}

export default GameRounds;
