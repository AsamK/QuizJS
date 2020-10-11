import React from 'react';
import { useSelector } from 'react-redux';

import { GameState } from '../api/IApiGame';
import { selectGame, startPlaying } from '../redux/actions/ui.actions';
import { AnswerType } from '../redux/interfaces/IGameRoundState';
import { userSelector } from '../redux/selectors/entities.selectors';
import { isSelectedGameWithFriendSelector, selectedGameAddFriendLoadingSelector, selectedGameCreateLoadingSelector, selectedGameExistsRunningGameWithPlayer, selectedGameGiveUpLoadingSelector, selectedGameIdSelector, selectedGameMessagesSelector, selectedGameRemoveFriendLoadingSelector, selectedGameRoundStateSelector, selectedGameSelector, selectedGameShouldUpload, sendMessageLoadingSelector, uploadRoundLoadingSelector } from '../redux/selectors/ui.selectors';
import { useThunkDispatch } from '../redux/store';
import { addFriend, createGame, declineGame, giveUpGame, loadGame, removeFriend, sendMessageForGame, uploadRoundForSelectedGame } from '../redux/thunks';
import Avatar from './Avatar';
import { Button } from './Button';
import './Game.css';
import GameRounds from './GameRounds';
import { Messaging } from './Messaging';

function Game(): React.ReactElement {
    const againButtonEnabled = useSelector(selectedGameExistsRunningGameWithPlayer);
    const game = useSelector(selectedGameSelector);
    const currentGameId = useSelector(selectedGameIdSelector);
    const gameRound = useSelector(selectedGameRoundStateSelector);
    const isAddingFriend = useSelector(selectedGameAddFriendLoadingSelector);
    const isFriend = useSelector(isSelectedGameWithFriendSelector);
    const isGivingUp = useSelector(selectedGameGiveUpLoadingSelector);
    const isRemovingFriend = useSelector(selectedGameRemoveFriendLoadingSelector);
    const isSendingMessage = useSelector(sendMessageLoadingSelector);
    const isStartingNewGame = useSelector(selectedGameCreateLoadingSelector);
    const isUploading = useSelector(uploadRoundLoadingSelector);
    const messages = useSelector(selectedGameMessagesSelector);
    const shouldUpload = useSelector(selectedGameShouldUpload);
    const user = useSelector(userSelector);

    const dispatch = useThunkDispatch();
    const onAddFriend = React.useCallback((userId, name) => dispatch(addFriend(userId, name)), [dispatch]);
    const onBack = React.useCallback(() => dispatch(selectGame(null)), [dispatch]);
    const onDeclineGame = React.useCallback(gameId => dispatch(declineGame(gameId)), [dispatch]);
    const onGiveUp = React.useCallback(gameId => dispatch(giveUpGame(gameId)), [dispatch]);
    const onNewGame = React.useCallback(userId => dispatch(createGame(userId)), [dispatch]);
    const onPlay = React.useCallback(gameId => dispatch(startPlaying(gameId, Date.now())), [dispatch]);
    const onRemoveFriend = React.useCallback(userId => dispatch(removeFriend(userId)), [dispatch]);
    const requestGame = React.useCallback(gameId => dispatch(loadGame(gameId)), [dispatch]);
    const sendMessage = React.useCallback((gameId, message) => dispatch(sendMessageForGame(gameId, message)), [dispatch]);
    const uploadGameState = React.useCallback(() => dispatch(uploadRoundForSelectedGame()), [dispatch]);

    React.useEffect(() => {
        if (currentGameId != null && !isUploading) {
            requestGame(currentGameId);
        }
    }, [currentGameId]);

    if (!game) {
        return <div>'Loading game...'</div>;
    }
    const yourCorrectAnswers = gameRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === AnswerType.CORRECT).length, 0);
    const opponentCorrectAnswers = gameRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === AnswerType.CORRECT).length, 0);
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
        Nachrichten:
        <Messaging
            messages={messages}
            ownUserId={user?.user_id ?? ''}
            sendMessage={message => sendMessage(game.game_id, message)}
            isSending={isSendingMessage}
        />
    </div >;
}

export default Game;
