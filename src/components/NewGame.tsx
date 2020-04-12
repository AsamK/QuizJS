import React from 'react';
import { useSelector } from 'react-redux';

import { showCreateNewGame } from '../redux/actions/ui.actions';
import { foundUserSelector, friendsSelector } from '../redux/selectors/entities.selectors';
import { useThunkDispatch } from '../redux/store';
import { createGame, createRandomGame, searchUser } from '../redux/thunks';
import { debounce } from '../utils/utils';
import Avatar from './Avatar';
import { Button } from './Button';
import './NewGame.css';

function NewGame(): React.ReactElement {
    const foundUser = useSelector(foundUserSelector);
    const friends = useSelector(friendsSelector);

    const dispatch = useThunkDispatch();

    const onBack = React.useCallback(() => dispatch(showCreateNewGame(false)), [dispatch]);
    const onCreateGame = React.useCallback(userId => dispatch(createGame(userId)), [dispatch]);
    const onRandomGame = React.useCallback(() => dispatch(createRandomGame()), [dispatch]);
    const onSearchUser = React.useCallback(name => dispatch(searchUser(name)), [dispatch]);

    const onSearchUserDebounced = React.useCallback(debounce(
        (name: string) => onSearchUser(name)
        , 200), [onSearchUser]);

    const onSearchUserCallback = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onSearchUserDebounced(e.target.value),
        [onSearchUserDebounced]);

    const friendElements = React.useMemo(() => friends.map(friend =>
        <div
            key={friend.user_id}
            className="qd-new-game_friend"
            onClick={() => onCreateGame(friend.user_id)}
        >
            <Avatar avatarCode={friend.avatar_code} /> {friend.name} {friend.email}
        </div>,
    ), [friends, onCreateGame]);

    return <div className="qd-new-game">
        <Button className="qd-new-game_back" onClick={onBack}>Zurück</Button>
        <Button
            onClick={onRandomGame}
        >Beliebiger Spieler</Button>
        <div className="qd-new-game_search-user">
            <label>Benutzer suchen:<input
                onChange={onSearchUserCallback}
            /></label>
            {!foundUser ? null :
                <div
                    key={foundUser.user_id}
                    className="qd-new-game_user"
                    onClick={() => onCreateGame(foundUser.user_id)}
                >
                    <Avatar avatarCode={foundUser.avatar_code} /> {foundUser.name}
                </div>
            }
        </div>
        <label>Freunde</label>
        <div className="qd-new-game_friends">
            {friendElements}
        </div>
    </div>;
}

export default NewGame;
