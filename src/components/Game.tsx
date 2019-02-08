import React from 'react';
import { connect } from 'react-redux';

import { GameState } from '../api/IApiGame';
import { selectGame, startPlaying } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IGame } from '../redux/interfaces/IGame';
import { IGameRoundState } from '../redux/interfaces/IGameRoundState';
import { IUser } from '../redux/interfaces/IUser';
import { userSelector } from '../redux/selectors/entities.selectors';
import { isSelectedGameWithFriendSelector, selectedGameAddFriendLoadingSelector, selectedGameCreateLoadingSelector, selectedGameExistsRunningGameWithPlayer, selectedGameGiveUpLoadingSelector, selectedGameIdSelector, selectedGameRemoveFriendLoadingSelector, selectedGameRoundStateSelector, selectedGameSelector, selectedGameShouldUpload, uploadRoundLoadingSelector } from '../redux/selectors/ui.selectors';
import { addFriend, AppThunkDispatch, createGame, declineGame, giveUpGame, loadGame, removeFriend, uploadRoundForSelectedGame } from '../redux/thunks';
import Avatar from './Avatar';
import { Button } from './Button';
import './Game.css';
import GameRounds from './GameRounds';

interface IGameStateProps {
    againButtonEnabled: boolean;
    game: IGame | null;
    gameId: number | null;
    gameRound: IGameRoundState[];
    isAddingFriend: boolean;
    isRemovingFriend: boolean;
    isFriend: boolean;
    isGivingUp: boolean;
    isStartingNewGame: boolean;
    isUploading: boolean;
    shouldUpload: boolean;
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
    uploadGameState: () => void;
}

interface IGameProps extends IGameStateProps, IGameDispatchProps {
}

function Game({ againButtonEnabled, game, gameId, gameRound, isAddingFriend, isRemovingFriend, isFriend, isGivingUp, isStartingNewGame,
    isUploading, user, onBack, onDeclineGame, onPlay, onNewGame, onGiveUp, onAddFriend, onRemoveFriend, shouldUpload,
    uploadGameState, requestGame }: IGameProps): React.ReactElement<IGameProps> {

    React.useEffect(() => {
        if (gameId != null && !isUploading) {
            requestGame(gameId);
        }
    }, [gameId]);

    if (!game) {
        return <div>'Loading game...'</div>;
    }
    const yourCorrectAnswers = gameRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === 0).length, 0);
    const opponentCorrectAnswers = gameRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === 0).length, 0);
    return <div>
        <Button onClick={onBack}> Zurück</Button >
        <div className="qd-game_header">
            <div className="qd-game_user"><Avatar avatarCode={user ? user.avatar_code : null} /> Ich</div>
            <div className="qd-game_points">{yourCorrectAnswers} - {opponentCorrectAnswers}</div>
            <div className="qd-game_user"><Avatar avatarCode={game.opponent.avatar_code} />{game.opponent.name}</div>
        </div>
        <GameRounds gameRound={gameRound} />
        <div className="qd-game_footer">
            {game.state !== GameState.FINISHED && game.state !== GameState.GAVE_UP && game.state !== GameState.ELAPSED ? null :
                <Button className="qd-game_again" onClick={() => onNewGame(game.opponent.user_id)}
                    showLoadingIndicator={isStartingNewGame}
                    disabled={isStartingNewGame || againButtonEnabled}
                >Nochmal</Button>
            }
            {game.state !== GameState.ACTIVE && game.state !== GameState.REQUESTED && game.state !== GameState.NEW_RANDOM_GAME ? null :
                <Button
                    className="qd-game_give-up"
                    showLoadingIndicator={isGivingUp}
                    disabled={isGivingUp}
                    onClick={() => {
                        if (game.state === GameState.REQUESTED && game.your_turn) {
                            onDeclineGame(game.game_id);
                        } else {
                            onGiveUp(game.game_id);
                        }
                    }}
                >Aufgeben</Button>
            }
            {
                shouldUpload
                    ? <Button
                        className={'qd-game_play'}
                        showLoadingIndicator={isUploading}
                        onClick={() => uploadGameState()}
                        disabled={isUploading}
                    >Upload</Button>
                    : <Button
                        className={'qd-game_play'}
                        showLoadingIndicator={isUploading}
                        onClick={() => onPlay(game.game_id)}
                        disabled={isUploading || !game.your_turn || (game.state !== GameState.ACTIVE
                            && game.state !== GameState.REQUESTED
                            && game.state !== GameState.NEW_RANDOM_GAME)}
                    >Spielen</Button>
            }
            {
                isFriend
                    ? <Button onClick={() => onRemoveFriend(game.opponent.user_id)}
                        disabled={isRemovingFriend}
                        showLoadingIndicator={isRemovingFriend}
                    >-Freund</Button>
                    : <Button onClick={() => onAddFriend(game.opponent.user_id, game.opponent.name)}
                        disabled={isAddingFriend}
                        showLoadingIndicator={isAddingFriend}
                    >+Freund</Button>
            }
        </div>
    </div >;
}

const mapStateToProps = (state: IAppStore): IGameStateProps => {
    return {
        againButtonEnabled: selectedGameExistsRunningGameWithPlayer(state),
        game: selectedGameSelector(state),
        gameId: selectedGameIdSelector(state),
        gameRound: selectedGameRoundStateSelector(state),
        isAddingFriend: selectedGameAddFriendLoadingSelector(state),
        isFriend: isSelectedGameWithFriendSelector(state),
        isGivingUp: selectedGameGiveUpLoadingSelector(state),
        isRemovingFriend: selectedGameRemoveFriendLoadingSelector(state),
        isStartingNewGame: selectedGameCreateLoadingSelector(state),
        isUploading: uploadRoundLoadingSelector(state),
        shouldUpload: selectedGameShouldUpload(state),
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
        uploadGameState: () => dispatch(uploadRoundForSelectedGame()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
