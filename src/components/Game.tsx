import React from 'react';
import { connect } from 'react-redux';

import { GameState } from '../api/IApiGame';
import { selectGame, startPlaying } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IGame } from '../redux/interfaces/IGame';
import { isSelectedGameWithFriendSelector, selectedGameIdSelector, selectedGameSelector } from '../redux/selectors/ui.selectors';
import { addFriend, AppThunkDispatch, createGame, declineGame, giveUpGame, loadGame, removeFriend } from '../redux/thunks';
import './Game.css';

interface IGameStateProps {
    game: IGame | null;
    gameId: number | null;
    isFriend: boolean;
}

interface IGameDispatchProps {
    onAddFriend: (userId: string, name: string) => void;
    onBack: () => void;
    onDeclineGame: (gameId: number) => void;
    onGiveUp: (gameId: number) => void;
    onNewGame: (userId: string) => void;
    onPlay: (gameId: number) => void;
    onRemoveFriend: (userId: string) => void;
    requestGame: (gameId: number) => void;
}

interface IGameProps extends IGameStateProps, IGameDispatchProps {
}

const QuestionItem = ({ color }: { color: 'red' | 'green' | 'gray' }) => {
    return <div className="qd-game_round-question-block" style={{ backgroundColor: color }}>
    </div>;
};

class Game extends React.PureComponent<IGameProps> {

    public componentDidMount(): void {
        if (this.props.gameId != null) {
            this.props.requestGame(this.props.gameId);
        }
    }

    public render(): React.ReactElement<IGameProps> {
        const { game, isFriend, onBack, onDeclineGame, onPlay, onNewGame, onGiveUp, onAddFriend, onRemoveFriend } = this.props;
        if (!game) {
            return <div>'Loading game...'</div>;
        }
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
                        color={game.opponent_answers.length <= i * 3 + 0 ? 'gray'
                            : game.opponent_answers[i * 3 + 0] === 0 ? 'green' : 'red'} />
                    <QuestionItem

                        color={game.opponent_answers.length <= i * 3 + 1 ? 'gray'
                            : game.opponent_answers[i * 3 + 1] === 0 ? 'green' : 'red'} />
                    <QuestionItem

                        color={game.opponent_answers.length <= i * 3 + 2 ? 'gray'
                            : game.opponent_answers[i * 3 + 2] === 0 ? 'green' : 'red'} />
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
            <div className="qd-game_footer">
                {game.state !== GameState.FINISHED && game.state !== GameState.GAVE_UP ? null :
                    <button className="qd-game_again" onClick={() => onNewGame(game.opponent.user_id)}
                    >Nochmal</button>
                }
                {game.state !== GameState.ACTIVE && game.state !== GameState.REQUESTED ? null :
                    <button
                        className="qd-game_give-up"
                        onClick={() => {
                            if (game.state === GameState.REQUESTED && game.your_turn) {
                                onDeclineGame(game.game_id);
                            } else {
                                onGiveUp(game.game_id);
                            }
                        }}
                    >Aufgeben</button>
                }
                <button
                    className="qd-game_play"
                    onClick={() => onPlay(game.game_id)}
                    disabled={!game.your_turn || (game.state !== GameState.ACTIVE && game.state !== GameState.REQUESTED)}
                >Spielen</button>
                {
                    isFriend ?
                        <button onClick={() => onRemoveFriend(game.opponent.user_id)}>-Freund</button> :
                        <button onClick={() => onAddFriend(game.opponent.user_id, game.opponent.name)}>+Freund</button>
                }
            </div>
        </div >;
    }
}

const mapStateToProps = (state: IAppStore): IGameStateProps => {
    return {
        game: selectedGameSelector(state),
        gameId: selectedGameIdSelector(state),
        isFriend: isSelectedGameWithFriendSelector(state),
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IGameDispatchProps => {
    return {
        onAddFriend: (userId, name) => dispatch(addFriend(userId, name)),
        onBack: () => dispatch(selectGame(null)),
        onDeclineGame: gameId => dispatch(declineGame(gameId)),
        onGiveUp: gameId => dispatch(giveUpGame(gameId)),
        onNewGame: userId => dispatch(createGame(userId)),
        onPlay: gameId => dispatch(startPlaying(gameId, Date.now())),
        onRemoveFriend: userId => dispatch(removeFriend(userId)),
        requestGame: gameId => dispatch(loadGame(gameId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
