import React from 'react';
import { connect } from 'react-redux';

import { GameState } from '../api/IApiGame';
import { selectGame, startPlaying } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IGame } from '../redux/interfaces/IGame';
import { IGameRoundState } from '../redux/interfaces/IGameRoundState';
import { IUser } from '../redux/interfaces/IUser';
import { userSelector } from '../redux/selectors/entities.selectors';
import { isSelectedGameWithFriendSelector, selectedGameIdSelector, selectedGameRoundStateSelector, selectedGameSelector, uploadRoundLoadingSelector } from '../redux/selectors/ui.selectors';
import { addFriend, AppThunkDispatch, createGame, declineGame, giveUpGame, loadGame, removeFriend } from '../redux/thunks';
import Avatar from './Avatar';
import './Game.css';
import GameRounds from './GameRounds';

interface IGameStateProps {
    game: IGame | null;
    gameId: number | null;
    gameRound: IGameRoundState[];
    isFriend: boolean;
    isUploading: boolean;
    user: IUser | null;
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

export class Game extends React.PureComponent<IGameProps> {

    public componentDidMount(): void {
        if (this.props.gameId != null && !this.props.isUploading) {
            this.props.requestGame(this.props.gameId);
        }
    }

    public render(): React.ReactElement<IGameProps> {
        const { game, gameRound, isFriend, isUploading, user,
            onBack, onDeclineGame, onPlay, onNewGame, onGiveUp, onAddFriend, onRemoveFriend } = this.props;
        if (!game) {
            return <div>'Loading game...'</div>;
        }
        const yourCorrectAnswers = gameRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === 0).length, 0);
        const opponentCorrectAnswers = gameRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === 0).length, 0);
        return <div>
            <button onClick={onBack}>Zurück</button>
            <div className="qd-game_header">
                <div className="qd-game_user"><Avatar avatarCode={user ? user.avatar_code : null} /> Ich</div>
                <div className="qd-game_points">{yourCorrectAnswers} - {opponentCorrectAnswers}</div>
                <div className="qd-game_user"><Avatar avatarCode={game.opponent.avatar_code} />{game.opponent.name}</div>
            </div>
            <GameRounds gameRound={gameRound} />
            <div className="qd-game_footer">
                {game.state !== GameState.FINISHED && game.state !== GameState.GAVE_UP && game.state !== GameState.ELAPSED ? null :
                    <button className="qd-game_again" onClick={() => onNewGame(game.opponent.user_id)}
                    >Nochmal</button>
                }
                {game.state !== GameState.ACTIVE && game.state !== GameState.REQUESTED && game.state !== GameState.NEW_RANDOM_GAME ? null :
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
                    className={'qd-game_play' + (isUploading ? ' qd-game_play_loading' : '')}
                    onClick={() => onPlay(game.game_id)}
                    disabled={isUploading || !game.your_turn || (game.state !== GameState.ACTIVE
                        && game.state !== GameState.REQUESTED
                        && game.state !== GameState.NEW_RANDOM_GAME)}
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
        gameRound: selectedGameRoundStateSelector(state),
        isFriend: isSelectedGameWithFriendSelector(state),
        isUploading: uploadRoundLoadingSelector(state),
        user: userSelector(state),
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
