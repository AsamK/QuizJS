import React from 'react';

import { GameState, IApiGame } from '../api/IApiGame';
import './Game.css';

interface IGameProps {
    game: IApiGame;
    isFriend: boolean;
    onBack: () => void;
    onPlay: () => void;
    onNewGame: () => void;
    onGiveUp: () => void;
    onAddFriend: () => void;
    onRemoveFriend: () => void;
}

const QuestionItem = ({ color }: { color: 'red' | 'green' | 'gray' }) => {
    return <div className="qd-game_round-question-block" style={{ backgroundColor: color }}>
        x
    </div>;
};

function Game({ game, isFriend, onBack, onPlay, onNewGame, onGiveUp, onAddFriend, onRemoveFriend }: IGameProps,
): React.ReactElement<IGameProps> {
    const yourCorrectAnswers = game.your_answers.filter(a => a === 0).length;
    const opponentCorrectAnswers = game.opponent_answers.filter(a => a === 0).length;
    const rounds = game.cat_choices.map((catId, i) => (
        <div className="qd-game_round" key={i}>
            <div className="qd-game_round-questions">
                <QuestionItem
                    color={game.your_answers.length <= i * 3 + 0 ? 'gray' : game.your_answers[i * 3 + 0] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={game.your_answers.length <= i * 3 + 1 ? 'gray' : game.your_answers[i * 3 + 1] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={game.your_answers.length <= i * 3 + 2 ? 'gray' : game.your_answers[i * 3 + 2] === 0 ? 'green' : 'red'} />
            </div>
            <div className="qd-game_round-category">Kategorie: {catId}</div>
            <div className="qd-game_round-questions">
                <QuestionItem
                    color={game.opponent_answers.length <= i * 3 + 0 ? 'gray' : game.opponent_answers[i * 3 + 0] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={game.opponent_answers.length <= i * 3 + 1 ? 'gray' : game.opponent_answers[i * 3 + 1] === 0 ? 'green' : 'red'} />
                <QuestionItem
                    color={game.opponent_answers.length <= i * 3 + 2 ? 'gray' : game.opponent_answers[i * 3 + 2] === 0 ? 'green' : 'red'} />
            </div>
        </div>
    ));
    return <div>
        <button onClick={onBack}>Zurück</button>
        <div className="qd-game_header">
            <div className="qd-game_user">Ich</div>
            <div className="qd-game_points">{yourCorrectAnswers} - {opponentCorrectAnswers}</div>
            <div className="qd-game_user">{game.opponent.name}</div>
        </div>
        {rounds}
        <button onClick={onPlay} disabled={!game.your_turn}>Spielen</button>
        <button onClick={onNewGame} disabled={game.state !== GameState.FINISHED && game.state !== GameState.GAVE_UP}>Nochmal</button>
        <button onClick={onGiveUp} disabled={game.state !== GameState.ACTIVE && game.state !== GameState.REQUESTED}>Aufgeben</button>
        {isFriend ?
            <button onClick={onRemoveFriend}>-Freund</button> :
            <button onClick={onAddFriend}>+Freund</button>
        }
    </div>;
}

export default Game;
